import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { captureException } from "@sentry/react";

import { postLogin } from "@/api";
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

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {displayLogin ? (
        <LoginForm
          isLoading={isLoading}
          loginError={loginError}
          setDisplayLogin={setDisplayLogin}
          handleLogin={handleLogin}
        />
      ) : (
        <RegisterForm setDisplayLogin={setDisplayLogin} />
      )}
    </div>
  );
};
