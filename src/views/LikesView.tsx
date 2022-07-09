import { useEffect, useState } from "react";
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import { useStore } from "@/store/store";
import { getLikesAsSongs } from "@/api";
import { LikeSongItem } from "@/components/Likes/LikeSongItem";

export const LikesView: React.FC = () => {
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);

  const [hasFetched, setHasFetched] = useState(false);
  const [likedSongs, setLikedSongs] = useState<APISong[]>([]);

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
        <div className="flex flex-col">
          {likedSongs.map((song, index) => (
            <LikeSongItem key={song.id} song={song} index={index} />
          ))}
        </div>
      </div>
    </>
  );
};
