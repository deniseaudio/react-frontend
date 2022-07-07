import React from "react";
import type {
  UseFormRegister,
  RegisterOptions,
  FieldError,
} from "react-hook-form";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  register?: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  fieldError?: FieldError;
};

export const Input: React.FC<InputProps> = ({
  name,
  label,
  register,
  registerOptions,
  fieldError,
  ...inputProps
}) => (
  <label htmlFor={name} className="flex w-full flex-col">
    <p className="mb-1 block text-sm font-medium text-neutral-50">{label}</p>

    <input
      className="h-10 rounded-lg bg-neutral-700 px-4 text-base font-medium text-neutral-50 ring-green-500 ring-opacity-50 placeholder:text-neutral-400 focus:outline-none focus:ring-2"
      {...inputProps}
      {...(register ? register(name, registerOptions) : null)}
    />

    {fieldError ? (
      <p className="mt-1 text-xs font-medium leading-tight text-red-500">
        {fieldError?.message}
      </p>
    ) : null}
  </label>
);

// When using `forwardRef`, name is incorrect. We need to override it.
Input.displayName = "Input";
