import cx from "classnames";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  type,
  children,
  className,
  ...buttonProps
}) => {
  return (
    <button
      type={type === "button" ? "button" : "submit"}
      className={cx(
        "block w-full rounded-xl px-6 py-3 text-sm font-semibold uppercase tracking-wider ring-opacity-40 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70",
        variant === "primary"
          ? "bg-green-600 text-white ring-green-600 hover:bg-green-500"
          : null,
        variant === "secondary"
          ? " bg-neutral-700 text-neutral-200 ring-neutral-700 hover:bg-neutral-600"
          : null,
        className
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
