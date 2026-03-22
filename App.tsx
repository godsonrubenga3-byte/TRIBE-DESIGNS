import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sun, Moon, User as UserIcon, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { Theme, CartItem, Product, UserProfile, Order } from './types';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ShopPage from './pages/ShopPage';
import CustomizerPage from './pages/CustomizerPage';
import CartPage from './pages/CartPage';
import CommunityPage from './pages/CommunityPage';
import SettingsPage from './pages/SettingsPage';
import { supabaseService } from './services/supabaseService';
import { supabase } from './src/utils/supabase/client';

// --- 1. UI CONTEXT (Theme & Notifications) ---
interface UIContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  notify: (msg: string, type?: 'success' | 'error') => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within UIProvider");
  return context;
};

// --- 2. AUTH CONTEXT ---
interface AuthContextType {
  session: any;
  user: UserProfile;
  updateUser: (u: UserProfile) => void;
  signOut: () => void;
  isCommunityMember: boolean;
  joinCommunity: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- 3. CART CONTEXT ---
interface CartContextType {
  cart: CartItem[];
  addToCart: (p: Product, custom?: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (o: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

// --- DEFAULT STATE ---
const defaultUser: UserProfile = {
  name: '', email: '', phone: '',
  address: { street: '', city: '', state: '', zip: '', country: 'India' }
};

// --- COMPOSITE HOOK FOR BACKWARD COMPATIBILITY ---
export const useApp = () => ({
  ...useUI(), ...useAuth(), ...useCart()
});

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // UI State
  const [theme, setTheme] = useState<Theme>(() => (window.localStorage.getItem('tribe-designs-theme') as Theme) || Theme.DARK);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // Auth State
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isCommunityMember, setIsCommunityMember] = useState<boolean>(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = window.localStorage.getItem('tribe-designs-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch { return []; }
  });
  const [orders, setOrders] = useState<Order[]>([]);

  // Effects
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      supabaseService.getProfile().then(profile => {
        if (profile) setUser(profile);
        else setUser({ ...defaultUser, email: session.user.email });
      });
      supabaseService.getOrders().then(data => setOrders(data));
    } else {
      setUser(defaultUser);
      setOrders([]);
    }
  }, [session]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.DARK);
    window.localStorage.setItem('tribe-designs-theme', theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem('tribe-designs-cart', JSON.stringify(cart));
  }, [cart]);

  // Actions
  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const signOut = async () => {
    await supabaseService.signOut();
    setSession(null); setUser(defaultUser); setOrders([]);
    notify("Signed out successfully");
  };

  const updateUser = async (u: UserProfile) => {
    setUser(u);
    if (session) await supabaseService.saveProfile(u);
    notify("Profile updated");
  };

  const generateCartItemId = (p: Product, custom?: any) => {
    if (!custom) return p.id;
    // Deterministic Hashing
    const keys = Object.keys(custom).sort();
    const signature = keys.map(k => `${k}:${custom[k]}`).join('|');
    return `${p.id}-${btoa(signature).slice(0, 10)}`;
  };

  const addToCart = (product: Product, customization?: any) => {
    const customId = generateCartItemId(product, customization);
    setCart(prev => {
      const existing = prev.find(item => item.id === customId || (item.id === product.id && JSON.stringify(item.customization) === JSON.stringify(customization)));
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, id: customId, customization, quantity: 1 }];
    });
    setIsCartOpen(true);
    notify(`${product.name} added to bag`);
  };

  const addOrder = async (orderData: any) => {
    try {
      if (session) {
        const newOrder = await supabaseService.saveOrder(orderData);
        setOrders(prev => [newOrder, ...prev]);
      } else {
        const newOrder = { id: Date.now().toString(), ...orderData, date: new Date().toISOString() };
        setOrders(prev => [newOrder, ...prev]);
      }
      setCart([]);
      notify("Order placed successfully!", "success");
    } catch (err) {
      notify("Failed to place order", "error");
    }
  };

  return (
    <UIContext.Provider value={{ theme, setTheme, isCartOpen, toggleCart: () => setIsCartOpen(!isCartOpen), notify }}>
      <AuthContext.Provider value={{ session, user, updateUser, signOut, isCommunityMember, joinCommunity: () => setIsCommunityMember(true) }}>
        <CartContext.Provider value={{ cart, addToCart, removeFromCart: (id) => setCart(prev => prev.filter(i => i.id !== id)), clearCart: () => setCart([]), orders, addOrder }}>
          {children}
          {/* Global Notification Toast */}
          {notification && (
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 duration-300 ${notification.type === 'success' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-red-500 text-white'}`}>
              {notification.type === 'success' ? <CheckCircle2 size={20} className="text-amber-500" /> : <AlertCircle size={20} />}
              <span className="text-sm font-black uppercase tracking-widest">{notification.msg}</span>
            </div>
          )}
        </CartContext.Provider>
      </AuthContext.Provider>
    </UIContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout />
      </HashRouter>
    </AppProvider>
  );
};

const AppLayout: React.FC = () => {
  const { theme, session } = useApp();
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-amber-400 selection:text-black transition-all duration-500 w-full">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/shop" element={!session ? <Navigate to="/login" replace /> : <ShopPage />} />
          <Route path="/customize" element={!session ? <Navigate to="/login" replace /> : <CustomizerPage />} />
          <Route path="/cart" element={!session ? <Navigate to="/login" replace /> : <CartPage />} />
          <Route path="/community" element={!session ? <Navigate to="/login" replace /> : <CommunityPage />} />
          <Route path="/dashboard" element={!session ? <Navigate to="/login" replace /> : <DashboardPage />} />
          <Route path="/settings" element={!session ? <Navigate to="/login" replace /> : <SettingsPage />} />
        </Routes>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

const Navbar: React.FC = () => {
  const { theme, setTheme, cart, toggleCart, session, signOut } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [{ name: 'SHOP', path: '/shop' }, { name: 'CUSTOMIZE', path: '/customize' }, { name: 'THE VIBE', path: '/dashboard' }];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex flex-col -space-y-1 group">
            <span className="text-xl md:text-2xl font-syne font-black tracking-tighter group-hover:text-amber-500 transition-colors">TRIBE</span>
            <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500">DESIGNS</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`text-xs font-black tracking-widest hover:text-amber-500 transition-colors ${location.pathname === link.path ? 'text-amber-500' : 'text-zinc-500'}`}>{link.name}</Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            {theme === Theme.LIGHT ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          {session ? (
            <>
              <Link to="/settings" className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                <UserIcon size={20} />
              </Link>
              <button onClick={signOut} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </>

          ) : (
            <Link to="/login" className="text-xs font-black tracking-widest px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-transform">LOGIN</Link>
          )}
          <button onClick={toggleCart} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors relative">
            <ShoppingBag size={20} />
            {cart.length > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-black text-[10px] font-black rounded-full flex items-center justify-center">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 animate-in slide-in-from-top duration-300">
           <div className="flex flex-col p-4 gap-4">
             {navLinks.map((link) => (
               <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-black tracking-widest py-2 border-b border-zinc-100 dark:border-zinc-900">{link.name}</Link>
             ))}
           </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-zinc-100 dark:bg-zinc-900 py-16 px-4 border-t border-zinc-200 dark:border-zinc-800">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-zinc-900 dark:text-zinc-50">
      <div className="col-span-2">
        <h2 className="text-3xl font-syne font-black tracking-tighter mb-4 uppercase">Join the Tribe</h2>
        <p className="text-zinc-500 max-w-sm mb-6 text-sm">Be the first to know about new collection drops, limited editions, and community highlights.</p>
        <div className="flex gap-2">
          <input type="email" placeholder="ENTER YOUR EMAIL" className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-xs font-bold w-full max-w-xs focus:ring-2 focus:ring-amber-500 outline-none" />
          <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl text-xs font-black tracking-widest hover:scale-105 transition-transform">JOIN</button>
        </div>
      </div>
      <div>
        <h3 className="text-xs font-black tracking-[0.2em] text-zinc-400 mb-6 uppercase">Collections</h3>
        <ul className="space-y-4 text-sm font-bold">
          <li><Link to="/shop" className="hover:text-amber-500 transition-colors uppercase">Heritage Kits</Link></li>
          <li><Link to="/shop" className="hover:text-amber-500 transition-colors uppercase">Modern Streetwear</Link></li>
          <li><Link to="/customize" className="hover:text-amber-500 transition-colors uppercase">Custom Lab</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-black tracking-[0.2em] text-zinc-400 mb-6 uppercase">Company</h3>
        <ul className="space-y-4 text-sm font-bold">
          <li><a href="#" className="hover:text-amber-500 transition-colors uppercase">About Us</a></li>
          <li><a href="#" className="hover:text-amber-500 transition-colors uppercase">Sustainability</a></li>
          <li><a href="#" className="hover:text-amber-500 transition-colors uppercase">Terms</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-[10px] font-black tracking-widest text-zinc-500 uppercase">
      <span>© 2026 TRIBE DESIGNS. PAN-AFRICAN EXCELLENCE.</span>
      <div className="flex gap-6">
        <a href="#" className="hover:text-amber-500 transition-colors">INSTAGRAM</a>
        <a href="#" className="hover:text-amber-500 transition-colors">TIKTOK</a>
      </div>
    </div>
  </footer>
);

const CartSidebar: React.FC = () => {
  const { cart, removeFromCart, isCartOpen, toggleCart } = useApp();
  const navigate = useNavigate();
  if (!isCartOpen) return null;
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={toggleCart} />
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center text-zinc-900 dark:text-zinc-50">
          <h2 className="text-2xl font-syne font-black tracking-tighter uppercase">Your Bag ({cart.reduce((a,b) => a+b.quantity, 0)})</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingBag size={48} className="text-zinc-200 mb-4" />
              <p className="font-bold text-zinc-500 uppercase tracking-widest">Your bag is empty</p>
              <button onClick={() => { toggleCart(); navigate('/shop'); }} className="mt-6 text-xs font-black tracking-widest px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl uppercase">Start Shopping</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group text-zinc-900 dark:text-zinc-50">
                <div className="w-24 h-32 bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold uppercase text-sm leading-tight mb-1">{item.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.subcategory}</p>
                    {item.customization && <p className="text-[10px] text-amber-500 font-bold uppercase mt-2">Customized Item</p>}
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-syne font-black text-lg">${item.price}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest underline underline-offset-4">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex justify-between items-center mb-6 text-zinc-900 dark:text-zinc-50">
              <span className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase">Total Amount</span>
              <span className="text-3xl font-syne font-black">${total}</span>
            </div>
            <button onClick={() => { toggleCart(); navigate('/cart'); }} className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-syne font-black text-lg tracking-[0.2em] uppercase hover:scale-[1.02] transition-transform shadow-xl">Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
