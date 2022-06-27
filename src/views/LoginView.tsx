import { useState } from "react";
import { useNavigate } from "react-router-dom";
import shallow from "zustand/shallow";
import { captureException } from "@sentry/react";

import { postLogin } from "@/api";
import { useStore } from "@/store/store";

export const LoginView: React.FC = () => {
  const { login } = useStore((state) => ({ login: state.login }), shallow);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };

    postLogin(target.email.value, target.password.value)
      .then(({ response, data }) => {
        if (response.ok && data.user && data.token) {
          setIsLoading(false);
          login(data.token, data.user);
          navigate("/audio-player");
        } else {
          setError("Invalid email or password");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        captureException(err);
      });
  };

  return (
    <div className="max-w-[768px] w-full mx-auto px-8 py-12">
      <h1 className="mb-6 text-3xl text-slate-50 text-center font-medium">
        Synology Audio Server
      </h1>

      <p className="mb-8 text-center text-slate-200">
        Login with your user account.
        <br />
        If you don&apos;t have one, contact the server administrator.
      </p>

      <form
        className="flex flex-col max-w-[350px] mx-auto px-8 py-8 rounded-md bg-gray-600"
        onSubmit={onSubmit}
      >
        <label htmlFor="email" className="flex flex-col mb-4">
          <span className="text-slate-50 text-sm font-medium">Email</span>

          <input
            id="email"
            type="email"
            className="block w-full px-4 py-2 mt-1 rounded-sm font-medium text-sm text-slate-900"
            required
          />
        </label>

        <label htmlFor="password" className="flex flex-col mb-4">
          <span className="text-slate-50 text-sm font-medium">Password</span>

          <input
            id="password"
            type="password"
            className="block w-full px-4 py-2 mt-1 rounded-sm font-medium text-sm text-slate-900"
            required
          />
        </label>

        {error ? (
          <p className="mb-4 text-sm text-center text-red-300 font-medium">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="block w-full py-2 rounded-sm text-base text-slate-50 font-medium bg-indigo-500"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};
