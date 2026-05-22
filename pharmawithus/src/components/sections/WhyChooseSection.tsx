import { motion } from 'framer-motion';
import { Video, FileCheck, Trophy, Headphones } from 'lucide-react';
const features = [
  {
    icon: Video,
    title: 'Structured live classes',
    desc: 'Interactive sessions with practising pharmacists who know what examiners actually ask.',
    span: 'lg:col-span-2',
  },
  {
    icon: FileCheck,
    title: 'Notes, quizzes & mocks',
    desc: 'Everything in one place — no more hunting across random PDFs and YouTube playlists.',
    span: '',
  },
  {
    icon: Trophy,
    title: '94% pass rate',
    desc: 'Proven outcomes from students who followed the programme.',
    span: '',
  },
  {
    icon: Headphones,
    title: 'WhatsApp support',
    desc: 'Stuck on a topic? Reach out directly — we respond like humans, not bots.',
    span: 'lg:col-span-2',
  },
];

export function WhyChooseSection() {
  return (
    <section id="why-choose" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">
            Built for students who want results, not noise
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, span }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`${span} group rounded-3xl border border-border p-8 bg-gradient-to-br from-white to-bg-soft hover:border-brand/30 hover:card-shadow-hover transition-all`}
            >
              <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
