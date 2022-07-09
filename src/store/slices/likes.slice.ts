import type { StoreSlice } from "../store";

export type LikeSlice = {
  likes: string[];
  updateLikes: (likes: string[]) => void;
};

export const createLikeSlice: StoreSlice<LikeSlice> = (set) => ({
  likes: [],
  updateLikes: (l) => set(() => ({ likes: [...l] })),
});
