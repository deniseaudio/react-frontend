import { NavLink } from "react-router-dom";
import cx from "classnames";
import {
  ClipboardListIcon,
  CollectionIcon,
  HeartIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/outline";

import { LogoDeniseAudio } from "@/components/ui/LogoDeniseAudio";

type SidebarLink = {
  to: string;
  name: string;
  icon: JSX.Element;
};

export const Sidebar: React.FC = () => {
  const links: SidebarLink[] = [
    {
      to: "/audio-player",
      name: "Home",
      icon: <HomeIcon className="mr-3 h-auto w-5" />,
    },
    {
      to: "/likes",
      name: "Likes",
      icon: <HeartIcon className="mr-3 h-auto w-5" />,
    },
    {
      to: "/queue",
      name: "Queue",
      icon: <CollectionIcon className="mr-3 h-auto w-5" />,
    },
    {
      to: "/history",
      name: "History",
      icon: <ClipboardListIcon className="mr-3 h-auto w-5" />,
    },
    {
      to: "/me",
      name: "Profile",
      icon: <UserIcon className="mr-3 h-auto w-5" />,
    },
  ];

  return (
    <div className="fixed top-0 left-0 bottom-0 z-10 w-64 border-r border-neutral-800 bg-neutral-900">
      <div className="flex h-20 w-full items-center justify-center border-b border-neutral-800">
        <LogoDeniseAudio />
      </div>

      <ul className="flex flex-col space-y-6 px-8 py-8">
        {links.map((link) => (
          <li className="flex flex-col" key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                cx([
                  "flex items-center font-metropolis transition-colors duration-200 ease-in-out",
                  isActive
                    ? "text-white"
                    : "text-neutral-400 hover:text-neutral-50",
                ])
              }
            >
              {link.icon} {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
