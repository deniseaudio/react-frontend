import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import { useStore } from "@/store/store";
import { getSongCover } from "@/api";
import { audioManager } from "@/lib/AudioManager";

import { AudioPlayerTrackInfo } from "./AudioPlayerTrackInfo";
import { AudioPlayerControls } from "./AudioPlayerControls";
import { AudioPlayerProgressBar } from "./AudioPlayerProgressBar";
import { AudioPlayerQueue } from "./AudioPlayerQueue";
import { AudioPlayerVolume } from "./AudioPlayerVolume";

export const AudioPlayer: React.FC = () => {
  const {
    token,
    queue,
    history,
    currentSong,
    isSongLoading,
    loadSong,
    loadSongSuccess,
    loadSongFailed,
    loadSongProgression,
    songLoadingProgression,
  } = useStore(
    (state) => ({
      token: state.token,
      queue: state.queue,
      history: state.history,
      currentSong: state.currentSong,
      isSongLoading: state.isSongLoading,
      loadSong: state.loadSong,
      loadSongSuccess: state.loadSongSuccess,
      loadSongFailed: state.loadSongFailed,
      loadSongProgression: state.loadSongProgression,
      songLoadingProgression: state.songLoadingProgression,
    }),
    shallow
  );

  const [image, setImage] = useState<string>("");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const playSong = (
    song: APISong,
    initiator: "library-browser" | "queue" | "history"
  ) => {
    loadSong(song, initiator);
    audioManager.clean();

    audioManager
      .loadSong(song, token!)
      .then(() => {
        loadSongSuccess();
      })
      .catch((error) => {
        loadSongFailed();
        audioManager.clean();
        captureException(error);
      });
  };

  const handleUpdatedAudioContext = (event: CustomEvent) => {
    console.log(
      "[AudioPlayer] AudioContext updated from AudioManager",
      event.detail
    );

    setAudioContext(event.detail as AudioContext | null);
  };

  const handleSongLoadingProgression = (event: CustomEvent) => {
    const songProgression = event.detail as {
      contentLength: number;
      receivedLength: number;
    };

    loadSongProgression({
      currentLength: songProgression.receivedLength,
      totalLength: songProgression.contentLength,
    });
  };

  const handlePlayPreviousSong = () => {
    const previousSong = history[0];

    if (!token || isSongLoading) {
      return;
    }

    playSong(previousSong, "history");
  };

  const handlePlayNextSong = () => {
    const nextSong = queue[0];

    if (!token || isSongLoading || currentSong?.id === nextSong.id) {
      return;
    }

    playSong(nextSong, "queue");
  };

  useEffect(() => {
    if (currentSong && token) {
      getSongCover(currentSong.id, token)
        .then((blob) => {
          const url = URL.createObjectURL(blob);

          // Revoke old cover URL before replacing it only when the new one is
          // loaded.
          if (image) {
            URL.revokeObjectURL(image);
          }

          setImage(url);

          console.log("[AudioPlayer] fetched cover:", url);
        })
        .catch((error) => captureException(error));
    }
  }, [currentSong, token]);

  // Mount events everytime store values are updated to avoid stale variables.
  // It's a fix for the "stale closure" which captures a "snapshot" of the component
  // state which is then passed to the event-listeners callbacks.
  useEffect(() => {
    audioManager.on(
      "updated-audio-context",
      handleUpdatedAudioContext as EventListener
    );

    audioManager.on(
      "updated-song-loading-progression",
      handleSongLoadingProgression as EventListener
    );

    audioManager.on("song-ended", handlePlayNextSong as EventListener);

    return () => {
      audioManager.off(
        "updated-audio-context",
        handleUpdatedAudioContext as EventListener
      );

      audioManager.off(
        "updated-song-loading-progression",
        handleSongLoadingProgression as EventListener
      );

      audioManager.off("song-ended", handlePlayNextSong as EventListener);
    };
  }, [token, queue, currentSong, isSongLoading]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex w-full items-center justify-center border-t border-neutral-800 bg-neutral-900 px-6 py-4">
      <AudioPlayerTrackInfo
        imageUrl={image}
        artist={currentSong?.artist.name || "Not playing..."}
        title={currentSong?.title || ""}
        songProgression={songLoadingProgression}
      />

      <div className="flex flex-col space-y-3">
        <AudioPlayerControls
          audioContext={audioContext}
          currentSong={currentSong}
          isSongLoading={isSongLoading}
          hasPreviousSong={history.length > 0}
          hasNextSong={queue.length > 0}
          handlePlayPreviousSong={handlePlayPreviousSong}
          handlePlayNextSong={handlePlayNextSong}
        />

        <AudioPlayerProgressBar isSongLoading={isSongLoading} />
      </div>

      <div className="flex flex-1 items-center justify-end">
        <AudioPlayerQueue />
        <AudioPlayerVolume />
      </div>
    </div>
  );
};
