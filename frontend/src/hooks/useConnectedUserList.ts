import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { useGetUsersQuery } from "../state/api/usersApi";
import { RootState } from "../state/store";
import { RichUserConnection, User } from "../types";

type HookReturn = [RichUserConnection[], { isLoading: boolean }];

function useConnectedUserList(currentUser?: User): HookReturn {
  const { data: allUsers, isLoading } = useGetUsersQuery(undefined);
  const { connections } = useSelector((state: RootState) => state.chat);
  const [users, setUsers] = useState<RichUserConnection[]>([]);

  useEffect(() => {
    if (!allUsers) {
      return;
    }

    // Merge Users & Connections
    const newUserList: RichUserConnection[] = allUsers.map(user => {
      const matchConn = connections.find(conn => conn.userId === user.id);
      return matchConn ? { ...user, ...matchConn } : user;
    });

    // Sort users
    const me: RichUserConnection[] = [];
    const connected: RichUserConnection[] = [];
    const offline: RichUserConnection[] = [];

    newUserList.forEach(user => {
      if (user.id === currentUser?.id) {
        me.push(user);
      } else {
        if (user.connectionId) {
          connected.push(user);
        } else {
          offline.push(user);
        }
      }
    });

    const sortedUserList = [...me, ...connected, ...offline];

    setUsers(sortedUserList);
  }, [allUsers, connections, currentUser]);

  return [users, { isLoading }];
}

export default useConnectedUserList;
