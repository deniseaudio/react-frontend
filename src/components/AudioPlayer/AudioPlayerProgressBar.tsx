import React, { useEffect, useState, useMemo } from "react";
import ReactInputSlider from "react-input-slider";
import { addSeconds, format } from "date-fns";

import type { APISong } from "@/interfaces/api.interfaces";
import { audioManager } from "@/lib/AudioManager";

export type AudioPlayerProgressBarProps = {
  isSongLoading: boolean;
};

export const AudioPlayerProgressBar: React.FC<AudioPlayerProgressBarProps> = ({
  isSongLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedValue, setDraggedValue] = useState(0);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formattedDuration = useMemo<string>(
    () => format(addSeconds(new Date(0), duration), "m:ss"),
    [duration]
  );

  const formattedCurrentTime = useMemo<string>(
    () => format(addSeconds(new Date(0), currentTime), "m:ss"),
    [currentTime]
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleOnChange = (values: { x: number; y: number }) => {
    setDraggedValue(values.x);
  };

  const resetSongHandler = (event: CustomEvent) => {
    const song = event.detail as APISong;

    setDuration(song.length);
    setCurrentTime(0);

    console.log(
      "[AudioPlayerProgressBar] Song changed, resetting current time and duration.",
      song
    );
  };

  const currentTimeUpdatedHandler = (event: CustomEvent) => {
    setCurrentTime((event.detail as number) / 1000);
  };

  // When playing a song, reset current time and set song duration.
  // In case the component is unmounted, make sure to remove the event listeners.
  useEffect(() => {
    audioManager.on("song-playing", resetSongHandler as EventListener);

    audioManager.on(
      "current-time-updated",
      currentTimeUpdatedHandler as EventListener
    );

    return () => {
      audioManager.off("song-playing", resetSongHandler as EventListener);

      audioManager.off(
        "current-time-updated",
        currentTimeUpdatedHandler as EventListener
      );
    };
  }, []);

  // Called when user release the slider (`onDragEnd`).
  useEffect(() => {
    if (!isDragging) {
      audioManager.seek(draggedValue);
      setCurrentTime(draggedValue);
    }
  }, [isDragging, draggedValue]);

  return (
    <div className="inline-flex items-center">
      <span className="min-w-[50px] mr-3 text-xs text-right text-slate-400">
        {formattedDuration}
      </span>

      <ReactInputSlider
        axis="x"
        xmin={0}
        xmax={duration}
        x={isDragging ? draggedValue : currentTime}
        xstep={1}
        disabled={isSongLoading}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onChange={handleOnChange}
        styles={{
          track: {
            width: "25vw",
            height: "6px",
            backgroundColor: "#4b5563",
          },
          thumb: {
            width: "12px",
            height: "12px",
          },
          active: { backgroundColor: "#16a34a" },
        }}
      />

      <span className="min-w-[50px] ml-3 text-xs text-left text-slate-400">
        {formattedCurrentTime}
      </span>
    </div>
  );
};
