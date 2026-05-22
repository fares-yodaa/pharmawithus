import { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';
import { GlowButton } from '../components/ui/GlowButton';

function passwordStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  return Math.min(score, 4);
}

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
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId as string | undefined;
  const loginState = courseId ? { courseId, from: `/dashboard/purchase/${courseId}` } : undefined;

  const strength = useMemo(() => passwordStrength(password), [password]);

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
      <AuthLayout
        title="You're in!"
        subtitle="We've sent a confirmation link to your email. Verify your account, then sign in to start learning."
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-success/20 to-brand/10 flex items-center justify-center border border-success/20">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <p className="text-sm text-text-secondary mb-8 max-w-xs mx-auto leading-relaxed">
            Check your inbox (and spam folder) for the confirmation email from PharmaWithUs.
          </p>
          <GlowButton
            className="w-full !rounded-xl !py-3.5"
            onClick={() => navigate('/login', { state: loginState, replace: true })}
          >
            Continue to sign in <ArrowRight className="w-4 h-4" />
          </GlowButton>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Start your journey"
      subtitle="Create a free account and get structured exam prep trusted by thousands of pharmacy students."
      courseBanner={
        courseId ? 'Create an account to enroll in your selected course.' : undefined
      }
      footer={
        <p className="text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" state={loginState} className="text-brand font-bold hover:underline">
            Sign in
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Full name"
          type="text"
          icon={<User className="w-4 h-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          required
        />

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

        <div>
          <AuthField
            label="Password"
            type={showPw ? 'text' : 'password'}
            icon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            autoComplete="new-password"
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
          {password.length > 0 && (
            <div className="auth-password-meter" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={
                    i < strength
                      ? strength >= 3
                        ? 'is-active is-strong'
                        : 'is-active'
                      : ''
                  }
                />
              ))}
            </div>
          )}
        </div>

        <AuthField
          label="Confirm password"
          type={showPw ? 'text' : 'password'}
          icon={<Lock className="w-4 h-4" />}
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
        />

        <GlowButton type="submit" disabled={loading} className="w-full !rounded-xl !py-3.5 mt-2">
          {loading ? 'Creating account…' : (
            <>
              Create account <ArrowRight className="w-4 h-4" />
            </>
          )}
        </GlowButton>
      </form>

      <p className="mt-5 text-[11px] text-text-muted text-center leading-relaxed">
        By signing up you agree to our terms. We&apos;ll never share your email.
      </p>
    </AuthLayout>
  );
}
