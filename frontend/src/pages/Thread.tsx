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

  const currentThread = !!thread && thread.slug === threadSlug ? thread : null;

  useEffect(() => {
    if (!isSuccess || !currentThread) {
      return;
    }

    const threadState = chat.threads[currentThread.slug];
    if (!threadState) {
      dispatch(initThread(currentThread));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, thread, threadSlug]);

  if (isError) {
    return <NotFound />;
  }

  const threadState = !!currentThread && chat.threads[currentThread.slug];

  if (isLoading || !currentThread || !socket || !threadState) {
    return <PageLoader />;
  }

  return <Chat socket={socket} threadState={threadState} user={user} />;
}

export default Thread;
