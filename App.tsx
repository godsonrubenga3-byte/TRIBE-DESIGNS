import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Sun, 
  Moon,
  User,
  Settings
} from 'lucide-react';
import { Theme, CartItem, Product, UserProfile } from './types';
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import CustomizerPage from './pages/CustomizerPage';
import CartPage from './pages/CartPage';
import CommunityPage from './pages/CommunityPage';
import SettingsPage from './pages/SettingsPage';

// Context for Cart, Theme, User, and Community Status
interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  cart: CartItem[];
  addToCart: (p: Product, custom?: any) => void;
  removeFromCart: (id: string) => void;
  toggleCart: () => void;
  isCartOpen: boolean;
  user: UserProfile;
  updateUser: (u: UserProfile) => void;
  isCommunityMember: boolean;
  joinCommunity: (email: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const defaultUser: UserProfile = {
  name: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  }
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = window.localStorage.getItem('tribe-designs-theme');
      if (savedTheme && (savedTheme === Theme.LIGHT || savedTheme === Theme.DARK)) {
        return savedTheme as Theme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
    } catch {
      return Theme.DARK;
    }
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = window.localStorage.getItem('tribe-designs-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const savedUser = window.localStorage.getItem('tribe-designs-user');
      return savedUser ? JSON.parse(savedUser) : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  const [isCommunityMember, setIsCommunityMember] = useState<boolean>(() => {
    try {
        return window.localStorage.getItem('tribe-designs-member') === 'true';
    } catch {
        return false;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('tribe-designs-theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem('tribe-designs-cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem('tribe-designs-user', JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user to localStorage:", error);
    }
  }, [user]);

  const addToCart = (product: Product, customization?: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && JSON.stringify(item.customization) === JSON.stringify(customization));
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, customization, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateUser = (u: UserProfile) => {
    setUser(u);
  };

  const joinCommunity = (email: string) => {
    setIsCommunityMember(true);
    window.localStorage.setItem('tribe-designs-member', 'true');
    // Also update user profile email if it's currently empty
    setUser(prev => {
        if (!prev.email) {
            return { ...prev, email };
        }
        return prev;
    });
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <AppContext.Provider value={{ theme, setTheme, cart, addToCart, removeFromCart, toggleCart, isCartOpen, user, updateUser, isCommunityMember, joinCommunity }}>
      <HashRouter>
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-amber-400 selection:text-black transition-all duration-500 w-full">
          <Navbar />
          <main className="pt-16 md:pt-20">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/customize" element={<CustomizerPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
          <Footer />
          <CartSidebar />
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

const LogoIcon = ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { theme } = useApp();
    return (
        <img 
            src={theme === Theme.DARK ? './dark.png' : './light.png'} 
            alt="TRIBE DESIGNS" 
            loading="eager"
            className={`object-contain block ${className || ''}`}
            {...props}
        />
    );
};

const LogoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 p-8" 
            onClick={onClose}
        >
            <button className="absolute top-8 right-8 text-zinc-500 hover:text-black dark:hover:text-white transition-colors" onClick={onClose}>
                <X size={32} />
            </button>
            <div 
                className="relative w-full max-w-lg aspect-square flex items-center justify-center animate-in zoom-in-50 duration-500" 
                onClick={e => e.stopPropagation()}
            >
                <LogoIcon className="w-full h-full drop-shadow-2xl" />
            </div>
        </div>
    );
};

const Navbar = () => {
  const { theme, setTheme, cart, toggleCart, isCommunityMember } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'SHOP', path: '/shop' },
    { name: 'CUSTOMIZE', path: '/customize' },
    { name: 'THE VIBE', path: '/' },
  ];

  if (isCommunityMember) {
      navLinks.push({ name: '54 STREET', path: '/community' });
  }

  return (
    <>
    <LogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} />
    <nav className="fixed top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-all duration-500 left-0 right-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Area */}
          <div className="flex items-center space-x-2 md:space-x-3 group">
            <button 
                onClick={() => setIsLogoModalOpen(true)}
                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-transform hover:scale-110 duration-500 focus:outline-none bg-transparent"
                title="View Logo Large"
            >
              <LogoIcon className="w-full h-full" />
            </button>
            <Link to="/" className="font-poppins group hidden sm:block">
               <span className="font-semibold text-lg md:text-xl tracking-wide text-zinc-800 dark:text-zinc-200 group-hover:text-amber-500 transition-colors">
                  TRIBE<span className="text-amber-500 font-bold mx-0.5">•</span>DESIGNS
               </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-sm font-bold tracking-widest transition-colors hover:text-amber-500 ${location.pathname === link.path ? 'text-amber-500' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
             <Link 
              to="/settings"
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors hidden md:block"
              title="Settings & Profile"
            >
              <User size={18} />
            </Link>
            <button 
              onClick={() => setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle Dark Mode"
            >
              {theme === Theme.LIGHT ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              onClick={toggleCart}
              className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="View Cart"
            >
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top-4">
          <div className="px-2 pt-2 pb-6 space-y-2 sm:px-3 flex flex-col items-center">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-4 text-xl font-syne font-bold tracking-widest hover:text-amber-500 w-full text-center"
              >
                {link.name}
              </Link>
            ))}
            <Link 
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-4 text-xl font-syne font-bold tracking-widest hover:text-amber-500 w-full text-center flex items-center justify-center gap-2"
            >
                SETTINGS <Settings size={18} />
            </Link>
          </div>
        </div>
      )}
    </nav>
    </>
  );
};

const CartSidebar = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart } = useApp();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
      />
      <div className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-zinc-900 z-[70] transition-transform duration-500 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-syne font-bold uppercase">YOUR BAG</h2>
            <button onClick={toggleCart} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {cart.length === 0 ? (
              <div className="text-center py-20 opacity-50">
                <ShoppingBag size={48} className="mx-auto mb-4" />
                <p className="font-bold tracking-widest">BAG IS EMPTY</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex space-x-4 group">
                    <img src={item.image} className="w-20 h-24 object-cover rounded-lg" alt={item.name} />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm uppercase">{item.name}</h3>
                      {item.customization && (
                        <p className="text-[10px] text-zinc-500 uppercase mt-1 font-medium">
                          Name: {item.customization.name} | No: {item.customization.number}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-amber-500">${item.price}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-6">
            <div className="flex justify-between text-xl font-black mb-6">
              <span className="uppercase">TOTAL</span>
              <span>${cart.reduce((acc, i) => acc + (i.price * i.quantity), 0)}</span>
            </div>
            <Link to="/cart" onClick={toggleCart} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-4 rounded-xl transition-all transform active:scale-95 block text-center uppercase tracking-widest shadow-lg">
              CHECKOUT NOW
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const Footer = () => (
  <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12 md:py-16 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16">
            <LogoIcon className="w-full h-full" />
          </div>
          <div className="font-poppins">
            <h3 className="font-semibold text-xl md:text-2xl tracking-wider text-zinc-800 dark:text-zinc-200 uppercase">TRIBE•DESIGNS</h3>
            <p className="text-lg md:text-xl font-medium text-zinc-600 dark:text-zinc-400">.54.</p>
            <p className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-500 tracking-[0.2em] uppercase">PRIDE IDENTITY</p>
          </div>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 text-sm md:text-base leading-relaxed">
          The new standard in African sportswear. Custom-made, high-performance, and deeply rooted in our heritage. Designed for the youth of the world.
        </p>
        <div className="flex space-x-4">
          {['Instagram', 'Twitter', 'TikTok'].map(s => (
            <a key={s} href="#" className="text-xs font-black uppercase tracking-widest hover:text-amber-500 transition-colors">{s}</a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-black mb-6 tracking-widest uppercase text-xs text-zinc-400">Shop</h4>
        <ul className="space-y-4">
          {['Jerseys', 'Customizer', 'Heritage Collection', 'Limited Drops'].map(item => (
            <li key={item}><Link to="/shop" className="text-sm font-bold hover:text-amber-500 transition-colors uppercase">{item}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-black mb-6 tracking-widest uppercase text-xs text-zinc-400">Support</h4>
        <ul className="space-y-4">
          {['Sizing Guide', 'Shipping', 'Returns', 'Contact'].map(item => (
            <li key={item}><a href="#" className="text-sm font-bold hover:text-amber-500 transition-colors uppercase">{item}</a></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] tracking-widest font-black uppercase text-zinc-400">
      <span>© 2026 TRIBE DESIGNS GLOBAL. ALL RIGHTS RESERVED.</span>
      <div className="flex space-x-8">
        <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export default App;