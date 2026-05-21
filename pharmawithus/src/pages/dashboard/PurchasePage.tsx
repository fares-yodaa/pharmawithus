import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Check, BookOpen, Clock, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export function PurchasePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!courseId) return;
    api.get(`/users/courses/${courseId}`).then((data) => {
      setCourse(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [courseId]);

  useEffect(() => {
    if (profile) { setName(profile.full_name || ''); }
    if (user) { setEmail(user.email || ''); }
  }, [profile, user]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setFileName(f.name); }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setFileName(f.name); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !course || !name || !email) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('payer_name', name);
    formData.append('payer_email', email);
    formData.append('payer_phone', phone || '');
    formData.append('amount', course.price.toString());

    try {
      await api.postForm(`/users/courses/${course.id}/buy`, formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!course) {
    return <div className="text-center py-20"><p className="text-text-muted">Course not found.</p></div>;
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-success/10 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-success" /></div>
        <h2 className="font-heading font-bold text-2xl text-text mb-2">Order Submitted!</h2>
        <p className="text-sm text-text-secondary mb-6">We'll verify your payment shortly. You'll get access to your course once approved.</p>
        <button onClick={() => navigate('/dashboard/orders')} className="px-6 py-3 rounded-xl bg-brand text-white font-heading font-bold text-sm hover:bg-brand-dark transition-colors cursor-pointer">View My Orders</button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand transition-colors mb-6 cursor-pointer bg-transparent border-none">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="font-heading font-bold text-2xl text-text mb-6">Purchase Course</h1>

      {/* Course summary */}
      <div className="rounded-2xl bg-white border border-border p-5 card-shadow mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-bg-soft flex items-center justify-center shrink-0 overflow-hidden border border-border">
            {course.picture_url ? (
              <img src={course.picture_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="w-8 h-8 text-brand" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-lg text-text">{course.title}</h3>
            <p className="text-xs text-text-muted mt-1">{course.subtitle}</p>
          </div>
          <div className="text-right shrink-0">
            {course.anchor_price && <p className="text-xs text-text-muted line-through">{course.currency}{course.anchor_price}</p>}
            <p className="font-heading font-extrabold text-xl text-brand">{course.currency}{course.price}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-text-muted">
          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lesson_count} lessons</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
        </div>
      </div>

      {/* Payment form */}
      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl bg-white border border-border p-5 card-shadow space-y-4">
          <h3 className="font-heading font-bold text-base text-text">Your Details</h3>
          <div>
            <label className="text-xs font-semibold text-text mb-1.5 block">Full Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-border bg-bg-soft text-sm text-text focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text mb-1.5 block">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-border bg-bg-soft text-sm text-text focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text mb-1.5 block">Phone (WhatsApp)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" className="w-full px-4 py-3 rounded-xl border border-border bg-bg-soft text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
          </div>
        </div>

        {/* Proof upload */}
        <div className="rounded-2xl bg-white border border-border p-5 card-shadow">
          <h3 className="font-heading font-bold text-base text-text mb-3">Upload Payment Proof (Optional)</h3>
          <p className="text-xs text-text-muted mb-3">Upload a screenshot of your payment confirmation to speed up access.</p>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${isDragging ? 'border-brand bg-brand-lighter' : fileName ? 'border-success/50 bg-green-50' : 'border-border hover:border-brand/30 hover:bg-bg-soft'}`}
          >
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
            {fileName ? (
              <div className="flex flex-col items-center gap-2"><Check className="w-6 h-6 text-success" /><p className="text-sm font-medium text-text">{fileName}</p></div>
            ) : (
              <div className="flex flex-col items-center gap-2"><Upload className="w-8 h-8 text-text-muted/40" /><p className="text-sm text-text-secondary">Click to upload or drag and drop</p><p className="text-xs text-text-muted">PNG, JPG, PDF up to 5MB</p></div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted"><Shield className="w-4 h-4" /> Your information is safe and secure.</div>

        <button type="submit" disabled={submitting || !name || !email} className="w-full py-3.5 rounded-xl bg-brand text-white font-heading font-bold text-sm hover:bg-brand-dark transition-colors cursor-pointer disabled:opacity-50 shadow-[0_4px_16px_rgba(233,30,123,0.25)]">
          {submitting ? 'Submitting...' : `Submit Order — ${course.currency}${course.price}`}
        </button>
      </form>
    </div>
  );
}
