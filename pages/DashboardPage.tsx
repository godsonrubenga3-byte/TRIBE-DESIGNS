import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Globe, Palette, Sparkles, ArrowRight, MessageCircle, Shirt, ShoppingBag, Users, Crown, MessageSquare, Settings, Truck } from 'lucide-react';
import { useApp } from '../App';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isCommunityMember, cart, orders, signOut } = useApp();
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Welcome to your vibe zone, ' + user.name + '! Ask me about designs, colors, or African heritage patterns for your next jersey 👑' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

    const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Import dynamically to avoid SSR issues
      const { getDesignAdvice } = await import('../services/geminiService');
      const advice = await getDesignAdvice(input);
      
      let aiResponse;
      if (advice) {
        aiResponse = { 
          role: 'ai', 
          text: `Palette: ${advice.palette.join(', ')}\nPattern: ${advice.patternConcept}\nTwist: ${advice.modernTwist}\nVibe: ${advice.vibeDescription}` 
        };
      } else {
        aiResponse = { role: 'ai', text: 'Style idea: Green eagle patterns with gold accents for Naija vibes! 🔥 Ask for more details.' };
      }
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Stylist vibe loading... Try: "Naija jersey ideas"' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Welcome */}
      <section className="relative h-[70vh] md:h-[80vh] flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-amber-900/30">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#f59e0b_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#eab308_0%,transparent_50%)]" />
        </div>
        
        <div className="relative z-10 text-center lg:text-left px-6 w-full lg:w-1/2 lg:pr-12">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-amber-500/90 text-black font-black uppercase tracking-widest rounded-full shadow-2xl backdrop-blur-sm animate-pulse">
            <Crown size={20} />
            Welcome back, <span className="text-2xl">{user.name.split(' ')[0]}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-syne font-extrabold text-white tracking-tighter mb-6 leading-none uppercase">
            #THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">VIBE</span>
          </h1>
          <p className="text-zinc-200 max-w-lg mx-auto lg:mx-0 text-xl font-bold leading-relaxed">
            Your personalized space. Recent designs, AI stylist, tribe updates, exclusive drops.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="relative z-10 w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mt-8 lg:mt-0 lg:pl-12">
          <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <ShoppingBag className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-3xl font-black text-white">{cart.reduce((acc, i) => acc + i.quantity, 0)}</p>
              <p className="text-zinc-300 uppercase tracking-widest text-sm font-bold">In Bag</p>
            </div>
          </div>
          <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <Users className="w-12 h-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-3xl font-black text-white">{isCommunityMember ? '54 STREET' : 'JOIN'}</p>
              <p className="text-zinc-300 uppercase tracking-widest text-sm font-bold">Status</p>
            </div>
          </div>
          <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <Shirt className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-3xl font-black text-white">{orders.length}</p>
              <p className="text-zinc-300 uppercase tracking-widest text-sm font-bold">Orders</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-12 py-24">
        {/* AI Chat */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-syne font-black uppercase tracking-tight flex items-center gap-3">
            <Sparkles className="text-amber-500" size={28} />
            AI Stylist Chat
          </h2>
          <div className="h-96 bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-zinc-700 p-6 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl ${msg.role === 'user' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-white shadow-lg'}`}>
                    <p className={`font-medium ${msg.role === 'user' ? 'font-black' : 'font-semibold'}`}>{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800/50 p-4 rounded-2xl text-zinc-400 animate-pulse">
                    Typing...
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={sendMessage} className="flex gap-3 p-2 bg-zinc-800 rounded-2xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-zinc-400 border-none outline-none font-bold"
                placeholder="Ask about jersey designs, colors, heritage patterns..."
              />
              <button type="submit" disabled={loading || !input.trim()} className="p-3 bg-amber-500 text-black rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <MessageCircle size={20} />
              </button>
            </form>
          </div>
          <p className="text-sm text-zinc-500 italic">Your AI stylist is ready! Ask about designs, colors, heritage patterns...</p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-syne font-black uppercase tracking-tight mb-8 flex items-center gap-3">
              <Zap className="text-emerald-500" size={28} />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/customize" className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black p-8 rounded-3xl font-black uppercase tracking-widest text-xl flex flex-col items-center justify-center h-32 shadow-2xl transition-all hover:scale-105 hover:shadow-3xl">
                <Palette className="w-16 h-16 mb-4 group-hover:rotate-12 transition-transform" />
                Customize Now
              </Link>
              <Link to="/track-order" className="group bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white p-8 rounded-3xl font-black uppercase tracking-widest text-xl flex flex-col items-center justify-center h-32 shadow-2xl transition-all hover:scale-105 hover:shadow-3xl">
                <Truck className="w-16 h-16 mb-4 group-hover:rotate-12 transition-transform" />
                Track Order
              </Link>
            </div>
          </div>

          {isCommunityMember && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-xl md:text-2xl font-syne font-black text-white uppercase tracking-wider mb-4 flex items-center gap-3">
                <Users className="text-yellow-400" size={20} />
                54 Street Elite
              </h3>
              <p className="text-white/90 mb-6 leading-relaxed">You're in the council. Exclusive drops, collabs, and first access.</p>
              <Link to="/community" className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-white hover:shadow-2xl transition-all">
                Enter 54 Street <Crown size={20} />
              </Link>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              onClick={signOut}
              className="flex-1 bg-zinc-800/50 hover:bg-zinc-700 text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest border border-zinc-600 transition-all hover:shadow-xl"
            >
              Logout
            </button>
            <Link to="/settings" className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-4 px-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all">
              Profile <Settings size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-zinc-950 to-black">
        <h2 className="text-4xl font-syne font-black text-white uppercase tracking-tight mb-12 text-center flex items-center justify-center gap-4 mx-auto max-w-4xl">
          <MessageSquare size={36} className="text-amber-400" />
          Recent Vibes
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.length > 0 ? orders.slice(0,3).map((order, idx) => (
            <div key={idx} className="group bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-zinc-700 hover:border-amber-500/50 transition-all hover:bg-zinc-800/50 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <span className="px-4 py-1 bg-emerald-500/90 text-black text-xs font-black uppercase tracking-widest rounded-full">
                  Order #{order.id.slice(-6)}
                </span>
                <span className="text-amber-400 font-black">${order.total}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{order.items[0]?.name}</h3>
              <p className="text-zinc-400 mb-4">{order.status}</p>
              <div className="flex gap-2 text-sm text-zinc-500">
                {order.items.map(item => (
                  <span key={item.id} className="px-2 py-1 bg-zinc-800 rounded-full">{item.name.slice(0,10)}...</span>
                ))}
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-24 opacity-50">
              <Shirt size={64} className="mx-auto mb-8 text-zinc-600" />
              <p className="text-2xl font-bold text-zinc-500 uppercase tracking-wider">No orders yet</p>
              <p className="text-zinc-600 mt-2">Your first vibe awaits</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

