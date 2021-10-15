import React from "react";

import { useDispatch } from "react-redux";
import { useBoolean } from "usehooks-ts";

import useAuth from "../../hooks/useAuth";
import { logout } from "../../state/authSlice";
import { Thread, User } from "../../types";
import Avatar from "../Avatar";
import { HashtagIcon } from "../Icons";
import Modal from "../Modal";

interface ChatHeaderProps {
  user: User;
  thread: Thread;
}

function ChatHeader({ user, thread }: ChatHeaderProps) {
  const { value: open, setTrue, setFalse } = useBoolean(false);
  const dispatch = useDispatch();
  const auth = useAuth();

  const handleLogout = () => dispatch(logout());

  return (
    <header className="flex justify-between items-center shadow-md bg-gray-100 py-2 px-6">
      <div className="flex items-center justify-start font-black">
        <HashtagIcon />
        <h1 className="font-bold text-md pl-0.5">{thread.name}</h1>
      </div>

      <button onClick={setTrue} className="cursor-pointer">
        <Avatar username={user.username} size="sm" />
      </button>
      {open && (
        <Modal
          title="Profile"
          mode="danger"
          confirmButtonProps={{
            children: "Logout",
            onClick: handleLogout,
          }}
          onClose={setFalse}
        >
          {`Hello ${auth ? auth.user.username : "Anon"} 👋`}
        </Modal>
      )}
    </header>
  );
}

export default ChatHeader;
