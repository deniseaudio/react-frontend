import type { APISong } from "@/interfaces/api.interfaces";
import type { StoreSlice } from "../store";

export type HistorySlice = {
  history: APISong[];
  updateHistory: (history: APISong[]) => void;
};

export const createHistorySlice: StoreSlice<HistorySlice> = (set) => ({
  history: [],
  updateHistory: (h) => set(() => ({ history: [...h] })),
});
