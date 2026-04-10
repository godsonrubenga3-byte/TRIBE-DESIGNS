import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';
import { db, auth, logout } from '../../lib/firebase';

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
  Settings as SettingsIcon, 
  Bell, 
  Phone, 
  Shield, 
  LogOut, 
  Save,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const Settings = () => {
  const [settings, setSettings] = useState({
    adminPhone: '',
    whatsappAlerts: true,
    notificationsEnabled: true,
    storeStatus: 'Open'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

    const fetchSettings = async () => {
      const path = 'admin_settings/general';
      try {
        const docRef = doc(db, 'admin_settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() as any }));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const path = 'admin_settings/general';
    setSaving(true);
    try {
      await setDoc(doc(db, 'admin_settings', 'general'), settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setSaving(false);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setSettings({ ...settings, notificationsEnabled: true });
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-syne font-black uppercase tracking-tighter">Settings</h1>
        <p className="text-zinc-500 font-medium">Configure your admin experience and notifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-amber-500 mx-auto flex items-center justify-center text-black text-3xl font-black">
              {auth.currentUser?.email?.[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg">{auth.currentUser?.displayName || 'Admin'}</h3>
              <p className="text-xs text-zinc-500">{auth.currentUser?.email}</p>
            </div>
            <div className="pt-6 border-t border-zinc-800">
              <button 
                onClick={() => logout()}
                className="w-full flex items-center justify-center gap-2 text-red-500 font-black text-xs tracking-widest uppercase hover:bg-red-500/10 py-3 rounded-xl transition-all"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <Smartphone size={20} />
              <h2 className="text-sm font-black tracking-widest uppercase">WhatsApp Integration</h2>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Admin WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                  <input 
                    type="text" 
                    placeholder="+1 234 567 890" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono"
                    value={settings.adminPhone}
                    onChange={(e) => setSettings({ ...settings, adminPhone: e.target.value })}
                  />
                </div>
                <p className="text-[10px] text-zinc-600">This number will be used for direct customer communication links.</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">WhatsApp Alerts</h4>
                  <p className="text-xs text-zinc-500">Receive order notifications via WhatsApp</p>
                </div>
                <button 
                  onClick={() => setSettings({ ...settings, whatsappAlerts: !settings.whatsappAlerts })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    settings.whatsappAlerts ? "bg-green-500" : "bg-zinc-800"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    settings.whatsappAlerts ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <Bell size={20} />
              <h2 className="text-sm font-black tracking-widest uppercase">System Notifications</h2>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Browser Notifications</h4>
                  <p className="text-xs text-zinc-500">Get alerted when a new order arrives</p>
                </div>
                <button 
                  onClick={() => {
                    if (!settings.notificationsEnabled) {
                      requestNotificationPermission();
                    } else {
                      setSettings({ ...settings, notificationsEnabled: false });
                    }
                  }}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    settings.notificationsEnabled ? "bg-amber-500" : "bg-zinc-800"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    settings.notificationsEnabled ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          </section>

          <div className="pt-4 flex items-center gap-4">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-500 transition-all disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  SAVE CONFIGURATION
                </>
              )}
            </button>
            
            <AnimatePresence>
              {saved && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase tracking-widest"
                >
                  <CheckCircle2 size={16} />
                  Updated
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
