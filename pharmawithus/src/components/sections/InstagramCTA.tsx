import { motion } from 'framer-motion';

export function InstagramCTA() {
  return (
    <section id="contact" className="section-padding bg-bg-soft">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-white border border-border p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 card-shadow">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-pink-400 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-heading font-bold text-xl text-text mb-1">Not sure which course to choose?</h3>
            <p className="text-text-secondary text-sm">Message us on Instagram and we will help you pick the right course</p>
          </div>
          <a href="https://instagram.com/pharmawithus" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-brand text-brand font-heading font-semibold text-sm hover:bg-brand hover:text-white transition-all">@pharmawithus</a>
        </motion.div>
      </div>
    </section>
  );
}
