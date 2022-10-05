import type { StoreSlice } from "../store";
import type { APISong } from "../../interfaces/api.interfaces";

export type LikeSlice = {
  likes: APISong[];
  updateLikes: (likes: APISong[]) => void;
};

export const createLikeSlice: StoreSlice<LikeSlice> = (set) => ({
  likes: [],
  updateLikes: (l) => set(() => ({ likes: [...l] })),
});
