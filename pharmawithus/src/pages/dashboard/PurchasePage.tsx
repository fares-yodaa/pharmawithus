import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  Check,
  BookOpen,
  Clock,
  CheckCircle,
  Shield,
} from 'lucide-react';
import { api } from '../../lib/api';
import { getErrorMessage, LOAD_ERROR_COPY } from '../../lib/errors';
import { useAuth } from '../../context/AuthContext';
import {
  UserLoading,
  UserPageError,
  UserFormError,
  UserFieldLabel,
  UserInput,
  UserPrimaryButton,
  UserGhostButton,
} from '../../components/dashboard/user-ui';

export function PurchasePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get(`/users/courses/${courseId}`, { silent: true });
      setCourse(data);
    } catch (err) {
      setLoadError(getErrorMessage(err, LOAD_ERROR_COPY.checkout));
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  useEffect(() => {
    if (profile) setName(profile.full_name || '');
    if (user) setEmail(user.email || '');
  }, [profile, user]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !course) {
      setError('Please sign in to complete your enrollment.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!file) {
      setError('Please upload a screenshot of your payment before submitting.');
      return;
    }
    setError('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('payer_name', name);
    formData.append('payer_email', email);
    formData.append('payer_phone', phone || '');

    try {
      await api.postForm(`/users/courses/${course.id}/buy`, formData, { silent: true });
      setSuccess(true);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'We could not submit your order. Please check your details and try again.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <UserLoading />;

  if (loadError) {
    return (
      <UserPageError
        message={loadError}
        title="Course unavailable"
        onRetry={loadCourse}
      />
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <UserPageError
          message="This course is no longer available. Browse our catalog to find another course."
          title="Course not found"
        />
        <UserGhostButton to="/dashboard/browse" className="mt-4 inline-flex">
          Browse courses
        </UserGhostButton>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="user-success"
      >
        <div className="user-success__icon">
          <CheckCircle className="w-9 h-9" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-text">Order submitted</h2>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">
          We'll verify your payment shortly. Once approved, the course appears in My Courses.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <UserPrimaryButton onClick={() => navigate('/dashboard/orders')}>
            View my orders
          </UserPrimaryButton>
          <UserGhostButton to="/dashboard">Go to dashboard</UserGhostButton>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="user-eyebrow mb-2">Secure checkout</p>
      <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text tracking-tight mb-6">
        Complete your enrollment
      </h1>

      <div className="user-checkout-summary">
        <div className="user-checkout-summary__thumb">
          {course.picture_url ? (
            <img src={course.picture_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="w-8 h-8 text-brand" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-lg text-text">{course.title}</h3>
          {course.subtitle && (
            <p className="text-sm text-brand font-medium mt-0.5">{course.subtitle}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-text-muted">
            {course.lesson_count != null && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-brand" /> {course.lesson_count} lessons
              </span>
            )}
            {course.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand" /> {course.duration}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="font-heading font-extrabold text-2xl text-brand">
            ${course.price}
          </span>
        </div>
      </div>

      <UserFormError message={error} onDismiss={() => setError('')} />

      <form onSubmit={handleSubmit}>
        <div className="user-form-section space-y-4">
          <h3 className="user-form-section__title">Your details</h3>
          <div>
            <UserFieldLabel>Full name *</UserFieldLabel>
            <UserInput type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <UserFieldLabel>Email *</UserFieldLabel>
            <UserInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <UserFieldLabel>Phone (WhatsApp)</UserFieldLabel>
            <UserInput
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional — for faster support"
            />
          </div>
        </div>

        <div className="user-form-section mt-4">
          <h3 className="user-form-section__title">Payment proof *</h3>
          <p className="text-xs text-text-muted mb-4 leading-relaxed">
            A screenshot of your transfer or receipt is required to submit your enrollment.
          </p>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`user-dropzone ${isDragging ? 'user-dropzone--drag' : ''} ${fileName ? 'user-dropzone--done' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              required
            />
            {fileName ? (
              <div className="flex flex-col items-center gap-2">
                <Check className="w-7 h-7 text-success" />
                <p className="text-sm font-semibold text-text">{fileName}</p>
                <p className="text-xs text-text-muted">Tap to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-9 h-9 text-brand/50" />
                <p className="text-sm font-semibold text-text-secondary">
                  Click or drag to upload
                </p>
                <p className="text-xs text-text-muted">PNG, JPG, or PDF — up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        <p className="flex items-center gap-2 text-xs text-text-muted mt-5 mb-4">
          <Shield className="w-4 h-4 text-brand shrink-0" />
          Your information is encrypted and only used to verify your purchase.
        </p>

        <UserPrimaryButton
          type="submit"
          disabled={submitting || !name || !email || !file}
          className="w-full !rounded-xl !py-3.5"
        >
          {submitting ? 'Submitting…' : `Submit order — $${course.price}`}
        </UserPrimaryButton>
      </form>
    </div>
  );
}
