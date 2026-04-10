import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  Timestamp,
  getDocFromServer,
  addDoc
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Order } from '../../types';
import { useApp } from '../../App';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  ExternalLink,
  Search,
  Filter,
  MoreVertical,
  Truck,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    };
    testConnection();

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().createdAt as Timestamp)?.toDate()?.toISOString() || new Date().toISOString()
      })) as unknown as Order[];
      
      // Check for new orders to notify
      if (!loading && ordersData.length > orders.length) {
        const newOrder = ordersData[0];
        if (Notification.permission === 'granted') {
          new Notification('New Order Received!', {
            body: `Order from ${newOrder.customer.name} for $${newOrder.total}`,
            icon: '/favcon.ico'
          });
        }
      }

      setOrders(ordersData);
      setLastUpdated(new Date());
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const path = `orders/${orderId}`;
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'All' || order.status === filter;
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o: Order) => o.status === 'Pending').length,
    processing: orders.filter((o: Order) => o.status === 'Processing').length,
    delivered: orders.filter((o: Order) => o.status === 'Delivered').length,
  };

  const openWhatsApp = (phone: string, orderId: string) => {
    const message = encodeURIComponent(`Hello! This is Tribe Designs regarding your order #${orderId.slice(-6)}. We are currently processing it!`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const simulateOrder = async () => {
    try {
      const newOrder = {
        customer: {
          name: "Test Customer",
          email: "test@example.com",
          phone: "+1234567890"
        },
        items: [
          {
            name: "Classic African Jersey",
            price: 59.99,
            quantity: 1,
            image: "https://picsum.photos/seed/jersey/200/300",
            customization: { name: "TRIBE", number: "10" }
          }
        ],
        total: 59.99,
        status: "Pending",
        shippingDetails: {
          address: "123 African Way",
          city: "Nairobi",
          state: "Nairobi",
          zip: "00100",
          country: "Kenya"
        },
        createdAt: Timestamp.now()
      };
      await addDoc(collection(db, 'orders'), newOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-syne font-black uppercase tracking-tighter">Command Center</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={simulateOrder}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-[8px] font-black tracking-widest text-zinc-500 hover:text-amber-500 rounded-full border border-zinc-700 transition-all uppercase"
              >
                Simulate Order
              </button>
              <span className="text-[8px] font-black tracking-widest text-zinc-600 uppercase flex items-center gap-1">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                Live: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <p className="text-zinc-500 font-medium">Real-time order stream from Tribe Designs App</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL ORDERS', value: stats.total, icon: Package, color: 'text-zinc-400' },
            { label: 'PENDING', value: stats.pending, icon: Clock, color: 'text-amber-500' },
            { label: 'PROCESSING', value: stats.processing, icon: Truck, color: 'text-blue-500' },
            { label: 'COMPLETED', value: stats.delivered, icon: CheckCircle2, color: 'text-green-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">{stat.label}</span>
              </div>
              <div className="text-2xl font-black font-syne">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search orders, customers..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap",
                filter === s ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="p-6 text-[10px] font-black tracking-widest text-zinc-500 uppercase">Order ID</th>
                <th className="p-6 text-[10px] font-black tracking-widest text-zinc-500 uppercase">Customer</th>
                <th className="p-6 text-[10px] font-black tracking-widest text-zinc-500 uppercase">Items</th>
                <th className="p-6 text-[10px] font-black tracking-widest text-zinc-500 uppercase">Total</th>
                <th className="p-6 text-[10px] font-black tracking-widest text-zinc-500 uppercase">Status</th>
                <th className="p-6 text-[10px] font-black tracking-widest text-zinc-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-32 text-center space-y-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                      <Package size={32} className="text-zinc-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">No orders found</p>
                      <p className="text-zinc-600 text-xs">Waiting for incoming transmissions from Tribe Designs App...</p>
                    </div>
                    <button 
                      onClick={simulateOrder}
                      className="mt-6 text-[10px] font-black tracking-widest text-amber-500 hover:text-amber-400 uppercase underline underline-offset-4"
                    >
                      Create a test order
                    </button>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="p-6">
                      <div className="font-mono text-xs font-bold text-amber-500">#{order.id.slice(-8).toUpperCase()}</div>
                      <div className="text-[10px] text-zinc-500 mt-1">{format(new Date(order.date), 'MMM dd, HH:mm')}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-sm">{order.customer.name}</div>
                      <div className="text-xs text-zinc-500">{order.customer.email}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex -space-x-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 overflow-hidden bg-zinc-800" title={item.name}>
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6 font-black text-white">${order.total}</td>
                    <td className="p-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                        order.status === 'Pending' && "bg-amber-500/10 text-amber-500",
                        order.status === 'Processing' && "bg-blue-500/10 text-blue-500",
                        order.status === 'Shipped' && "bg-purple-500/10 text-purple-500",
                        order.status === 'Delivered' && "bg-green-500/10 text-green-500",
                        order.status === 'Cancelled' && "bg-red-500/10 text-red-500",
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button 
                          onClick={() => openWhatsApp(order.customer.phone, order.id)}
                          className="p-2 hover:bg-green-500/20 rounded-lg text-green-500 transition-colors"
                          title="Contact via WhatsApp"
                        >
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl overflow-y-auto custom-scrollbar"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase mb-2">Order Details</div>
                    <h2 className="text-3xl font-syne font-black uppercase">#{selectedOrder.id.slice(-8).toUpperCase()}</h2>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-zinc-900 rounded-full transition-colors">
                    <XCircle size={32} className="text-zinc-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Left Column: Customer & Shipping */}
                  <div className="space-y-10">
                    <section>
                      <h3 className="text-xs font-black tracking-widest text-zinc-500 uppercase mb-4">Customer Info</h3>
                      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-4">
                        <div>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Name</p>
                          <p className="font-bold">{selectedOrder.customer.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Contact</p>
                          <p className="font-bold">{selectedOrder.customer.email}</p>
                          <p className="font-bold text-amber-500">{selectedOrder.customer.phone}</p>
                        </div>
                        <button 
                          onClick={() => openWhatsApp(selectedOrder.customer.phone, selectedOrder.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                          <MessageSquare size={18} />
                          WHATSAPP CUSTOMER
                        </button>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-black tracking-widest text-zinc-500 uppercase mb-4">Shipping Address</h3>
                      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                        <p className="font-medium leading-relaxed">
                          {selectedOrder.shippingDetails.address}<br />
                          {selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.state} {selectedOrder.shippingDetails.zip}<br />
                          {selectedOrder.shippingDetails.country}
                        </p>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Items & Status */}
                  <div className="space-y-10">
                    <section>
                      <h3 className="text-xs font-black tracking-widest text-zinc-500 uppercase mb-4">Update Status</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                          <button
                            key={s}
                            onClick={() => updateOrderStatus(selectedOrder.id, s)}
                            className={cn(
                              "px-4 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all",
                              selectedOrder.status === s 
                                ? "bg-amber-500 border-amber-500 text-black" 
                                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-black tracking-widest text-zinc-500 uppercase mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                            <img src={item.image} className="w-16 h-20 object-cover rounded-lg" alt={item.name} />
                            <div className="flex-1">
                              <h4 className="font-bold text-sm uppercase">{item.name}</h4>
                              {item.customization && (
                                <p className="text-[10px] text-zinc-500 uppercase mt-1">
                                  {item.customization.name} | {item.customization.number}
                                </p>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs font-bold text-zinc-400">QTY: {item.quantity}</span>
                                <span className="font-black text-amber-500">${item.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between items-end">
                        <span className="text-xs font-black text-zinc-500 uppercase">Total Amount</span>
                        <span className="text-3xl font-black font-syne text-white">${selectedOrder.total}</span>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
