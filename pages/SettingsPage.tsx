
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Save, MapPin, User, CheckCircle2, LocateFixed, Loader2, Camera, Upload } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useApp();
  const [formData, setFormData] = useState(user);
  const [saved, setSaved] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    let updatedData = { ...user };
    
    // Ensure India is set if not already
    if (updatedData.address.country !== 'India') {
      updatedData.address = { ...updatedData.address, country: 'India' };
    }

    // Default to Indian prefix if phone is empty
    if (!updatedData.phone) {
        updatedData.phone = '+91 ';
    }

    setFormData(updatedData);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
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
              country: 'India'
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
        <p className="text-zinc-500 mb-8 font-medium">Manage your identity, profile picture, and delivery preferences.</p>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <User className="text-amber-500" size={24} />
                    <h2 className="text-xl font-syne font-bold uppercase">Identity</h2>
                </div>
                
                {/* Profile Picture Upload */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 group">
                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                <User size={40} />
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                            <Upload size={20} />
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm uppercase mb-1">Profile Photo</h3>
                        <p className="text-xs text-zinc-500 mb-2">Upload from your media files.</p>
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-black uppercase cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <Camera size={14} /> Upload New
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
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
                            readOnly
                            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-amber-500 outline-none opacity-60 cursor-not-allowed"
                            title="Email used for login cannot be changed"
                        />
                         <p className="text-[10px] text-zinc-500 mt-1">Email is locked to your 54 Street access.</p>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Phone Number</label>
                        <input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="+91 98765 43210"
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
