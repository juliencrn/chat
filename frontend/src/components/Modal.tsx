import React, { HTMLProps, useRef } from "react";

import cn from "classnames";
import { useOnClickOutside } from "usehooks-ts";

import { DangerIcon } from "./Icons";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  mode: "danger" | "info";
  cancelButtonProps?: HTMLProps<HTMLButtonElement>;
  confirmButtonProps?: HTMLProps<HTMLButtonElement>;
  icon?: React.ReactNode;
  onClose: () => void;
}

function Modal({
  title,
  children,
  mode,
  icon,
  confirmButtonProps,
  cancelButtonProps,
  onClose,
}: ModalProps) {
  const modalContentRef = useRef(null);
  const isDanger = mode === "danger";
  const colors = {
    danger: { fadeBg: "bg-red-100", bg: "bg-red-600", font: "text-red-600" },
    info: {
      fadeBg: "bg-green-100",
      bg: "bg-green-600",
      font: "text-green-600",
    },
  };

  useOnClickOutside(modalContentRef, onClose);

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/*
          Background overlay, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100"
            To: "opacity-0"
        */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/*
          Modal panel, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        */}
        <div
          ref={modalContentRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div
                className={cn(
                  isDanger ? colors.danger.font : colors.info.font,
                  isDanger ? colors.danger.fadeBg : colors.info.fadeBg,
                  "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10",
                )}
              >
                {icon || <DangerIcon />}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  {typeof children === "string" ? (
                    <p className="text-sm text-gray-500">{children}</p>
                  ) : (
                    children
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {confirmButtonProps && (
              <button
                {...confirmButtonProps}
                type="button"
                className={cn(
                  isDanger ? colors.danger.bg : colors.info.bg,
                  "w-full inline-flex justify-center rounded border border-transparent shadow px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm",
                  confirmButtonProps.className,
                )}
              />
            )}
            {cancelButtonProps && (
              <button
                {...cancelButtonProps}
                type="button"
                className={cn(
                  "mt-3 w-full inline-flex justify-center rounded border border-gray-300 shadow px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
                  cancelButtonProps.className,
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
