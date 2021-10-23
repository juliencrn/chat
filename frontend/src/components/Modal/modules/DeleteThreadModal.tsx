import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { useDeleteThreadMutation } from "../../../state/api/threadsApi";
import {
  closeModal,
  DeleteThreadModalState,
} from "../../../state/slices/modalSlice";
import { ServerError } from "../../../types";
import Button from "../../Button";
import BaseModal from "../BaseModal";

interface DeleteThreadModalProps {
  thread: DeleteThreadModalState["payload"];
}

function DeleteThreadModal({ thread }: DeleteThreadModalProps) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [deleteThread, deleteThreadState] = useDeleteThreadMutation();

  const { isSuccess, isError, error } = deleteThreadState;

  const handleDelete = () => {
    deleteThread(thread.id);
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      history.push(`/`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const errorMessage =
    isError && error && "status" in error
      ? (error?.data as ServerError)?.message
      : null;

  return (
    <BaseModal
      title="Delete"
      content={
        <>
          <p>Are you sure you want to delete this thread?</p>
          {errorMessage && (
            <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>
          )}
        </>
      }
      footer={
        <>
          <Button onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="danger">
            Delete
          </Button>
        </>
      }
    />
  );
}

export default DeleteThreadModal;
