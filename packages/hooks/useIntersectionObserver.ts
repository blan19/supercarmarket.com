/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

interface Args extends IntersectionObserverInit {
  isFreezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    isFreezeOnceVisible = false,
  }: Args
): IntersectionObserverEntry | undefined => {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && isFreezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  React.useEffect(() => {
    const node = elementRef?.current; // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) {
      return;
    }

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen]);

  return entry;
};
