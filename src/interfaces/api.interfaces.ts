export type APIUser = {
  id: string;
  username: string;
  email: string;
};

export type APIArtist = {
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
};

export type APIAlbum = {
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
};

export type APISong = {
  album: APIAlbum;
  albumId: string;
  artist: APIArtist;
  artistId: string;
  createdAt: string;
  directoryId: string;
  id: string;
  length: number;
  title: string;
  updatedAt: string;
  filename: string;
  codec: string;
};

export type APIRootDirectory = {
  id: string;
  name: string;
};

export type APIDirectory = {
  id: string;
  name: string;
  children: {
    id: string;
    name: string;
  }[];
  songs: APISong[];
};
