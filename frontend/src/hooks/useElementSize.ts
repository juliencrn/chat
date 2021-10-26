import React, { RefObject, useEffect, useState } from "react";

import { useEventListener } from "usehooks-ts";

interface Size {
  width: number;
  height: number;
}

function useElementSize<T extends HTMLElement = HTMLDivElement>(
  elementRef: RefObject<T> | null,
  deps?: React.DependencyList,
): Size {
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  // Prevent too many rendering using useCallback
  const updateSize = () => {
    const node = elementRef?.current;
    if (node) {
      setSize({
        width: node.offsetWidth || 0,
        height: node.offsetHeight || 0,
      });
    }
  };

  // Initial size on mount
  useEffect(() => {
    updateSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef, ...(deps || [])]);

  useEventListener("resize", updateSize);

  return size;
}

export default useElementSize;
