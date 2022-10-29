import { useState } from "react";
import ReactInputSlider from "react-input-slider";

import { audioManager } from "@/lib/AudioManager";
import { ReactComponent as VolumeIcon } from "@/assets/icons/volume.svg";
import { ReactComponent as VolumeMutedIcon } from "@/assets/icons/volume-muted.svg";

export const AudioPlayerVolume: React.FC = () => {
  // Visual UI state.
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (values: { x: number; y: number }) => {
    audioManager.setVolumeGainNodeValue(values.x);
    setVolume(values.x);
  };

  const handleMuteClick = () => {
    if (isMuted) {
      audioManager.setVolumeGainNodeValue(volume);
      setIsMuted(false);
    } else {
      audioManager.setVolumeGainNodeValue(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="flex items-center justify-end text-neutral-400">
      {isMuted ? (
        <VolumeMutedIcon
          className="mr-4 h-4 w-4 cursor-pointer hover:text-neutral-50"
          onClick={handleMuteClick}
        />
      ) : (
        <VolumeIcon
          className="mr-4 h-4 w-4 cursor-pointer hover:text-neutral-50"
          onClick={handleMuteClick}
        />
      )}

      <ReactInputSlider
        axis="x"
        xmin={0}
        xmax={1}
        x={isMuted ? 0 : volume}
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
