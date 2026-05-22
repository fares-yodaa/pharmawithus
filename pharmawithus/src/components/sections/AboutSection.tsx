import { motion } from 'framer-motion';
import { Users, GraduationCap, RefreshCw, Target, Lightbulb, Heart } from 'lucide-react';
import { BrandLogo } from '../auth/BrandLogo';

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-brand-lighter/50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 w-full max-w-md">
            <div className="rounded-3xl bg-white p-8 card-shadow border border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative text-center">
                <BrandLogo
                  size="xl"
                  showText={false}
                  linkToHome={false}
                  className="mx-auto mb-4 justify-center"
                />
                <h3 className="font-heading font-bold text-lg text-text">PharmaWithUs</h3>
                <p className="text-sm text-text-muted mt-1">Structured learning. Better results.</p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[{ icon: <Target className="w-5 h-5 text-brand" />, label: 'Focused' }, { icon: <Lightbulb className="w-5 h-5 text-brand" />, label: 'Smart' }, { icon: <Heart className="w-5 h-5 text-brand" />, label: 'Supportive' }].map((item, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-brand-lighter flex flex-col items-center justify-center gap-1.5">{item.icon}<span className="text-[10px] font-semibold text-text-muted">{item.label}</span></div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1">
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text mb-4">About PharmaWithUs</h2>
            <p className="text-text-secondary leading-relaxed mb-8">We're here to support MPharm students, pre-reg trainees, and resitters with high-quality, structured education that helps you succeed. Every course is built by practising pharmacists who understand exactly what the exams demand.</p>
            <div className="flex flex-wrap gap-5">
              {[{ icon: <GraduationCap className="w-5 h-5 text-brand" />, label: 'MPharm Students' }, { icon: <Users className="w-5 h-5 text-brand" />, label: 'Pre-reg Trainees' }, { icon: <RefreshCw className="w-5 h-5 text-brand" />, label: 'Resitters' }].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-border card-shadow"><div className="w-10 h-10 rounded-xl bg-brand-lighter flex items-center justify-center">{item.icon}</div><span className="text-sm font-semibold text-text">{item.label}</span></div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
