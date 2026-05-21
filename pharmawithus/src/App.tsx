import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Landing page sections
import { NavBar } from './components/sections/NavBar';
import { HeroSection } from './components/sections/HeroSection';
import { CoursesSection } from './components/sections/CoursesSection';
import { WhatsInsideSection } from './components/sections/WhatsInsideSection';
import { WhyChooseSection } from './components/sections/WhyChooseSection';
import { SocialProofSection } from './components/sections/SocialProofSection';
import { UrgencySection } from './components/sections/UrgencySection';
import { InstagramCTA } from './components/sections/InstagramCTA';
import { FooterSection } from './components/sections/FooterSection';
import { LiveActivityFeed } from './components/ui/LiveActivityFeed';
import { StickyBuyBar } from './components/ui/StickyBuyBar';
import { PaymentModal } from './components/ui/PaymentModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FAQPage } from './pages/FAQPage';

// User Dashboard
import { UserLayout } from './pages/dashboard/UserLayout';
import { MyCourses } from './pages/dashboard/MyCourses';
import { BrowseCourses } from './pages/dashboard/BrowseCourses';
import { PurchasePage } from './pages/dashboard/PurchasePage';
import { MyOrders } from './pages/dashboard/MyOrders';

// Admin Dashboard
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminUsers } from './pages/admin/AdminUsers';

import type { Course } from './data/courses';
import { api } from './lib/api';

function LandingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('pre-reg');
  const [showPayment, setShowPayment] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        const data = await api.get('/users/courses/top?limit=4');
        const mapped = data.map((c: any) => ({
          id: c.id,
          title: c.title,
          subtitle: c.subtitle,
          description: c.description,
          price: c.price,
          anchorPrice: c.anchor_price,
          currency: c.currency || '£',
          lessonCount: c.lesson_count,
          duration: c.duration,
          passRate: c.pass_rate,
          badge: c.badge,
          features: c.features || [],
          pictureUrl: c.picture_url,
        }));
        setCourses(mapped);
        if (mapped.length > 0) {
          setSelectedCourse(mapped[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch top courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchTopCourses();
  }, []);

  const selected = courses.find((c) => c.id === selectedCourse) || null;

  const scrollToCourses = () => {
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBuyClick = () => {
    if (user) {
      // Logged in → go to dashboard purchase flow
      navigate('/dashboard/browse');
    } else {
      // Not logged in → redirect directly to signup
      navigate('/register');
    }
  };

  return (
    <>
      <NavBar onJoinNow={scrollToCourses} />
      <HeroSection onGetAccess={scrollToCourses} />
      <CoursesSection courses={courses} loading={loadingCourses} selectedCourse={selectedCourse} onSelectCourse={setSelectedCourse} onBuyClick={handleBuyClick} />
      <WhatsInsideSection />
      <WhyChooseSection />
      <UrgencySection onBuyClick={handleBuyClick} />
      <SocialProofSection />
      <InstagramCTA />
      <FooterSection />

      <LiveActivityFeed />
      <StickyBuyBar visible={showStickyBar} selectedCourse={selected} onBuyClick={handleBuyClick} />
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} course={selected} />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/faq" element={<FAQPage />} />

      {/* User Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route index element={<MyCourses />} />
        <Route path="browse" element={<BrowseCourses />} />
        <Route path="purchase/:courseId" element={<PurchasePage />} />
        <Route path="orders" element={<MyOrders />} />
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
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
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
