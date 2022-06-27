import type { APISong } from "./api.interfaces";

export type OrderedDirectory = {
  id: string;
  name: string;
  songs: APISong[];
  children: OrderedDirectory[];
};
