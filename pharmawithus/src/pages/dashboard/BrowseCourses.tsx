import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export function BrowseCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.get('/users/courses');
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text mb-1">Browse Courses</h1>
          <p className="text-sm text-text-muted">Explore our professional pharmacy courses.</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 rounded-3xl bg-white border border-border card-shadow">
          <BookOpen className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg text-text mb-2">No courses available</h3>
          <p className="text-sm text-text-muted">New courses are coming soon. Check back later!</p>
        </motion.div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-3xl bg-white border border-border p-6 card-shadow hover:card-shadow-hover transition-all"
          >
            {c.badge && (
              <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-brand text-white text-[10px] font-bold uppercase tracking-wider">
                {c.badge}
              </span>
            )}
            <div className="w-full h-48 rounded-2xl bg-bg-soft flex items-center justify-center mb-5 group-hover:scale-[1.02] transition-transform duration-300 overflow-hidden border border-border">
              {c.picture_url ? (
                <img src={c.picture_url} alt={c.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-10 h-10 text-brand" />
              )}
            </div>
            <h3 className="font-heading font-bold text-lg text-text mb-1">{c.title}</h3>
            <p className="text-sm text-text-muted mb-4">{c.subtitle}</p>
            <p className="text-sm text-text-secondary line-clamp-2 mb-6">{c.description}</p>
            
            <div className="space-y-3 mb-6">
              {c.duration && (
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Clock className="w-3.5 h-3.5 text-brand" /> {c.duration}
              </div>
              )}
              {c.pass_rate != null && (
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-brand" /> {c.pass_rate}% Pass Rate
              </div>
              )}
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Star className="w-3.5 h-3.5 text-brand" /> {c.lesson_count} Professional Lessons
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-border">
              <div className="flex flex-col">
                {c.anchor_price && <span className="text-xs text-text-muted line-through">{c.currency}{c.anchor_price}</span>}
                <span className="font-heading font-extrabold text-xl text-brand">{c.currency}{c.price}</span>
              </div>
              <Link
                to={`/dashboard/purchase/${c.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-text text-white font-heading font-bold text-xs hover:bg-brand transition-colors"
              >
                Enroll Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      )}
    </div>
  );
}
