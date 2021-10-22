import React from "react";

import cn from "classnames";
import { Link, useParams } from "react-router-dom";

import { useGetAllThreadsQuery } from "../../state/threadsApi";
import { Thread } from "../../types";
import { HashtagIcon } from "../Icons";
import CreateThread from "./CreateThread";

function ThreadList() {
  const { slug } = useParams<{ slug: string }>();
  const threadsQuery = useGetAllThreadsQuery(undefined);

  const { data: threads, isLoading, refetch } = threadsQuery;

  return (
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
      <CreateThread onSuccess={refetch} />
    </ul>
  );
}

export default ThreadList;

interface ThreadLineProps {
  thread: Thread;
  active: boolean;
}

function ThreadLine({ thread, active }: ThreadLineProps) {
  const fontColor = active ? "text-gray-300 font-bold" : "text-gray-500";

  return (
    <li className={`flex items-center justify-start mb-1`}>
      <span className={cn(`w-4`, fontColor)}>
        <HashtagIcon />
      </span>
      <Link
        to={`/thread/${thread.slug}`}
        className={cn("pl-2 link capitalize", active && "font-bold", fontColor)}
      >
        {thread.name}
      </Link>
    </li>
  );
}
