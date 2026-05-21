import { useEffect, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition(elementRef?: React.RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (elementRef?.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setPosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
      } else {
        setPosition({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
      }
    };

    const target = elementRef?.current || window;
    target.addEventListener('mousemove', handleMouseMove as EventListener);
    return () => target.removeEventListener('mousemove', handleMouseMove as EventListener);
  }, [elementRef]);

  return position;
}
