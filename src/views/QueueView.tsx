import React from "react";
import cx from "classnames";

import { useStore } from "@/store/store";
import { SongQueueItem } from "@/components/Song/SongQueueItem";

export const QueueView: React.FC = () => {
  const queue = useStore((state) => state.queue);
  const currentSong = useStore((state) => state.currentSong);

  return (
    <>
      <h3 className="mb-6 font-metropolis text-3xl text-neutral-50">Queue</h3>

      <div className="rounded-xl border border-neutral-800 bg-neutral-800 px-8 py-8 shadow-2xl">
        <p
          className={cx(
            "font-metropolis text-lg font-medium leading-tight text-neutral-400",
            currentSong && "mb-4"
          )}
        >
          {currentSong ? "Now playing" : "No song playing"}
        </p>

        {currentSong ? <SongQueueItem song={currentSong} index={0} /> : null}

        {queue.length > 0 ? (
          <p className="mt-8 mb-4 font-metropolis text-lg font-medium leading-tight text-neutral-400">
            Next queued
          </p>
        ) : null}

        <div className="flex flex-col">
          {queue.map((song, index) => (
            <SongQueueItem key={song.id} song={song} index={index + 1} />
          ))}
        </div>
      </div>
    </>
  );
};
