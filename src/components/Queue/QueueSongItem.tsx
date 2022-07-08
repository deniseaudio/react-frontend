import React from "react";

import type { APISong } from "@/interfaces/api.interfaces";

export type SongListItemProps = {
  song: APISong;
  index: number;
};

export const QueueSongItem: React.FC<SongListItemProps> = ({ song, index }) => {
  return (
    <div className="flex items-center">
      <p className="mr-3 w-6 font-metropolis text-lg font-medium text-neutral-400">
        {index + 1}
      </p>

      <div className="flex flex-col justify-center">
        <p className="font-metropolis text-sm font-medium leading-snug text-neutral-50">
          {song.title}
        </p>

        <p className="font-metropolis text-xs font-normal leading-snug text-neutral-400">
          {song.artist.name}
        </p>
      </div>
    </div>
  );
};
