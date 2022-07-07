import { useState } from "react";

import { LoginForm } from "@/components/Register/LoginForm";
import { RegisterForm } from "@/components/Register/RegisterForm";

export const LoginView: React.FC = () => {
  const [displayLogin, setDisplayLogin] = useState(true);

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {displayLogin ? (
        <LoginForm setDisplayLogin={setDisplayLogin} />
      ) : (
        <RegisterForm setDisplayLogin={setDisplayLogin} />
      )}
    </div>
  );
};
