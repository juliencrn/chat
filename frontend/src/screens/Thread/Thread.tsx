import React from "react";

import { useParams } from "react-router";

import { PrivateRouteProps } from "../../App";
import { useGetOneThreadQuery } from "../../state/threadsApi";
import NotFound from "../NotFound";

function Thread(props: PrivateRouteProps) {
  const { name } = useParams<{ name: string }>();
  const { data: thread, isLoading, isError } = useGetOneThreadQuery(name);

  console.log({ props, thread });

  if (isError) {
    return <NotFound />;
  }

  return (
    <div>
      <p>Thread name: {name}</p>
      <p>{isLoading && "..."}</p>
      <p>{thread && "Thread id: " + thread.id}</p>
    </div>
  );
}

export default Thread;
