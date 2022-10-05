import type { APISong } from "./api.interfaces";

export type OrderedDirectory = {
  id: number;
  name: string;
  songs: APISong[];
  children: OrderedDirectory[];
};
