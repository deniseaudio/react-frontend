import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";

/**
 * Default layout for the app. Contains a navbar and audio-player that will be
 * rendered only when the user is logged in.
 */
export const DefaultLayout: React.FC = () => {
  const location = useLocation();

  return location.pathname !== "/" ? (
    <>
      <Navbar />

      <main className="max-w-[1024px] mx-auto pb-24">
        <div className="p-8">
          <Outlet />
        </div>
      </main>

      <AudioPlayer />
    </>
  ) : (
    <Outlet />
  );
};
