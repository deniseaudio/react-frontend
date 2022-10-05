import { useMemo } from "react";
import { FolderIcon, FolderOpenIcon } from "@heroicons/react/solid";

import { OrderedDirectory } from "@/interfaces/directory.interfaces";
import { SongNode } from "./SongNode";

export type TreeNodeProps = {
  directory: OrderedDirectory;
  foldersOpened: number[];
  toggleFolderState: (directoryId: number) => void;
};

export const TreeNode: React.FC<TreeNodeProps> = ({
  directory,
  foldersOpened,
  toggleFolderState,
}) => {
  const isFolderOpened = useMemo(
    () => foldersOpened.includes(directory.id),
    [foldersOpened, directory.id]
  );

  return (
    <div className="text-neutral-50">
      <button
        type="button"
        className="flex items-center"
        onClick={() => toggleFolderState(directory.id)}
      >
        {isFolderOpened ? (
          <FolderOpenIcon className="mr-2 h-auto w-4" />
        ) : (
          <FolderIcon className="mr-2 h-auto w-4" />
        )}
        <p>{directory.name}</p>
      </button>

      {directory.songs?.length || directory.children?.length ? (
        <div className="pl-6">
          {directory.songs?.length && isFolderOpened
            ? directory.songs.map((song) => (
                <SongNode
                  key={`song-${song.id}`}
                  song={song}
                  directorySongs={directory.songs}
                />
              ))
            : null}

          {directory.children?.length > 0 && isFolderOpened
            ? directory.children.map((child) => (
                <TreeNode
                  key={`node-${child.id}`}
                  directory={child}
                  foldersOpened={foldersOpened}
                  toggleFolderState={toggleFolderState}
                />
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
};
