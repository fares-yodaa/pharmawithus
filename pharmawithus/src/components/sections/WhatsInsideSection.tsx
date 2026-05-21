import { motion } from 'framer-motion';
import { CheckCircle, Users, Zap, Award, Video, FileText, MessageCircle, BarChart3 } from 'lucide-react';

export function WhatsInsideSection() {
  return (
    <section id="about" className="section-padding bg-bg-soft">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">
            Everything You Need to <span className="text-brand">Ace Your Exams</span>
          </h2>
          <p className="mt-3 text-text-secondary max-w-lg mx-auto">A complete learning system — not just videos. Here's what you get access to.</p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Large card — Dashboard Preview */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2 md:row-span-2 rounded-3xl bg-white border border-border p-6 card-shadow hover:card-shadow-hover transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-brand" />
              <span className="font-heading font-bold text-sm text-text">Your Learning Dashboard</span>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-lighter to-pink-50 p-5">
              {/* Progress overview */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Completed', value: '24', sub: 'lessons' },
                  { label: 'Quiz Score', value: '87%', sub: 'average' },
                  { label: 'Study Time', value: '18h', sub: 'total' },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl bg-white/80 p-3 text-center">
                    <p className="font-heading font-extrabold text-xl text-text">{s.value}</p>
                    <p className="text-[10px] text-text-muted font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Lesson list */}
              <div className="space-y-2">
                {[
                  { title: 'GPhC Assessment Fundamentals', done: true, duration: '45 min' },
                  { title: 'Drug Calculations & Dosing', done: true, duration: '60 min' },
                  { title: 'Clinical Case Scenarios', done: false, duration: '55 min' },
                  { title: 'Full Mock Exam Simulation', done: false, duration: '90 min' },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 px-4 rounded-xl bg-white/70 border border-white/60 text-sm">
                    <CheckCircle className={`w-4 h-4 shrink-0 ${l.done ? 'text-brand' : 'text-text-muted/20'}`} />
                    <span className={`flex-1 font-medium ${l.done ? 'text-text' : 'text-text-muted/40'}`}>{l.title}</span>
                    <span className="text-[11px] text-text-muted">{l.duration}</span>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '50%' }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }} className="h-full bg-brand rounded-full" />
                </div>
                <span className="text-xs font-bold text-brand">50%</span>
              </div>
            </div>
          </motion.div>

          {/* Live Sessions */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-3xl bg-white border border-border p-6 card-shadow hover:card-shadow-hover transition-shadow flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-brand" />
            </div>
            <h3 className="font-heading font-bold text-base text-text mb-1">Structured Live Classes</h3>
            <p className="text-[13px] text-text-muted leading-relaxed flex-1">Learn directly from expert pharmacists in interactive, exam-focused sessions.</p>
            <div className="mt-4 flex items-center gap-2 text-[12px] text-brand font-semibold">
              <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              Live sessions every week
            </div>
          </motion.div>

          {/* Notes & Materials */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="rounded-3xl bg-brand text-white p-6 card-shadow hover:pink-glow-strong transition-shadow flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-heading font-bold text-base mb-1">Notes, Quizzes & Exam Prep</h3>
            <p className="text-[13px] text-white/70 leading-relaxed flex-1">Comprehensive study materials, practice questions, and mock exams — all in one place.</p>
            <p className="mt-4 text-[12px] font-semibold text-white/80">1,100+ practice questions</p>
          </motion.div>

          {/* Row of 3 small feature cards */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Award className="w-5 h-5 text-brand" />, title: 'High Pass Rate', desc: '94% of our students pass on their first attempt' },
              { icon: <Users className="w-5 h-5 text-brand" />, title: 'Expert Pharmacists', desc: 'Taught by experienced, qualified practitioners' },
              { icon: <Zap className="w-5 h-5 text-brand" />, title: 'Exam-Focused', desc: 'Every lesson targets real exam content' },
              { icon: <MessageCircle className="w-5 h-5 text-brand" />, title: 'WhatsApp Support', desc: 'Direct access to help when you need it' },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl bg-white border border-border p-5 card-shadow hover:card-shadow-hover transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-brand-lighter flex items-center justify-center mb-3">{f.icon}</div>
                <h4 className="font-heading font-bold text-sm text-text mb-1">{f.title}</h4>
                <p className="text-[12px] text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
