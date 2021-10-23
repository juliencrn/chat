import React, { useRef } from "react";

import { useDispatch } from "react-redux";
import { useOnClickOutside } from "usehooks-ts";

import { closeModal } from "../../state/slices/modalSlice";
import { CloseIcon } from "../Icons";

interface BaseModalProps {
  title: string;
  content: React.ReactNode;
  footer: React.ReactNode;
}

function BaseModal({ title, content, footer }: BaseModalProps) {
  const dispatch = useDispatch();
  const modalContentRef = useRef(null);

  const handleClose = () => dispatch(closeModal());

  useOnClickOutside(modalContentRef, handleClose);

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
          className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <button
            onClick={handleClose}
            className="absolute top-0 right-0 h-8 w-8 flex items-center justify-center m-2"
          >
            <CloseIcon />
          </button>

          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2 w-full text-sm text-gray-500">
                  {content}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row sm:justify-end">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaseModal;
