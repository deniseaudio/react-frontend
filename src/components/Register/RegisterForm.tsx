import { type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { RegisterFormLayout } from "@/components/Register/RegisterFormLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
  secretKey: string;
};

export type RegisterFormProps = {
  isLoading: boolean;
  loginError: string;
  setDisplayLogin: (displayLogin: boolean) => void;
  handleCreate: (
    username: string,
    email: string,
    password: string,
    secretKey: string
  ) => void;
};

const schema = yup.object({
  username: yup
    .string()
    .min(3, "Your username should have at least 3 characters.")
    .required("This field is required."),
  email: yup
    .string()
    .email("Invalid email address.")
    .required("This field is required."),
  password: yup.string().required("This field is required."),
  secretKey: yup.string().required("This field is required."),
});

export const RegisterForm: React.FC<RegisterFormProps> = ({
  isLoading,
  loginError,
  setDisplayLogin,
  handleCreate,
}) => {
  const form = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
  });

  const submitHandler: SubmitHandler<RegisterFormInputs> = (data, event) => {
    event?.preventDefault();
    handleCreate(data.username, data.email, data.password, data.secretKey);
  };

  return (
    <RegisterFormLayout onSubmit={form.handleSubmit(submitHandler)}>
      <Input
        name="username"
        label="Username"
        placeholder="Username"
        autoComplete="name"
        defaultValue=""
        register={form.register}
        fieldError={form.formState.errors.username}
      />

      <Input
        name="email"
        label="Email address"
        placeholder="Email address"
        autoComplete="email"
        defaultValue=""
        register={form.register}
        fieldError={form.formState.errors.email}
      />

      <Input
        name="password"
        label="Password"
        placeholder="Password"
        type="password"
        autoComplete="current-password"
        defaultValue=""
        register={form.register}
        fieldError={form.formState.errors.password}
      />

      <Input
        name="secretKey"
        label="Secret Key"
        placeholder="Secrey Key"
        type="password"
        defaultValue=""
        register={form.register}
        fieldError={form.formState.errors.secretKey}
      />

      <p className="text-center text-sm font-medium text-red-500">
        {loginError}
      </p>

      <Button type="submit" disabled={isLoading}>
        Register
      </Button>

      <button
        type="button"
        className="mt-6 text-sm font-medium text-white underline"
        onClick={() => setDisplayLogin(true)}
      >
        Login to your account
      </button>
    </RegisterFormLayout>
  );
};
