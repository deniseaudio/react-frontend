import React from "react";
import { useNavigate } from "react-router-dom";
import { LogoutIcon } from "@heroicons/react/outline";

import { audioManager } from "@/lib/AudioManager";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const logout = useStore((state) => state.logout);

  const navigate = useNavigate();

  const handleClickLogout = () => {
    audioManager.clean();
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 w-full border-b border-neutral-800 bg-neutral-900 pl-64">
      <div className="relative flex h-full w-full items-center justify-end px-8">
        <Button
          type="button"
          variant="secondary"
          className="inline-flex w-auto items-center justify-center"
          onClick={handleClickLogout}
        >
          <LogoutIcon className="h-5 w-auto" />
        </Button>
      </div>
    </nav>
  );
};
