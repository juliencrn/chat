import React from "react";

import useConnectedUserList from "../../hooks/useConnectedUserList";
import { useProfileQuery } from "../../state/usersApi";
import { RichUserConnection } from "../../types";

function UserList() {
  const { data: currentUser } = useProfileQuery(undefined);
  const [users, { isLoading }] = useConnectedUserList(currentUser);

  return (
    <div>
      <h3>Users</h3>
      <ul>
        {isLoading && <li>...</li>}
        {users.map(user => (
          <UserLine key={user.id} user={user} me={currentUser} />
        ))}
      </ul>
    </div>
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
    <li key={user.id} className={`flex items-center justify-start mb-1 ${""}`}>
      <span
        className={`w-2 h-2 block rounded-full  ${
          online ? "bg-green-300" : "bg-gray-600"
        }`}
      ></span>
      <span
        className={` pl-2 capitalize ${
          online ? "text-white font-bold" : "text-gray-500"
        }`}
      >
        {user.username} {isMe ? "(Me)" : ""}
      </span>
    </li>
  );
}
