import React, { useState } from "react";
import { VolumeUpIcon } from "@heroicons/react/solid";
import ReactInputSlider from "react-input-slider";

import { audioManager } from "@/lib/AudioManager";

export const AudioPlayerVolume: React.FC = () => {
  // Visual UI state.
  const [volume, setVolume] = useState(0.5);

  const handleVolumeChange = (values: { x: number; y: number }) => {
    audioManager.setVolumeGainNodeValue(values.x);
    setVolume(values.x);
  };

  return (
    <div className="flex items-center justify-end text-slate-300">
      <VolumeUpIcon className="mr-4 h-5 w-5" />

      <ReactInputSlider
        axis="x"
        xmin={0}
        xmax={1}
        x={volume}
        xstep={0.01}
        onChange={handleVolumeChange}
        styles={{
          track: {
            width: "125px",
            height: "6px",
            backgroundColor: "#e2e8f0",
          },
          thumb: {
            width: "12px",
            height: "12px",
          },
          active: { backgroundColor: "#16a34a" },
        }}
      />
    </div>
  );
};
