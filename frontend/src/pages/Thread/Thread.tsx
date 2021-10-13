import React from "react";

import { useParams } from "react-router";

import { PrivateRouteProps } from "../../App";
import Chat from "../../components/Chat/Chat";
import PageLoader from "../../components/PageLoader";
import useSocket from "../../hooks/useSocket";
import { useGetOneThreadQuery } from "../../state/threadsApi";
import NotFound from "../NotFound";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT ?? "";

function Thread(props: PrivateRouteProps) {
  const { accessToken, user } = props;
  const { name: threadName } = useParams<{ name: string }>();
  const { data: thread, isLoading, isError } = useGetOneThreadQuery(threadName);
  const socket = useSocket(apiEndpoint, {
    query: { accessToken, userId: user.id },
  });

  console.log({ props, thread });

  if (isError) {
    return <NotFound />;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (!thread) {
    console.error("Oups, no thread found");
    return null;
  }

  if (!socket) {
    return <div>Socket initializing or error</div>;
  }

  return <Chat socket={socket} thread={thread} user={user} />;
}

export default Thread;
