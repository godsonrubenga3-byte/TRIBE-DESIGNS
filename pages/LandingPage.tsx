
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Globe, Palette, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      navigate('/community');
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-60 scale-105"
            alt="African Fashion"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 w-full">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-amber-500 text-black text-[10px] md:text-xs font-black tracking-widest uppercase animate-pulse">
            NEW DROP: THE HERITAGE PACK
          </span>
          <h1 className="text-5xl md:text-9xl font-syne font-extrabold text-white tracking-tighter mb-4 md:mb-6 leading-none uppercase">
            WEAR YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">SPIRIT.</span>
          </h1>
          <p className="text-zinc-300 max-w-xl mx-auto text-sm md:text-lg mb-8 md:mb-10 font-medium px-4">
            Custom-made jerseys that bridge the gap between ancient African artistry and modern street culture.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-6 sm:px-0">
            <Link 
              to="/shop" 
              className="w-full sm:w-auto px-10 py-4 md:py-5 bg-white text-black font-syne font-black text-sm md:text-lg tracking-widest hover:bg-amber-500 transition-all rounded-none transform -skew-x-12 text-center"
            >
              SHOP COLLECTION
            </Link>
            <Link 
              to="/customize" 
              className="w-full sm:w-auto px-10 py-4 md:py-5 border-2 border-white text-white font-syne font-black text-sm md:text-lg tracking-widest hover:bg-white hover:text-black transition-all rounded-none transform -skew-x-12 text-center"
            >
              CUSTOMIZE YOURS
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 md:py-24 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { 
                icon: <Palette className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />, 
                title: "HYPER-CUSTOM", 
                desc: "Your name. Your number. Your tribe. We build it exactly how you want it." 
              },
              { 
                icon: <Zap className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />, 
                title: "STREET READY", 
                desc: "Technical fabrics meeting street aesthetics. From the pitch to the club." 
              },
              { 
                icon: <Globe className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />, 
                title: "ROOTED DEEP", 
                desc: "Patterns sourced from 54 nations. Authentic, respected, and revolutionized." 
              }
            ].map((feature, i) => (
              <div key={i} className="group p-6 md:p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl hover:border-amber-500/50 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <div className="mb-6 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl md:text-2xl font-syne font-extrabold mb-4">{feature.title}</h3>
                <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Teaser Section */}
      <section className="py-16 md:py-24 px-6 relative overflow-hidden bg-amber-500 group">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Sparkles className="w-96 h-96 text-black" />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:max-w-xl mb-12 md:mb-0 text-center md:text-left">
            <h2 className="text-4xl md:text-7xl font-syne font-black text-black leading-none mb-6 md:mb-8">
              AI-POWERED <br /> DESIGN <br /> ASSISTANT
            </h2>
            <p className="text-black/80 text-lg md:text-xl font-bold mb-8">
              Don't know where to start? Tell our AI your vibe and it will suggest a custom jersey concept rooted in your heritage.
            </p>
            <Link 
              to="/customize" 
              className="inline-flex items-center space-x-4 bg-black text-white px-8 py-4 font-black tracking-widest hover:px-10 transition-all shadow-xl rounded-lg md:rounded-none"
            >
              <span>TRY IT NOW</span>
              <ChevronRight />
            </Link>
          </div>
          <div className="relative w-full md:w-auto flex justify-center">
            <div className="w-64 h-80 md:w-72 md:h-96 bg-zinc-900 rounded-2xl rotate-6 overflow-hidden shadow-2xl border-4 border-black">
               <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-72 h-96 bg-zinc-800 rounded-2xl -rotate-6 overflow-hidden shadow-2xl border-4 border-black hidden sm:block">
               <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Community */}
      <section className="py-20 md:py-32 bg-zinc-950 text-white text-center px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-40 h-40 md:w-64 md:h-64 rounded-full bg-blue-500 blur-3xl mix-blend-screen"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 md:w-96 md:h-96 rounded-full bg-purple-500 blur-3xl mix-blend-screen"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-8xl font-syne font-black mb-6 md:mb-8 uppercase italic tracking-tighter">
                JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">TRIBE.</span>
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto mb-10 md:mb-12 text-base md:text-lg font-medium leading-relaxed">
            Be the first to know about secret drops, custom collaboration opportunities, and join the conversation at 54 Street.
            </p>
            
            <form onSubmit={handleJoin} className="max-w-xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
                <div className="relative flex flex-col sm:flex-row p-2 bg-black rounded-2xl border border-zinc-800 shadow-2xl gap-2">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER YOUR EMAIL" 
                        className="flex-1 bg-transparent px-6 py-4 focus:outline-none text-white font-bold uppercase placeholder:text-zinc-600 tracking-widest text-center sm:text-left"
                        required
                    />
                    <button type="submit" className="bg-amber-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-colors shadow-lg flex items-center justify-center gap-2">
                        JOIN <ArrowRight size={18} />
                    </button>
                </div>
            </form>
            
            <p className="mt-8 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                Join 15,000+ members worldwide
            </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
