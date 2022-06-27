import type { APIUser } from "@/interfaces/api.interfaces";
import type { StoreSlice } from "../store";

export type AuthSlice = {
  user: APIUser | null;
  token: string | null;
  login: (token: string, user: APIUser) => void;
  logout: () => void;
};

export const createAuthSlice: StoreSlice<AuthSlice> = (set) => ({
  user: null,
  token: null,
  login: (token, user) => set(() => ({ token, user })),
  logout: () =>
    set(() => ({
      token: null,
      user: null,
      queue: [],
      currentSong: null,
      isSongLoading: false,
      songLoadingProgression: null,
    })),
});
