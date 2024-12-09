import { MutableRefObject, useCallback, useRef } from "react";

export function useLinkedRef<T>(): [
  MutableRefObject<T | undefined>,
  () => T | undefined,
  (data: T) => void,
];
export function useLinkedRef<T>(
  initial: T | null
): [MutableRefObject<T>, () => T, (data: T) => void];

export function useLinkedRef<T>(
  initialValue?: T
): [MutableRefObject<T | undefined>, () => T | undefined, (data: T) => void] {
  const ref = useRef<T | undefined>(initialValue);
  const getRef = useCallback(() => ref.current, [ref]);
  const setRef = useCallback(
    (data: T) => {
      ref.current = data;
    },
    [ref]
  );
  return [ref, getRef, setRef];
}
