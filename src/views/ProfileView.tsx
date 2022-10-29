import { useState } from "react";
import Switch from "react-switch";
import Select from "react-select";

import { postUserSettings } from "@/api";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/Button";

const bitrateOptions = [
  { value: 128, label: "128kbps" },
  { value: 160, label: "160kbps" },
  { value: 192, label: "192kbps" },
  { value: 256, label: "256kbps" },
  { value: 320, label: "320kbps" },
];

export const ProfileView: React.FC = () => {
  const user = useStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [hasLowBandwidth, setHasLowBandwidth] = useState(
    user?.lowBandwidthEnabled || false
  );
  const [bandwidthBitrate, setBandwidthBitrate] = useState(
    bitrateOptions.find((opt) => opt.value === user?.lowBandwidthBitrate) ||
      bitrateOptions[0]
  );

  const handleSaveSettings = () => {
    setIsLoading(true);

    return postUserSettings({
      lowBandwidthEnabled: hasLowBandwidth,
      lowBandwidthBitrate: bandwidthBitrate.value,
    })
      .then(() => {
        if (user) {
          user.lowBandwidthBitrate = bandwidthBitrate.value;
          user.lowBandwidthEnabled = hasLowBandwidth;
        }

        return null;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <h3 className="mb-6 font-metropolis text-3xl text-neutral-50">
        Settings
      </h3>

      <div className="rounded-xl border border-neutral-800 bg-neutral-800 px-8 py-8 shadow-2xl">
        <div className="mb-16 flex justify-between">
          <div className="w-1/2">
            <p className="mb-4 font-metropolis text-lg font-medium leading-tight text-neutral-400">
              Enable low bandwidth mode
            </p>

            <Switch
              onChange={() => setHasLowBandwidth(!hasLowBandwidth)}
              checked={hasLowBandwidth}
            />
          </div>

          <div className="w-1/2">
            <p className="mb-4 font-metropolis text-lg font-medium leading-tight text-neutral-400">
              Low bandwidth mode bitrate
            </p>

            <Select
              options={bitrateOptions}
              defaultValue={bandwidthBitrate}
              onChange={(option) =>
                option ? setBandwidthBitrate(option) : null
              }
              styles={{
                container: (provided) => ({
                  ...provided,
                  maxWidth: "16rem",
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "6rem",
                }),
                option: (provided, state) => ({
                  ...provided,
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.875rem",
                  // eslint-disable-next-line no-nested-ternary
                  backgroundColor: state.isSelected
                    ? "#17a34a"
                    : state.isFocused
                    ? "rgba(0, 0, 0, 0.125)"
                    : "transparent",
                }),
              }}
            />
          </div>
        </div>

        <Button
          className="w-auto"
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          Save settings
        </Button>
      </div>
    </>
  );
};
