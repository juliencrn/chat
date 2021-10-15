import React from "react";

import cn from "classnames";

import useConnectedUserList from "../../hooks/useConnectedUserList";
import { useProfileQuery } from "../../state/usersApi";
import { RichUserConnection } from "../../types";

function UserList() {
  const { data: currentUser } = useProfileQuery(undefined);
  const [users, { isLoading }] = useConnectedUserList(currentUser);

  return (
    <ul>
      {isLoading && <li>...</li>}
      {users.map(user => (
        <UserLine key={user.id} user={user} me={currentUser} />
      ))}
    </ul>
  );
}

export default UserList;

interface UserLineProps {
  user: RichUserConnection;
  me?: RichUserConnection;
}

function UserLine({ user, me }: UserLineProps) {
  const online = !!user?.connectionId;
  const isMe = me && me.id === user.id;

  return (
    <li className={`flex items-center justify-start mb-1`}>
      <span className="w-4 flex justify-center">
        <span
          className={`w-2 h-2 block rounded-full  ${
            online ? "bg-green-300" : "bg-gray-600"
          }`}
        ></span>
      </span>
      <span
        className={cn(
          "pl-2 link capitalize",
          online ? "text-gray-300" : "text-gray-500",
        )}
      >
        <span className={cn(online && "font-bold")}>{user.username}</span>
        {isMe && <span className="text-gray-500 pl-2">you</span>}
      </span>
    </li>
  );
}
