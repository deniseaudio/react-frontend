import React from "react";

import type { APISong } from "@/interfaces/api.interfaces";

export type SongListItemProps = {
  song: APISong;
  index: number;
};

export const QueueSongItem: React.FC<SongListItemProps> = ({ song, index }) => {
  return (
    <div className="flex items-center">
      <p className="mr-4 w-8 text-lg font-medium text-slate-100">{index + 1}</p>

      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium leading-snug text-slate-100">
          {song.title}
        </p>

        <p className="text-xs font-normal leading-snug text-slate-200">
          {song.artist.name}
        </p>
      </div>
    </div>
  );
};
