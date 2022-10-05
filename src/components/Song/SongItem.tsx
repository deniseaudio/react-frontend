import { useState } from "react";
import cx from "classnames";
import { addSeconds, format } from "date-fns";
import { HeartIcon } from "@heroicons/react/outline";
import { PlayIcon } from "@heroicons/react/solid";
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import { SongInitiatorTypes } from "@/interfaces/song.interfaces";
import { useStore } from "@/store/store";
import { postSongLike } from "@/api";
import { AudioManagerEvents, audioManager } from "@/lib/AudioManager";

export type SongItemProps = {
  song: APISong;
  index: number;
  onLikeUpdate?: (song: APISong) => void;
};

export const SongItem: React.FC<SongItemProps> = ({
  song,
  index,
  onLikeUpdate,
}) => {
  const user = useStore((state) => state.user);
  const likes = useStore((state) => state.likes);
  const updateLikes = useStore((state) => state.updateLikes);

  const isLiked = likes.findIndex((like) => like.id === song.id) !== -1;

  const [isLoading, setIsLoading] = useState(false);

  const playLikeItem = () => {
    audioManager.emit(AudioManagerEvents.PREPARE_SONG, {
      song,
      initiator: SongInitiatorTypes.QUEUE,
    });
  };

  const onSongLike = () => {
    if (!isLoading && user && user.id) {
      setIsLoading(true);

      postSongLike(song.id.toString())
        .then(({ data }) => {
          if (onLikeUpdate) {
            onLikeUpdate(song);
          }

          updateLikes(data);
          return setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(true);
          captureException(error);
        });
    }
  };

  return (
    <div className="group flex items-center rounded-md px-4 py-2 hover:bg-neutral-700">
      <div className="mr-3 flex w-6 items-center justify-center">
        <p className="font-metropolis text-lg font-medium text-neutral-400 group-hover:hidden">
          {index + 1}
        </p>

        <button type="button" onClick={playLikeItem}>
          <PlayIcon className="hidden h-auto w-6 text-neutral-50 transition-transform duration-150 ease-in-out hover:scale-110 group-hover:block" />
        </button>
      </div>

      <div className="mr-16 flex w-full max-w-[30vw] flex-col justify-center">
        <p className="overflow-hidden text-ellipsis font-metropolis text-sm font-medium leading-snug text-neutral-50">
          {song.title}
        </p>

        <p className="font-metropolis text-xs font-normal leading-snug text-neutral-400">
          {song.artists[0]?.name || "Unknown"}
        </p>
      </div>

      <div className="flex flex-col justify-center">
        <p className="overflow-hidden text-ellipsis font-metropolis text-sm font-medium leading-snug text-neutral-400">
          {song.album?.name || "Unknown"}
        </p>
      </div>

      <div className="ml-auto flex items-center justify-center">
        <button type="button" onClick={onSongLike}>
          <HeartIcon
            className={cx([
              "mr-4 h-auto w-5",
              isLiked
                ? "fill-green-500 text-green-500"
                : "text-neutral-400 hover:fill-neutral-400",
            ])}
          />
        </button>

        <p className="overflow-hidden text-ellipsis font-mono text-sm font-medium leading-snug text-neutral-400">
          {format(addSeconds(new Date(0), song.length), "m:ss")}
        </p>
      </div>
    </div>
  );
};
