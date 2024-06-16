type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: ThrottleOptions = {},
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any;
  let lastCallTime: number | null = null;

  const { leading = true, trailing = true } = options;

  const invokeFunction = (time: number) => {
    lastCallTime = time;
    func.apply(lastThis, lastArgs as Parameters<T>);
    lastArgs = lastThis = null;
  };

  const leadingEdge = (time: number) => {
    if (leading) {
      invokeFunction(time);
    }
    timeout = setTimeout(timerExpired, wait);
  };

  const remainingWait = (time: number) => {
    if (lastCallTime === null) {
      return 0;
    }
    const timeSinceLastCall = time - lastCallTime;
    const timeWaiting = wait - timeSinceLastCall;
    return timeWaiting;
  };

  const shouldInvoke = (time: number) => {
    if (lastCallTime === null) {
      return true;
    }
    const timeSinceLastCall = time - lastCallTime;
    return timeSinceLastCall >= wait;
  };

  const timerExpired = () => {
    const now = Date.now();
    if (shouldInvoke(now) && trailing && lastArgs) {
      invokeFunction(now);
    }
    timeout = null;
  };

  const throttled = function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (lastCallTime === null && !leading) {
      lastCallTime = now;
    }

    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    const timeRemaining = remainingWait(now);
    if (shouldInvoke(now)) {
      if (timeout === null) {
        leadingEdge(now);
      } else if (timeout && trailing) {
        clearTimeout(timeout);
        timeout = setTimeout(timerExpired, wait);
      }
    } else if (!timeout && trailing) {
      timeout = setTimeout(timerExpired, timeRemaining);
    }
  };

  throttled.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    lastCallTime = timeout = lastArgs = lastThis = null;
  };

  return throttled;
}

export default throttle;
