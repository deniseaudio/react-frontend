import { PlayIcon, PauseIcon } from "@heroicons/react/solid";

import { audioManager } from "@/lib/AudioManager";
import { ReactComponent as PlayPreviousIcon } from "@/assets/icons/play-previous.svg";
import { ReactComponent as PlayNextIcon } from "@/assets/icons/play-next.svg";

const cx = (classes: string[]) => classes.join(" ");

export type AudioPlayerControlsProps = {
  isPlaying: boolean;
  isSongLoading: boolean;
  hasPreviousSong: boolean;
  hasNextSong: boolean;
  handlePlayPreviousSong: () => void;
  handlePlayNextSong: () => void;
};

export const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  isPlaying,
  isSongLoading,
  hasPreviousSong,
  hasNextSong,
  handlePlayPreviousSong,
  handlePlayNextSong,
}) => {
  const onResumeOrPause = () => {
    audioManager.pauseOrResume();
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <button
        type="button"
        className={cx([
          "flex h-12 w-12 items-center justify-center text-neutral-300 transition-colors duration-100 hover:text-neutral-50",
          isSongLoading || !hasPreviousSong
            ? "cursor-not-allowed text-opacity-50"
            : "cursor-pointer text-opacity-100",
        ])}
        onClick={handlePlayPreviousSong}
        disabled={isSongLoading || !hasPreviousSong}
      >
        <PlayPreviousIcon />
      </button>

      <button
        type="button"
        className={cx([
          "flex h-12 w-12 items-center justify-center text-neutral-50 transition-transform duration-100 hover:scale-110 focus:outline-none",
          isSongLoading
            ? "cursor-not-allowed text-opacity-50"
            : "cursor-pointer text-opacity-100",
        ])}
        onClick={onResumeOrPause}
        disabled={isSongLoading}
      >
        {isPlaying ? (
          <PauseIcon className="h-auto w-full" />
        ) : (
          <PlayIcon className="h-auto w-full" />
        )}
      </button>

      <button
        type="button"
        className={cx([
          "flex h-12 w-12 items-center justify-center text-neutral-300 transition-colors duration-100 hover:text-neutral-50",
          isSongLoading || !hasNextSong
            ? "cursor-not-allowed text-opacity-50"
            : "cursor-pointer text-opacity-100",
        ])}
        onClick={handlePlayNextSong}
        disabled={isSongLoading || !hasNextSong}
      >
        <PlayNextIcon />
      </button>
    </div>
  );
};
