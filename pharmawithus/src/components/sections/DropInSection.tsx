import { motion } from 'framer-motion';
import {
  BookOpen,
  Bookmark,
  Calculator,
  ClipboardPlus,
  FileText,
  BarChart3,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';

const TOPICS = [
  { label: 'GPhC Assessment', icon: ClipboardPlus },
  { label: 'OTC', icon: ShieldCheck },
  { label: 'Clinical', icon: ClipboardPlus },
  { label: 'MEP', icon: ShieldCheck },
  { label: 'Calculations', icon: Calculator },
  { label: 'MPharm Modules', icon: BookOpen },
  { label: 'Assignments', icon: BarChart3 },
  { label: 'Case Studies', icon: FileText },
  { label: 'Exam Revision', icon: BookOpen },
  { label: 'Past Papers', icon: Bookmark },
  { label: 'One-to-One', icon: Users },
  { label: 'Topic Support', icon: Target },
];

export function DropInSection() {
  return (
    <section id="drop-in" className="section-padding relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 text-center lg:text-left"
          >
            <h2 className="font-heading font-extrabold text-brand uppercase leading-[1.08] tracking-tight text-3xl md:text-4xl">
              Drop-In Session
            </h2>
            <div className="mt-3 mx-auto lg:mx-0 w-16 h-1 rounded-full bg-brand" />
            <p className="mt-5 text-base text-text-secondary max-w-md mx-auto lg:mx-0 leading-relaxed">
              Need help with pharmacy? Our Drop-In Sessions support you with any topic, at any stage.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          >
            {TOPICS.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="rounded-2xl bg-white border border-white px-3 py-4 flex flex-col items-center text-center shadow-sm"
              >
                <Icon className="w-7 h-7 text-brand" strokeWidth={1.75} />
                <span className="mt-2 text-[11px] font-bold text-teal leading-tight">{label}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
