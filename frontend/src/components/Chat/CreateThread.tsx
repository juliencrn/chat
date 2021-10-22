import React, { HTMLProps, useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { useBoolean } from "usehooks-ts";
import * as yup from "yup";

import { useCreateThreadMutation } from "../../state/threadsApi";
import { ServerError } from "../../types";
import { PlusIcon } from "../Icons";
import Modal from "../Modal";
import TextInput from "../TextInput";

const validationSchema = yup.object().shape({
  name: yup.string().required(),
});

type CreateThreadProps = { onSuccess: () => void };
type CreateThreadDto = { name: string };

function CreateThread({ onSuccess }: CreateThreadProps) {
  const { value: open, ...modalOpen } = useBoolean(false);
  const [createThread, createThreadState] = useCreateThreadMutation();
  const { register, ...form } = useForm<CreateThreadDto>({
    resolver: yupResolver(validationSchema),
  });

  const { isLoading, isError, error, isSuccess } = createThreadState;

  useEffect(() => {
    if (isSuccess) {
      modalOpen.setFalse();
      form.reset();
      onSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const submit = form.handleSubmit(createThread);

  const errorMessage =
    isError && error && "status" in error
      ? (error?.data as ServerError)?.message
      : form.formState.errors.name;

  return (
    <>
      <ThreadButton onClick={modalOpen.setTrue} />

      {open && (
        <form noValidate onSubmit={submit}>
          <Modal
            title="Create a thread"
            confirmButtonProps={{
              children: "Create",
              type: "submit",
              disabled: isLoading,
            }}
            cancelButtonProps={{
              children: "Cancel",
              onClick: modalOpen.setFalse,
            }}
            onClose={modalOpen.setFalse}
          >
            <TextInput
              {...register("name")}
              label="Thread name"
              errors={errorMessage || form.formState.errors.name}
              inputProps={{ placeholder: "My super thread name" }}
            />
          </Modal>
        </form>
      )}
    </>
  );
}

export default CreateThread;

function ThreadButton(props: HTMLProps<HTMLButtonElement>) {
  return (
    <li className={`mb-1 mt-2`}>
      <button
        {...props}
        className={`flex items-center justify-start cursor-pointer`}
        type="button"
      >
        <span className={cn(`w-4 bg-gray-700 text-gray-300 rounded`)}>
          <PlusIcon />
        </span>
        <span className={cn("pl-2 link capitalize text-gray-500")}>
          Add thread
        </span>
      </button>
    </li>
  );
}
