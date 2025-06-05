/**
 * Creates a debounced version of a function that delays calling it until after
 * `delay` milliseconds have passed since the last time it was called.
 *
 * @param fn The function to debounce
 * @param delay The amount of time to wait before calling the debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T =>
  ((...args: Parameters<T>) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  }) as T;
