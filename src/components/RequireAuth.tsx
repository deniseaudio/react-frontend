import React from "react";
import { Navigate } from "react-router-dom";
import shallow from "zustand/shallow";

import { useStore } from "@/store/store";

export const RequireAuth: React.FC = ({ children }) => {
  const { token, user } = useStore(
    (state) => ({
      user: state.user,
      token: state.token,
    }),
    shallow
  );

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
