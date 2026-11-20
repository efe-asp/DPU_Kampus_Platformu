import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
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

export default function App() {
  const { isAuthenticated, isEnteringPortal, isExitingPortal } = useAuth();

  return (
    <>
      <AnimatePresence>
        {isEnteringPortal && <PortalSplashOverlay key="portal-splash" />}
        {isExitingPortal && <ExitSplashOverlay key="exit-splash" />}
      </AnimatePresence>

      {!isAuthenticated ? (
        <AuthPage />
      ) : (
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="pazar" element={<PazarPage />} />
            <Route path="topluluklar" element={<ToplulukPage />} />
            <Route path="kayip-buluntu" element={<KayipBuluntuPage />} />
            <Route path="notlar" element={<NotlarPage />} />
            <Route path="radar" element={<RadarPage />} />
            <Route path="forum" element={<ForumPage />} />
            <Route path="profil" element={<ProfilPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
