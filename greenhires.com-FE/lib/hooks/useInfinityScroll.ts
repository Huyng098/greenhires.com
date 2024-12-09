import { useCallback, useEffect, useRef } from "react";

const useInfinityScroll = (fetchNextPage: any, hasNextPage: boolean) => {
  const observerElemRef = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting) {
        fetchNextPage();
      }
    },
    [fetchNextPage]
  );

  useEffect(() => {
    const element = observerElemRef.current;
    const options = { threshold: 0 };

    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, options);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [fetchNextPage, hasNextPage, handleObserver]);

  return observerElemRef;
};

export default useInfinityScroll;
