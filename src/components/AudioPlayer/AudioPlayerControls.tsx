import React, { useEffect, useState } from "react";
import { captureException } from "@sentry/react";
import { PlayIcon, PauseIcon } from "@heroicons/react/solid";

import type { APISong } from "@/interfaces/api.interfaces";
import { ReactComponent as PlayPreviousIcon } from "@/assets/icons/play-previous.svg";
import { ReactComponent as PlayNextIcon } from "@/assets/icons/play-next.svg";

const cx = (classes: string[]) => classes.join(" ");

export type AudioPlayerControlsProps = {
  isSongLoading: boolean;
  hasPreviousSong: boolean;
  hasNextSong: boolean;
  currentSong: APISong | null;
  audioContext: AudioContext | null;
  handlePlayPreviousSong: () => void;
  handlePlayNextSong: () => void;
};

export const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  isSongLoading,
  hasPreviousSong,
  hasNextSong,
  currentSong,
  audioContext,
  handlePlayPreviousSong,
  handlePlayNextSong,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleResumePause = () => {
    if (!currentSong || !audioContext) {
      return;
    }

    if (audioContext.state === "running") {
      audioContext.suspend().catch((err) => captureException(err));
      setIsPlaying(false);
    } else if (audioContext.state === "suspended") {
      audioContext.resume().catch((err) => captureException(err));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    setIsPlaying(audioContext?.state === "running" || false);
  }, [audioContext]);

  return (
    <div className="flex flex-1 justify-center items-center">
      <button
        type="button"
        className={cx([
          "w-12 h-12 flex items-center justify-center text-slate-300 hover:text-slate-50 transition-colors duration-100",
          isSongLoading || !hasPreviousSong
            ? "text-opacity-50 cursor-not-allowed"
            : " text-opacity-100 cursor-pointer",
        ])}
        onClick={handlePlayPreviousSong}
        disabled={isSongLoading || !hasPreviousSong}
      >
        <PlayPreviousIcon />
      </button>

      <button
        type="button"
        className={cx([
          "flex items-center justify-center w-12 h-12 focus:outline-none hover:scale-110 transition-transform duration-100 text-slate-50",
          isSongLoading
            ? "text-opacity-50 cursor-not-allowed"
            : "text-opacity-100 cursor-pointer",
        ])}
        onClick={() => handleResumePause()}
        disabled={isSongLoading}
      >
        {isPlaying ? (
          <PauseIcon className="w-full h-auto" />
        ) : (
          <PlayIcon className="w-full h-auto" />
        )}
      </button>

      <button
        type="button"
        className={cx([
          "w-12 h-12 flex items-center justify-center text-slate-300 hover:text-slate-50 transition-colors duration-100",
          isSongLoading || !hasNextSong
            ? "text-opacity-50 cursor-not-allowed"
            : " text-opacity-100 cursor-pointer",
        ])}
        onClick={handlePlayNextSong}
        disabled={isSongLoading || !hasNextSong}
      >
        <PlayNextIcon />
      </button>
    </div>
  );
};
