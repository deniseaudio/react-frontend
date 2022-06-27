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
        })
        .catch((err) => captureException(err));
    }
  }, [token]);

  return (
    <div className="max-h-[600px] overflow-y-auto px-8 py-4 rounded-md bg-gray-600">
      <h3 className="mb-3 text-2xl text-slate-50 font-medium leading-tight">
        Library browser
      </h3>

      {/* Create a FolderTree for each root directory. */}
      {rootDirectories.map((rootDirectory) => (
        <FolderTree
          key={`root-${rootDirectory.id}`}
          rootDirectory={rootDirectory}
          className={className}
        />
      ))}
    </div>
  );
};
