import React, { useState, useEffect } from 'react';
import { PRINTOUT_COLORS, SIZE_CHART } from '../constants';
import { useApp } from '../App';
import { Save, Check, Ruler, Upload, Palette, Type, RefreshCcw, Eye, Shirt, Loader2, Sparkles, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Product } from '../types';
import JerseyPreview from '../components/JerseyPreview';
import { supabaseService } from '../services/supabaseService';

const ATHLETIC_FONTS = [
  { id: 'futuristic', name: 'FUTURISTIC', family: "'Syne', sans-serif" },
  { id: 'angular', name: 'ANGULAR', family: "'Bebas Neue', sans-serif" },
  { id: 'collegiate', name: 'COLLEGIATE', family: "'Space Grotesk', sans-serif" },
  { id: 'varsity', name: 'VARSITY', family: "serif" },
];

const STYLES = [
  { id: 'dark', name: 'DARK ELITE', torso: '#121212', sleeve: '#121212', collar: '#fbbf24', accent: '#1DB954' },
  { id: 'light', name: 'PURE LIGHT', torso: '#ffffff', sleeve: '#ffffff', collar: '#2563eb', accent: '#dc2626' },
];

const SIZES = Object.keys(SIZE_CHART) as Array<keyof typeof SIZE_CHART>;
type TextSize = 'S' | 'M' | 'L';

const CustomizerPage: React.FC = () => {
  const { addToCart, notify } = useApp();
  const location = useLocation();
  
  const [styles, setStyles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'athletic' | 'printout'>('athletic');
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');
  const [activeStyle, setActiveStyle] = useState('dark');
  const [frontImage, setFrontImage] = useState('');
  const [backImage, setBackImage] = useState('');

  // JERSEY STATE
  const [torsoColor, setTorsoColor] = useState('#121212');
  const [sleeveColor, setSleeveColor] = useState('#121212');
  const [collarColor, setCollarColor] = useState('#fbbf24');
  const [collarType, setCollarType] = useState<'v-neck' | 'crew' | 'polo'>('v-neck');
  const [accentColor, setAccentColor] = useState('#1DB954'); // Side stripe
  const [showMap, setShowMap] = useState(false); // For light kit map watermark

  // IDENTITY
  const [name, setName] = useState('YOUR NAME');
  const [number, setNumber] = useState('54');
  const [nameSize, setNameSize] = useState<TextSize>('M');
  const [numberSize, setNumberSize] = useState<TextSize>('M');
  const [athleticFont, setAthleticFont] = useState(ATHLETIC_FONTS[0]);

  // PRINTOUT STATE
  const [printText, setPrintText] = useState('STREET VIBE');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // SHARED
  const [selectedSize, setSelectedSize] = useState('L');
  const [draftSaved, setDraftSaved] = useState(false);

  const applyStyle = (style: any) => {
    setActiveStyle(style.id);
    setTorsoColor(style.torso_color);
    setSleeveColor(style.sleeve_color);
    setCollarColor(style.collar_color);
    setAccentColor(style.accent_color);
    setFrontImage(style.image_url);
    setBackImage(style.image_url_back);
    setShowMap(style.id === 'light');
  };

  useEffect(() => {
    const loadStyles = async () => {
      try {
        const data = await supabaseService.getGarmentStyles();
        if (data && data.length > 0) {
          setStyles(data);
          const initial = data.find(s => s.id === 'dark') || data[0];
          applyStyle(initial);
        } else {
          // Hardcoded fallbacks if DB is empty
          const fallbackStyles = [
            { id: 'dark', name: 'DARK ELITE', torso_color: '#121212', sleeve_color: '#121212', collar_color: '#fbbf24', accent_color: '#1DB954', image_url: 'https://hsctgucjbzbxmzcgpgga.supabase.co/storage/v1/object/public/assets/dark-front.png', image_url_back: 'https://hsctgucjbzbxmzcgpgga.supabase.co/storage/v1/object/public/assets/dark-back.png' },
            { id: 'light', name: 'PURE LIGHT', torso_color: '#ffffff', sleeve_color: '#ffffff', collar_color: '#3F2A1D', accent_color: '#3F2A1D', image_url: 'https://hsctgucjbzbxmzcgpgga.supabase.co/storage/v1/object/public/assets/light-front.png', image_url_back: 'https://hsctgucjbzbxmzcgpgga.supabase.co/storage/v1/object/public/assets/light-back.png' }
          ];
          setStyles(fallbackStyles);
          applyStyle(fallbackStyles[0]);
        }
      } catch (err) {
        console.error("Failed to load styles:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStyles();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicUrl = await supabaseService.uploadDesignImage(file);
        setUploadedImage(publicUrl);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleSave = () => {
    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      name: mode === 'athletic' 
        ? (torsoColor === '#121212' ? 'PAN AFRICAN DARK KIT' : 'PAN AFRICAN LIGHT KIT')
        : 'CUSTOM STREET PRINTOUT',
      price: mode === 'athletic' ? 90 : 65,
      image: mode === 'athletic' 
        ? (torsoColor === '#121212' ? 'https://images.unsplash.com/photo-1637822412497-69b5b2257f00?auto=format&fit=crop&q=80&w=800' : 'https://images.unsplash.com/photo-1562869319-3c8327429d25?auto=format&fit=crop&q=80&w=800')
        : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
      category: mode === 'athletic' ? 'Heritage' : 'Modern',
      subcategory: mode === 'athletic' ? 'jerseys' : 't-shirts',
      description: `Custom ${mode} design. Size ${selectedSize}.`
    };

    addToCart(customProduct, {
      mode,
      name,
      number,
      nameSize,
      numberSize,
      primaryColor: torsoColor,
      secondaryColor: sleeveColor,
      accentColor: accentColor,
      collarColor: collarColor,
      collarType: collarType,
      showPattern: showMap,
      uploadedImage,
      printText,
      size: selectedSize
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      {loading ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">Initializing Lab...</p>
        </div>
      ) : (
        <>
          {/* Mode Switcher */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl flex gap-1 shadow-inner">
          <button 
            onClick={() => setMode('athletic')}
            className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
              mode === 'athletic' 
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
              : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Pro Athletic
          </button>
          <button 
             onClick={() => setMode('printout')}
             className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
              mode === 'printout' 
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
              : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Street Print
          </button>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl flex gap-1 shadow-inner">
          <button 
            onClick={() => setViewSide('front')}
            className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 ${
              viewSide === 'front' 
              ? 'bg-amber-500 text-black shadow-lg' 
              : 'text-zinc-400'
            }`}
          >
            <Eye size={14} /> Front
          </button>
          <button 
             onClick={() => setViewSide('back')}
             className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 ${
              viewSide === 'back' 
              ? 'bg-amber-500 text-black shadow-lg' 
              : 'text-zinc-400'
            }`}
          >
            <Eye size={14} /> Back
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* REALISTIC JERSEY PREVIEW */}
        <div className="flex-1 w-full lg:sticky lg:top-32 h-fit flex justify-center">
          <JerseyPreview 
            mode={mode}
            viewSide={viewSide}
            torsoColor={torsoColor}
            sleeveColor={sleeveColor}
            collarColor={collarColor}
            collarType={collarType}
            accentColor={accentColor}
            showMap={showMap}
            name={name}
            number={number}
            nameSize={nameSize}
            numberSize={numberSize}
            athleticFontFamily={athleticFont.family}
            printText={printText}
            uploadedImage={uploadedImage}
            frontImage={frontImage}
            backImage={backImage}
          />
        </div>

        {/* CONTROLS AREA */}
        <div className="w-full lg:w-[480px] space-y-10">
           <div>
               <h2 className="text-4xl font-syne font-black uppercase mb-1 tracking-tighter">Design Lab</h2>
               <p className="text-zinc-500 text-sm font-medium">
                   {mode === 'athletic' ? 'Customize your Pan African Heritage Kit.' : 'Create your unique streetwear print.'}
               </p>
           </div>

           {/* THEME SELECTION */}
           <div className="space-y-6">
               <div className="flex items-center gap-2 mb-2">
                   <Sparkles size={18} className="text-amber-500" />
                   <h3 className="text-xs font-black uppercase tracking-widest">Base Theme</h3>
               </div>

               <div className="grid grid-cols-2 gap-4">
                   {styles.map(style => (
                       <button 
                        key={style.id} 
                        onClick={() => applyStyle(style)}
                        className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${activeStyle === style.id ? 'border-amber-500 bg-amber-500/10 shadow-lg' : 'border-zinc-100 dark:border-zinc-800'}`}
                       >
                           <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                                <img src={style.image_url} alt={style.name} className="w-full h-full object-cover" />
                                {/* Small Color Box Overlay */}
                                <div className="absolute bottom-2 right-2 flex gap-1 bg-black/20 backdrop-blur-md p-1 rounded-lg border border-white/10">
                                    <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: style.torso_color }} />
                                    <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: style.collar_color }} />
                                </div>
                           </div>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${activeStyle === style.id ? 'text-amber-600' : 'text-zinc-500'}`}>{style.id}</span>
                       </button>
                   ))}
               </div>
           </div>

           {/* FONT SECTION */}
           <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Type size={18} className="text-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Typography</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {ATHLETIC_FONTS.map(font => (
                        <button 
                            key={font.id} 
                            onClick={() => setAthleticFont(font)}
                            className={`py-4 px-2 rounded-xl border-2 text-xs font-black transition-all ${athleticFont.id === font.id ? 'border-amber-500 bg-amber-500 text-black shadow-md' : 'border-zinc-100 dark:border-zinc-800 text-zinc-400'}`}
                            style={{ fontFamily: font.family }}
                        >
                            {font.name}
                        </button>
                    ))}
                </div>
           </div>

           {/* IDENTITY SECTION */}
           {mode === 'athletic' ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Shirt size={18} className="text-amber-500" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Player Details</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Squad Name</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={12} className="w-full bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Squad Number</label>
                                <input value={number} onChange={(e) => setNumber(e.target.value)} maxLength={2} className="w-full bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl font-bold uppercase text-center outline-none focus:ring-2 focus:ring-amber-500 transition-all text-2xl" />
                            </div>
                    </div>
                </div>
           ) : (
             /* Printout Inputs */
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <Type size={18} className="text-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Print Details</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Street Text</label>
                        <input value={printText} onChange={(e) => setPrintText(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-amber-500" placeholder="STREET VIBE" />
                    </div>
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Graphic Overlay</label>
                        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center hover:border-amber-500 transition-colors relative cursor-pointer">
                           <Upload size={24} className="mx-auto mb-2 text-zinc-400" />
                           <span className="text-xs font-bold text-zinc-500 uppercase">Upload PNG/JPG</span>
                           <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>
                </div>
              </div>
           )}

           {/* SIZE & ACTIONS */}
           <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-8">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 block flex items-center gap-2">
                        <Ruler size={14} /> Global Sizing
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {SIZES.map((size) => (
                            <button key={size} onClick={() => setSelectedSize(size)} className={`min-w-[3.5rem] py-3 rounded-xl border-2 transition-all font-black text-xs ${selectedSize === size ? 'border-amber-500 bg-amber-500 text-black' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'}`}>
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button onClick={handleSave} className="w-full bg-amber-500 hover:bg-amber-600 text-black py-5 rounded-2xl font-syne font-black text-lg tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                        <Save size={20} />
                        ADD TO BAG - ${mode === 'athletic' ? 90 : 65}
                    </button>
                    <button 
                      onClick={() => { setDraftSaved(true); setTimeout(() => setDraftSaved(false), 2000); }} 
                      className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs border-2 transition-all flex items-center justify-center gap-2 ${draftSaved ? 'bg-green-500 border-green-500 text-white' : 'border-zinc-200 text-zinc-500 hover:border-black'}`}
                    >
                      {draftSaved ? <><Check size={16} /> Saved to Tribe</> : <><RefreshCcw size={16} /> Reset Design</>}
                    </button>
                </div>
           </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default CustomizerPage;
