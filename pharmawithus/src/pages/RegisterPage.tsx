import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPw) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error: err } = await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-lighter via-white to-pink-50 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white rounded-3xl border border-border p-8 card-shadow text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-text mb-2">Account Created!</h1>
          <p className="text-sm text-text-muted mb-6">Check your email to confirm your account, then sign in.</p>
          <Link to="/login" className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-brand text-white font-heading font-bold text-sm hover:bg-brand-dark transition-colors">
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-lighter via-white to-pink-50 px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 64 64" fill="none"><path d="M20 28C20 28 18 14 32 14C46 14 44 28 44 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M38 14L44 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M16 30C16 30 14 50 32 50C50 50 48 30 48 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M16 30H48" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M26 50L24 56H40L38 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 56H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
            </div>
            <span className="font-heading font-bold text-xl text-text">PharmaWithUs</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-border p-8 card-shadow">
          <h1 className="font-heading font-bold text-2xl text-text text-center mb-1">Create your account</h1>
          <p className="text-sm text-text-muted text-center mb-6">Join thousands of pharmacy students</p>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-bg-soft text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-bg-soft text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required className="w-full pl-11 pr-11 py-3 rounded-xl border border-border bg-bg-soft text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text cursor-pointer bg-transparent border-none p-0">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Confirm your password" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-bg-soft text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-brand text-white font-heading font-bold text-sm hover:bg-brand-dark transition-colors cursor-pointer disabled:opacity-50 shadow-[0_4px_16px_rgba(233,30,123,0.25)]">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          <Link to="/" className="hover:text-brand transition-colors">Back to homepage</Link>
        </p>
      </motion.div>
    </div>
  );
}
