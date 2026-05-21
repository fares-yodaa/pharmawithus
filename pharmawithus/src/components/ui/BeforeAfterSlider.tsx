import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseMove = useCallback((e: React.MouseEvent) => { if (isDragging.current) updatePosition(e.clientX); }, [updatePosition]);
  const handleMouseUp = () => { isDragging.current = false; };
  const handleTouchMove = useCallback((e: React.TouchEvent) => { updatePosition(e.touches[0].clientX); }, [updatePosition]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden select-none cursor-col-resize border border-border card-shadow"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      id="before-after-slider"
    >
      {/* Before side */}
      <div className="relative w-full aspect-[16/10] bg-red-50">
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-center">
          <span className="inline-block self-start px-3 py-1 rounded-full bg-red-100 text-red-500 text-xs font-bold uppercase tracking-wider mb-4">Before PharmaWithUs</span>
          <div className="space-y-3">
            {[
              { label: 'Exam Confidence', value: 20 },
              { label: 'Study Efficiency', value: 15 },
              { label: 'Calculation Skills', value: 25 },
              { label: 'Clinical Knowledge', value: 30 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-red-400 mb-1"><span>{item.label}</span><span>{item.value}%</span></div>
                <div className="h-2.5 bg-red-100 rounded-full overflow-hidden"><div className="h-full bg-red-400 rounded-full" style={{ width: `${item.value}%` }} /></div>
              </div>
            ))}
          </div>
          <p className="text-sm text-red-400 mt-4">😰 Stressed. Lost. Cramming at 3am.</p>
        </div>
      </div>

      {/* After side */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
        <div className="absolute inset-0 bg-green-50 p-6 md:p-10 flex flex-col justify-center">
          <span className="inline-block self-start px-3 py-1 rounded-full bg-green-100 text-success text-xs font-bold uppercase tracking-wider mb-4">After PharmaWithUs</span>
          <div className="space-y-3">
            {[
              { label: 'Exam Confidence', value: 94 },
              { label: 'Study Efficiency', value: 88 },
              { label: 'Calculation Skills', value: 97 },
              { label: 'Clinical Knowledge', value: 92 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-success mb-1"><span>{item.label}</span><span>{item.value}%</span></div>
                <div className="h-2.5 bg-green-100 rounded-full overflow-hidden"><div className="h-full bg-brand rounded-full" style={{ width: `${item.value}%` }} /></div>
              </div>
            ))}
          </div>
          <p className="text-sm text-success mt-4">💪 Confident. Prepared. Exam-ready.</p>
        </div>
      </div>

      {/* Slider handle */}
      <div className="absolute top-0 bottom-0 z-10" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
        <div className="w-[2px] h-full bg-brand" />
        <div onMouseDown={handleMouseDown} onTouchStart={handleMouseDown} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-brand flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-brand/50 rounded-full" />
            <div className="w-0.5 h-4 bg-brand/50 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
