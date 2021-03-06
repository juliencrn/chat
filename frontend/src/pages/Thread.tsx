import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import Chat from "../components/Chat/Chat";
import Layout from "../components/Layout";
import useSocket from "../hooks/useSocket";
import { ProtectedRouteProps } from "../Router";
import { useGetOneThreadQuery } from "../state/api/threadsApi";
import { chatSelector, initThread } from "../state/slices/chatSlice";
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
    return (
      <Layout>
        <h3>...</h3>
      </Layout>
    );
  }

  return (
    <Layout>
      <Chat socket={socket} threadState={threadState} user={user} />
    </Layout>
  );
}

export default Thread;
