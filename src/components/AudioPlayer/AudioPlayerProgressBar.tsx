import React, { useEffect, useState, useMemo } from "react";
import ReactInputSlider from "react-input-slider";
import { addSeconds, format } from "date-fns";

import type { APISong } from "@/interfaces/api.interfaces";
import { AudioManagerEvents, audioManager } from "@/lib/AudioManager";

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
  useEffect(() => {
    audioManager.on(
      AudioManagerEvents.SONG_PLAYING,
      resetSongHandler as EventListener
    );

    audioManager.on(
      AudioManagerEvents.CURRENT_TIME_UPDATED,
      currentTimeUpdatedHandler as EventListener
    );

    return () => {
      audioManager.off(
        AudioManagerEvents.SONG_PLAYING,
        resetSongHandler as EventListener
      );

      audioManager.off(
        AudioManagerEvents.CURRENT_TIME_UPDATED,
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
      <span className="mr-3 min-w-[50px] text-right text-xs tracking-tight text-neutral-400">
        {formattedCurrentTime}
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
            backgroundColor: "#404040",
          },
          thumb: {
            width: "12px",
            height: "12px",
            backgroundColor: "#fafafa",
          },
          active: { backgroundColor: "#fff" },
        }}
      />

      <span className="ml-3 min-w-[50px] text-left text-xs tracking-tight text-neutral-400">
        {formattedDuration}
      </span>
    </div>
  );
};
