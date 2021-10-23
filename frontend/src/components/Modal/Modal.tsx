import React from "react";

import { ModalState } from "../../state/slices/modalSlice";
import CreateThreadModal from "./modules/CreateThreadModal";
import DeleteThreadModal from "./modules/DeleteThreadModal";
import LogoutModal from "./modules/LogoutModal";

function Modal(props: ModalState) {
  switch (props.type) {
    case "LOGOUT":
      return <LogoutModal />;
    case "DELETE_THREAD":
      return <DeleteThreadModal thread={props.payload} />;
    case "CREATE_THREAD":
      return <CreateThreadModal />;

    default:
      return null;
  }
}

export default Modal;
