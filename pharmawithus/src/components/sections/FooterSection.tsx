import { MessageCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FooterSection() {
  return (
    <footer id="footer" className="bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 64 64" fill="none"><path d="M20 28C20 28 18 14 32 14C46 14 44 28 44 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><path d="M38 14L44 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><path d="M16 30C16 30 14 50 32 50C50 50 48 30 48 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><path d="M16 30H48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><path d="M26 50L24 56H40L38 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 56H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
              </div>
              <div>
                <span className="font-heading font-bold text-text text-sm">PharmaWithUs</span>
                <p className="text-[10px] text-brand font-medium leading-none">ace with us</p>
              </div>
            </div>
            <p className="text-xs text-text-muted max-w-xs">Structured learning. Better results. Ace with us!</p>
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-text mb-3">Quick Links</p>
            <div className="space-y-2">{['Courses', 'About Us', 'Combo Course', 'Contact'].map((l) => (<a key={l} href="#" className="block text-xs text-text-muted hover:text-brand transition-colors">{l}</a>))}</div>
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-text mb-3">Support</p>
            <div className="space-y-2">
              <Link to="/faq" className="block text-xs text-text-muted hover:text-brand transition-colors">FAQs</Link>
              {['Payment Info', 'Refund Policy', 'Terms & Conditions'].map((l) => (<a key={l} href="#" className="block text-xs text-text-muted hover:text-brand transition-colors">{l}</a>))}
            </div>
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-text mb-3">Follow Us</p>
            <div className="flex items-center gap-2 mb-4">
              <a href="https://instagram.com/pharmawithus" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-bg-muted flex items-center justify-center text-text-muted hover:text-brand hover:bg-brand-lighter transition-all"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
              <a href="https://wa.me/44XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-bg-muted flex items-center justify-center text-text-muted hover:text-success hover:bg-green-50 transition-all"><MessageCircle className="w-4 h-4" /></a>
            </div>
            <p className="font-heading font-bold text-xs text-text mb-2">We Accept</p>
            <div className="flex items-center gap-2 text-[10px] text-text-muted font-semibold"><span className="px-2.5 py-1 rounded-md bg-bg-muted">CliQ</span><span className="px-2.5 py-1 rounded-md bg-bg-muted">Bank Transfer</span></div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} PharmaWithUs. All rights reserved.</p>
          <p className="text-xs text-text-muted flex items-center gap-1">Made with <Heart className="w-3 h-3 text-brand fill-brand" /> for pharmacy students</p>
        </div>
      </div>
    </footer>
  );
}
