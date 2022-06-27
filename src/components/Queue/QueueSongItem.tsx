import React from "react";

import type { APISong } from "@/interfaces/api.interfaces";

export type SongListItemProps = {
  song: APISong;
  index: number;
};

export const QueueSongItem: React.FC<SongListItemProps> = ({ song, index }) => {
  return (
    <div className="flex items-center">
      <p className="w-8 mr-4 font-medium text-slate-100 text-lg">{index + 1}</p>

      <div className="flex flex-col justify-center">
        <p className="leading-snug font-medium text-sm text-slate-100">
          {song.title}
        </p>

        <p className="leading-snug font-normal text-xs text-slate-200">
          {song.artist.name}
        </p>
      </div>
    </div>
  );
};
