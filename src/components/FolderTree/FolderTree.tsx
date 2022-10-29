import { useEffect, useMemo, useState } from "react";
import { CollectionIcon } from "@heroicons/react/solid";
import { FolderOpenIcon } from "@heroicons/react/outline";
import { captureException } from "@sentry/react";

import type {
  APIChildrenDirectory,
  APIDirectory,
  APIRootDirectory,
} from "@/interfaces/api.interfaces";
import type { OrderedDirectory } from "@/interfaces/directory.interfaces";
import { useStore } from "@/store/store";
import { getDirectoryContent } from "@/api";
import { TreeNode } from "./TreeNode";

export type FolderTreeProps = {
  rootDirectory: APIRootDirectory;
  openedDirectories: number[];
  setOpenedDirectories: (openedDirectories: number[]) => void;
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  rootDirectory,
  openedDirectories,
  setOpenedDirectories,
}) => {
  const directories = useStore((state) => state.directories);
  const setDirectories = useStore((state) => state.updateDirectories);

  // Top-level directories are directories with no parent.
  // They are the first folders relative to the root-directory, provided by
  // the root-directories already fetched earlier.
  const [topLevelDirectory, setTopLevelDirectory] =
    useState<APIDirectory | null>(null);

  const handleCollaspeAll = () => {
    setOpenedDirectories([]);
  };

  const fetchDirectory = (parentDirectoryId: number, topLevel = false) => {
    // Don't fetch directory if it has already been fetched or if it's not a
    // top-level directory.
    if (!topLevel && directories.some((dir) => dir.id === parentDirectoryId)) {
      return;
    }

    getDirectoryContent(parentDirectoryId.toString())
      .then(({ response, data }) => {
        if (response.ok && data) {
          if (topLevel) {
            setTopLevelDirectory(data);
          } else {
            setDirectories([...directories, data]);
          }
        }

        return { response, data };
      })
      .catch((error) => captureException(error));
  };

  const toggleFolderState = (directoryId: number) => {
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
    directory: APIChildrenDirectory,
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
    fetchDirectory(rootDirectory.id, true);
  }, []);

  return (
    <>
      <div className="relative flex items-center text-neutral-200">
        <CollectionIcon className="mr-2 h-auto w-4" />

        <p className="font-semibold">{rootDirectory.name} (root)</p>

        <button
          type="button"
          className="absolute top-0 right-0 inline-flex items-center"
          onClick={handleCollaspeAll}
        >
          <FolderOpenIcon className="h-4 w-4" />
        </button>
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
