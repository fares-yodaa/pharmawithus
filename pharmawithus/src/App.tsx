import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { NavBar } from './components/sections/NavBar';
import { HeroSection } from './components/sections/HeroSection';
import { TrustMarquee } from './components/sections/TrustMarquee';
import { CoursesSection } from './components/sections/CoursesSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { WhatsInsideSection } from './components/sections/WhatsInsideSection';
import { WhyChooseSection } from './components/sections/WhyChooseSection';
import { SocialProofSection } from './components/sections/SocialProofSection';
import { FinalCTASection } from './components/sections/FinalCTASection';
import { FooterSection } from './components/sections/FooterSection';
import { StickyBuyBar } from './components/ui/StickyBuyBar';
import { LandingPageBackground } from './components/ui/LandingPageBackground';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FAQPage } from './pages/FAQPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { UserLayout } from './pages/dashboard/UserLayout';
import { MyCourses } from './pages/dashboard/MyCourses';
import { BrowseCourses } from './pages/dashboard/BrowseCourses';
import { PurchasePage } from './pages/dashboard/PurchasePage';
import { MyOrders } from './pages/dashboard/MyOrders';
import { CourseDetailPage } from './pages/dashboard/CourseDetailPage';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminUsers } from './pages/admin/AdminUsers';

import type { Course } from './data/courses';
import { api } from './lib/api';

function mapCourse(c: Record<string, unknown>): Course {
  return {
    id: String(c.id),
    title: String(c.title),
    subtitle: String(c.subtitle ?? ''),
    description: String(c.description ?? ''),
    price: Number(c.price),
    anchorPrice: c.anchor_price != null ? Number(c.anchor_price) : 0,
    currency: String(c.currency || '£'),
    lessonCount: Number(c.lesson_count ?? 0),
    duration: String(c.duration ?? ''),
    passRate: Number(c.pass_rate ?? 0),
    badge: c.badge != null ? String(c.badge) : undefined,
    features: Array.isArray(c.features) ? (c.features as string[]) : [],
    pictureUrl: c.picture_url != null ? String(c.picture_url) : undefined,
  };
}

function LandingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    setCoursesError(null);
    try {
      let data: Record<string, unknown>[];
      try {
        data = await api.get('/users/courses/top?limit=4', { silent: true });
      } catch {
        const all = await api.get('/users/courses', { silent: true });
        data = [...all]
          .sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0))
          .slice(0, 4);
      }
      const mapped = data.map(mapCourse);
      setCourses(mapped);
      if (mapped.length > 0) setSelectedCourse(mapped[0].id);
    } catch (err) {
      setCoursesError(err instanceof Error ? err.message : 'Failed to load courses');
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > window.innerHeight * 0.55);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const selected = courses.find((c) => c.id === selectedCourse) || null;

  const scrollToCourses = () => {
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBuyClick = (courseId: string) => {
    const id = courseId || selectedCourse;
    if (!id) {
      scrollToCourses();
      return;
    }
    if (user) {
      navigate(`/dashboard/purchase/${id}`);
    } else {
      navigate('/register', { state: { courseId: id } });
    }
  };

  return (
    <div className="relative min-h-screen">
      <LandingPageBackground />
      <div className="relative z-10">
      <NavBar onJoinNow={scrollToCourses} />
      <main>
        <HeroSection onGetAccess={scrollToCourses} />
        <TrustMarquee />
        <CoursesSection
          courses={courses}
          loading={loadingCourses}
          error={coursesError}
          onRetry={loadCourses}
          selectedCourse={selectedCourse}
          onSelectCourse={setSelectedCourse}
          onBuyClick={handleBuyClick}
        />
        <HowItWorksSection />
        <WhatsInsideSection />
        <WhyChooseSection />
        <SocialProofSection />
        <FinalCTASection onGetStarted={scrollToCourses} />
      </main>
      <FooterSection />

      <StickyBuyBar
        visible={showStickyBar}
        selectedCourse={selected}
        onBuyClick={() => selected && handleBuyClick(selected.id)}
      />
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/faq" element={<FAQPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route index element={<MyCourses />} />
        <Route path="browse" element={<BrowseCourses />} />
        <Route path="purchase/:courseId" element={<PurchasePage />} />
        <Route path="course/:courseId" element={<CourseDetailPage />} />
        <Route path="orders" element={<MyOrders />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A1A2E',
              color: '#fff',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
