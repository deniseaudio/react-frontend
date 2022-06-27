import type { APISong } from "@/interfaces/api.interfaces";
import type { StoreSlice } from "../store";

export type QueueSlice = {
  queue: APISong[];
  updateQueue: (queue: APISong[]) => void;
};

export const createQueueSlice: StoreSlice<QueueSlice> = (set) => ({
  queue: [],
  updateQueue: (q) => set(() => ({ queue: [...q] })),
});
