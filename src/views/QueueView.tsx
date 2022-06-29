import React from "react";
import shallow from "zustand/shallow";
import cx from "classnames";

import { useStore } from "@/store/store";
import { QueueSongItem } from "@/components/Queue/QueueSongItem";

export const QueueView: React.FC = () => {
  const { queue, currentSong } = useStore(
    (state) => ({ queue: state.queue, currentSong: state.currentSong }),
    shallow
  );

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-md bg-gray-600 px-8 py-4">
      <h3 className="mb-3 text-2xl font-medium leading-tight text-slate-50">
        Queue
      </h3>

      <p
        className={cx(
          "text-lg font-medium leading-tight text-slate-300",
          currentSong && "mb-4"
        )}
      >
        {currentSong ? "Now playing" : "No song playing"}
      </p>

      {currentSong ? <QueueSongItem song={currentSong} index={0} /> : null}

      {queue.length ? (
        <p className="my-4 text-lg font-medium leading-tight text-slate-300">
          Next queued:
        </p>
      ) : null}

      <div className="flex flex-col space-y-2">
        {queue.map((song, index) => (
          <QueueSongItem key={song.id} song={song} index={index + 1} />
        ))}
      </div>
    </div>
  );
};
