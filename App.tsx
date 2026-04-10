import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  ShieldAlert
} from 'lucide-react';
import { Theme } from './types';
import { db, auth, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Dashboard from './pages/admin/Dashboard';
import Settings from './pages/admin/Settings';
import LoginPage from './pages/admin/LoginPage';
import ErrorBoundary from './components/ErrorBoundary';
import { cn } from './lib/utils';

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  user: User | null;
  isAdmin: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const ADMIN_EMAIL = "godsonrubenga3@gmail.com";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = window.localStorage.getItem('tribe-admin-theme');
      return (savedTheme as Theme) || Theme.DARK;
    } catch {
      return Theme.DARK;
    }
  });
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem('tribe-admin-theme', theme);
  }, [theme]);

  const isAdmin = user?.email === ADMIN_EMAIL;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AppContext.Provider value={{ theme, setTheme, user, isAdmin }}>
        <HashRouter>
          {!user ? (
            <LoginPage />
          ) : !isAdmin ? (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center space-y-8 shadow-2xl">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert size={40} />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold uppercase">Access Denied</h1>
                  <p className="text-zinc-500 text-sm">Your account ({user.email}) is not authorized to access the Tribe Designs Command Center.</p>
                </div>
                <button 
                  onClick={() => logout()}
                  className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-amber-500 transition-all"
                >
                  SIGN OUT
                </button>
              </div>
            </div>
          ) : (
            <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-all duration-500 flex flex-col md:flex-row">
              <Sidebar />
              <main className="flex-1 p-6 md:p-12 md:ml-64">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          )}
        </HashRouter>
      </AppContext.Provider>
    </ErrorBoundary>
  );
};

const Sidebar = () => {
  const { theme, setTheme, user } = useApp();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'DASHBOARD', path: '/', icon: LayoutDashboard },
    { name: 'SETTINGS', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-[60] p-3 bg-amber-500 text-black rounded-full shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transition-transform duration-500 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center gap-3 mb-12">
            <img src="./dark.png" alt="Logo" className="w-10 h-10" />
            <div className="font-poppins">
              <h2 className="font-bold text-sm tracking-widest text-white">TRIBE ADMIN</h2>
              <p className="text-[10px] text-zinc-500 font-black tracking-[0.3em] uppercase">Command Center</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all",
                  location.pathname === item.path 
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                    : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                )}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="pt-8 border-t border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}
                className="p-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-all"
              >
                {theme === Theme.LIGHT ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button 
                onClick={() => logout()}
                className="p-3 rounded-xl bg-zinc-800 text-red-500 hover:bg-red-500/10 transition-all"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black text-[10px] font-black">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-white truncate">{user?.displayName || 'Admin'}</p>
                <p className="text-[8px] text-zinc-500 truncate uppercase tracking-widest">Authorized</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default App;
