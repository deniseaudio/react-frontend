import { useState } from "react";
import ReactInputSlider from "react-input-slider";

import { audioManager } from "@/lib/AudioManager";
import { ReactComponent as VolumeIcon } from "@/assets/icons/volume.svg";

export const AudioPlayerVolume: React.FC = () => {
  // Visual UI state.
  const [volume, setVolume] = useState(0.5);

  const handleVolumeChange = (values: { x: number; y: number }) => {
    audioManager.setVolumeGainNodeValue(values.x);
    setVolume(values.x);
  };

  return (
    <div className="flex items-center justify-end text-neutral-400">
      <VolumeIcon className="mr-4 h-4 w-4" />

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
            backgroundColor: "#404040",
          },
          thumb: {
            width: "12px",
            height: "12px",
            backgroundColor: "#fafafa",
          },
          active: { backgroundColor: "#22c55e" },
        }}
      />
    </div>
  );
};
