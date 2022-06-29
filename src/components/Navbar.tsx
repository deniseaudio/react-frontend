import React from "react";
import { useNavigate } from "react-router-dom";
import shallow from "zustand/shallow";
import { LogoutIcon } from "@heroicons/react/outline";

import { audioManager } from "@/lib/AudioManager";
import { useStore } from "@/store/store";
import LogoImageSrc from "@/assets/images/logo-purple.svg";

export const Navbar: React.FC = () => {
  const { user, logout } = useStore(
    (state) => ({
      token: state.token,
      user: state.user,
      logout: state.logout,
    }),
    shallow
  );

  const navigate = useNavigate();

  const handleClickLogout = () => {
    audioManager.clean();
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="mr-3 block h-auto w-5"
                src={LogoImageSrc}
                alt=""
              />

              <p className="text-xl font-semibold text-slate-50">
                Synology Audio Server
              </p>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center space-x-6">
            <p className="text-base font-medium text-slate-200">
              Welcome, {user ? user.username : "guest"}
            </p>

            <button
              className="flex items-center justify-center rounded-sm bg-slate-200 px-4 py-2 text-base text-slate-900 hover:bg-slate-100 focus:outline-none"
              type="button"
              onClick={handleClickLogout}
            >
              <LogoutIcon className="mr-2 h-auto w-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
