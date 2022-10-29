import React from "react";
import { Routes, Route } from "react-router-dom";

import { DefaultLayout } from "@/layouts/DefaultLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { LoginView } from "@/views/LoginView";
import { AudioPlayerView } from "@/views/AudioPlayerView";
import { QueueView } from "@/views/QueueView";
import { LikesView } from "@/views/LikesView";
import { HistoryView } from "@/views/HistoryView";
import { ProfileView } from "@/views/ProfileView";

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

        <Route
          path="likes"
          element={
            <RequireAuth>
              <LikesView />
            </RequireAuth>
          }
        />

        <Route
          path="history"
          element={
            <RequireAuth>
              <HistoryView />
            </RequireAuth>
          }
        />

        <Route
          path="me"
          element={
            <RequireAuth>
              <ProfileView />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
