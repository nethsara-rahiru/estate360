import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/landing/Hero';
import { Features } from './components/landing/Features';
import { HowItWorks } from './components/landing/HowItWorks';
import { Footer } from './components/landing/Footer';
import { OwnerLogin } from './components/auth/OwnerLogin';
import { OwnerRegister } from './components/auth/OwnerRegister';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { getStoredAuth, clearStoredAuth, fetchProfile } from './api/auth';

export default function App() {
  const [currentView, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore stored session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const stored = getStoredAuth();
        if (stored && stored.accessToken) {
          if (stored.user) {
            setUser(stored.user);
          }
          try {
            const profile = await fetchProfile(stored.accessToken);
            if (profile) {
              setUser(profile);
            }
          } catch {
            clearStoredAuth();
            setUser(null);
          }
        }
      } catch {
        clearStoredAuth();
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  const handleLoginSuccess = (profile) => {
    setUser(profile);
    setView('dashboard');
  };

  const handleRegisterSuccess = (profile) => {
    setUser(profile);
    setView('dashboard');
  };

  const handleLogout = () => {
    clearStoredAuth();
    setUser(null);
    setView('landing');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#1F3D2C] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#4B5563] font-medium">Loading Estate 360...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1F2937]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setView={setView}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <>
            <Hero setView={setView} />
            <Features />
            <HowItWorks setView={setView} />
            <Footer setView={setView} />
          </>
        )}

        {currentView === 'login' && (
          <OwnerLogin
            setView={setView}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentView === 'register' && (
          <OwnerRegister
            setView={setView}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}

        {currentView === 'dashboard' && (
          <OwnerDashboard
            user={user}
            onLogout={handleLogout}
            setView={setView}
          />
        )}
      </main>
    </div>
  );
}
