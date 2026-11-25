import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import EDevletAuthPage from './pages/EDevletAuthPage';
import AppShell from './components/AppShell';
import HomePage from './pages/HomePage';
import PazarPage from './pages/PazarPage';
import ToplulukPage from './pages/ToplulukPage';
import KayipBuluntuPage from './pages/KayipBuluntuPage';
import NotlarPage from './pages/NotlarPage';
import RadarPage from './pages/RadarPage';
import ProfilPage from './pages/ProfilPage';
import ForumPage from './pages/ForumPage';
import PortalSplashOverlay from './components/PortalSplashOverlay';
import ExitSplashOverlay from './components/ExitSplashOverlay';
import GuestLockModal from './components/GuestLockModal';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setGuestLockModalOpen } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setGuestLockModalOpen(true);
    }
  }, [isAuthenticated, setGuestLockModalOpen]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, isEnteringPortal, isExitingPortal } = useAuth();

  return (
    <>
      <AnimatePresence>
        {isEnteringPortal && <PortalSplashOverlay key="portal-splash" />}
        {isExitingPortal && <ExitSplashOverlay key="exit-splash" />}
      </AnimatePresence>

      <GuestLockModal />

      <Routes>
        {/* Full-screen split video Login/Register page */}
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
        />

        {/* Full-page e-Devlet Identity Verification screen */}
        <Route
          path="/edevlet-giris"
          element={isAuthenticated ? <Navigate to="/" replace /> : <EDevletAuthPage />}
        />

        {/* Public Guest Landing & Authenticated App Shell */}
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route
            path="pazar"
            element={
              <ProtectedRoute>
                <PazarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="topluluklar"
            element={
              <ProtectedRoute>
                <ToplulukPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="kayip-buluntu"
            element={
              <ProtectedRoute>
                <KayipBuluntuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="notlar"
            element={
              <ProtectedRoute>
                <NotlarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="radar"
            element={
              <ProtectedRoute>
                <RadarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="forum"
            element={
              <ProtectedRoute>
                <ForumPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profil"
            element={
              <ProtectedRoute>
                <ProfilPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
