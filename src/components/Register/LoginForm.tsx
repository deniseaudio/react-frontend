import { type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { RegisterFormLayout } from "@/components/Register/RegisterFormLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export type LoginFormInputs = {
  email: string;
  password: string;
};

export type LoginFormProps = {
  isLoading: boolean;
  loginError: string;
  setDisplayLogin: (displayLogin: boolean) => void;
  setLoginError: (loginError: string) => void;
  handleLogin: (email: string, password: string) => void;
};

const schema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email address.")
      .required("This field is required."),
    password: yup.string().required("This field is required"),
  })
  .required();

export const LoginForm: React.FC<LoginFormProps> = ({
  isLoading,
  loginError,
  setDisplayLogin,
  setLoginError,
  handleLogin,
}) => {
  const form = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const submitHandler: SubmitHandler<LoginFormInputs> = (data, event) => {
    event?.preventDefault();
    handleLogin(data.email, data.password);
  };

  return (
    <RegisterFormLayout onSubmit={form.handleSubmit(submitHandler)}>
      <Input
        id="email"
        name="email"
        label="Email address"
        placeholder="Email address"
        autoComplete="email"
        defaultValue=""
        register={form.register}
        fieldError={form.formState.errors.email}
      />

      <Input
        id="password"
        name="password"
        label="Password"
        placeholder="Password"
        type="password"
        autoComplete="current-password"
        defaultValue=""
        register={form.register}
        fieldError={form.formState.errors.password}
      />

      <p className="text-center text-sm font-medium text-red-500">
        {loginError}
      </p>

      <Button type="submit" disabled={isLoading}>
        Sign in
      </Button>

      <button
        type="button"
        className="mt-6 text-sm font-medium text-white underline"
        onClick={() => {
          setDisplayLogin(false);
          setLoginError("");
        }}
      >
        Create an account
      </button>
    </RegisterFormLayout>
  );
};
