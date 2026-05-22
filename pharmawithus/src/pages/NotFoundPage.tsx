import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { BrandLogo } from '../components/auth/BrandLogo';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg-soft flex items-center justify-center px-4">
      <div className="text-center">
        <BrandLogo size="lg" showText={false} linkToHome className="mx-auto mb-6 justify-center" />
        <p className="font-heading font-black text-7xl text-brand/20">404</p>
        <h1 className="font-heading font-bold text-2xl text-text mt-2">Page not found</h1>
        <p className="text-sm text-text-muted mt-2 mb-8">This page doesn&apos;t exist or was moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand text-white font-bold text-sm">
          <Home className="w-4 h-4" /> Back home
        </Link>
      </div>
    </div>
  );
}
