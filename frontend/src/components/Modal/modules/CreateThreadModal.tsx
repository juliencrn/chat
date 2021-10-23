import React, { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import * as yup from "yup";

import { useCreateThreadMutation } from "../../../state/api/threadsApi";
import { closeModal } from "../../../state/slices/modalSlice";
import { ServerError } from "../../../types";
import Button from "../../Button";
import TextInput from "../../TextInput";
import BaseModal from "../BaseModal";

type CreateThreadDto = { name: string };

const validationSchema = yup.object().shape({
  name: yup.string().required(),
});

function CreateThreadModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [createThread, createThreadState] = useCreateThreadMutation();
  const { register, ...form } = useForm<CreateThreadDto>({
    resolver: yupResolver(validationSchema),
  });

  const { isLoading, isError, error, isSuccess, data } = createThreadState;

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleSubmit = form.handleSubmit(createThread);

  useEffect(() => {
    if (isSuccess && data?.slug) {
      form.reset();
      handleClose();
      history.push(`/thread/${data.slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data]);

  const errorMessage =
    isError && error && "status" in error
      ? (error?.data as ServerError)?.message
      : form.formState.errors.name;

  return (
    <BaseModal
      title="Create a thread"
      content={
        <form noValidate>
          <TextInput
            {...register("name")}
            label="Thread name"
            errors={errorMessage}
            inputProps={{ placeholder: "My super thread name" }}
          />
        </form>
      }
      footer={
        <>
          <Button onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} variant="primary">
            Create
          </Button>
        </>
      }
    />
  );
}

export default CreateThreadModal;
