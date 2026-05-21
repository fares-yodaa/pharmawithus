import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const objections = [
  { q: 'Will this actually help me pass my exam?', a: "Our courses have a 94% pass rate — that's real data from 2,800+ students. The content is built by pharmacists who've been through the exact same exams. We focus on what actually appears in exams, not textbook fluff." },
  { q: "I don't have time to study — my exam is next week!", a: "That's exactly who our courses are designed for. Each course is structured in bite-sized modules you can complete in a few hours. Many students have passed after studying with us for just 2-3 days." },
  { q: 'How is this different from free YouTube videos?', a: "YouTube content is scattered, unstructured, and often outdated. Our courses follow a proven learning framework, include 1,100+ practice questions modeled after real exams, and come with expert support." },
  { q: 'Is my payment secure?', a: "Absolutely. We use CliQ for secure payments. Once verified, your access is activated immediately. Over 2,800 students have paid this way without a single problem." },
  { q: 'Can I access the course on my phone?', a: "Yes! Our platform is fully mobile-optimized. Study on your commute, during lunch, or in bed. All you need is a browser — no app download required." },
  { q: "What if the course doesn't work for me?", a: "We stand behind our content. If you complete the course materials and feel it hasn't helped, reach out to us on WhatsApp. We'll work with you personally to address any gaps." },
];

export function ObjectionSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">Frequently Asked Questions</h2>
          <p className="mt-3 text-text-secondary">We get it. Here are honest answers to the questions we hear most.</p>
        </motion.div>

        <div className="space-y-3">
          {objections.map((obj, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border overflow-hidden hover:border-brand/20 transition-colors bg-white card-shadow">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left cursor-pointer bg-transparent border-none">
                <span className="font-heading font-semibold text-text text-sm md:text-base pr-4">{obj.q}</span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                  <ChevronDown className="w-5 h-5 text-brand" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="px-5 pb-5"><p className="text-sm text-text-secondary leading-relaxed">{obj.a}</p></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
