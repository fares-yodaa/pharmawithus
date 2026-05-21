import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { activityItems } from '../../data/activityFeed';

export function LiveActivityFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activityItems.length);
        setIsVisible(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const item = activityItems[currentIndex];

  return (
    <div className="fixed bottom-24 left-4 z-40 md:bottom-6 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-border shadow-lg max-w-[320px]"
          >
            <div className="w-8 h-8 rounded-full bg-brand-lighter flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-brand" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-text">{item.name}</span>
              <span className="text-text-muted"> {item.action} </span>
              <span className="text-brand font-medium">{item.location}</span>
              <div className="text-text-muted/60 mt-0.5">{item.timeAgo}</div>
            </div>
            <div className="relative shrink-0">
              <div className="w-2 h-2 bg-success rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-success rounded-full animate-ping opacity-75" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
