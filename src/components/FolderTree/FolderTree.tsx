import { useEffect, useMemo, useState } from "react";
import shallow from "zustand/shallow";
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
  className?: string;
};

export const FolderTree: React.FC<FolderTreeProps> = ({ rootDirectory }) => {
  const { token } = useStore((state) => ({ token: state.token }), shallow);

  const [foldersOpened, setFoldersOpened] = useState<string[]>([]);

  // Top-level directories are directories with no parent.
  // They are the first folders relative to the root directory.
  const [topLevelDirectory, setTopLevelDirectory] =
    useState<APIDirectory | null>(null);

  // Fetched directories are directories with a parent.
  const [fetchedDirectories, setFetchedDirectories] = useState<APIDirectory[]>(
    []
  );

  // Ordered directories means it's a directory tree from the top-level
  // directory. Each directory have its children mapped.
  const [orderedDirectories, setOrderedDirectories] = useState<
    OrderedDirectory[]
  >([]);

  // Keep a reference of fetched directories to avoid re-fetching them.
  const fetchedDirectoriesIds = useMemo(
    () => fetchedDirectories.map((dir) => dir.id),
    [fetchedDirectories]
  );

  const fetchDirectory = (parentDirectoryId: string, topLevel = false) => {
    // Don't fetch directory if it has already been fetched or if it's not a
    // top-level directory.
    if (!topLevel && fetchedDirectoriesIds.includes(parentDirectoryId)) {
      return;
    }

    if (token) {
      getDirectoryContent(token, parentDirectoryId)
        .then(({ response, data }) => {
          if (response.ok && data.directory) {
            if (topLevel) {
              setTopLevelDirectory(data.directory);
              setFetchedDirectories(() => [data.directory]);
            } else {
              setFetchedDirectories((value) => [...value, data.directory]);
            }
          }
        })
        .catch((error) => captureException(error));
    }
  };

  const toggleFolderState = (directoryId: string) => {
    if (!foldersOpened.includes(directoryId)) {
      setFoldersOpened([...foldersOpened, directoryId]);
      fetchDirectory(directoryId);
    } else {
      setFoldersOpened([...foldersOpened.filter((id) => id !== directoryId)]);
    }
  };

  const orderDirectory = (
    directory: { id: string; name: string },
    directories: APIDirectory[]
  ) => {
    const orderedDirectory: OrderedDirectory = {
      ...directory,
      songs: [],
      children: [],
    };

    const matched = directories.find((dir) => directory.id === dir.id);

    if (matched) {
      orderedDirectory.songs = [...matched.songs];
      orderedDirectory.children = [
        ...matched.children.map((childDir) =>
          orderDirectory(childDir, fetchedDirectories)
        ),
      ];
    }

    return orderedDirectory;
  };

  // On mount, fetch directory content of the root directory.
  useEffect(() => {
    if (token) {
      setTopLevelDirectory(null);
      setFoldersOpened([]);
      fetchDirectory(rootDirectory.id, true);
    }
  }, []);

  // When top-level directory or any directory is fetched, re-order directories.
  useEffect(() => {
    if (topLevelDirectory?.children.length && fetchedDirectories.length > 0) {
      setOrderedDirectories([]);

      topLevelDirectory.children.forEach((child) => {
        setOrderedDirectories((value) => [
          ...value,
          orderDirectory(child, fetchedDirectories),
        ]);
      });
    }
  }, [fetchedDirectories, topLevelDirectory]);

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
            foldersOpened={foldersOpened}
            toggleFolderState={toggleFolderState}
          />
        ))}
      </div>
    </>
  );
};
