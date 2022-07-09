import type { APISong } from "@/interfaces/api.interfaces";
import {
  type SongProgression,
  SongInitiatorTypes,
} from "@/interfaces/song.interfaces";
import type { StoreSlice } from "../store";

export type SongSlice = {
  currentSong: APISong | null;
  isSongLoading: boolean;
  songLoadingProgression: SongProgression | null;
  loadSong: (song: APISong, initiator: SongInitiatorTypes) => void;
  loadSongSuccess: () => void;
  loadSongFailed: () => void;
  loadSongProgression: (progression: SongProgression) => void;
};

export const createSongSlice: StoreSlice<SongSlice> = (set, get) => ({
  currentSong: null,
  isSongLoading: false,
  songLoadingProgression: null,

  loadSong: (song, initiator) => {
    const { currentSong, queue, history } = get();

    // Push songs to the history only if they are not played from the "back" button.
    if (currentSong && initiator !== SongInitiatorTypes.HISTORY) {
      set(() => ({ history: [currentSong, ...history] }));
    }

    // If playing from the "next" button or auto-play queue, remove the first song
    // from the queue.
    if (initiator === SongInitiatorTypes.QUEUE) {
      set(() => ({ queue: [...get().queue].slice(1) }));
    }

    // If playing from the "back" button, remove the last song from the history
    // and add the current song to the queue.
    if (currentSong && initiator === SongInitiatorTypes.HISTORY) {
      set(() => ({
        queue: [currentSong, ...queue],
        history: [...history].slice(1),
      }));
    }

    return set(() => ({
      isSongLoading: true,
      currentSong: song,
    }));
  },

  loadSongSuccess: () =>
    set(() => ({ isSongLoading: false, songLoadingProgression: null })),

  loadSongFailed: () =>
    set(() => ({
      currentSong: null,
      isSongLoading: false,
      songLoadingProgression: null,
    })),

  loadSongProgression: (songProgression) =>
    set(() => ({ songLoadingProgression: { ...songProgression } })),
});
