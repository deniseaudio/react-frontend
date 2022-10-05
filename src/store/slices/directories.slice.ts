import type {
  APIRootDirectory,
  APIDirectory,
} from "@/interfaces/api.interfaces";
import type { StoreSlice } from "../store";

export type DirectoriesSlice = {
  rootDirectories: APIRootDirectory[];
  directories: APIDirectory[];
  openedDirectories: number[];
  updateRootDirectories: (rootDirectories: APIRootDirectory[]) => void;
  updateDirectories: (directories: APIDirectory[]) => void;
  updateOpenedDirectories: (openedDirectories: number[]) => void;
};

export const createDirectoriesSlice: StoreSlice<DirectoriesSlice> = (set) => ({
  rootDirectories: [],
  directories: [],
  openedDirectories: [],
  updateRootDirectories: (dirs) => set(() => ({ rootDirectories: [...dirs] })),
  updateDirectories: (dirs) => set(() => ({ directories: [...dirs] })),
  updateOpenedDirectories: (dirs) =>
    set(() => ({ openedDirectories: [...dirs] })),
});
