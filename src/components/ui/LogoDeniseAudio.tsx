import cx from "classnames";

import { ReactComponent as Logo } from "@/assets/logo/wavebar.svg";

export type LogoDeniseAudioProps = {
  className?: string;
};

export const LogoDeniseAudio: React.FC<LogoDeniseAudioProps> = ({
  className,
}) => (
  <div
    className={cx([
      "pointer-events-none flex h-10 w-auto select-none items-center justify-center",
      className,
    ])}
  >
    <Logo />

    <p className="ml-[2px] select-none font-metropolis text-xl font-semibold leading-none tracking-wide text-white">
      deniseaudio
    </p>
  </div>
);
