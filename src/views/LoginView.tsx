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
      .catch((error_) => {
        setIsLoading(false);
        captureException(error_);
      });
  };

  return (
    <div className="mx-auto w-full max-w-[768px] px-8 py-12">
      <h1 className="mb-6 text-center text-3xl font-medium text-slate-50">
        Synology Audio Server
      </h1>

      <p className="mb-8 text-center text-slate-200">
        Login with your user account.
        <br />
        If you don&apos;t have one, contact the server administrator.
      </p>

      <form
        className="mx-auto flex max-w-[350px] flex-col rounded-md bg-gray-600 px-8 py-8"
        onSubmit={onSubmit}
      >
        <label htmlFor="email" className="mb-4 flex flex-col">
          <span className="text-sm font-medium text-slate-50">Email</span>

          <input
            id="email"
            type="email"
            className="mt-1 block w-full rounded-sm px-4 py-2 text-sm font-medium text-slate-900"
            required
          />
        </label>

        <label htmlFor="password" className="mb-4 flex flex-col">
          <span className="text-sm font-medium text-slate-50">Password</span>

          <input
            id="password"
            type="password"
            className="mt-1 block w-full rounded-sm px-4 py-2 text-sm font-medium text-slate-900"
            required
          />
        </label>

        {error ? (
          <p className="mb-4 text-center text-sm font-medium text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="block w-full rounded-sm bg-indigo-500 py-2 text-base font-medium text-slate-50"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};
