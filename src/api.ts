import type {
  UpdateUserSettings,
  APIUser,
  APIDirectory,
  APIRootDirectory,
  APISong,
} from "@/interfaces/api.interfaces";

const API_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL as string)
  : "http://localhost:3000";

const convertResponse = <T>(
  response: Response
): Promise<{ data: T; response: Response }> => {
  return response.json().then((data: { data: T; message?: string }) => ({
    data: data.data,
    response,
  }));
};

export const postLogin = (email: string, password: string) => {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  }).then((response) => convertResponse<APIUser>(response));
};

export const postRegister = (
  username: string,
  email: string,
  password: string,
  secretKey: string
) => {
  return fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, secretKey }),
    credentials: "include",
  }).then((response) => convertResponse<APIUser>(response));
};

export const getRootDirectories = () => {
  return fetch(`${API_URL}/folder-tree/root-directories`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => convertResponse<APIRootDirectory[]>(response));
};

export const getDirectoryContent = (id: string) => {
  return fetch(`${API_URL}/folder-tree/directory?id=${id}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => convertResponse<APIDirectory>(response));
};

export const getSongStream = (songId: string) => {
  return fetch(`${API_URL}/songs/stream?id=${songId}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getSongCover = (songId: string) => {
  return fetch(`${API_URL}/songs/cover?id=${songId}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.blob());
};

export const getSongsLiked = () => {
  return fetch(`${API_URL}/user/songs-liked`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => convertResponse<APISong[]>(response));
};

export const postSongLike = (songId: string) => {
  return fetch(`${API_URL}/user/toggle-song-like?id=${songId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => convertResponse<APISong[]>(response));
};

export const postUserSettings = (payload: UpdateUserSettings) => {
  return fetch(`${API_URL}/user/update-options`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
