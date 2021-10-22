import React, { ChangeEventHandler, forwardRef, HTMLProps } from "react";

import cn from "classnames";

export interface TextInputProps {
  name: string;
  onChange: ChangeEventHandler;
  onBlur: ChangeEventHandler;
  label?: string;
  inputProps: HTMLProps<HTMLInputElement>;
  errors?: any;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(props, ref) {
    const { name, label, inputProps, errors, onBlur, onChange } = props;
    return (
      <div className="mb-4">
        {label && (
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor={name}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          type="text"
          {...inputProps}
          {...{ onBlur, onChange, id: name, name }}
          className={cn(
            "rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline shadow appearance-none border",
            { ["border-red-500"]: errors },
          )}
        />
        {errors && <p className="text-red-500 text-xs italic">{errors}</p>}
      </div>
    );
  },
);

export default TextInput;
