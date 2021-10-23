import React from "react";

import { useDispatch } from "react-redux";

import useAuth from "../../hooks/useAuth";
import {
  showDeleteThreadModal,
  showLogoutModal,
} from "../../state/slices/modalSlice";
import { Thread, User } from "../../types";
import Avatar from "../Avatar";
import { HashtagIcon, TrashIcon } from "../Icons";

interface ChatHeaderProps {
  user: User;
  thread: Thread;
}

function ChatHeader({ user, thread }: ChatHeaderProps) {
  const dispatch = useDispatch();
  const auth = useAuth();

  const isOwner = !!auth && auth.user.id === thread.owner.id;

  const openLogoutModal = () => {
    dispatch(showLogoutModal());
  };

  const openDeleteThreadModal = () => {
    dispatch(showDeleteThreadModal(thread));
  };

  return (
    <header className="flex justify-between items-center shadow-md bg-gray-100 py-2 px-6">
      <div className="flex items-center justify-start font-black">
        <HashtagIcon />
        <h1 className="font-bold text-md pl-0.5">{thread.name}</h1>
      </div>

      <div className="flex items-center justify-end font-black">
        {isOwner && (
          <button
            onClick={openDeleteThreadModal}
            className="cursor-pointer mr-3"
          >
            <TrashIcon />
          </button>
        )}

        <button onClick={openLogoutModal} className="cursor-pointer">
          <Avatar username={user.username} size="sm" />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
