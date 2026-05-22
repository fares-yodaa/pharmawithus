import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Upload, MessageCircle, ArrowRight, Shield, User, Mail, Phone, ChevronRight, CheckCircle, Video, FileText, HelpCircle } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { BrandLogo } from '../auth/BrandLogo';
import { LOGO_SRC } from '../../lib/brand';
import type { Course } from '../../data/courses';

interface PaymentModalProps { isOpen: boolean; onClose: () => void; course: Course | null; }
type Step = 'review' | 'payment' | 'confirm' | 'success';

export function PaymentModal({ isOpen, onClose, course }: PaymentModalProps) {
  const [step, setStep] = useState<Step>('review');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setFileName(f.name); }, []);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) setFileName(f.name); }, []);
  const handleClose = () => { setStep('review'); setFileName(null); setFormData({ name: '', email: '', phone: '' }); onClose(); };

  if (!course) return null;

  const steps = [{ key: 'review', label: 'Review', num: 1 }, { key: 'payment', label: 'Payment', num: 2 }, { key: 'confirm', label: 'Confirm', num: 3 }];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[101] mx-auto max-w-lg rounded-3xl bg-white border border-border overflow-hidden shadow-2xl md:inset-x-auto" id="payment-modal">
            {/* Header */}
            <div className="relative px-6 pt-5 pb-4 border-b border-border bg-bg-soft">
              <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:text-text transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
              <BrandLogo size="sm" linkToHome={false} />
            </div>
            {/* Progress */}
            <div className="px-6 py-3 flex items-center justify-between border-b border-border">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= currentStepIndex ? 'bg-brand text-white' : 'bg-bg-muted text-text-muted'}`}>{i < currentStepIndex ? <Check className="w-3 h-3" /> : s.num}</div>
                  <span className={`ml-1.5 text-[11px] font-medium hidden sm:inline ${i <= currentStepIndex ? 'text-brand' : 'text-text-muted'}`}>{s.label}</span>
                  {i < 2 && <ChevronRight className="w-3.5 h-3.5 text-text-muted mx-1.5" />}
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 pt-4 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === 'review' && (
                  <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="font-heading font-bold text-xl text-text mb-4">Review Your Order</h3>
                    <div className="rounded-2xl border border-border p-4 mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-brand-lighter flex items-center justify-center shrink-0 p-1.5">
                          <img src={LOGO_SRC} alt="" className="h-full w-full object-contain" />
                        </div>
                        <div className="flex-1"><h4 className="font-heading font-bold text-text">{course.title}</h4><p className="text-xs text-text-muted mt-1">{course.subtitle}</p></div>
                        <div className="text-right shrink-0"><p className="font-heading font-extrabold text-xl text-brand">{course.currency}{course.price}</p><p className="text-xs text-text-muted">One-time</p></div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border space-y-2">{course.features.slice(0, 4).map((f, i) => (<div key={i} className="flex items-center gap-2 text-sm text-text-secondary"><Check className="w-3.5 h-3.5 text-brand shrink-0" />{f}</div>))}</div>
                    </div>
                    <p className="font-heading font-semibold text-sm text-text mb-3">What's Included</p>
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {[{ icon: <Video className="w-4 h-4 text-brand" />, label: 'Live Sessions' }, { icon: <FileText className="w-4 h-4 text-brand" />, label: 'Notes & Materials' }, { icon: <HelpCircle className="w-4 h-4 text-brand" />, label: 'Quizzes & Exam Prep' }, { icon: <CheckCircle className="w-4 h-4 text-brand" />, label: 'Session Recordings' }].map((item) => (
                        <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-bg-soft text-xs font-medium text-text">{item.icon}{item.label}</div>
                      ))}
                    </div>
                    <GlowButton onClick={() => setStep('payment')} className="w-full">Continue to Payment <ArrowRight className="w-4 h-4" /></GlowButton>
                  </motion.div>
                )}
                {step === 'payment' && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="font-heading font-bold text-xl text-text mb-2">Secure Payment</h3>
                    <p className="text-sm text-text-muted mb-5">Pay via bank transfer using your name.</p>
                    <div className="rounded-2xl border border-border p-4 mb-5 bg-bg-soft">
                      <p className="text-xs font-heading font-semibold text-text mb-3">How it works</p>
                      <div className="flex items-start justify-between gap-1">
                        {[{ num: '1', label: 'Click Pay Now' }, { num: '2', label: 'Enter your name' }, { num: '3', label: 'Complete payment' }, { num: '4', label: 'Get access' }].map((s, i) => (
                          <div key={i} className="flex-1 text-center"><div className="w-7 h-7 mx-auto mb-1 rounded-full bg-brand-lighter text-brand text-[10px] font-bold flex items-center justify-center">{s.num}</div><p className="text-[10px] text-text-muted leading-tight">{s.label}</p></div>
                        ))}
                      </div>
                    </div>
                    <GlowButton onClick={() => setStep('confirm')} className="w-full" size="lg">PAY NOW — {course.currency}{course.price}</GlowButton>
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs text-text-muted"><span>No card required</span><span>·</span><span>Fast and secure</span></div>
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-text-muted"><Shield className="w-3.5 h-3.5" /><span>Your information is safe and protected.</span></div>
                  </motion.div>
                )}
                {step === 'confirm' && (
                  <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="font-heading font-bold text-xl text-text mb-2">Confirm Your Payment</h3>
                    <p className="text-sm text-text-muted mb-4">Please fill in your details after completing payment.</p>
                    <div className="space-y-3 mb-4">
                      <div><label className="text-xs font-semibold text-text mb-1 block">Full Name *</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" /><input type="text" placeholder="Enter your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20" /></div></div>
                      <div><label className="text-xs font-semibold text-text mb-1 block">Email Address *</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" /><input type="email" placeholder="example@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20" /></div></div>
                      <div><label className="text-xs font-semibold text-text mb-1 block">Phone (WhatsApp)</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" /><input type="tel" placeholder="07XXXXXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20" /></div></div>
                    </div>
                    <label className="text-xs font-semibold text-text mb-1 block">Upload Payment Screenshot</label>
                    <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center mb-4 ${isDragging ? 'border-brand bg-brand-lighter' : fileName ? 'border-success/50 bg-green-50' : 'border-border hover:border-brand/30'}`}>
                      <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                      {fileName ? <div className="flex flex-col items-center gap-1"><Check className="w-5 h-5 text-success" /><p className="text-sm font-medium text-text">{fileName}</p></div> : <div className="flex flex-col items-center gap-1"><Upload className="w-5 h-5 text-text-muted" /><p className="text-sm text-text-secondary">Click to upload or drag and drop</p><p className="text-xs text-text-muted">PNG, JPG up to 5MB</p></div>}
                    </div>
                    <GlowButton onClick={() => setStep('success')} className="w-full" disabled={!formData.name || !formData.email}>Submit Confirmation <ArrowRight className="w-4 h-4" /></GlowButton>
                    <a href="https://wa.me/44XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 mt-3 rounded-xl border border-border text-sm text-text-secondary hover:text-brand hover:border-brand/30 transition-all"><MessageCircle className="w-4 h-4" /> Need help? Message us on Instagram</a>
                  </motion.div>
                )}
                {step === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="text-center py-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }} className="w-16 h-16 mx-auto mb-5 rounded-full bg-success/10 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-success" /></motion.div>
                    <h3 className="font-heading font-bold text-2xl text-text mb-2">You're All Set!</h3>
                    <p className="text-text-secondary text-sm mb-6">Your payment is confirmed and you now have full access to your course.</p>
                    <div className="text-left space-y-2.5 p-4 rounded-2xl bg-bg-soft border border-border mb-6">
                      <p className="text-xs font-heading font-semibold text-text uppercase tracking-wider">Your Access Includes</p>
                      {[{ icon: <Video className="w-4 h-4 text-brand" />, text: 'Zoom link for live sessions' }, { icon: <FileText className="w-4 h-4 text-brand" />, text: 'Course materials' }, { icon: <CheckCircle className="w-4 h-4 text-brand" />, text: 'Recordings' }, { icon: <MessageCircle className="w-4 h-4 text-brand" />, text: 'Community support' }].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-2.5 text-sm text-text-secondary">{item.icon}{item.text}</motion.div>
                      ))}
                    </div>
                    <GlowButton onClick={handleClose} className="w-full">Done</GlowButton>
                    <p className="text-xs text-text-muted mt-3">Check your email for all details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
