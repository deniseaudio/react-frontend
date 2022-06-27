import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { captureException } from "@sentry/react";
import { MusicNoteIcon } from "@heroicons/react/solid";

import { APISong } from "@/interfaces/api.interfaces";
import { useStore } from "@/store/store";
import { audioManager } from "@/lib/AudioManager";

export type SongNodeProps = {
  song: APISong;
  directorySongs: APISong[];
};

export const SongNode: React.FC<SongNodeProps> = ({ song, directorySongs }) => {
  const {
    token,
    queue,
    updateQueue,
    currentSong,
    isSongLoading,
    loadSong,
    loadSongSuccess,
    loadSongFailed,
    loadSongProgression,
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
      loadSongProgression: state.loadSongProgression,
    }),
    shallow
  );

  /**
   * Add all songs in the directory of the song that is being played, but only
   * the songs that are **after** the played song index.
   *
   * @param songId Song ID reference.
   */
  const addSongsToQueue = (songId: string) => {
    const currentSongIndex = directorySongs.findIndex((s) => s.id === songId);
    const songsToQueue = directorySongs.slice(currentSongIndex + 1);
    const noDuplicatesSongsToQueue = songsToQueue.filter(
      (s) => !queue.find((q) => q.id === s.id)
    );

    updateQueue([...queue, ...noDuplicatesSongsToQueue]);
  };

  const playAudio = () => {
    if (!token || isSongLoading || currentSong?.id === song.id) {
      return;
    }

    loadSong(song);
    addSongsToQueue(song.id);
    audioManager.clean();

    audioManager
      .loadSong(song, token)
      .then(() => {
        loadSongSuccess();
      })
      .catch((err) => {
        loadSongFailed();
        audioManager.clean();
        captureException(err);
      });
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

  useEffect(() => {
    audioManager.on(
      "updated-song-loading-progression",
      handleSongLoadingProgression as EventListener
    );

    return () =>
      audioManager.off(
        "updated-song-loading-progression",
        handleSongLoadingProgression as EventListener
      );
  });

  return (
    <button
      type="button"
      className="flex items-center"
      onClick={() => playAudio()}
    >
      <MusicNoteIcon className="w-4 h-auto mr-2" />
      <p>{song.filename}</p>
    </button>
  );
};
