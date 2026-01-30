
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Save, MapPin, User, CheckCircle2, LocateFixed, Loader2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useApp();
  const [formData, setFormData] = useState(user);
  const [saved, setSaved] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // Ensure India is set if not already
    if (user.address.country !== 'India') {
      const updatedUser = { ...user, address: { ...user.address, country: 'India' } };
      setFormData(updatedUser);
    } else {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

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
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              street: data.address.road || data.address.suburb || prev.address.street,
              city: data.address.city || data.address.town || data.address.village || prev.address.city,
              state: data.address.state || prev.address.state,
              zip: data.address.postcode || prev.address.zip,
              country: 'India' // Enforce India
            }
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
      alert("Unable to retrieve your location. Please check your browser permissions.");
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <h1 className="text-4xl md:text-6xl font-syne font-black mb-2 uppercase tracking-tighter">SETTINGS</h1>
        <p className="text-zinc-500 mb-8 font-medium">Manage your identity and delivery preferences.</p>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <User className="text-amber-500" size={24} />
                    <h2 className="text-xl font-syne font-bold uppercase">Profile Details</h2>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Full Name</label>
                        <input 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="Kwame Doe"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Email Address</label>
                        <input 
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="kwame@example.com"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Phone Number</label>
                        <input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="+233 55 123 4567"
                        />
                    </div>
                </div>
            </div>

            {/* Address Info */}
            <div className="space-y-6">
                 <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <MapPin className="text-amber-500" size={24} />
                        <h2 className="text-xl font-syne font-bold uppercase">Default Delivery</h2>
                    </div>
                    <button 
                        type="button"
                        onClick={handleUseLocation}
                        disabled={isLocating}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        {isLocating ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} />}
                        {isLocating ? 'Locating...' : 'Use My Location'}
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Street Address</label>
                        <input 
                            name="street"
                            value={formData.address.street}
                            onChange={handleAddressChange}
                            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="54 Independence Ave"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">City</label>
                            <input 
                                name="city"
                                value={formData.address.city}
                                onChange={handleAddressChange}
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="Accra"
                            />
                        </div>
                         <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">State/Region</label>
                            <input 
                                name="state"
                                value={formData.address.state}
                                onChange={handleAddressChange}
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="Greater Accra"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Zip/Post Code</label>
                            <input 
                                name="zip"
                                value={formData.address.zip}
                                onChange={handleAddressChange}
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="00233"
                            />
                        </div>
                         <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Country</label>
                            <input 
                                name="country"
                                value={formData.address.country}
                                readOnly
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-amber-500 outline-none text-zinc-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 pt-6">
                <button 
                    type="submit"
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all flex items-center justify-center gap-2 ${
                        saved 
                        ? 'bg-green-500 text-white'
                        : 'bg-black dark:bg-white text-white dark:text-black hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-black shadow-xl'
                    }`}
                >
                    {saved ? <><CheckCircle2 /> SAVED</> : <><Save size={20} /> SAVE CHANGES</>}
                </button>
            </div>
        </form>
    </div>
  );
};

export default SettingsPage;
