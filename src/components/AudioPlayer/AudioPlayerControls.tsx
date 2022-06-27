import React, { useEffect, useState } from "react";
import { captureException } from "@sentry/react";
import { PlayIcon, PauseIcon } from "@heroicons/react/solid";

import type { APISong } from "@/interfaces/api.interfaces";

const cx = (classes: string[]) => classes.join(" ");

export type AudioPlayerControlsProps = {
  isSongLoading: boolean;
  currentSong: APISong | null;
  audioContext: AudioContext | null;
};

export const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  isSongLoading,
  currentSong,
  audioContext,
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
          "flex items-center justify-center w-12 h-12 focus:outline-none hover:scale-105 transition-transform duration-150 text-slate-50",
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
    </div>
  );
};
