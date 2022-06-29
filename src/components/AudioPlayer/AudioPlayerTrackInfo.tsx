import { useMemo } from "react";

import type { SongProgression } from "@/interfaces/song.interfaces";

export type AudioPlayerTrackInfoProps = {
  imageUrl?: string;
  title: string;
  artist: string;
  songProgression: SongProgression | null;
};

export const AudioPlayerTrackInfo: React.FC<AudioPlayerTrackInfoProps> = ({
  artist,
  imageUrl,
  title,
  songProgression,
}) => {
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

  return (
    <div className="flex flex-1 justify-start">
      {imageUrl ? (
        <img
          className="mr-4 block h-auto w-14 rounded-sm"
          src={imageUrl}
          alt=""
        />
      ) : (
        <div className="mr-4 h-14 w-14 rounded-md border border-slate-700" />
      )}

      <div className="flex flex-col justify-center">
        <p className="mb-1 max-w-[33ch] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-snug text-slate-50">
          {title}
        </p>

        <p className="max-w-[66ch] overflow-hidden text-ellipsis whitespace-nowrap text-xs font-normal leading-snug text-slate-100">
          {artist}
        </p>

        {songProgression && !isBuffering ? (
          <p className="text-xs font-normal leading-snug text-slate-200">
            Loading {loadingPercentage}%...
          </p>
        ) : null}

        {isBuffering ? (
          <p className="text-xs font-normal leading-snug text-slate-200">
            Buffering...
          </p>
        ) : null}
      </div>
    </div>
  );
};
