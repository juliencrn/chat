import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import Chat from "../components/Chat/Chat";
import PageLoader from "../components/PageLoader";
import useSocket from "../hooks/useSocket";
import { ProtectedRouteProps } from "../Router";
import { chatSelector, initThread } from "../state/chatSlice";
import { useGetOneThreadQuery } from "../state/threadsApi";
import NotFound from "./NotFound";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT ?? "";

function Thread(props: ProtectedRouteProps) {
  const { accessToken, user } = props;

  const dispatch = useDispatch();
  const chat = useSelector(chatSelector);
  const { slug: threadSlug } = useParams<{ slug: string }>();
  const {
    data: thread,
    isLoading,
    isError,
    isSuccess,
  } = useGetOneThreadQuery(threadSlug);

  const socket = useSocket(apiEndpoint, {
    query: { accessToken, userId: user.id },
  });

  const isThreadReady: boolean = !!thread && !!chat.threads[thread.id];

  useEffect(() => {
    if (isSuccess && !!thread && !isThreadReady) {
      dispatch(initThread(thread));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, thread, isThreadReady]);

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

  const threadState = chat.threads[thread.id];

  if (!threadState) {
    return <div>Thread initializing...</div>;
  }

  return <Chat socket={socket} threadState={threadState} user={user} />;
}

export default Thread;
