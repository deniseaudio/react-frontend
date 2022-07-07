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
  setDisplayLogin: (displayLogin: boolean) => void;
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

export const LoginForm: React.FC<LoginFormProps> = ({ setDisplayLogin }) => {
  const form = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const submitHandler: SubmitHandler<LoginFormInputs> = (data, event) => {
    event?.preventDefault();
  };

  return (
    <RegisterFormLayout onSubmit={form.handleSubmit(submitHandler)}>
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

      <Button type="submit">Sign in</Button>

      <button
        type="button"
        className="mt-6 text-sm font-medium text-white underline"
        onClick={() => setDisplayLogin(false)}
      >
        Create an account
      </button>
    </RegisterFormLayout>
  );
};
