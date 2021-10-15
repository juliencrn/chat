import React from "react";

import cn from "classnames";
import { Link, useParams } from "react-router-dom";

import { useGetAllThreadsQuery } from "../../state/threadsApi";
import { Thread } from "../../types";
import { HashtagIcon, PlusIcon } from "../Icons";

function ThreadList() {
  const { slug } = useParams<{ slug: string }>();
  const { data: threads, isLoading } = useGetAllThreadsQuery(undefined);

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
      <ThreadButton />
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

function ThreadButton() {
  return (
    <li className={`mb-1 mt-2`}>
      <button
        className={`flex items-center justify-start cursor-pointer`}
        onClick={() => alert("Add thread")}
      >
        <span className={cn(`w-4 bg-gray-700 text-gray-300 rounded`)}>
          <PlusIcon />
        </span>
        <span className={cn("pl-2 link capitalize text-gray-500")}>
          Add thread
        </span>
      </button>
    </li>
  );
}
