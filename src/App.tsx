import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="pazar" element={<PazarPage />} />
        <Route path="topluluklar" element={<ToplulukPage />} />
        <Route path="kayip-buluntu" element={<KayipBuluntuPage />} />
        <Route path="notlar" element={<NotlarPage />} />
        <Route path="radar" element={<RadarPage />} />
        <Route path="profil" element={<ProfilPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
