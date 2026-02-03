
import React, { useState, useEffect } from 'react';
import { PRINTOUT_COLORS, SIZE_CHART } from '../constants';
import { useApp } from '../App';
import { Save, Info, Check, Ruler, Upload, Shirt, Layout, Type } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Product } from '../types';

const ATHLETIC_FONTS = [
  { id: 'college', name: 'VARSITY', family: "'Space Grotesk', sans-serif", letterSpacing: '0.05em' },
  { id: 'impact', name: 'IMPACT', family: "'Syne', sans-serif", letterSpacing: '0.1em' },
];

const PRINTOUT_FONTS = [
  { id: 'marker', name: 'MARKER', family: "'Syne', sans-serif" },
  { id: 'clean', name: 'CLEAN', family: "'Poppins', sans-serif" },
  { id: 'rough', name: 'ROUGH', family: "'Space Grotesk', sans-serif" }
];

const SIZES = Object.keys(SIZE_CHART) as Array<keyof typeof SIZE_CHART>;

const CustomizerPage: React.FC = () => {
  const { addToCart } = useApp();
  const location = useLocation();
  
  // MAIN MODE STATE
  const [mode, setMode] = useState<'athletic' | 'printout'>('athletic');

  // Check for incoming state from ShopPage
  useEffect(() => {
      if (location.state && location.state.mode) {
          setMode(location.state.mode);
      }
  }, [location]);

  // ATHLETIC STATE
  const [kitType, setKitType] = useState<'dark' | 'light'>('dark');
  const [name, setName] = useState('YOUR NAME');
  const [number, setNumber] = useState('54');
  const [layout, setLayout] = useState<'name-top' | 'number-top'>('name-top');
  const [athleticFont, setAthleticFont] = useState(ATHLETIC_FONTS[0]);

  // PRINTOUT STATE
  const [baseColor, setBaseColor] = useState(PRINTOUT_COLORS[0]);
  const [printContent, setPrintContent] = useState<'text' | 'image'>('text');
  const [printText, setPrintText] = useState('STREET VIBE');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [printFont, setPrintFont] = useState(PRINTOUT_FONTS[0]);
  const [placement, setPlacement] = useState<'front' | 'back'>('front');

  // SHARED STATE
  const [selectedSize, setSelectedSize] = useState('L');
  const [draftSaved, setDraftSaved] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      name: mode === 'athletic' ? `PAN AFRICAN ${kitType.toUpperCase()} KIT` : `CUSTOM PRINT ${baseColor.name.toUpperCase()}`,
      price: mode === 'athletic' ? 120 : 65,
      image: mode === 'athletic' 
        ? 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
      category: 'Modern',
      subcategory: mode === 'athletic' ? 'clothing' : 'hoodies', // Default subcat for custom items
      description: `Custom ${mode} design. Size ${selectedSize}.`
    };

    addToCart(customProduct, {
      mode,
      name,
      number,
      layout,
      kit: kitType,
      baseColor: baseColor.hex,
      uploadedImage,
      printText,
      printFont: mode === 'athletic' ? athleticFont.name : printFont.name,
      placement,
      size: selectedSize
    });
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      {/* Mode Switcher */}
      <div className="flex justify-center mb-12">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl flex gap-1">
          <button 
            onClick={() => setMode('athletic')}
            className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${
              mode === 'athletic' 
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
              : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Athletic (Pan African)
          </button>
          <button 
             onClick={() => setMode('printout')}
             className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${
              mode === 'printout' 
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
              : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Printouts (Street)
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
        {/* PREVIEW AREA */}
        <div className="flex-1 w-full lg:sticky lg:top-32 h-fit">
          <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] md:rounded-[3rem] overflow-hidden border-4 border-zinc-200 dark:border-zinc-700 shadow-2xl flex items-center justify-center p-6">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-black opacity-80" />
              
              {/* Dynamic Jersey/Tee SVG */}
              <div className="relative w-full max-w-lg h-full z-10">
                <svg viewBox="0 0 500 600" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <defs>
                    <clipPath id="shirtShape">
                       <path d="M 200 50 Q 250 80 300 50 L 450 100 L 410 230 L 350 200 L 350 550 L 150 550 L 150 200 L 90 230 L 50 100 L 200 50 Z" />
                    </clipPath>
                  </defs>

                  {/* Base Layer */}
                  <g clipPath="url(#shirtShape)">
                    <rect 
                        width="500" height="600" 
                        fill={
                            mode === 'athletic' 
                                ? (kitType === 'dark' ? '#18181b' : '#f4f4f5') 
                                : baseColor.hex 
                        } 
                    />
                    
                    {/* Athletic Accents */}
                    {mode === 'athletic' && (
                        <>
                           {kitType === 'dark' ? (
                                <path d="M0 0 L150 200 M500 0 L350 200" stroke="#fbbf24" strokeWidth="15" strokeOpacity="0.8" />
                           ) : (
                                <path d="M0 0 L150 200 M500 0 L350 200" stroke="#008751" strokeWidth="15" strokeOpacity="0.8" />
                           )}
                           <rect x="230" y="50" width="40" height="500" fill="transparent" />
                        </>
                    )}
                  </g>

                  {/* Shadows/Texture Overlay */}
                  <path 
                    d="M 200 50 Q 250 80 300 50 L 450 100 L 410 230 L 350 200 L 350 550 L 150 550 L 150 200 L 90 230 L 50 100 L 200 50 Z" 
                    fill="url(#folds)"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="2"
                    fillOpacity="0.2"
                  />

                  {/* ATHLETIC CONTENT */}
                  {mode === 'athletic' && (
                      <g transform="translate(250, 300)" textAnchor="middle">
                         <text 
                            y={layout === 'name-top' ? -80 : 120}
                            fill={kitType === 'dark' ? '#fbbf24' : '#008751'}
                            style={{ 
                                fontFamily: athleticFont.family, 
                                fontSize: '42px', 
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase'
                            }}
                         >
                            {name}
                         </text>
                         <text 
                            y={layout === 'name-top' ? 100 : -60}
                            fill={kitType === 'dark' ? 'white' : 'black'}
                            style={{ 
                                fontFamily: athleticFont.family, 
                                fontSize: '180px', 
                                fontWeight: 900
                            }}
                         >
                            {number}
                         </text>
                      </g>
                  )}

                  {/* PRINTOUT CONTENT */}
                  {mode === 'printout' && (
                      <g transform="translate(250, 280)">
                          {/* Visual simulation of front/back just by content opacity or position for now */}
                          {printContent === 'image' && uploadedImage ? (
                              <image 
                                x="-100" y="-100" width="200" height="200" 
                                href={uploadedImage} 
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="inset(0% round 10px)"
                              />
                          ) : (
                              <text 
                                textAnchor="middle"
                                y="0"
                                fill={['#ffffff', '#f4f4f5'].includes(baseColor.hex) ? 'black' : 'white'}
                                style={{ 
                                    fontFamily: printFont.family, 
                                    fontSize: '50px', 
                                    fontWeight: 800,
                                    textTransform: 'uppercase'
                                }}
                              >
                                  {printText}
                              </text>
                          )}
                          <text y="180" textAnchor="middle" fill="rgba(0,0,0,0.2)" fontSize="12" fontWeight="bold">
                              {placement === 'front' ? 'FRONT PRINT' : 'BACK PRINT'}
                          </text>
                      </g>
                  )}
                </svg>
              </div>
          </div>
        </div>

        {/* CONTROLS AREA */}
        <div className="w-full lg:w-[480px]">
           {/* ATHLETIC CONTROLS */}
           {mode === 'athletic' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                   <div>
                       <h2 className="text-3xl font-syne font-black uppercase mb-1">Pan African Kit</h2>
                       <p className="text-zinc-500 text-sm">Official athletic wear. Performance mesh.</p>
                   </div>

                   <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block">Select Kit</label>
                       <div className="grid grid-cols-2 gap-4">
                           <button 
                                onClick={() => setKitType('dark')}
                                className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${kitType === 'dark' ? 'border-amber-500 bg-zinc-900 text-white' : 'border-zinc-200'}`}
                           >
                               <span className="font-bold uppercase">Dark (Gold/Blk)</span>
                               {kitType === 'dark' && <Check size={16} className="text-amber-500" />}
                           </button>
                           <button 
                                onClick={() => setKitType('light')}
                                className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${kitType === 'light' ? 'border-green-600 bg-white text-black' : 'border-zinc-200'}`}
                           >
                               <span className="font-bold uppercase">Light (Grn/Wht)</span>
                               {kitType === 'light' && <Check size={16} className="text-green-600" />}
                           </button>
                       </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={12} className="w-full bg-zinc-100 dark:bg-zinc-900 p-3 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Number</label>
                            <input value={number} onChange={(e) => setNumber(e.target.value)} maxLength={2} className="w-full bg-zinc-100 dark:bg-zinc-900 p-3 rounded-xl font-bold uppercase text-center outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                   </div>

                   <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block">Layout Configuration</label>
                       <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
                           <button 
                                onClick={() => setLayout('name-top')}
                                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase transition-all ${layout === 'name-top' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-zinc-500'}`}
                           >
                               Name Top / Num Btm
                           </button>
                           <button 
                                onClick={() => setLayout('number-top')}
                                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase transition-all ${layout === 'number-top' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-zinc-500'}`}
                           >
                               Num Top / Name Btm
                           </button>
                       </div>
                   </div>

                   <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block">Typography</label>
                       <div className="flex gap-2">
                           {ATHLETIC_FONTS.map(font => (
                               <button 
                                key={font.id}
                                onClick={() => setAthleticFont(font)}
                                className={`flex-1 py-3 border-2 rounded-xl uppercase font-bold text-xs transition-all ${athleticFont.id === font.id ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-200'}`}
                                style={{ fontFamily: font.family }}
                               >
                                   {font.name}
                               </button>
                           ))}
                       </div>
                   </div>
               </div>
           )}

           {/* PRINTOUT CONTROLS */}
           {mode === 'printout' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                   <div>
                       <h2 className="text-3xl font-syne font-black uppercase mb-1">Street Printout</h2>
                       <p className="text-zinc-500 text-sm">Heavyweight cotton tee. Direct-to-garment print.</p>
                   </div>

                   <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block">Base Color</label>
                       <div className="flex gap-3 flex-wrap">
                           {PRINTOUT_COLORS.map(c => (
                               <button 
                                key={c.name}
                                onClick={() => setBaseColor(c)}
                                className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${c.class} ${baseColor.hex === c.hex ? 'ring-2 ring-offset-2 ring-black dark:ring-white scale-110' : 'border-zinc-200'}`}
                                title={c.name}
                               />
                           ))}
                       </div>
                   </div>

                   <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block">Content Type</label>
                       <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl mb-4">
                           <button onClick={() => setPrintContent('text')} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase ${printContent === 'text' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-zinc-500'}`}>Text</button>
                           <button onClick={() => setPrintContent('image')} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase ${printContent === 'image' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-zinc-500'}`}>Image Upload</button>
                       </div>

                       {printContent === 'text' ? (
                           <div className="space-y-3">
                               <input value={printText} onChange={(e) => setPrintText(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-900 p-3 rounded-xl font-bold outline-none" placeholder="ENTER TEXT" />
                               <div className="flex gap-2">
                                   {PRINTOUT_FONTS.map(f => (
                                       <button key={f.id} onClick={() => setPrintFont(f)} className={`flex-1 py-2 border rounded-lg text-xs font-bold uppercase ${printFont.id === f.id ? 'border-black dark:border-white bg-zinc-100 dark:bg-zinc-800' : 'border-zinc-200'}`} style={{ fontFamily: f.family }}>{f.name}</button>
                                   ))}
                               </div>
                           </div>
                       ) : (
                           <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 text-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer relative">
                               <Upload className="mx-auto mb-2 text-zinc-400" />
                               <span className="text-xs font-bold text-zinc-500 uppercase">Click to Upload Image</span>
                               <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                       )}
                   </div>

                   <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block">Print Placement</label>
                       <div className="flex gap-4">
                           <button onClick={() => setPlacement('front')} className={`flex-1 py-3 border-2 rounded-xl font-bold text-xs uppercase ${placement === 'front' ? 'border-black dark:border-white' : 'border-zinc-200'}`}>Front</button>
                           <button onClick={() => setPlacement('back')} className={`flex-1 py-3 border-2 rounded-xl font-bold text-xs uppercase ${placement === 'back' ? 'border-black dark:border-white' : 'border-zinc-200'}`}>Back</button>
                       </div>
                   </div>
               </div>
           )}

           {/* SHARED SIZE CHART */}
           <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                    <Ruler size={14} /> Size Selection
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[3.5rem] py-3 rounded-xl border-2 transition-all font-black text-xs group relative ${
                            selectedSize === size
                                ? 'border-amber-500 bg-amber-500 text-black'
                                : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'
                            }`}
                        >
                            {size}
                            {/* Hover Tooltip for Chest/Neck */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-black text-white p-2 rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                <div className="flex justify-between"><span>Chest:</span> <span>{SIZE_CHART[size].chest}</span></div>
                                <div className="flex justify-between"><span>Neck:</span> <span>{SIZE_CHART[size].neck}</span></div>
                            </div>
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 text-center">Hover over size for chest & neck measurements.</p>
           </div>

           {/* ACTION BUTTONS */}
           <div className="mt-10 space-y-3">
                <button 
                onClick={handleSave}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black py-5 rounded-2xl font-syne font-black text-lg tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                <Save size={20} />
                ADD TO BAG - ${mode === 'athletic' ? '120' : '65'}
                </button>
                <button 
                    onClick={handleSaveDraft}
                    className={`w-full py-5 rounded-2xl font-bold text-sm tracking-widest transition-all border flex items-center justify-center gap-2 ${
                        draftSaved 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                    }`}
                >
                {draftSaved ? <><Check size={18} /> SAVED</> : 'SAVE DRAFT'}
                </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizerPage;
