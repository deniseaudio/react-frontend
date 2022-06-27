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
          className="block w-14 h-auto mr-4 rounded-sm"
          src={imageUrl}
          alt=""
        />
      ) : (
        <div className="w-14 h-14 mr-4 border rounded-md border-slate-700" />
      )}

      <div className="flex flex-col justify-center">
        <p className="mb-1 leading-snug font-medium text-sm text-slate-50">
          {title}
        </p>

        <p className="leading-snug font-normal text-xs text-slate-100">
          {artist}
        </p>

        {songProgression && !isBuffering ? (
          <p className="leading-snug font-normal text-xs text-slate-200">
            Loading {loadingPercentage}%...
          </p>
        ) : null}

        {isBuffering ? (
          <p className="leading-snug font-normal text-xs text-slate-200">
            Buffering...
          </p>
        ) : null}
      </div>
    </div>
  );
};
