import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CollectionIcon } from "@heroicons/react/solid";
import cx from "classnames";

export const AudioPlayerQueue: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isInQueueRoute = useMemo(
    () => location.pathname === "/queue",
    [location.pathname]
  );

  const handleClick = () => {
    if (isInQueueRoute) {
      navigate("/audio-player");
    } else {
      navigate("/queue");
    }
  };

  return (
    <div className="mr-4 flex flex-col items-center">
      <CollectionIcon
        className={cx(
          "h-5 w-5 cursor-pointer transition-colors duration-150 ease-in-out hover:text-neutral-50",
          isInQueueRoute ? "text-neutral-50" : "text-neutral-400"
        )}
        onClick={handleClick}
      />

      {isInQueueRoute ? (
        <span className="mt-1 mb-[-8px] inline-block h-[4px] w-[4px] rounded-full bg-green-500" />
      ) : null}
    </div>
  );
};
