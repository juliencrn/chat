import React, { forwardRef, HTMLProps } from 'react'

export interface TextInputProps {
    name: string
    label: string
    inputProps: HTMLProps<HTMLInputElement>
    errors?: any
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    function TextInput(props, ref) {
        const { name, label, inputProps, errors} = props
        return (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                {label}
              </label>
              <input
                ref={ref}
                type="text" 
                {...inputProps}
                id={name}
                name={name}
                className={`shadow appearance-none border ${errors ? "border-red-500" : ""} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`} 
              />
              {errors && (
                <p className="text-red-500 text-xs italic">
                  {errors}
                </p>
              )}
            </div>
        )
    }
)