import type { APISong } from "@/interfaces/api.interfaces";
import type { SongProgression } from "@/interfaces/song.interfaces";
import type { StoreSlice } from "../store";

export type SongSlice = {
  currentSong: APISong | null;
  isSongLoading: boolean;
  songLoadingProgression: SongProgression | null;
  loadSong: (song: APISong) => void;
  loadSongSuccess: () => void;
  loadSongFailed: () => void;
  loadSongProgression: (progression: SongProgression) => void;
};

export const createSongSlice: StoreSlice<SongSlice> = (set) => ({
  currentSong: null,
  isSongLoading: false,
  songLoadingProgression: null,
  loadSong: (song) => set(() => ({ currentSong: song, isSongLoading: true })),
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
