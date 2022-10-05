import { useEffect, useState } from "react";
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import { useStore } from "@/store/store";
import { getSongsLiked } from "@/api";
import { SongItem } from "@/components/Song/SongItem";

export const LikesView: React.FC = () => {
  const user = useStore((state) => state.user);

  const [hasFetched, setHasFetched] = useState(false);
  const [likedSongs, setLikedSongs] = useState<APISong[]>([]);

  const onLikeUpdate = () => {
    setHasFetched(false);
  };

  useEffect(() => {
    if (!hasFetched && user && user.id) {
      getSongsLiked()
        .then((response) => {
          setHasFetched(true);
          return setLikedSongs(response.data);
        })
        .catch((error) => {
          setHasFetched(true);
          captureException(error);
        });
    }
  }, [hasFetched, user]);

  return (
    <>
      <h3 className="mb-6 font-metropolis text-3xl text-neutral-50">Likes</h3>

      <div className="rounded-xl border border-neutral-800 bg-neutral-800 px-8 py-8 shadow-2xl">
        {!hasFetched ? (
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
                <SongItem
                  key={song.id}
                  song={song}
                  index={index}
                  onLikeUpdate={onLikeUpdate}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};
