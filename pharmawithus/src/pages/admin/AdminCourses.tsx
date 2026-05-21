import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  anchor_price: number | null;
  currency: string;
  lesson_count: number;
  duration: string | null;
  pass_rate: number | null;
  badge: string | null;
  features: string[];
  picture_url: string | null;
  is_active: boolean;
  created_at: string;
}

const emptyCourse = { title: '', subtitle: '', description: '', price: 0, anchor_price: 0, currency: '£', lesson_count: 0, duration: '', pass_rate: 0, badge: null, features: [], is_active: true, picture_url: null };

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<any>(emptyCourse);
  const [featuresStr, setFeaturesStr] = useState('');
  const [saving, setSaving] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  // Lessons Modal State
  const [lessonsModalOpen, setLessonsModalOpen] = useState(false);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<Course | null>(null);
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: '', order_index: 0 });
  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [lessonUploading, setLessonUploading] = useState(false);

  const fetchCourses = async () => {
    try {
      const data = await api.get('/admin/courses');
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCourse);
    setFeaturesStr('');
    setPictureFile(null);
    setPicturePreview(null);
    setModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({
      title: c.title,
      subtitle: c.subtitle || '',
      description: c.description || '',
      price: c.price,
      anchor_price: c.anchor_price || 0,
      currency: c.currency,
      lesson_count: c.lesson_count,
      duration: c.duration || '',
      pass_rate: c.pass_rate || 0,
      badge: c.badge || null,
      features: c.features,
      is_active: c.is_active
    });
    setFeaturesStr((c.features || []).join('\n'));
    setPictureFile(null);
    setPicturePreview(c.picture_url || null);
    setModalOpen(true);
  };

  const handleUploadImage = async (courseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.postForm(`/admin/courses/${courseId}/picture`, formData);
      toast.success('Image uploaded successfully!');
      fetchCourses();
    } catch (err) {
      console.error('Failed to upload image:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      features: featuresStr.split('\n').map((f) => f.trim()).filter(Boolean),
      badge: form.badge || null,
      subtitle: form.subtitle || null,
      description: form.description || null,
      duration: form.duration || null,
      pass_rate: form.pass_rate || null,
      anchor_price: form.anchor_price || null
    };

    try {
      if (editing) {
        await api.put(`/admin/courses/${editing.id}`, payload);
        if (pictureFile) {
          const fd = new FormData();
          fd.append('file', pictureFile);
          await api.postForm(`/admin/courses/${editing.id}/picture`, fd);
        }
        toast.success('Course updated successfully!');
      } else {
        const created = await api.post('/admin/courses', payload);
        if (pictureFile && created?.id) {
          const fd = new FormData();
          fd.append('file', pictureFile);
          await api.postForm(`/admin/courses/${created.id}/picture`, fd);
        }
        toast.success('Course created successfully!');
      }
      setModalOpen(false);
      setPictureFile(null);
      setPicturePreview(null);
      fetchCourses();
    } catch (err) {
      console.error('Failed to save course:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success('Course deleted!');
      fetchCourses();
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  const toggleActive = async (c: Course) => {
    try {
      const payload = { ...c, is_active: !c.is_active };
      // Backend expects full CourseCreate object for PUT
      await api.put(`/admin/courses/${c.id}`, payload);
      toast.success(`Course ${!c.is_active ? 'activated' : 'deactivated'}!`);
      fetchCourses();
    } catch (err) {
      console.error('Failed to toggle active status:', err);
    }
  };

  const openLessons = async (c: Course) => {
    setSelectedCourseForLessons(c);
    setLessonsModalOpen(true);
    setLessonsLoading(true);
    try {
      const data = await api.get(`/admin/courses/${c.id}/lessons`);
      setCourseLessons(data);
      setLessonForm({ title: '', order_index: data.length });
    } catch (err) {
      console.error('Failed to fetch lessons:', err);
    } finally {
      setLessonsLoading(false);
    }
  };

  const handleUploadLesson = async () => {
    if (!selectedCourseForLessons || !lessonForm.title || !lessonFile) return;
    setLessonUploading(true);
    const formData = new FormData();
    formData.append('title', lessonForm.title);
    formData.append('order_index', lessonForm.order_index.toString());
    formData.append('file', lessonFile);

    try {
      await api.postForm(`/admin/courses/${selectedCourseForLessons.id}/lessons`, formData);
      toast.success('Lesson uploaded successfully!');
      setLessonFile(null);

      const data = await api.get(`/admin/courses/${selectedCourseForLessons.id}/lessons`);
      setCourseLessons(data);
      setLessonForm({ title: '', order_index: data.length });
      fetchCourses();
    } catch (err) {
      console.error('Failed to upload lesson:', err);
    } finally {
      setLessonUploading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await api.delete(`/admin/lessons/${lessonId}`);
      toast.success('Lesson deleted!');
      if (selectedCourseForLessons) {
        const data = await api.get(`/admin/courses/${selectedCourseForLessons.id}/lessons`);
        setCourseLessons(data);
        fetchCourses();
      }
    } catch (err) {
      console.error('Failed to delete lesson:', err);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text mb-1">Courses</h1>
          <p className="text-sm text-text-muted">Manage your course catalog.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-heading font-bold text-sm hover:bg-brand-dark transition-colors cursor-pointer"><Plus className="w-4 h-4" /> Add Course</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`rounded-2xl bg-white border border-border p-5 card-shadow ${!c.is_active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading font-bold text-base text-text">{c.title}</h3>
                  {c.badge && <span className="px-2 py-0.5 rounded-full bg-brand text-white text-[9px] font-bold uppercase">{c.badge}</span>}
                </div>
                <p className="text-xs text-text-muted">{c.subtitle}</p>
                {c.picture_url && (
                  <img src={c.picture_url} alt="" className="w-full h-32 object-cover rounded-xl mt-3" />
                )}
                {!c.picture_url && (
                  <div className="w-full h-32 bg-bg-soft rounded-xl mt-3 flex items-center justify-center border-2 border-dashed border-border group relative overflow-hidden">
                    <span className="text-[10px] text-text-muted">No Image</span>
                    <input type="file" onChange={(e) => handleUploadImage(c.id, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                )}
                {c.picture_url && (
                  <div className="mt-2 relative">
                    <label className="text-[10px] text-brand font-bold cursor-pointer hover:underline">
                      Change Image
                      <input type="file" onChange={(e) => handleUploadImage(c.id, e)} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="font-heading font-extrabold text-lg text-text">{c.currency}{c.price}</p>
                {c.anchor_price && <p className="text-xs text-text-muted line-through">{c.currency}{c.anchor_price}</p>}
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-3 line-clamp-2">{c.description}</p>
            <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
              <span>{c.lesson_count} lessons</span>
              <span>{c.duration}</span>
              <span>{c.pass_rate}% pass rate</span>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <button onClick={() => toggleActive(c)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer bg-transparent border-none text-text-secondary hover:text-brand transition-colors">
                {c.is_active ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4 text-text-muted" />}
                {c.is_active ? 'Active' : 'Inactive'}
              </button>
              <div className="ml-auto flex gap-1.5">
                <button onClick={() => openLessons(c)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer bg-transparent border-none"><Video className="w-3.5 h-3.5" /> Lessons</button>
                <button onClick={() => openEdit(c)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-brand hover:bg-brand-lighter transition-colors cursor-pointer bg-transparent border-none"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => handleDelete(c.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course form modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none">
              <div className="w-full max-w-lg max-h-[88vh] overflow-y-auto custom-scrollbar rounded-3xl bg-white border border-border p-6 shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading font-bold text-lg text-text">{editing ? 'Edit Course' : 'Add Course'}</h3>
                  <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:text-text cursor-pointer border-none"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  <div><label className="text-xs font-semibold text-text mb-1 block">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text focus:outline-none focus:border-brand" /></div>
                  <div><label className="text-xs font-semibold text-text mb-1 block">Subtitle</label><input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text focus:outline-none focus:border-brand" /></div>
                  <div><label className="text-xs font-semibold text-text mb-1 block">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text resize-none focus:outline-none focus:border-brand" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-semibold text-text mb-1 block">Price *</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text focus:outline-none focus:border-brand" /></div>
                    <div><label className="text-xs font-semibold text-text mb-1 block">Original Price</label><input type="number" value={form.anchor_price} onChange={(e) => setForm({ ...form, anchor_price: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text focus:outline-none focus:border-brand" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="text-xs font-semibold text-text mb-1 block">Lessons</label><input type="number" value={form.lesson_count} onChange={(e) => setForm({ ...form, lesson_count: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text focus:outline-none focus:border-brand" /></div>
                    <div><label className="text-xs font-semibold text-text mb-1 block">Duration</label><input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 12 hours" className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text focus:outline-none focus:border-brand" /></div>
                    <div><label className="text-xs font-semibold text-text mb-1 block">Pass Rate %</label><input type="number" value={form.pass_rate} onChange={(e) => setForm({ ...form, pass_rate: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text focus:outline-none focus:border-brand" /></div>
                  </div>
                  <div><label className="text-xs font-semibold text-text mb-1 block">Badge (optional)</label><input value={form.badge || ''} onChange={(e) => setForm({ ...form, badge: e.target.value || null })} placeholder="e.g. Most Popular" className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text focus:outline-none focus:border-brand" /></div>
                  <div><label className="text-xs font-semibold text-text mb-1 block">Features (one per line)</label><textarea value={featuresStr} onChange={(e) => setFeaturesStr(e.target.value)} rows={4} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-soft text-sm text-text resize-none focus:outline-none focus:border-brand" /></div>
                  <div>
                    <label className="text-xs font-semibold text-text mb-1.5 block">Course Image</label>
                    {picturePreview && (
                      <img src={picturePreview} alt="Preview" className="w-full h-36 object-cover rounded-xl border border-border mb-2" />
                    )}
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-border bg-bg-soft text-sm text-text-muted hover:border-brand hover:text-brand transition-colors cursor-pointer">
                      {pictureFile ? pictureFile.name : (picturePreview ? 'Click to change image' : 'Click to upload a course image')}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setPictureFile(f); setPicturePreview(URL.createObjectURL(f)); }
                      }} />
                    </label>
                  </div>
                  <button onClick={handleSave} disabled={saving || !form.title || !form.price} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-colors cursor-pointer disabled:opacity-50"><Check className="w-4 h-4" /> {saving ? 'Saving...' : editing ? 'Update Course' : 'Create Course'}</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lessons Modal */}
      <AnimatePresence>
        {lessonsModalOpen && selectedCourseForLessons && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLessonsModalOpen(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none">
              <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-border p-6 shadow-2xl pointer-events-auto">

                <div className="flex items-center justify-between mb-5 shrink-0">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-text">Manage Lessons</h3>
                    <p className="text-sm text-text-muted">{selectedCourseForLessons.title}</p>
                  </div>
                  <button onClick={() => setLessonsModalOpen(false)} className="w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:text-text cursor-pointer border-none"><X className="w-4 h-4" /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">

                  {/* Existing Lessons */}
                  <div>
                    <h4 className="font-heading font-bold text-sm text-text mb-3">Existing Lessons</h4>
                    {lessonsLoading ? (
                      <div className="flex items-center justify-center py-10"><div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>
                    ) : courseLessons.length === 0 ? (
                      <div className="p-5 text-center bg-bg-soft rounded-xl border border-border text-sm text-text-muted">No lessons uploaded yet.</div>
                    ) : (
                      <div className="space-y-2">
                        {courseLessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-border rounded-xl">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded bg-bg-muted flex items-center justify-center text-xs font-bold text-text-secondary">{lesson.order_index}</span>
                              <span className="text-sm font-medium text-text">{lesson.title}</span>
                            </div>
                            <button onClick={() => handleDeleteLesson(lesson.id)} className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upload New Lesson */}
                  <div className="bg-bg-soft rounded-2xl p-5 border border-border">
                    <h4 className="font-heading font-bold text-sm text-text mb-3">Upload New Lesson</h4>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-text mb-1 block">Lesson Title</label>
                          <input value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="e.g. Introduction" className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm text-text focus:outline-none focus:border-brand" />
                        </div>
                        <div className="w-24">
                          <label className="text-xs font-semibold text-text mb-1 block">Order</label>
                          <input type="number" value={lessonForm.order_index} onChange={(e) => setLessonForm({ ...lessonForm, order_index: Number(e.target.value) })} className="w-full px-4 py-2 rounded-xl border border-border bg-white text-sm text-text focus:outline-none focus:border-brand" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-text mb-1 block">Video File</label>
                        <input type="file" accept="video/*" onChange={(e) => setLessonFile(e.target.files?.[0] || null)} className="w-full text-sm text-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-lighter file:text-brand hover:file:bg-brand-light cursor-pointer" />
                      </div>
                      <button onClick={handleUploadLesson} disabled={lessonUploading || !lessonForm.title || !lessonFile} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-colors cursor-pointer disabled:opacity-50 mt-2">
                        {lessonUploading ? 'Uploading...' : 'Upload Lesson'}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
