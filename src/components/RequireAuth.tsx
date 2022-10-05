import React from "react";
import { Navigate } from "react-router-dom";

import { useStore } from "@/store/store";

export const RequireAuth: React.FC = ({ children }) => {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
