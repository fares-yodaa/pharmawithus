import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';

export function MyCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.get('/users/my-courses');
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch my courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-1">My Courses</h1>
      <p className="text-sm text-text-muted mb-8">Courses you've purchased and have access to.</p>

      {courses.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 rounded-3xl bg-white border border-border card-shadow">
          <BookOpen className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg text-text mb-2">No courses yet</h3>
          <p className="text-sm text-text-muted mb-6">Browse our courses and start your journey to passing your exams.</p>
          <Link to="/dashboard/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand text-white font-heading font-bold text-sm hover:bg-brand-dark transition-colors">
            Browse Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl bg-white border border-border p-5 card-shadow hover:card-shadow-hover transition-shadow">
              <div className="w-full h-32 rounded-xl bg-bg-soft flex items-center justify-center mb-4 overflow-hidden border border-border">
                {c.picture_url ? (
                  <img src={c.picture_url} alt={c.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-6 h-6 text-brand" />
                )}
              </div>
              <h3 className="font-heading font-bold text-base text-text mb-1">{c.title}</h3>
              <p className="text-xs text-text-muted mb-3">{c.subtitle}</p>
              <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {c.lesson_count} lessons</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">Active</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
