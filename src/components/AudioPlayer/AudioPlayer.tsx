import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { captureException } from "@sentry/react";

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
    updateQueue,
    currentSong,
    isSongLoading,
    loadSong,
    loadSongSuccess,
    loadSongFailed,
    songLoadingProgression,
  } = useStore(
    (state) => ({
      token: state.token,
      queue: state.queue,
      updateQueue: state.updateQueue,
      currentSong: state.currentSong,
      isSongLoading: state.isSongLoading,
      loadSong: state.loadSong,
      loadSongSuccess: state.loadSongSuccess,
      loadSongFailed: state.loadSongFailed,
      songLoadingProgression: state.songLoadingProgression,
    }),
    shallow
  );

  const [image, setImage] = useState<string>("");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const handleUpdatedAudioContext = (event: CustomEvent) => {
    console.log(
      "[AudioPlayer] AudioContext updated from AudioManager",
      event.detail
    );

    setAudioContext(event.detail as AudioContext | null);
  };

  const handleSongEnded = () => {
    const nextSong = queue[0];

    if (!token || isSongLoading || currentSong?.id === nextSong.id) {
      return;
    }

    updateQueue([...queue].slice(1));
    loadSong(nextSong);
    audioManager.clean();

    audioManager
      .loadSong(nextSong, token)
      .then(() => {
        loadSongSuccess();
      })
      .catch((err) => {
        loadSongFailed();
        audioManager.clean();
        captureException(err);
      });
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
        .catch((err) => captureException(err));
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

    audioManager.on("song-ended", handleSongEnded as EventListener);

    return () => {
      audioManager.off(
        "updated-audio-context",
        handleUpdatedAudioContext as EventListener
      );

      audioManager.off("song-ended", handleSongEnded as EventListener);
    };
  }, [token, queue, currentSong, isSongLoading]);

  return (
    <div className="flex items-center justify-center fixed bottom-0 left-0 right-0 w-full px-6 py-4 bg-gray-800">
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
        />

        <AudioPlayerProgressBar isSongLoading={isSongLoading} />
      </div>

      <div className="flex flex-1 justify-end items-center">
        <AudioPlayerQueue />
        <AudioPlayerVolume />
      </div>
    </div>
  );
};
