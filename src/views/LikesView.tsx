import { useEffect, useState } from "react";
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import { useStore } from "@/store/store";
import { postSongLike, getLikesAsSongs } from "@/api";
import { LikeSongItem } from "@/components/Likes/LikeSongItem";

export const LikesView: React.FC = () => {
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [likedSongs, setLikedSongs] = useState<APISong[]>([]);

  const onUnlike = (song: APISong) => {
    if (!isLoading && user && user.id && token) {
      setIsLoading(true);

      postSongLike(user.id, song.id, token)
        .then(() => {
          setIsLoading(false);
          return setHasFetched(false);
        })
        .catch((error) => {
          setIsLoading(true);
          captureException(error);
        });
    }
  };

  useEffect(() => {
    if (!hasFetched && user && user.id && token) {
      getLikesAsSongs(user.id, token)
        .then((response) => {
          setHasFetched(true);
          return setLikedSongs(response.data);
        })
        .catch((error) => {
          setHasFetched(true);
          captureException(error);
        });
    }
  }, [hasFetched, user, token]);

  return (
    <>
      <h3 className="mb-6 font-metropolis text-3xl text-neutral-50">Likes</h3>

      <div className="rounded-xl border border-neutral-800 bg-neutral-800 px-8 py-8 shadow-2xl">
        {likedSongs.length === 0 ? (
          <p className="font-metropolis text-lg font-medium leading-tight text-neutral-400">
            Loading...
          </p>
        ) : null}

        {hasFetched || likedSongs.length > 0 ? (
          <>
            <p className="mb-4 font-metropolis text-lg font-medium leading-tight text-neutral-400">
              Liked songs
            </p>

            <div className="flex flex-col">
              {likedSongs.map((song, index) => (
                <LikeSongItem
                  key={song.id}
                  song={song}
                  index={index}
                  onUnlike={onUnlike}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};