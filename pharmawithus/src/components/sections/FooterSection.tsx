import { MessageCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../auth/BrandLogo';

export function FooterSection() {
  return (
    <footer id="contact" className="bg-ink text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="mb-4">
              <BrandLogo variant="dark" size="sm" />
            </div>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              Structured pharmacy exam prep for UK students. Pass with confidence.
            </p>
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-white/90 mb-4">Explore</p>
            <div className="space-y-2.5">
              <a href="/#courses" className="block text-sm text-white/50 hover:text-brand transition-colors">Courses</a>
              <a href="/#how-it-works" className="block text-sm text-white/50 hover:text-brand transition-colors">How it works</a>
              <a href="/#about" className="block text-sm text-white/50 hover:text-brand transition-colors">What&apos;s inside</a>
              <a href="/#testimonials" className="block text-sm text-white/50 hover:text-brand transition-colors">Reviews</a>
            </div>
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-white/90 mb-4">Support</p>
            <div className="space-y-2.5">
              <Link to="/faq" className="block text-sm text-white/50 hover:text-brand transition-colors">FAQs</Link>
              <a href="https://instagram.com/pharmawithus" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/50 hover:text-brand transition-colors">Contact us</a>
            </div>
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-white/90 mb-4">Connect</p>
            <div className="flex items-center gap-2 mb-4">
              <a href="https://instagram.com/pharmawithus" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>
              </a>
              <a href="https://instagram.com/pharmawithus" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-success/80 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-white/40 font-medium">Bank transfer</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} PharmaWithUs. All rights reserved.</p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-brand fill-brand" /> for pharmacy students
          </p>
        </div>
      </div>
    </footer>
  );
}
