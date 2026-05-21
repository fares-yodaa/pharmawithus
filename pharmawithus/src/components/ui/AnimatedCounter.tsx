import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  id?: string;
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
  id,
}: AnimatedCounterProps) {
  const { ref, isInView } = useInView(0.3);
  const count = useCountUp(end, duration, 0, isInView);

  return (
    <span ref={ref} className={className} id={id}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
