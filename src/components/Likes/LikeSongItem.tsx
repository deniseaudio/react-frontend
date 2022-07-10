import { addSeconds, format } from "date-fns";
import { HeartIcon } from "@heroicons/react/outline";
import { PlayIcon } from "@heroicons/react/solid";
import { captureException } from "@sentry/react";

import type { APISong } from "@/interfaces/api.interfaces";
import { SongInitiatorTypes } from "@/interfaces/song.interfaces";
import { useStore } from "@/store/store";
import { AudioManagerEvents, audioManager } from "@/lib/AudioManager";

export type LikeSongItemProps = {
  song: APISong;
  index: number;
  onUnlike: (song: APISong) => void;
};

export const LikeSongItem: React.FC<LikeSongItemProps> = ({
  song,
  index,
  onUnlike,
}) => {
  const token = useStore((state) => state.token);

  const playLikeItem = () => {
    if (!token) {
      captureException("No token at the time of playing a song.");
      return;
    }

    audioManager.emit(AudioManagerEvents.PREPARE_SONG, {
      song,
      initiator: SongInitiatorTypes.QUEUE,
    });
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
          {song.artist.name}
        </p>
      </div>

      <div className="flex flex-col justify-center">
        <p className="overflow-hidden text-ellipsis font-metropolis text-sm font-medium leading-snug text-neutral-400">
          {song.album.name}
        </p>
      </div>

      <div className="ml-auto flex items-center justify-center">
        <button type="button" onClick={() => onUnlike(song)}>
          <HeartIcon className="mr-4 h-auto w-5 fill-green-500 text-green-500" />
        </button>

        <p className="overflow-hidden text-ellipsis font-mono text-sm font-medium leading-snug text-neutral-400">
          {format(addSeconds(new Date(0), song.length), "m:ss")}
        </p>
      </div>
    </div>
  );
};
