import { useState, useMemo } from "react";
import cx from "classnames";
import { HeartIcon } from "@heroicons/react/outline";
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import type { SongProgression } from "@/interfaces/song.interfaces";
import { postSongLike } from "@/api";
import { useStore } from "@/store/store";

export type AudioPlayerTrackInfoProps = {
  song: APISong | null;
  imageUrl?: string;
  title: string;
  artist: string;
  songProgression: SongProgression | null;
};

export const AudioPlayerTrackInfo: React.FC<AudioPlayerTrackInfoProps> = ({
  song,
  artist,
  imageUrl,
  title,
  songProgression,
}) => {
  const user = useStore((state) => state.user);
  const likes = useStore((state) => state.likes);
  const updateLikes = useStore((state) => state.updateLikes);

  const [isLoading, setIsLoading] = useState(false);

  const isLiked = song
    ? likes.findIndex((like) => like.id === song.id) !== -1
    : false;

  const loadingPercentage = useMemo(
    () =>
      songProgression
        ? Math.floor(
            (songProgression.currentLength / songProgression.totalLength) * 100
          )
        : -1,
    [songProgression]
  );

  const isBuffering = useMemo(
    () => loadingPercentage >= 100,
    [loadingPercentage]
  );

  const onSongLike = () => {
    if (!isLoading && song && user && user.id) {
      setIsLoading(true);

      postSongLike(song.id.toString())
        .then(({ data }) => {
          setIsLoading(false);
          return updateLikes(data);
        })
        .catch((error) => {
          setIsLoading(false);
          captureException(error);
        });
    }
  };

  return (
    <div className="flex flex-1 justify-start">
      {imageUrl ? (
        <img
          className="mr-4 block h-auto w-14 rounded-sm"
          src={imageUrl}
          alt=""
        />
      ) : (
        <div className="mr-4 h-14 w-14 rounded-md border border-neutral-800" />
      )}

      <div className="flex flex-col justify-center">
        <p className="mb-1 max-w-[33ch] overflow-hidden text-ellipsis whitespace-nowrap font-metropolis text-sm font-medium leading-snug text-neutral-50">
          {title}
        </p>

        <p className="max-w-[66ch] overflow-hidden text-ellipsis whitespace-nowrap font-metropolis text-xs font-normal leading-snug text-neutral-400">
          {artist}
        </p>

        {songProgression && !isBuffering ? (
          <p className="font-metropolis text-xs font-normal leading-snug text-neutral-300">
            Loading {loadingPercentage}%...
          </p>
        ) : null}

        {isBuffering ? (
          <p className="font-metropolis text-xs font-normal leading-snug text-neutral-300">
            Buffering...
          </p>
        ) : null}
      </div>

      <button
        type="button"
        className={cx([
          "ml-6",
          isLiked ? "text-green-500" : "text-neutral-400",
        ])}
        onClick={onSongLike}
      >
        <HeartIcon
          className={cx([
            "h-auto w-5",
            isLiked ? "fill-green-500" : "hover:fill-neutral-400",
          ])}
        />
      </button>
    </div>
  );
};
