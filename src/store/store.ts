import create, { SetState, GetState } from "zustand";

import { AuthSlice, createAuthSlice } from "./slices/auth.slice";
import { QueueSlice, createQueueSlice } from "./slices/queue.slice";
import { SongSlice, createSongSlice } from "./slices/song.slice";
import { HistorySlice, createHistorySlice } from "./slices/history.slice";
import { LikeSlice, createLikeSlice } from "./slices/likes.slice";

export type StoreState = AuthSlice &
  QueueSlice &
  SongSlice &
  HistorySlice &
  LikeSlice;

export type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => T;

export const useStore = create<StoreState>((set, get) => ({
  ...createAuthSlice(set, get),
  ...createQueueSlice(set, get),
  ...createSongSlice(set, get),
  ...createHistorySlice(set, get),
  ...createLikeSlice(set, get),
}));
