import React from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  deleteToast,
  Toast,
  toasterSelector,
} from "../state/slices/toasterSlice";
import { CloseIcon } from "./Icons";

function Toaster() {
  const { toasts } = useSelector(toasterSelector);
  return (
    <div className="absolute top-14 w-100 right-0 left-14 sm:left-auto sm:right-4 sm:w-72 overflow-hidden z-50">
      <ul className="overflow-scroll no-scrollbar">
        {toasts.map(toast => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </ul>
    </div>
  );
}

export default Toaster;

function ToastItem({ id, message }: Toast) {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(deleteToast(id));
  };

  return (
    <li className="shadow bg-gray-800 text-gray-300 rounded m-2 w-100">
      <div className="px-4 py-3 flex justify-between w-100">
        <p className="text-sm">{message}</p>
        <button className="cursor-pointer" onClick={handleClose}>
          <CloseIcon />
        </button>
      </div>
    </li>
  );
}
