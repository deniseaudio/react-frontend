import type { APIUser } from "@/interfaces/api.interfaces";
import type { StoreSlice } from "../store";

export type AuthSlice = {
  user: APIUser | null;
  login: (user: APIUser) => void;
  logout: () => void;
};

export const createAuthSlice: StoreSlice<AuthSlice> = (set) => ({
  user: null,
  login: (user) => set(() => ({ user, likes: [...user.likes] })),
  logout: () =>
    set(() => ({
      user: null,
      queue: [],
      currentSong: null,
      isSongLoading: false,
      songLoadingProgression: null,
      likes: [],
      history: [],
    })),
});
