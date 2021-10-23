import { useEffect } from "react";

import { useGetAllThreadsQuery } from "../state/api/threadsApi";
import { Thread } from "../types";

type HookReturn = [Thread[], { isLoading: boolean }];

function useThreadList(currentThreadSlug?: string): HookReturn {
  const threadsQuery = useGetAllThreadsQuery(undefined);

  const { data: threads, isLoading, refetch } = threadsQuery;

  useEffect(() => {
    const threadFound =
      threads && threads.find(thread => thread.slug === currentThreadSlug);
    if (!threadFound) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentThreadSlug]);

  return [threads || [], { isLoading }];
}

export default useThreadList;
