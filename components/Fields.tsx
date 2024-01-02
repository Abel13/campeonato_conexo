"use client";
import { ClassAttributes, LegacyRef, forwardRef, useState } from "react";

const formClasses =
  "flex appearance-none block w-full rounded-lg border border-gray-200 bg-white py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-gray-900 placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm";

function Label({
  id,
  children,
}: {
  id: string;
  children: string | JSX.Element;
}) {
  return (
    <label
      htmlFor={id}
      className="mb-1 block text-sm font-semibold text-gray-900"
    >
      {children}
    </label>
  );
}

function Error({
  id,
  children,
}: {
  id: string;
  children: string | JSX.Element;
}) {
  return (
    <label htmlFor={id} className="mt-1 block text-xs font-normal text-danger">
      {children}
    </label>
  );
}

function TextField(
  {
    id,
    label,
    type = "text",
    className = "",
    error,
    onChange,
    placeholder,
    maxLength,
    value,
    ...props
  }: {
    id: string;
    label?: string;
    type: "text" | "email" | "password" | "url" | "file" | "number";
    className?: string;
    accept?: string;
    placeholder: string;
    error?: string;
    maxLength?: number;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  },
  ref: LegacyRef<HTMLInputElement> | undefined
) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <div className={formClasses}>
        <input
          id={id}
          placeholder={placeholder}
          type={showPassword ? "text" : type}
          onChange={onChange}
          maxLength={maxLength}
          className="flex appearance-none w-full rounded-lg border border-transparent bg-white py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-transparent sm:text-sm"
          value={value}
          {...props}
          ref={ref}
        />
      </div>
      {error && <Error id={id}>{error}</Error>}
    </div>
  );
}

export default forwardRef(TextField);
