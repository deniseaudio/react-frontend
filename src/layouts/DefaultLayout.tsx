import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";

/**
 * Default layout for the app. Contains a navbar and audio-player that will be
 * rendered only when the user is logged in.
 */
export const DefaultLayout: React.FC = () => {
  const location = useLocation();

  return location.pathname !== "/" ? (
    <div className="relative min-h-screen">
      <Sidebar />
      <Navbar />

      <main className="max-h-[calc(100vh-96px)] overflow-y-auto pt-20 pl-64">
        <div className="px-8 pt-12">
          <Outlet />
        </div>
      </main>

      <AudioPlayer />
    </div>
  ) : (
    <Outlet />
  );
};
