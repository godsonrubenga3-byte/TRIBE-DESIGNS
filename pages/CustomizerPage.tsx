
import React, { useState, useEffect } from 'react';
import { PRINTOUT_COLORS, SIZE_CHART } from '../constants';
import { useApp } from '../App';
import { Save, Check, Ruler, Upload, Palette, Type, RefreshCcw, Eye, Shirt } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Product } from '../types';

const ATHLETIC_FONTS = [
  { id: 'college', name: 'VARSITY', family: "'Space Grotesk', sans-serif", letterSpacing: '0.05em' },
  { id: 'impact', name: 'IMPACT', family: "'Syne', sans-serif", letterSpacing: '0.1em' },
];

const COLORS = [
  { name: 'Pitch Black', hex: '#121212' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Amber Gold', hex: '#fbbf24' },
  { name: 'Heritage Green', hex: '#1DB954' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Fire Red', hex: '#dc2626' },
  { name: 'Stone Grey', hex: '#e4e4e7' },
  { name: 'Desert Sand', hex: '#d4d4d8' },
];

const SIZES = Object.keys(SIZE_CHART) as Array<keyof typeof SIZE_CHART>;
type TextSize = 'S' | 'M' | 'L';

const CustomizerPage: React.FC = () => {
  const { addToCart } = useApp();
  const location = useLocation();
  
  const [mode, setMode] = useState<'athletic' | 'printout'>('athletic');
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  // JERSEY STATE
  const [torsoColor, setTorsoColor] = useState('#121212');
  const [sleeveColor, setSleeveColor] = useState('#121212');
  const [collarColor, setCollarColor] = useState('#fbbf24');
  const [accentColor, setAccentColor] = useState('#1DB954'); // Side stripe
  const [showMap, setShowMap] = useState(false); // For light kit map watermark

  // IDENTITY
  const [name, setName] = useState('YOUR NAME');
  const [number, setNumber] = useState('54');
  const [nameSize, setNameSize] = useState<TextSize>('M');
  const [numberSize, setNumberSize] = useState<TextSize>('M');
  const [athleticFont, setAthleticFont] = useState(ATHLETIC_FONTS[1]);

  // PRINTOUT STATE
  const [printText, setPrintText] = useState('STREET VIBE');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // SHARED
  const [selectedSize, setSelectedSize] = useState('L');
  const [draftSaved, setDraftSaved] = useState(false);

  // Initialize based on selection from Shop
  useEffect(() => {
    if (location.state && location.state.preselectedItem) {
      const item = location.state.preselectedItem;
      if (location.state.mode) {
          setMode(location.state.mode);
      }
      
      if (item.includes('LIGHT')) {
        // Pan African Light Kit Defaults
        setTorsoColor('#e4e4e7'); // Stone Grey
        setSleeveColor('#e4e4e7');
        setCollarColor('#2563eb'); // Blue
        setAccentColor('#dc2626'); // Red Side Stripe
        setShowMap(true);
      } else if (item.includes('DARK')) {
        // Pan African Dark Kit Defaults
        setTorsoColor('#121212'); // Black
        setSleeveColor('#121212');
        setCollarColor('#fbbf24'); // Gold
        setAccentColor('#1DB954'); // Green Side Stripe
        setShowMap(false);
      }
    }
  }, [location]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
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
      showPattern: showMap,
      uploadedImage,
      printText,
      size: selectedSize
    });
  };

  // --- STYLE HELPERS ---
  const getNameSizeClass = (size: TextSize, view: 'front' | 'back') => {
      if (view === 'front') {
        switch(size) {
            case 'S': return 'text-xl';
            case 'M': return 'text-3xl';
            case 'L': return 'text-5xl';
        }
      } else {
        switch(size) {
            case 'S': return 'text-2xl';
            case 'M': return 'text-4xl';
            case 'L': return 'text-6xl';
        }
      }
  };

  const getNumberSizeClass = (size: TextSize, view: 'front' | 'back') => {
      if (view === 'front') {
          switch(size) {
              case 'S': return 'text-[100px]';
              case 'M': return 'text-[140px]';
              case 'L': return 'text-[180px]';
          }
      } else {
           switch(size) {
              case 'S': return 'text-[150px]';
              case 'M': return 'text-[200px]';
              case 'L': return 'text-[250px]';
          }
      }
  };

  // --- SVG COMPONENTS ---

  const AfricaMapWatermark = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
       <path d="M100,20 C110,15 120,25 125,30 C130,35 140,40 145,50 C150,60 160,65 155,80 C150,95 160,110 150,130 C140,150 120,170 100,180 C80,170 60,150 50,130 C40,110 50,95 45,80 C40,65 50,60 55,50 C60,40 70,35 75,30 C80,25 90,15 100,20 Z" fill={collarColor} />
    </svg>
  );

  const ShieldLogo = ({ className }: { className?: string }) => (
    <div className={`${className} flex flex-col items-center border-2 p-1 rounded-t-sm rounded-b-xl relative bg-black/10 backdrop-blur-sm`} style={{ borderColor: collarColor }}>
      <span className="text-[6px] font-bold uppercase" style={{ color: collarColor }}>Tribe Designs</span>
      <span className="text-xs font-bold" style={{ color: collarColor }}>54</span>
      <div className="flex gap-0.5 mt-0.5">
        {[1, 2, 3].map(i => <div key={i} className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: collarColor }} />)}
      </div>
    </div>
  );

  const CircleLogo = ({ className }: { className?: string }) => (
    <div className={`${className} flex flex-col items-center justify-center border-2 rounded-full p-1 bg-black/10 backdrop-blur-sm relative`} style={{ borderColor: collarColor }}>
       {/* Simplified Map Shape inside circle */}
       <svg viewBox="0 0 100 100" className="w-full h-full p-1">
         <path d="M30,40 Q40,20 60,30 T70,60 T40,80 T20,60 Z" fill={collarColor} />
       </svg>
       <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-50" style={{ borderColor: collarColor }}></div>
       <span className="absolute -bottom-4 text-[6px] font-black uppercase tracking-wider whitespace-nowrap" style={{ color: collarColor }}>PAN AFRICA</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
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
          <div className="relative w-full max-w-md h-[550px] transition-all duration-500 transform group">
            
            {/* MAIN BODY */}
            <div 
              className="absolute inset-x-12 top-6 bottom-0 rounded-t-[50px] shadow-2xl overflow-hidden border-x-[12px] transition-colors duration-500"
              style={{ backgroundColor: torsoColor, borderColor: accentColor }}
            >
              {mode === 'athletic' && showMap && <AfricaMapWatermark />}
              
              {/* Lighting Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none z-10" />

              {/* V-Neck Collar (Athletic Only or modified for Printout) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 clip-path-v-neck flex items-center justify-center transition-colors duration-500 z-20" style={{ backgroundColor: collarColor }}>
                  <div className="w-28 h-12 bg-inherit clip-path-v-neck mt-3 brightness-75" style={{ backgroundColor: torsoColor }}></div>
              </div>

              {/* CONTENT - FRONT */}
              {viewSide === 'front' && (
                <div className="relative h-full pt-28 px-8 flex flex-col items-center z-20 animate-in fade-in duration-500">
                  
                  {mode === 'athletic' ? (
                    <>
                      <div className="flex justify-between w-full mb-12 px-2">
                        <ShieldLogo className="w-16 h-16" />
                        <CircleLogo className="w-16 h-16" />
                      </div>
                      
                      <div className="flex flex-col items-center w-full">
                         {/* TRBE DESIGNS TEXT */}
                         <h2 className="text-3xl font-black tracking-widest uppercase mb-12 text-center w-full" style={{ fontFamily: 'Syne', color: collarColor }}>
                            TRBE DESIGNS
                         </h2>
                      </div>
                    </>
                  ) : (
                    /* PRINTOUT FRONT */
                    <div className="flex flex-col items-center justify-center flex-1 pb-20 w-full">
                       {uploadedImage ? (
                        <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 rotate-2">
                           <img src={uploadedImage} className="w-full h-full object-cover" alt="Custom" />
                        </div>
                      ) : (
                        <div className="border-4 border-dashed border-white/30 p-4 w-full h-64 flex items-center justify-center">
                            <h2 className="text-4xl font-black tracking-tighter uppercase text-center text-white break-words w-full" style={{ fontFamily: 'Syne' }}>
                            {printText || 'YOUR PRINT'}
                            </h2>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CONTENT - BACK */}
              {viewSide === 'back' && (
                <div className="relative h-full pt-16 px-8 flex flex-col items-center z-20 animate-in fade-in duration-500">
                   
                   {mode === 'athletic' ? (
                     <>
                        <span className="text-sm font-black tracking-[0.3em] uppercase mb-12" style={{ color: collarColor }}>UNITY</span>
                        
                        <div className="flex flex-col items-center mt-auto mb-20 w-full">
                           {/* User Name */}
                            {name && (
                                <h2 className={`${getNameSizeClass(nameSize, 'back')} font-black tracking-[0.1em] uppercase mb-0 text-center w-full truncate`} style={{ color: collarColor, fontFamily: athleticFont.family }}>
                                    {name}
                                </h2>
                            )}
                            {/* User Number */}
                           <span className={`${getNumberSizeClass(numberSize, 'back')} font-black tracking-tighter leading-none drop-shadow-lg`} style={{ color: collarColor, fontFamily: athleticFont.family }}>
                                {number}
                           </span>
                        </div>
                     </>
                   ) : (
                      /* PRINTOUT BACK */
                      <div className="flex flex-col items-center justify-center h-full pb-20">
                          <h2 className="text-3xl font-black tracking-widest uppercase text-white/50 rotate-90 origin-center absolute right-4 top-1/2 -translate-y-1/2">
                              TRIBE
                          </h2>
                          <span className="text-xs text-white/50 font-mono absolute bottom-8">STREETWEAR EDITION</span>
                      </div>
                   )}
                </div>
              )}
            </div>

            {/* Sleeves */}
            {/* Left Sleeve */}
            <div 
              className="absolute top-16 -left-4 w-28 h-44 -rotate-[35deg] rounded-tl-[40px] border-b-[16px] overflow-hidden transition-all duration-500 shadow-lg"
              style={{ backgroundColor: sleeveColor, borderColor: collarColor }}
            >
              {mode === 'athletic' && showMap && <AfricaMapWatermark />}
              <div className="absolute inset-0 bg-black/10" />
            </div>
            {/* Right Sleeve */}
            <div 
              className="absolute top-16 -right-4 w-28 h-44 rotate-[35deg] rounded-tr-[40px] border-b-[16px] overflow-hidden transition-all duration-500 shadow-lg"
              style={{ backgroundColor: sleeveColor, borderColor: collarColor }}
            >
               {mode === 'athletic' && showMap && <AfricaMapWatermark />}
              <div className="absolute inset-0 bg-black/10" />
            </div>
            
            {/* Floor Shadow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[120%] h-12 bg-black/20 blur-2xl rounded-full" />
          </div>
        </div>

        {/* CONTROLS AREA */}
        <div className="w-full lg:w-[480px] space-y-10">
           <div>
               <h2 className="text-4xl font-syne font-black uppercase mb-1 tracking-tighter">Design Lab</h2>
               <p className="text-zinc-500 text-sm font-medium">
                   {mode === 'athletic' ? 'Customize your Pan African Heritage Kit.' : 'Create your unique streetwear print.'}
               </p>
           </div>

           {/* COLOR SECTIONS */}
           <div className="space-y-6">
               <div className="flex items-center gap-2 mb-2">
                   <Palette size={18} className="text-amber-500" />
                   <h3 className="text-xs font-black uppercase tracking-widest">
                       {mode === 'athletic' ? 'Kit Configuration' : 'Base Color'}
                   </h3>
               </div>

               <div className="space-y-6 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                   
                   {/* Torso */}
                   <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Base Color</label>
                       <div className="flex gap-2 flex-wrap">
                           {COLORS.map(c => (
                               <button key={c.hex} onClick={() => { setTorsoColor(c.hex); setSleeveColor(c.hex); }} className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${torsoColor === c.hex ? 'border-amber-500 ring-2 ring-amber-500 ring-offset-2' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} title={c.name} />
                           ))}
                       </div>
                   </div>

                   {mode === 'athletic' && (
                       <>
                        {/* Accents (Collar/Text) */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Accents (Logos & Collar)</label>
                            <div className="flex gap-2 flex-wrap">
                                {COLORS.map(c => (
                                    <button key={c.hex} onClick={() => setCollarColor(c.hex)} className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${collarColor === c.hex ? 'border-amber-500 ring-2 ring-amber-500 ring-offset-2' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} title={c.name} />
                                ))}
                            </div>
                        </div>

                        {/* Side Trim */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Side Trim</label>
                            <div className="flex gap-2 flex-wrap">
                                {COLORS.map(c => (
                                    <button key={c.hex} onClick={() => setAccentColor(c.hex)} className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${accentColor === c.hex ? 'border-amber-500 ring-2 ring-amber-500 ring-offset-2' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} title={c.name} />
                                ))}
                            </div>
                        </div>

                        {/* Map Toggle */}
                        <div className="flex justify-between items-center pt-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Africa Map Watermark</label>
                                <button onClick={() => setShowMap(!showMap)} className={`text-[10px] font-black px-3 py-1 rounded transition-colors ${showMap ? 'bg-amber-500 text-black' : 'bg-zinc-200 text-zinc-400'}`}>
                                    {showMap ? 'VISIBLE' : 'HIDDEN'}
                                </button>
                        </div>
                       </>
                   )}
               </div>
           </div>

           {/* IDENTITY SECTION */}
           {mode === 'athletic' ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Type size={18} className="text-amber-500" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Player Identity</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Last Name (Back)</label>
                                    <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
                                        {(['S', 'M', 'L'] as TextSize[]).map((s) => (
                                            <button 
                                                key={s} 
                                                onClick={() => setNameSize(s)}
                                                className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${nameSize === s ? 'bg-white dark:bg-zinc-600 shadow-sm text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={12} className="w-full bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Number (Back)</label>
                                    <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
                                        {(['S', 'M', 'L'] as TextSize[]).map((s) => (
                                            <button 
                                                key={s} 
                                                onClick={() => setNumberSize(s)}
                                                className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${numberSize === s ? 'bg-white dark:bg-zinc-600 shadow-sm text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <input value={number} onChange={(e) => setNumber(e.target.value)} maxLength={2} className="w-full bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl font-bold uppercase text-center outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
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
    </div>
  );
};

export default CustomizerPage;
