import { MousePointer, Zap, Trophy } from 'lucide-react';
import { TimelineStep } from '../ui/TimelineStep';

export function HowItWorksSection() {
  const steps = [
    { step: 1, title: 'Choose Your Course', description: 'Pick the course that matches your exam. Not sure? Our quick quiz helps you decide in 10 seconds.', icon: <MousePointer className="w-5 h-5" /> },
    { step: 2, title: 'Get Instant Access', description: 'Pay via bank transfer and get access within 30 minutes. Start studying immediately — no waiting around.', icon: <Zap className="w-5 h-5" /> },
    { step: 3, title: 'Pass With Confidence', description: 'Work through structured lessons, practice questions, and mock exams. Walk into your exam feeling prepared.', icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <section id="how-it-works" className="relative section-padding">
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-pink/10 text-accent-pink text-xs font-bold uppercase tracking-wider mb-5">Simple Process</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-text-primary leading-tight">How It <span className="gradient-text">Works</span></h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto text-lg">From signup to exam success in 3 simple steps.</p>
        </div>
        <div className="max-w-md mx-auto">
          {steps.map((s, i) => (
            <TimelineStep key={s.step} {...s} isLast={i === steps.length - 1} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
