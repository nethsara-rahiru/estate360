import { Trees, User, LogOut, LayoutDashboard, Home, UserPlus } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar({ currentView, setView, user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D7E6DD] bg-[#F8F9FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand: Just "Estate 360" */}
        <button
          onClick={() => setView(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 bg-[#1F3D2C] flex items-center justify-center text-white">
            <Trees className="w-4 h-4 text-[#D7E6DD]" />
          </div>
          <div>
            <span className="font-bold text-lg text-[#1F3D2C] tracking-tight">
              Estate 360
            </span>
            <p className="text-[11px] text-[#4B5563] -mt-0.5 hidden sm:block">
              Plantation Management
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#4B5563]">
          <button
            onClick={() => setView('landing')}
            className={`hover:text-[#1F3D2C] transition-colors cursor-pointer ${
              currentView === 'landing' ? 'text-[#1F3D2C] font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <a
            href="#features"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                setView('landing');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#1F3D2C] transition-colors cursor-pointer"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                setView('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#1F3D2C] transition-colors cursor-pointer"
          >
            How It Works
          </a>
        </nav>

        {/* User / Auth Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-xs font-semibold text-[#1F3D2C]">
                  {user.name || user.email}
                </span>
                <span className="text-[10px] text-[#8C6239] uppercase font-bold tracking-wider">
                  Owner
                </span>
              </div>
              {currentView !== 'dashboard' ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setView('dashboard')}
                  className="gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setView('landing')}
                  className="gap-1.5"
                >
                  <Home className="w-3.5 h-3.5" />
                  Home
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={onLogout}
                className="text-[#8C6239] hover:bg-[#D7E6DD]/40 gap-1.5"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant={currentView === 'login' ? 'secondary' : 'outline'}
                onClick={() => setView('login')}
                className="gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Owner Login
              </Button>
              <Button
                size="sm"
                variant={currentView === 'register' ? 'secondary' : 'default'}
                onClick={() => setView('register')}
                className="bg-[#1F3D2C] hover:bg-[#162D20] gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Owner Registration
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
