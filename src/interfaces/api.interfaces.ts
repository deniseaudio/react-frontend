export type APIUser = {
  id: number;
  username: string;
  email: string;
  likes: APISong[];
};

export type APIChildrenDirectory = {
  id: number;
  parentId: number;
  name: string;
};

export type APIRootDirectory = {
  id: number;
  name: string;
  root: true;
  children: APIChildrenDirectory[];
};

export type APIDirectory = {
  id: number;
  parentId: number;
  name: string;
  root: boolean;
  children: APIChildrenDirectory[];
  songs: APISong[];
};

export type APIArtist = {
  id: number;
  name: string;
};

export type APIAlbum = {
  id: number;
  name: string;
};

export type APISong = {
  id: number;
  directoryId: number;
  title: string;
  filename: string;
  length: number;
  codec: string;
  artists: APIArtist[];
  album: APIAlbum | null;
};
