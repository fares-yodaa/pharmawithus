import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
interface FinalCTASectionProps {
  onGetStarted: () => void;
}

export function FinalCTASection({ onGetStarted }: FinalCTASectionProps) {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <div className="section-dark rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 lg:p-14 relative overflow-hidden border border-white/10 shadow-[0_24px_80px_rgba(12,12,20,0.15)]">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/20 blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#2D1B69]/40 blur-[100px]" />
          </div>
          <div className="absolute inset-0 dot-grid opacity-[0.07] pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white leading-tight text-balance">
              Stop cramming. Start passing with a plan that actually works.
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed max-w-md">
              Join thousands of pharmacy students who traded panic for preparation. Use code{' '}
              <span className="text-brand font-bold">ACE10</span> at checkout.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GlowButton size="lg" onClick={onGetStarted}>
                Get started <ArrowRight className="w-5 h-5" />
              </GlowButton>
              <a
                href="https://instagram.com/pharmawithus"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white/90 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Ask on Instagram
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <BeforeAfterSlider />
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
}
