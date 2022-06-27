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
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="block w-5 h-auto mr-3"
                src={LogoImageSrc}
                alt=""
              />

              <p className="font-semibold text-xl text-slate-50">
                Synology Audio Server
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-6">
            <p className="font-medium text-base text-slate-200">
              Welcome, {user ? user.username : "guest"}
            </p>

            <button
              className="flex items-center justify-center px-4 py-2 rounded-sm text-base text-slate-900 bg-slate-200 hover:bg-slate-100 focus:outline-none"
              type="button"
              onClick={handleClickLogout}
            >
              <LogoutIcon className="w-4 h-auto mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
