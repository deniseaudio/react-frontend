import { useStore } from "@/store/store";
import { SongItem } from "@/components/Song/SongItem";

export const HistoryView: React.FC = () => {
  const history = useStore((state) => state.history);

  const onLikeUpdate = () => {};

  return (
    <>
      <h3 className="mb-6 font-metropolis text-3xl text-neutral-50">
        Listening history
      </h3>

      <div className="rounded-xl border border-neutral-800 bg-neutral-800 px-8 py-8 shadow-2xl">
        <p className="mb-4 font-metropolis text-lg font-medium leading-tight text-neutral-400">
          Session history
        </p>

        {history.length === 0 ? (
          <p className="text-center font-metropolis text-lg font-medium leading-tight text-neutral-50">
            No listening history, go listen to some songs!
          </p>
        ) : null}

        {history.length > 0 ? (
          <div className="flex flex-col">
            {history.map((song, index) => (
              <SongItem
                key={song.id}
                song={song}
                index={index}
                onLikeUpdate={onLikeUpdate}
              />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};
