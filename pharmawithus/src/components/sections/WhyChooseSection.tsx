import { motion } from 'framer-motion';
import { BookOpen, FileText, TrendingUp, ShoppingCart } from 'lucide-react';

export function WhyChooseSection() {
  const features = [
    { icon: <BookOpen className="w-7 h-7 text-brand" />, title: 'Structured Live Classes', desc: 'Learn with expert pharmacists in interactive sessions.' },
    { icon: <FileText className="w-7 h-7 text-brand" />, title: 'Notes, Quizzes & Exam Prep', desc: 'Everything you need in one place.' },
    { icon: <TrendingUp className="w-7 h-7 text-brand" />, title: 'High Pass Rate', desc: 'Proven results with happy students.' },
    { icon: <ShoppingCart className="w-7 h-7 text-brand" />, title: 'Easy Purchase Process', desc: 'Quick, secure & hassle-free.' },
  ];

  return (
    <section id="why-choose" className="section-padding bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">Why Choose Us?</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-bg-soft border border-border hover:border-brand/20 hover:card-shadow-hover transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-lighter flex items-center justify-center">{f.icon}</div>
              <h3 className="font-heading font-bold text-sm text-text mb-2">{f.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
