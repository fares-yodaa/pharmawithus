import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'About Our Courses',
    items: [
      { q: 'Will this actually help me pass my exam?', a: "Our courses have a 94% pass rate — that's real data from 2,800+ students. The content is built by pharmacists who've been through the exact same exams. We focus on what actually appears in exams, not textbook fluff." },
      { q: "I don't have time to study — my exam is next week!", a: "That's exactly who our courses are designed for. Each course is structured in bite-sized modules you can complete in a few hours. Many students have passed after studying with us for just 2-3 days." },
      { q: 'How is this different from free YouTube videos?', a: "YouTube content is scattered, unstructured, and often outdated. Our courses follow a proven learning framework, include 1,100+ practice questions modeled after real exams, and come with expert support." },
      { q: 'What courses do you offer?', a: "We offer Pre-Reg Exam Mastery, Pharmacy Calculations, Clinical Pharmacy Essentials, and the Complete Pharmacy Bundle which includes all three courses plus bonus materials and priority support." },
    ]
  },
  {
    category: 'Payment & Access',
    items: [
      { q: 'Is my payment secure?', a: "Absolutely. We use CliQ for secure payments. Once verified, your access is activated immediately. Over 2,800 students have paid this way without a single problem." },
      { q: 'How do I pay for a course?', a: "Click 'Buy Now' on any course, then follow the payment flow. You can pay via CliQ or bank transfer. After payment, fill in the confirmation form and you'll receive access within minutes." },
      { q: 'When do I get access after paying?', a: "Access is typically granted within a few hours of payment confirmation. You'll receive an email with your Zoom link, course dashboard access, and WhatsApp group invite." },
      { q: 'Do you offer refunds?', a: "We stand behind our content. If you have concerns about your purchase, please reach out to us on Instagram or WhatsApp and we'll work with you to find a solution." },
    ]
  },
  {
    category: 'Course Experience',
    items: [
      { q: 'Can I access the course on my phone?', a: "Yes! Our platform is fully mobile-optimised. Study on your commute, during lunch, or in bed. All you need is a browser — no app download required." },
      { q: 'Are the sessions live or recorded?', a: "Both! We run structured live sessions every week where you can interact with the instructor. All sessions are also recorded so you can rewatch them at your own pace." },
      { q: "What if the course doesn't work for me?", a: "We stand behind our content. If you complete the course materials and feel it hasn't helped, reach out to us on WhatsApp. We'll work with you personally to address any gaps." },
      { q: 'Do I get a certificate?', a: "Our focus is on helping you pass your actual exams rather than providing certificates. Your GPhC qualification is the certificate that matters — and we'll help you earn it." },
    ]
  },
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');

  return (
    <div className="min-h-screen bg-bg-soft">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-brand transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-text">Frequently Asked Questions</h1>
          <p className="mt-2 text-text-secondary">Everything you need to know about PharmaWithUs courses.</p>
        </div>
      </div>

      {/* FAQ sections */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {faqs.map((section, si) => (
          <div key={si} className="mb-10">
            <h2 className="font-heading font-bold text-lg text-text mb-4">{section.category}</h2>
            <div className="space-y-2.5">
              {section.items.map((item, ii) => {
                const key = `${si}-${ii}`;
                const isOpen = openIndex === key;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (si * 4 + ii) * 0.03 }}
                    className={`rounded-2xl border overflow-hidden transition-colors bg-white ${isOpen ? 'border-brand/20 shadow-[0_4px_20px_rgba(233,30,123,0.06)]' : 'border-border'}`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : key)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer bg-transparent border-none"
                    >
                      <span className="font-heading font-semibold text-text text-[15px] pr-4">{item.q}</span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                        <ChevronDown className="w-5 h-5 text-brand" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <div className="px-5 pb-5">
                            <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div className="rounded-3xl bg-white border border-border p-8 text-center card-shadow mt-6">
          <h3 className="font-heading font-bold text-xl text-text mb-2">Still have questions?</h3>
          <p className="text-sm text-text-secondary mb-5">We're here to help. Reach out and we'll get back to you quickly.</p>
          <a href="https://instagram.com/pharmawithus" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-brand text-brand font-heading font-semibold text-sm hover:bg-brand hover:text-white transition-all">
            Message us on Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
