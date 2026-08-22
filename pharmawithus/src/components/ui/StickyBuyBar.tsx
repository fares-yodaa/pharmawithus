import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { GlowButton } from './GlowButton';
import type { Course } from '../../data/courses';

interface StickyBuyBarProps {
  visible: boolean;
  selectedCourse: Course | null;
  onBuyClick: () => void;
}

export function StickyBuyBar({ visible, selectedCourse, onBuyClick }: StickyBuyBarProps) {
  return (
    <AnimatePresence>
      {visible && selectedCourse && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          id="sticky-buy-bar"
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-heading font-semibold text-text truncate">
                  {selectedCourse.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-heading font-extrabold text-brand">
                    ${selectedCourse.price}
                  </span>
                </div>
              </div>
              <GlowButton onClick={onBuyClick} size="sm">
                <ShoppingCart className="w-4 h-4" />
                Buy Now
              </GlowButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
