import { LogoDeniseAudio } from "@/components/ui/LogoDeniseAudio";

export type RegisterFormLayoutProps = React.FormHTMLAttributes<HTMLFormElement>;

export const RegisterFormLayout: React.FC<RegisterFormLayoutProps> = ({
  children,
  ...formProps
}) => (
  <form
    className="flex w-full max-w-lg flex-col items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800 py-8 px-6 shadow-2xl"
    {...formProps}
  >
    <LogoDeniseAudio className="mb-8" />

    <div className="flex w-full flex-col space-y-6 px-16">{children}</div>
  </form>
);
