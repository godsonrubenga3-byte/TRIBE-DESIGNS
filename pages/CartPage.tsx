
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Trash2, ArrowRight, CreditCard, Smartphone, Bitcoin, CheckCircle, LocateFixed, Loader2, Banknote, Box, ShoppingBag, Clock, Truck, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Order } from '../types';

type PaymentMethod = 'card' | 'momo' | 'crypto' | 'cod';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, user, clearCart, orders, addOrder } = useApp();
  const [activeTab, setActiveTab] = useState<'bag' | 'tracking'>('bag');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isLocating, setIsLocating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingDetails, setShippingDetails] = useState({
      name: user.name || '',
      address: user.address.street || '',
      city: user.address.city || '',
      country: user.address.country || 'India',
      zip: user.address.zip || ''
  });

  useEffect(() => {
    if (orders.length > 0 && cart.length === 0) {
        // If coming to page empty but has orders, maybe prompt or just stay on bag?
        // Let's default to bag but if they click tracking they see it.
    }
  }, []);

  useEffect(() => {
    if(user.name || user.address.street) {
        setShippingDetails({
            name: user.name,
            address: user.address.street,
            city: user.address.city,
            country: 'India',
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
                      country: 'India'
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
      setIsProcessing(true);

      const processOrder = () => {
          const newOrder: Order = {
              id: `ORD-${Date.now().toString().slice(-6)}`,
              date: new Date().toLocaleDateString(),
              items: [...cart],
              total: total,
              status: 'Processing',
              paymentMethod: paymentMethod,
              shippingDetails: { ...shippingDetails }
          };
          addOrder(newOrder);
          clearCart();
          setIsProcessing(false);
          setCheckoutStep('success');
      };

      if (paymentMethod === 'cod') {
          // COD confirms immediately (after short delay for UX)
          setTimeout(processOrder, 1000);
      } else {
          // Others simulate payment processing delay
          setTimeout(processOrder, 2500);
      }
  };

  const renderOrderTracking = () => (
      <div className="max-w-4xl mx-auto space-y-6">
          {orders.length === 0 ? (
              <div className="text-center py-20 opacity-50">
                  <PackageCheck size={48} className="mx-auto mb-4" />
                  <p className="font-bold tracking-widest uppercase">NO ACTIVE ORDERS</p>
                  <p className="text-sm mt-2">Your order history will appear here.</p>
              </div>
          ) : (
              orders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 animate-in slide-in-from-bottom-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4 gap-4">
                          <div>
                              <div className="flex items-center gap-3 mb-1">
                                  <h3 className="font-syne font-black text-xl">#{order.id}</h3>
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                      {order.status}
                                  </span>
                              </div>
                              <p className="text-xs text-zinc-500 font-bold uppercase">{order.date}</p>
                          </div>
                          <div className="text-right">
                              <p className="font-black text-lg">${order.total}</p>
                              <p className="text-xs text-zinc-500 font-bold uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</p>
                          </div>
                      </div>

                      <div className="space-y-4 mb-8">
                          {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center">
                                  <div className="w-12 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                  </div>
                                  <div className="flex-1">
                                      <p className="font-bold text-sm uppercase">{item.name}</p>
                                      <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Status Stepper */}
                      <div className="relative pt-2">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full z-0"></div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 rounded-full z-0 transition-all duration-1000" style={{ width: '25%' }}></div>
                          
                          <div className="relative z-10 flex justify-between">
                              <div className="flex flex-col items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center border-4 border-white dark:border-zinc-900">
                                      <Clock size={14} />
                                  </div>
                                  <span className="text-[10px] font-bold uppercase">Processing</span>
                              </div>
                              <div className="flex flex-col items-center gap-2 opacity-50">
                                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border-4 border-white dark:border-zinc-900">
                                      <PackageCheck size={14} />
                                  </div>
                                  <span className="text-[10px] font-bold uppercase">Shipped</span>
                              </div>
                              <div className="flex flex-col items-center gap-2 opacity-50">
                                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border-4 border-white dark:border-zinc-900">
                                      <Truck size={14} />
                                  </div>
                                  <span className="text-[10px] font-bold uppercase">En Route</span>
                              </div>
                              <div className="flex flex-col items-center gap-2 opacity-50">
                                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border-4 border-white dark:border-zinc-900">
                                      <CheckCircle size={14} />
                                  </div>
                                  <span className="text-[10px] font-bold uppercase">Delivered</span>
                              </div>
                          </div>
                      </div>
                  </div>
              ))
          )}
      </div>
  );

  if (checkoutStep === 'success') {
      return (
          <div className="max-w-3xl mx-auto px-4 py-20 md:py-32 text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in-50 duration-500">
                  <CheckCircle size={48} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-syne font-black mb-6 uppercase">Order Confirmed!</h1>
              <p className="text-zinc-500 mb-12 max-w-md mx-auto text-lg">
                  {paymentMethod === 'cod' 
                    ? `Thanks, ${shippingDetails.name}. Please have $${total} ready for the courier upon delivery.` 
                    : `Welcome to the tribe, ${shippingDetails.name}. Your gear is being prepared.`
                  }
              </p>
              <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => {
                        setCheckoutStep('cart');
                        setActiveTab('tracking');
                    }}
                    className="inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-4 font-bold uppercase tracking-widest rounded-xl hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-black transition-colors"
                  >
                      Track Order
                  </button>
                  <Link to="/shop" className="inline-block border-2 border-zinc-200 dark:border-zinc-800 px-10 py-4 font-bold uppercase tracking-widest rounded-xl hover:border-black dark:hover:border-white transition-colors">
                      Continue Shopping
                  </Link>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6">
          <h1 className="text-4xl md:text-8xl font-syne font-black tracking-tighter uppercase leading-none">
              {checkoutStep === 'cart' ? (activeTab === 'bag' ? 'YOUR BAG' : 'TRACKING') : 'PAYMENT'}
          </h1>
          {checkoutStep === 'cart' && (
              <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl self-start md:self-auto">
                  <button 
                    onClick={() => setActiveTab('bag')}
                    className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'bag' ? 'bg-white dark:bg-black shadow-sm' : 'text-zinc-500'}`}
                  >
                      <ShoppingBag size={14} /> Bag
                  </button>
                  <button 
                    onClick={() => setActiveTab('tracking')}
                    className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'tracking' ? 'bg-white dark:bg-black shadow-sm' : 'text-zinc-500'}`}
                  >
                      <Box size={14} /> Orders
                  </button>
              </div>
          )}
      </div>
      
      {activeTab === 'tracking' && checkoutStep === 'cart' ? (
          renderOrderTracking()
      ) : (
          /* Cart & Checkout Layout */
          <>
            {cart.length === 0 && checkoutStep !== 'details' ? (
                 <div className="text-center py-20 opacity-50">
                    <ShoppingBag size={48} className="mx-auto mb-4" />
                    <p className="font-bold tracking-widest uppercase">BAG IS EMPTY</p>
                    <Link to="/shop" className="inline-block mt-4 text-sm font-bold border-b-2 border-black dark:border-white pb-0.5">START SHOPPING</Link>
                 </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
                    {/* Left Column: Cart Items */}
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

                    {/* Right Column: Checkout Flow */}
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
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
                                            <span className="text-[10px] font-black uppercase tracking-widest">MoMo</span>
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
                                        <button 
                                            type="button"
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                                                paymentMethod === 'cod' 
                                                ? 'border-green-500 bg-green-500/10 text-green-600' 
                                                : 'border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300'
                                            }`}
                                        >
                                            <Banknote size={24} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Cash</span>
                                        </button>
                                    </div>

                                    {/* Payment Details Inputs */}
                                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl mt-4 border border-zinc-100 dark:border-zinc-800">
                                        {paymentMethod === 'card' && (
                                            <div className="space-y-4 animate-in fade-in">
                                                <input required placeholder="Card Number" className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input required placeholder="MM/YY" className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" />
                                                    <input required placeholder="CVC" className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" />
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
                                                <input required placeholder="Mobile Number" className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" />
                                            </div>
                                        )}
                                        {paymentMethod === 'crypto' && (
                                            <div className="text-center py-8 animate-in fade-in">
                                                <div className="w-32 h-32 bg-white p-2 mx-auto mb-4 rounded-lg">
                                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x1234567890abcdef" alt="QR" className="w-full h-full" />
                                                </div>
                                                <p className="text-xs font-mono text-zinc-500 break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                                                <p className="text-xs font-bold text-amber-500 mt-2">Send ETH or USDC (ERC-20)</p>
                                                <div className="mt-4 flex items-center justify-center gap-2">
                                                    <input type="checkbox" required id="crypto-confirm" className="rounded text-amber-500 focus:ring-amber-500" />
                                                    <label htmlFor="crypto-confirm" className="text-xs text-zinc-400">I have sent the exact amount</label>
                                                </div>
                                            </div>
                                        )}
                                        {paymentMethod === 'cod' && (
                                            <div className="text-center py-8 animate-in fade-in">
                                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Banknote size={32} className="text-green-600" />
                                                </div>
                                                <h4 className="font-bold text-lg mb-2">Pay on Delivery</h4>
                                                <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                                                    You will pay <strong>${total}</strong> in cash to the courier when your order arrives. Please ensure you have the exact amount.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setCheckoutStep('cart')}
                                        className="px-6 py-4 font-bold uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white"
                                        disabled={isProcessing}
                                    >
                                        Back
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isProcessing}
                                        className={`flex-1 font-black uppercase tracking-widest py-4 rounded-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                                            paymentMethod === 'cod' 
                                            ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800'
                                            : 'bg-amber-500 hover:bg-amber-600 text-black'
                                        }`}
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="animate-spin" /> Processing...</>
                                        ) : (
                                            paymentMethod === 'cod' ? 'Confirm Order' : `Pay $${total}`
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    </div>
                </div>
            )}
          </>
      )}
    </div>
  );
};

export default CartPage;
