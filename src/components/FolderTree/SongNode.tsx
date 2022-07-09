import React from "react";
import { MusicNoteIcon } from "@heroicons/react/solid";

import { APISong } from "@/interfaces/api.interfaces";
import { SongInitiatorTypes } from "@/interfaces/song.interfaces";
import { useStore } from "@/store/store";
import { AudioManagerEvents, audioManager } from "@/lib/AudioManager";

export type SongNodeProps = {
  song: APISong;
  directorySongs: APISong[];
};

export const SongNode: React.FC<SongNodeProps> = ({ song, directorySongs }) => {
  const queue = useStore((state) => state.queue);
  const updateQueue = useStore((state) => state.updateQueue);

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
      (s) => !queue.some((q) => q.id === s.id)
    );

    updateQueue([...noDuplicatesSongsToQueue, ...queue]);
  };

  /**
   * Adds all songs in the same folder to the queue. Send an event to the
   * `AudioManager` in order to start the song loading process in the
   * `AudioPlayer` component.
   */
  const playSong = () => {
    addSongsToQueue(song.id);

    audioManager.emit(AudioManagerEvents.PREPARE_SONG, {
      song,
      initiator: SongInitiatorTypes.LIBRARY_BROWSER,
    });
  };

  return (
    <button type="button" className="flex items-center" onClick={playSong}>
      <MusicNoteIcon className="mr-2 h-auto w-4" />
      <p>{song.filename}</p>
    </button>
  );
};
