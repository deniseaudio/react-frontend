import React from "react";
import { Routes, Route } from "react-router-dom";

import { DefaultLayout } from "@/layouts/DefaultLayout";
import { LoginView } from "@/views/LoginView";
import { AudioPlayerView } from "@/views/AudioPlayerView";
import { QueueView } from "@/views/QueueView";
import { RequireAuth } from "@/components/RequireAuth";

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<LoginView />} />

        <Route
          path="audio-player"
          element={
            <RequireAuth>
              <AudioPlayerView />
            </RequireAuth>
          }
        />

        <Route
          path="queue"
          element={
            <RequireAuth>
              <QueueView />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
