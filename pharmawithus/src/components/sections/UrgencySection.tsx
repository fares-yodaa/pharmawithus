import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gift } from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';

interface UrgencySectionProps { onBuyClick: () => void; }

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, targetDate.getTime() - Date.now());
    return {
      days: Math.floor(diff / 864e5),
      hours: Math.floor((diff % 864e5) / 36e5),
      minutes: Math.floor((diff % 36e5) / 6e4),
      seconds: Math.floor((diff % 6e4) / 1e3),
    };
  });

  useEffect(() => {
    const id = setInterval(() => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 864e5),
        hours: Math.floor((diff % 864e5) / 36e5),
        minutes: Math.floor((diff % 36e5) / 6e4),
        seconds: Math.floor((diff % 6e4) / 1e3),
      });
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export function UrgencySection({ onBuyClick }: UrgencySectionProps) {
  // Stable date — only computed once
  const examDate = useMemo(() => new Date(Date.now() + 30 * 864e5), []);
  const { days, hours, minutes, seconds } = useCountdown(examDate);
  const units = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Mins' },
    { value: seconds, label: 'Secs' },
  ];

  return (
    <section id="urgency" className="section-padding">
      {/* Before / After */}
      <div className="max-w-4xl mx-auto mb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">
            Before vs After <span className="text-brand">PharmaWithUs</span>
          </h2>
          <p className="mt-3 text-text-secondary">Drag the slider to see the transformation</p>
        </motion.div>
        <BeforeAfterSlider />
      </div>

      {/* Limited Spots banner */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
        <div className="rounded-3xl bg-brand-lighter border-2 border-brand/20 p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Gift className="w-7 h-7 text-brand" />
              <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-text">Limited Spots!</h3>
            </div>
            <p className="text-text-secondary mb-1">
              Use code: <span className="font-bold text-brand">ACE10</span> for a special discount
            </p>
            <p className="text-sm text-text-muted mb-6">Hurry up! Offer ends in:</p>

            <div className="flex items-center justify-center gap-3 mb-8">
              {units.map((u) => (
                <div key={u.label} className="text-center">
                  <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl bg-brand flex items-center justify-center">
                    <span className="font-heading font-extrabold text-2xl md:text-3xl text-white tabular-nums">
                      {String(u.value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted mt-1.5 block font-medium">{u.label}</span>
                </div>
              ))}
            </div>

            <GlowButton size="lg" onClick={onBuyClick}>
              Enroll Now <ArrowRight className="w-5 h-5" />
            </GlowButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
