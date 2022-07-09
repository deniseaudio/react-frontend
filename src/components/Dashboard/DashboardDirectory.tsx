import { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { captureException } from "@sentry/react";

import type { APIRootDirectory } from "@/interfaces/api.interfaces";
import { getRootDirectories } from "@/api";
import { useStore } from "@/store/store";
import { FolderTree } from "@/components/FolderTree/FolderTree";

export type DashboardDirectoryProps = {
  className?: string;
};

export const DashboardDirectory: React.FC<DashboardDirectoryProps> = ({
  className,
}) => {
  const { token } = useStore((state) => ({ token: state.token }), shallow);

  const [rootDirectories, setRootDirectories] = useState<APIRootDirectory[]>(
    []
  );

  // Fetch root directories on mount.
  useEffect(() => {
    if (token) {
      setRootDirectories([]);

      getRootDirectories(token)
        .then(({ response, data }) => {
          if (response.ok && data.directories) {
            setRootDirectories([...data.directories]);
          }

          return { response, data };
        })
        .catch((error) => captureException(error));
    }
  }, [token]);

  return (
    <>
      <h3 className="mb-6 font-metropolis text-3xl text-neutral-50">
        Library Browser
      </h3>

      <div className="rounded-xl border border-neutral-800 bg-neutral-800 px-8 py-8 shadow-2xl">
        {rootDirectories.length === 0 ? (
          <p className="font-metropolis text-lg font-medium leading-tight text-neutral-400">
            Loading...
          </p>
        ) : null}

        {/* Create a FolderTree for each root directory. */}
        {rootDirectories.map((rootDirectory) => (
          <FolderTree
            key={`root-${rootDirectory.id}`}
            rootDirectory={rootDirectory}
            className={className}
          />
        ))}
      </div>
    </>
  );
};
