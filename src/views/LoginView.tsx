import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { captureException } from "@sentry/react";

import { postLogin, postRegister } from "@/api";
import { useStore } from "@/store/store";
import { LoginForm } from "@/components/Register/LoginForm";
import { RegisterForm } from "@/components/Register/RegisterForm";

export const LoginView: React.FC = () => {
  const login = useStore((state) => state.login);

  const navigate = useNavigate();

  const [displayLogin, setDisplayLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const { data, response } = await postLogin(email, password);

      setIsLoading(false);

      if (response.ok && data) {
        login(data.token, data.user);
        navigate("/audio-player");
      } else {
        setLoginError("Invalid email or password.");
      }
    } catch (error) {
      setIsLoading(false);
      setLoginError("Something went wrong, please try again later.");
      captureException(error);
    }
  };

  const handleCreate = async (
    username: string,
    email: string,
    password: string,
    secretKey: string
  ) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const { data, response } = await postRegister(
        username,
        email,
        password,
        secretKey
      );

      setIsLoading(false);

      if (response.ok && data) {
        login(data.token, data.user);
        navigate("/audio-player");
      } else if (response.status === 401) {
        setLoginError("The provided secret-key is invalid.");
      } else if (response.status === 409) {
        setLoginError("Email or username already in use.");
      } else {
        setLoginError("Something went wrong, please try again later.");
      }
    } catch (error) {
      setIsLoading(false);
      setLoginError("Something went wrong, please try again later.");
      captureException(error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {displayLogin ? (
        <LoginForm
          isLoading={isLoading}
          loginError={loginError}
          setDisplayLogin={setDisplayLogin}
          setLoginError={setLoginError}
          handleLogin={handleLogin}
        />
      ) : (
        <RegisterForm
          isLoading={isLoading}
          loginError={loginError}
          setDisplayLogin={setDisplayLogin}
          setLoginError={setLoginError}
          handleCreate={handleCreate}
        />
      )}
    </div>
  );
};
