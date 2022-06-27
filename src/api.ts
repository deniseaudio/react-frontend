import type {
  APIDirectory,
  APIRootDirectory,
  APIUser,
} from "@/interfaces/api.interfaces";

const API_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL as string)
  : "http://localhost:3000";

const convertResponse = <T>(
  response: Response
): Promise<{ data: T; response: Response }> => {
  return response.json().then((data: T) => ({ data, response }));
};

export const postLogin = (email: string, password: string) => {
  return fetch(`${API_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((response) =>
    convertResponse<{ token: string; user: APIUser }>(response)
  );
};

export const getRootDirectories = (token: string) => {
  return fetch(`${API_URL}/api/app/root-directories`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) =>
    convertResponse<{ directories: APIRootDirectory[] }>(response)
  );
};

export const getDirectoryContent = (token: string, id: string) => {
  return fetch(`${API_URL}/api/app/directory-content?directoryId=${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => convertResponse<{ directory: APIDirectory }>(response));
};

export const getSongStream = (songId: string, token: string) => {
  return fetch(`${API_URL}/api/app/stream?songId=${songId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSongCover = (songId: string, token: string) => {
  return fetch(`${API_URL}/api/app/cover?songId=${songId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.blob());
};
