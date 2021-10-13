import React from "react";

import { useGetAllThreadsQuery } from "../../state/threadsApi";
import { Thread } from "../../types";

function ThreadList() {
  const { data: threads, isLoading } = useGetAllThreadsQuery(undefined);

  return (
    <div>
      <h3>Thread</h3>
      <ul>
        {isLoading && <li>...</li>}
        {threads &&
          threads.map(thread => <ThreadLine key={thread.id} thread={thread} />)}
      </ul>
    </div>
  );
}

export default ThreadList;

interface ThreadLineProps {
  thread: Thread;
}

function ThreadLine({ thread }: ThreadLineProps) {
  return (
    <li
      key={thread.id}
      className={`flex items-center justify-start mb-1 ${""}`}
    >
      <span className={` pl-2 capitalize text-white font-bold`}>
        {thread.name}
      </span>
    </li>
  );
}
