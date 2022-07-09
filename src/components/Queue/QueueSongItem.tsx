import { useState } from "react";
import cx from "classnames";
import { addSeconds, format } from "date-fns";
import { HeartIcon } from "@heroicons/react/outline";
import { PlayIcon, MinusCircleIcon } from "@heroicons/react/solid";
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import { SongInitiatorTypes } from "@/interfaces/song.interfaces";
import { postSongLike } from "@/api";
import { useStore } from "@/store/store";
import { AudioManagerEvents, audioManager } from "@/lib/AudioManager";

export type SongListItemProps = {
  song: APISong;
  index: number;
};

export const QueueSongItem: React.FC<SongListItemProps> = ({ song, index }) => {
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);
  const likes = useStore((state) => state.likes);
  const updateLikes = useStore((state) => state.updateLikes);
  const queue = useStore((state) => state.queue);
  const updateQueue = useStore((state) => state.updateQueue);

  const [isLoading, setIsLoading] = useState(false);

  const isCurrentSong = index === 0;
  const isLiked = likes.includes(song.id);

  const playQueueItem = () => {
    if (!token) {
      captureException("No token at the time of playing a song.");
      return;
    }

    const queueSong = queue[index - 1];

    updateQueue([...queue.slice(index - 1)]);
    audioManager.emit(AudioManagerEvents.PREPARE_SONG, {
      song: queueSong,
      initiator: SongInitiatorTypes.QUEUE,
    });
  };

  const removeQueueItem = () => {
    updateQueue([...queue].filter((_, i) => i !== index - 1));
  };

  const onSongLike = () => {
    if (!isLoading && token && user && user.id) {
      setIsLoading(true);

      postSongLike(user.id, song.id, token)
        .then(({ data }) => {
          setIsLoading(false);
          return updateLikes(data.likes);
        })
        .catch((error) => {
          setIsLoading(false);
          captureException(error);
        });
    }
  };

  return (
    <div className="group flex items-center rounded-md px-4 py-2 hover:bg-neutral-700">
      <div className="mr-3 flex w-6 items-center justify-center">
        <p
          className={cx([
            "font-metropolis text-lg font-medium text-neutral-400",
            !isCurrentSong ? "group-hover:hidden" : "",
          ])}
        >
          {index + 1}
        </p>

        {!isCurrentSong ? (
          <button type="button" onClick={playQueueItem}>
            <PlayIcon className="hidden h-auto w-6 text-neutral-50 transition-transform duration-150 ease-in-out hover:scale-110 group-hover:block" />
          </button>
        ) : null}
      </div>

      <div className="mr-16 flex w-full max-w-[30vw] flex-col justify-center">
        <p className="overflow-hidden text-ellipsis font-metropolis text-sm font-medium leading-snug text-neutral-50">
          {song.title}
        </p>

        <p className="font-metropolis text-xs font-normal leading-snug text-neutral-400">
          {song.artist.name}
        </p>
      </div>

      <div className="flex flex-col justify-center">
        <p className="overflow-hidden text-ellipsis font-metropolis text-sm font-medium leading-snug text-neutral-400">
          {song.album.name}
        </p>
      </div>

      <div className="ml-auto flex items-center justify-center">
        <button
          type="button"
          className={cx([
            "mr-4",
            isLiked
              ? "text-green-500"
              : "hidden text-neutral-400 group-hover:block",
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

        <p className="overflow-hidden text-ellipsis font-mono text-sm font-medium leading-snug text-neutral-400">
          {format(addSeconds(new Date(0), song.length), "m:ss")}
        </p>

        <div className="w-8">
          {!isCurrentSong ? (
            <button
              type="button"
              className="ml-3 hidden h-auto w-5 text-neutral-400 group-hover:block"
              onClick={removeQueueItem}
            >
              <MinusCircleIcon className="h-auto w-full" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
