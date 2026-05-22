import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { GlowButton } from '../components/ui/GlowButton';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId as string | undefined;
  const redirectFrom = location.state?.from as string | undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setLoading(false);
      setError(err);
      return;
    }
    try {
      const me = await api.get('/users/me', { silent: true });
      if (me.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }
      const destination = courseId
        ? `/dashboard/purchase/${courseId}`
        : redirectFrom || '/dashboard';
      navigate(destination, { replace: true });
    } catch {
      navigate(redirectFrom || '/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your courses, track orders, and pick up where you left off."
      courseBanner={
        courseId ? 'Sign in to complete your course enrollment.' : undefined
      }
      footer={
        <p className="text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" state={{ courseId }} className="text-brand font-bold hover:underline">
            Create one free
          </Link>
        </p>
      }
    >
      {error && (
        <div className="auth-alert-error mb-5" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          label="Email"
          type="email"
          icon={<Mail className="w-4 h-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@university.ac.uk"
          autoComplete="email"
          required
        />

        <AuthField
          label="Password"
          type={showPw ? 'text' : 'password'}
          icon={<Lock className="w-4 h-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          autoComplete="current-password"
          required
          trailing={
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-brand-lighter transition-colors cursor-pointer border-none bg-transparent"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <GlowButton type="submit" disabled={loading} className="w-full !rounded-xl !py-3.5">
          {loading ? 'Signing in…' : (
            <>
              Sign in <ArrowRight className="w-4 h-4" />
            </>
          )}
        </GlowButton>
      </form>

      <div className="auth-divider">Secure access</div>

      <ul className="space-y-2.5 text-xs text-text-muted">
        <li className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-brand" />
          Bank transfer payments verified within 24 hours
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-brand" />
          Instant access to courses after approval
        </li>
      </ul>
    </AuthLayout>
  );
}
