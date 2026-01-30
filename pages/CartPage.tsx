
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Smartphone, Bitcoin, CheckCircle, LocateFixed, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

type PaymentMethod = 'card' | 'momo' | 'crypto';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, user } = useApp();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isLocating, setIsLocating] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
      name: user.name || '',
      address: user.address.street || '',
      city: user.address.city || '',
      country: user.address.country || 'India', // Default to India
      zip: user.address.zip || ''
  });

  // Update shipping details if user profile loads/changes
  useEffect(() => {
    if(user.name || user.address.street) {
        setShippingDetails({
            name: user.name,
            address: user.address.street,
            city: user.address.city,
            country: 'India', // Ensure India is always default
            zip: user.address.zip
        });
    }
  }, [user]);

  const handleUseLocation = () => {
      if (!navigator.geolocation) {
          alert("Geolocation is not supported by your browser");
          return;
      }

      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
          try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await response.json();
              
              if (data && data.address) {
                  setShippingDetails(prev => ({
                      ...prev,
                      address: data.address.road || data.address.suburb || prev.address,
                      city: data.address.city || data.address.town || data.address.village || prev.city,
                      zip: data.address.postcode || prev.zip,
                      country: 'India' // Enforce India
                  }));
              }
          } catch (error) {
              console.error("Error fetching address:", error);
          } finally {
              setIsLocating(false);
          }
      }, (error) => {
          console.error("Geolocation error:", error);
          setIsLocating(false);
          alert("Unable to retrieve your location");
      });
  };
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const handlePayment = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate payment processing
      setTimeout(() => {
          setCheckoutStep('success');
      }, 1500);
  };

  if (cart.length === 0 && checkoutStep !== 'success') {
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

  if (checkoutStep === 'success') {
      return (
          <div className="max-w-3xl mx-auto px-4 py-20 md:py-32 text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in-50 duration-500">
                  <CheckCircle size={48} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-syne font-black mb-6 uppercase">Order Confirmed!</h1>
              <p className="text-zinc-500 mb-12 max-w-md mx-auto text-lg">
                  Welcome to the tribe, {shippingDetails.name}. Your gear is being prepared. We've sent a receipt to your email.
              </p>
              <Link to="/shop" className="inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-4 font-bold uppercase tracking-widest rounded-xl">
                  Back to Shop
              </Link>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <h1 className="text-4xl md:text-8xl font-syne font-black mb-8 md:mb-16 tracking-tighter uppercase">
          {checkoutStep === 'cart' ? 'CHECKOUT' : 'PAYMENT'}
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
        {/* Left Column: Cart Items (Simplified in checkout mode) */}
        <div className={`flex-1 space-y-6 md:space-y-8 ${checkoutStep === 'details' ? 'hidden lg:block lg:w-1/3 order-2' : ''}`}>
           {checkoutStep === 'details' && <h3 className="font-syne font-bold uppercase text-xl mb-4 text-zinc-400">Order Summary</h3>}
          {cart.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-6 md:gap-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-full sm:w-32 aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-base md:text-lg font-syne font-extrabold uppercase tracking-tight">{item.name}</h2>
                    {item.customization && (
                      <div className="mt-1 space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Customized</p>
                        <p className="text-xs text-zinc-500">{item.customization.name} | {item.customization.number}</p>
                      </div>
                    )}
                  </div>
                  {checkoutStep === 'cart' && (
                    <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  {checkoutStep === 'cart' ? (
                      <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg">
                        <span className="font-black text-xs text-zinc-500">QTY: {item.quantity}</span>
                      </div>
                  ) : (
                      <span className="text-sm font-bold text-zinc-500">Qty: {item.quantity}</span>
                  )}
                  <span className="text-lg font-syne font-black">${item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
           {checkoutStep === 'details' && (
               <div className="border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 pt-6">
                   <div className="flex justify-between font-black text-xl uppercase">
                        <span>Total Due</span>
                        <span>${total}</span>
                   </div>
               </div>
           )}
        </div>

        {/* Right Column: Checkout Flow or Summary */}
        <div className={`w-full ${checkoutStep === 'cart' ? 'lg:w-96' : 'lg:flex-1 order-1'}`}>
          {checkoutStep === 'cart' ? (
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
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-black text-xl md:text-2xl uppercase">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => setCheckoutStep('details')}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 md:py-5 rounded-2xl font-syne font-black text-base md:text-lg tracking-widest transition-all hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-black shadow-xl"
                  >
                    PROCEED TO PAY
                  </button>
                  <p className="text-[10px] text-zinc-400 text-center font-bold uppercase tracking-widest">
                    Secure checkout powered by TribePay
                  </p>
                </div>
              </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 p-0 md:p-8 rounded-3xl animate-in slide-in-from-right-8 duration-500">
                <form onSubmit={handlePayment} className="space-y-8">
                    {/* Shipping Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4">
                           <h3 className="text-xl font-syne font-bold uppercase">Shipping Details</h3>
                           <button 
                                type="button"
                                onClick={handleUseLocation}
                                disabled={isLocating}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                {isLocating ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} />}
                                {isLocating ? 'Locating...' : 'Use My Location'}
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                required
                                placeholder="Full Name"
                                value={shippingDetails.name}
                                onChange={e => setShippingDetails({...shippingDetails, name: e.target.value})}
                                className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 focus:ring-amber-500 outline-none w-full"
                            />
                            <input 
                                required
                                placeholder="Street Address"
                                value={shippingDetails.address}
                                onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})}
                                className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 focus:ring-amber-500 outline-none w-full"
                            />
                            <input 
                                required
                                placeholder="City"
                                value={shippingDetails.city}
                                onChange={e => setShippingDetails({...shippingDetails, city: e.target.value})}
                                className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 focus:ring-amber-500 outline-none w-full"
                            />
                            <input 
                                required
                                placeholder="Country"
                                value={shippingDetails.country}
                                readOnly
                                className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 focus:ring-amber-500 outline-none w-full text-zinc-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-syne font-bold uppercase border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4">Payment Method</h3>
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            <button
                                type="button" 
                                onClick={() => setPaymentMethod('card')}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                                    paymentMethod === 'card' 
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-600' 
                                    : 'border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300'
                                }`}
                            >
                                <CreditCard size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Card</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setPaymentMethod('momo')}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                                    paymentMethod === 'momo' 
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-600' 
                                    : 'border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300'
                                }`}
                            >
                                <Smartphone size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Mobile Money</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setPaymentMethod('crypto')}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                                    paymentMethod === 'crypto' 
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-600' 
                                    : 'border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300'
                                }`}
                            >
                                <Bitcoin size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Crypto</span>
                            </button>
                        </div>

                        {/* Payment Details Inputs */}
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl mt-4 border border-zinc-100 dark:border-zinc-800">
                            {paymentMethod === 'card' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <input placeholder="Card Number" className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="MM/YY" className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" />
                                        <input placeholder="CVC" className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" />
                                    </div>
                                </div>
                            )}
                            {paymentMethod === 'momo' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <select className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500 appearance-none">
                                        <option>Select Provider</option>
                                        <option>MTN Mobile Money</option>
                                        <option>Vodafone Cash</option>
                                        <option>AirtelTigo Money</option>
                                        <option>M-Pesa</option>
                                    </select>
                                    <input placeholder="Mobile Number" className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                            )}
                            {paymentMethod === 'crypto' && (
                                <div className="text-center py-8 animate-in fade-in">
                                    <div className="w-32 h-32 bg-white p-2 mx-auto mb-4 rounded-lg">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x1234567890abcdef" alt="QR" className="w-full h-full" />
                                    </div>
                                    <p className="text-xs font-mono text-zinc-500 break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                                    <p className="text-xs font-bold text-amber-500 mt-2">Send ETH or USDC (ERC-20)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            type="button"
                            onClick={() => setCheckoutStep('cart')}
                            className="px-6 py-4 font-bold uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white"
                        >
                            Back
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-xl transition-all active:scale-95"
                        >
                            Pay ${total}
                        </button>
                    </div>
                </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
