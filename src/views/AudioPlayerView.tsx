import { useEffect } from "react";
import { captureException } from "@sentry/react";

import { getRootDirectories } from "@/api";
import { useStore } from "@/store/store";
import { FolderTree } from "@/components/FolderTree/FolderTree";

export const AudioPlayerView: React.FC = () => {
  const token = useStore((state) => state.token);
  const rootDirectories = useStore((state) => state.rootDirectories);
  const openedDirectories = useStore((state) => state.openedDirectories);
  const setRootDirectories = useStore((state) => state.updateRootDirectories);
  const setOpenedDirectories = useStore(
    (state) => state.updateOpenedDirectories
  );

  // Fetch root directories on mount.
  useEffect(() => {
    if (token && rootDirectories.length === 0) {
      getRootDirectories(token)
        .then(({ response, data }) => {
          if (response.ok && data.directories) {
            setRootDirectories([...data.directories]);
          }

          return { response, data };
        })
        .catch((error) => captureException(error));
    }
  }, [token, rootDirectories, setRootDirectories]);

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
            openedDirectories={openedDirectories}
            setOpenedDirectories={setOpenedDirectories}
          />
        ))}
      </div>
    </>
  );
};
