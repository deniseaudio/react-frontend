import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import { SongInitiatorTypes } from "@/interfaces/song.interfaces";
import { useStore } from "@/store/store";
import { getSongCover } from "@/api";
import { AudioManagerEvents, audioManager } from "@/lib/AudioManager";
import {
  setupMediaSessionMetadata,
  setupMediaSessionActionHandlers,
  pauseMediaSession,
  closeMediaSession,
  resumeMediaSession,
  updateMediaSessionPosition,
} from "@/lib/MediaSession";

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
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song: APISong, initiator: SongInitiatorTypes) => {
    loadSong(song, initiator);
    audioManager.clean();

    audioManager
      .loadSong(song, token!)
      .then(() => loadSongSuccess())
      .catch((error) => {
        loadSongFailed();
        audioManager.clean();
        captureException(error);
      });
  };

  const playPreviousSong = () => {
    const previousSong = history[0];

    if (!token || isSongLoading || !previousSong) {
      return;
    }

    playSong(previousSong, SongInitiatorTypes.HISTORY);
  };

  const playNextSong = () => {
    const nextSong = queue[0];

    if (!token || isSongLoading || currentSong?.id === nextSong.id) {
      return;
    }

    playSong(nextSong, SongInitiatorTypes.QUEUE);
  };

  const onLoadSong = (event: CustomEvent) => {
    const { song, initiator } = event.detail as {
      song: APISong;
      initiator: SongInitiatorTypes;
    };

    playSong(song, initiator);
  };

  const onSongLoadingProgression = (event: CustomEvent) => {
    const songProgression = event.detail as {
      contentLength: number;
      receivedLength: number;
    };

    loadSongProgression({
      currentLength: songProgression.receivedLength,
      totalLength: songProgression.contentLength,
    });
  };

  const onSongPlaying = (e: CustomEvent) => {
    const song = e.detail as APISong;

    setIsPlaying(true);
    setupMediaSessionMetadata(song, image);
  };

  const onSongPaused = () => {
    pauseMediaSession();
    setIsPlaying(false);
  };

  const onSongResumed = () => {
    resumeMediaSession();
    setIsPlaying(true);
  };

  const onSongEnded = () => {
    closeMediaSession();
    playNextSong();
  };

  const onSongSeeking = (e: CustomEvent) => {
    if (currentSong) {
      updateMediaSessionPosition(e.detail as number, currentSong?.length);
    }
  };

  useEffect(() => {
    if (currentSong && token) {
      getSongCover(currentSong.id, token)
        .then((blob) => {
          const url = URL.createObjectURL(blob);

          console.log("[AudioPlayer] fetched cover:", url);

          // Revoke old cover URL before replacing it only when the new one is loaded.
          if (image) {
            URL.revokeObjectURL(image);
          }

          return setImage(url);
        })
        .catch((error) => captureException(error));
    }
  }, [currentSong, token]);

  // Mount events everytime component re-render to avoid stale variables.
  // It's a fix for the "stale closure" which captures a "snapshot" of the
  // component state which is then passed to the event-listeners callbacks.
  useEffect(() => {
    audioManager.on(AudioManagerEvents.LOAD_SONG, onLoadSong as EventListener);

    audioManager.on(
      AudioManagerEvents.UPDATED_SONG_LOADING_PROGRESSION,
      onSongLoadingProgression as EventListener
    );

    audioManager.on(
      AudioManagerEvents.SONG_ENDED,
      onSongEnded as EventListener
    );

    audioManager.on(
      AudioManagerEvents.SONG_PLAYING,
      onSongPlaying as EventListener
    );

    audioManager.on(
      AudioManagerEvents.SONG_PAUSED,
      onSongPaused as EventListener
    );

    audioManager.on(
      AudioManagerEvents.SONG_RESUMED,
      onSongResumed as EventListener
    );

    audioManager.on(
      AudioManagerEvents.SONG_SEEKING,
      onSongSeeking as EventListener
    );

    setupMediaSessionActionHandlers({
      pause: () => audioManager.pauseOrResume(),
      play: () => audioManager.pauseOrResume(),
      nexttrack: () => playNextSong(),
      previoustrack: () => playPreviousSong(),
    });

    return () => {
      audioManager.off(
        AudioManagerEvents.LOAD_SONG,
        onLoadSong as EventListener
      );

      audioManager.off(
        AudioManagerEvents.UPDATED_SONG_LOADING_PROGRESSION,
        onSongLoadingProgression as EventListener
      );

      audioManager.off(
        AudioManagerEvents.SONG_ENDED,
        onSongEnded as EventListener
      );

      audioManager.off(
        AudioManagerEvents.SONG_PLAYING,
        onSongPlaying as EventListener
      );

      audioManager.off(
        AudioManagerEvents.SONG_PAUSED,
        onSongPaused as EventListener
      );

      audioManager.off(
        AudioManagerEvents.SONG_RESUMED,
        onSongResumed as EventListener
      );

      audioManager.off(
        AudioManagerEvents.SONG_SEEKING,
        onSongSeeking as EventListener
      );
    };
  });

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
          isPlaying={isPlaying}
          isSongLoading={isSongLoading}
          hasPreviousSong={history.length > 0}
          hasNextSong={queue.length > 0}
          handlePlayPreviousSong={playPreviousSong}
          handlePlayNextSong={playNextSong}
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
