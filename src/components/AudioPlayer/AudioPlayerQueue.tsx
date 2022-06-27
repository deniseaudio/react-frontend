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
    <div className="flex flex-col items-center mr-4">
      <CollectionIcon
        className={cx(
          "w-5 h-5 cursor-pointer hover:text-slate-100",
          isInQueueRoute ? "text-slate-100" : "text-slate-300"
        )}
        onClick={handleClick}
      />

      {isInQueueRoute ? (
        <span className="inline-block w-[4px] h-[4px] mt-1 mb-[-8px] rounded-full bg-[#16a34a]" />
      ) : null}
    </div>
  );
};
