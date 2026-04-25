import React, { useState } from 'react';
import { useApp } from '../App';
import { ShoppingBag, Truck, Package, CheckCircle, Clock, ChevronRight, Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackOrderPage: React.FC = () => {
  const { orders, session } = useApp();
  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.id.includes(searchId) || o.id === searchId);
    setSearchedOrder(found || 'not_found');
  };

  const getStatusStep = (status: string) => {
    const steps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
    const currentIdx = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;
    return currentIdx;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-syne font-black tracking-tighter uppercase mb-4">Track Order</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Follow your vibe from our studio to your door</p>
        </div>

        {/* Search Bar */}
        <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-3xl mb-12 shadow-xl border border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="ENTER ORDER ID (e.g. #772183)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-black tracking-widest focus:ring-2 focus:ring-amber-500 outline-none uppercase"
              />
            </div>
            <button type="submit" className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl text-xs font-black tracking-widest hover:scale-105 transition-transform uppercase shadow-lg">
              Track Now
            </button>
          </form>
        </div>

        {searchedOrder === 'not_found' && (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30 mb-8">
            <p className="text-red-500 font-black uppercase tracking-widest">Order not found. Please check the ID and try again.</p>
          </div>
        )}

        {searchedOrder && searchedOrder !== 'not_found' && (
          <div className="bg-white dark:bg-black rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl mb-12 animate-in fade-in zoom-in duration-500">
            <div className="bg-amber-500 p-6 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-black/60 uppercase tracking-[0.2em]">Order Status</p>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">{searchedOrder.status}</h3>
              </div>
              <Package size={40} className="text-black/20" />
            </div>
            
            <div className="p-8">
              {/* Progress Steps */}
              <div className="relative flex justify-between mb-12">
                <div className="absolute top-5 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800 z-0" />
                <div 
                  className="absolute top-5 left-0 h-1 bg-amber-500 z-0 transition-all duration-1000" 
                  style={{ width: `${(getStatusStep(searchedOrder.status) / 3) * 100}%` }}
                />
                
                {['Processing', 'Confirmed', 'Shipped', 'Delivered'].map((step, idx) => (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                      getStatusStep(searchedOrder.status) >= idx 
                        ? 'bg-amber-500 border-white dark:border-black text-black' 
                        : 'bg-zinc-100 dark:bg-zinc-800 border-white dark:border-black text-zinc-400'
                    }`}>
                      {getStatusStep(searchedOrder.status) > idx ? <CheckCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <span className={`mt-2 text-[10px] font-black uppercase tracking-tighter ${
                      getStatusStep(searchedOrder.status) >= idx ? 'text-amber-500' : 'text-zinc-500'
                    }`}>{step}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-100 dark:border-zinc-900">
                <div>
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Items</h4>
                  <div className="space-y-4">
                    {searchedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center">
                          <ShoppingBag size={24} className="text-zinc-400" />
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase">{item.name}</p>
                          <p className="text-xs text-zinc-500">QTY: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Shipping Address</h4>
                  <div className="flex gap-3">
                    <MapPin className="text-amber-500 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-bold">{searchedOrder.shippingAddress?.street || '123 Vibe Lane'}</p>
                      <p className="text-sm text-zinc-500">{searchedOrder.shippingAddress?.city}, {searchedOrder.shippingAddress?.state} {searchedOrder.shippingAddress?.zip}</p>
                      <p className="text-sm text-zinc-500">{searchedOrder.shippingAddress?.country}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                     <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Estimated Delivery</h4>
                     <p className="text-lg font-black text-amber-500">OCT 24 - OCT 28, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders for quick access if logged in */}
        {session && orders.length > 0 && (
          <div>
            <h2 className="text-2xl font-syne font-black uppercase tracking-tight mb-6">Your Recent Vibes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.slice(0, 4).map((order) => (
                <button
                  key={order.id}
                  onClick={() => { setSearchedOrder(order); setSearchId(order.id.slice(-6)); }}
                  className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                      <Truck size={24} />
                    </div>
                    <div>
                      <p className="font-black text-xs uppercase tracking-widest">Order #{order.id.slice(-6)}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-zinc-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {!session && (
          <div className="mt-12 text-center p-8 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-4">LOGIN TO VIEW YOUR FULL ORDER HISTORY</p>
            <Link to="/login" className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl text-xs font-black tracking-widest hover:scale-105 transition-transform uppercase">
              Member Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
