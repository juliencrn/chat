import React, { ButtonHTMLAttributes, forwardRef } from "react";

import cn from "classnames";

import { ThemeVariant } from "../types";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ThemeVariant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref,
) {
  const { variant } = props;

  const classes = cn(
    props?.className,
    "rounded border border-gray-300",
    "my-3 px-4 py-2",
    "w-full inline-flex justify-center",
    "shadow",
    variant === "primary" && "text-white bg-green-600 border-transparent",
    variant === "secondary" && "bg-white text-gray-700",
    variant === "danger" && "text-white bg-red-600 border-transparent",
    "text-base font-medium",
    "sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
    "focus:outline-none",
  );
  return <button {...props} ref={ref} className={classes} />;
});

export default Button;
