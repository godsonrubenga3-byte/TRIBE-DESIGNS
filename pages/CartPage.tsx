
import React from 'react';
import { useApp } from '../App';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cart, removeFromCart } = useApp();
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-syne font-black mb-6">EMPTY BAG.</h1>
        <p className="text-zinc-500 mb-12 max-w-sm mx-auto text-sm md:text-base">Your journey hasn't started yet. Grab a jersey or design your own.</p>
        <Link to="/shop" className="inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-amber-600 transition-all text-sm md:text-base">
          GO SHOPPING <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <h1 className="text-4xl md:text-8xl font-syne font-black mb-8 md:mb-16 tracking-tighter uppercase">CHECKOUT</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
        <div className="flex-1 space-y-6 md:space-y-8">
          {cart.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-6 md:gap-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-full sm:w-48 aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg md:text-2xl font-syne font-extrabold uppercase tracking-tight">{item.name}</h2>
                    {item.customization && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-amber-500">Personalized</p>
                        <p className="text-xs md:text-sm font-bold text-zinc-500">Name: {item.customization.name}</p>
                        <p className="text-xs md:text-sm font-bold text-zinc-500">Number: {item.customization.number}</p>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="flex justify-between items-end mt-4 md:mt-12">
                  <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-xl">
                    <button className="p-1 hover:text-amber-500"><Minus size={16} /></button>
                    <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                    <button className="p-1 hover:text-amber-500"><Plus size={16} /></button>
                  </div>
                  <span className="text-xl md:text-2xl font-syne font-black">${item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 sticky top-24 md:top-32">
            <h3 className="text-lg md:text-xl font-syne font-black mb-6 md:mb-8 uppercase tracking-widest">ORDER SUMMARY</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-zinc-500 font-bold uppercase text-xs">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-bold uppercase text-xs">
                <span>Shipping</span>
                <span>${shipping}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-bold uppercase text-xs">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-black text-xl md:text-2xl uppercase">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <button className="w-full bg-black dark:bg-white text-white dark:text-black py-4 md:py-5 rounded-2xl font-syne font-black text-base md:text-lg tracking-widest transition-all hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-black shadow-xl">
                PAY NOW
              </button>
              <p className="text-[10px] text-zinc-400 text-center font-bold uppercase tracking-widest">
                Secure checkout powered by TribePay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
