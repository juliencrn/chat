import React from "react";

import { Link, useParams } from "react-router-dom";

import { useGetAllThreadsQuery } from "../../state/threadsApi";
import { Thread } from "../../types";

function ThreadList() {
  const { slug } = useParams<{ slug: string }>();
  const { data: threads, isLoading } = useGetAllThreadsQuery(undefined);

  return (
    <div>
      <h3>Threads</h3>
      <ul>
        {isLoading && <li>...</li>}
        {threads &&
          threads.map(thread => (
            <ThreadLine
              key={thread.id}
              thread={thread}
              active={thread.slug === slug}
            />
          ))}
      </ul>
    </div>
  );
}

export default ThreadList;

interface ThreadLineProps {
  thread: Thread;
  active: boolean;
}

function ThreadLine({ thread, active }: ThreadLineProps) {
  return (
    <li
      key={thread.id}
      className={`flex items-center justify-start mb-1 ${""}`}
    >
      <Link
        to={`/thread/${thread.slug}`}
        className={` pl-2 link capitalize ${
          active ? "text-white font-bold" : "text-gray-500"
        }`}
      >
        {thread.name}
      </Link>
    </li>
  );
}
