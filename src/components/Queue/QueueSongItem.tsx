import cx from "classnames";
import { addSeconds, format } from "date-fns";
import { PlayIcon } from "@heroicons/react/solid";
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import { SongInitiatorTypes } from "@/interfaces/song.interfaces";
import { useStore } from "@/store/store";
import { AudioManagerEvents, audioManager } from "@/lib/AudioManager";

export type SongListItemProps = {
  song: APISong;
  index: number;
};

export const QueueSongItem: React.FC<SongListItemProps> = ({ song, index }) => {
  const token = useStore((state) => state.token);
  const queue = useStore((state) => state.queue);
  const updateQueue = useStore((state) => state.updateQueue);

  const isCurrentSong = index === 0;

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

      <div className="ml-auto flex flex-col justify-center">
        <p className="overflow-hidden text-ellipsis font-mono text-sm font-medium leading-snug text-neutral-400">
          {format(addSeconds(new Date(0), song.length), "m:ss")}
        </p>
      </div>
    </div>
  );
};
