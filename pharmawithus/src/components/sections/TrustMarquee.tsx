const items = [
  'GPhC-aligned content',
  '2,800+ students',
  '94% pass rate',
  'Live expert sessions',
  'Mock exams included',
  'WhatsApp support',
  'Bank transfer',
  'UK pharmacy focus',
];

export function TrustMarquee() {
  const doubled = [...items, ...items];

  return (
    <section className="relative py-5 border-y border-border/50 bg-white/50 backdrop-blur-sm overflow-hidden" aria-hidden>
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="mx-8 text-sm font-semibold text-text-muted/80 flex items-center gap-8"
          >
            {text}
            <span className="w-1 h-1 rounded-full bg-brand/40" />
          </span>
        ))}
      </div>
    </section>
  );
}
