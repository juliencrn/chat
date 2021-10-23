import React from "react";

import { useDispatch } from "react-redux";

import { logout } from "../../../state/slices/authSlice";
import { closeModal } from "../../../state/slices/modalSlice";
import Button from "../../Button";
import BaseModal from "../BaseModal";

function LogoutModal() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <BaseModal
      title="Logout"
      content={<p>Are you sure you want to logout?</p>}
      footer={
        <>
          <Button onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </>
      }
    />
  );
}

export default LogoutModal;
