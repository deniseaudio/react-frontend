import { useEffect, useMemo, useState } from "react";
import { CollectionIcon } from "@heroicons/react/solid";
import { captureException } from "@sentry/react";

import type {
  APIDirectory,
  APIRootDirectory,
} from "@/interfaces/api.interfaces";
import type { OrderedDirectory } from "@/interfaces/directory.interfaces";
import { useStore } from "@/store/store";
import { getDirectoryContent } from "@/api";
import { TreeNode } from "./TreeNode";

export type FolderTreeProps = {
  rootDirectory: APIRootDirectory;
  openedDirectories: string[];
  setOpenedDirectories: (openedDirectories: string[]) => void;
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  rootDirectory,
  openedDirectories,
  setOpenedDirectories,
}) => {
  const token = useStore((state) => state.token);
  const directories = useStore((state) => state.directories);
  const setDirectories = useStore((state) => state.updateDirectories);

  // Top-level directories are directories with no parent.
  // They are the first folders relative to the root directory.
  const [topLevelDirectory, setTopLevelDirectory] =
    useState<APIDirectory | null>(null);

  const fetchDirectory = (parentDirectoryId: string, topLevel = false) => {
    // Don't fetch directory if it has already been fetched or if it's not a
    // top-level directory.
    if (!topLevel && directories.some((dir) => dir.id === parentDirectoryId)) {
      return;
    }

    if (token) {
      getDirectoryContent(token, parentDirectoryId)
        .then(({ response, data }) => {
          if (response.ok && data.directory) {
            // Top-level directories are not stored globally, as we don't need
            // to cache them.
            if (topLevel) {
              setTopLevelDirectory(data.directory);
            } else {
              setDirectories([...directories, data.directory]);
            }
          }

          return { response, data };
        })
        .catch((error) => captureException(error));
    }
  };

  const toggleFolderState = (directoryId: string) => {
    if (!openedDirectories.includes(directoryId)) {
      setOpenedDirectories([...openedDirectories, directoryId]);
      fetchDirectory(directoryId);
    } else {
      setOpenedDirectories([
        ...openedDirectories.filter((id) => id !== directoryId),
      ]);
    }
  };

  const orderDirectory = (
    directory: { id: string; name: string },
    dirs: APIDirectory[]
  ) => {
    const orderedDirectory: OrderedDirectory = {
      ...directory,
      songs: [],
      children: [],
    };

    const matched = dirs.find((dir) => directory.id === dir.id);

    if (matched) {
      orderedDirectory.songs = [...matched.songs];
      orderedDirectory.children = [
        ...matched.children.map((childDir) =>
          orderDirectory(childDir, directories)
        ),
      ];
    }

    return orderedDirectory;
  };

  const orderedDirectories = useMemo<OrderedDirectory[]>(() => {
    if (topLevelDirectory?.children.length) {
      return topLevelDirectory.children.map((childDir) =>
        orderDirectory(childDir, directories)
      );
    }

    return [];
  }, [topLevelDirectory, directories]);

  // On mount, always fetch the top-level directory even if it's cached.
  useEffect(() => {
    if (token) {
      fetchDirectory(rootDirectory.id, true);
    }
  }, []);

  return (
    <>
      <div className="flex items-center text-neutral-200">
        <CollectionIcon className="mr-2 h-auto w-4" />
        <p className="font-semibold">{rootDirectory.name} (root)</p>
      </div>

      <div className="pl-6">
        {orderedDirectories.map((directory) => (
          <TreeNode
            key={`node-${directory.id}`}
            directory={directory}
            foldersOpened={openedDirectories}
            toggleFolderState={toggleFolderState}
          />
        ))}
      </div>
    </>
  );
};
