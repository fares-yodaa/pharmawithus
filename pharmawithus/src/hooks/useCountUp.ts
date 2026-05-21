import { useEffect, useState } from 'react';

export function useCountUp(end: number, duration: number = 2000, start: number = 0, trigger: boolean = true) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!trigger) {
      setCount(start);
      return;
    }

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * (end - start) + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [end, duration, start, trigger]);
//222
  return count;
}
