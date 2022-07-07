export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({ type, children }) => {
  return (
    <button
      type={type === "button" ? "button" : "submit"}
      className="block w-full rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white ring-green-600 ring-opacity-40 transition-colors duration-200 ease-in-out hover:bg-green-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {children}
    </button>
  );
};
