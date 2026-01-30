
import React, { useState } from 'react';
import { PATTERNS, COLORS } from '../constants';
import { useApp } from '../App';
import { Save, Info, Check, Type, Ruler } from 'lucide-react';

const FONT_OPTIONS = [
  { id: 'syne', name: 'TRIBE BOLD', family: "'Syne', sans-serif", letterSpacing: '0.1em' },
  { id: 'poppins', name: 'ATHLETIC', family: "'Poppins', sans-serif", letterSpacing: '0.05em' },
  { id: 'space', name: 'STREET', family: "'Space Grotesk', sans-serif", letterSpacing: '0.05em' }
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

const CustomizerPage: React.FC = () => {
  const { addToCart } = useApp();
  const [name, setName] = useState('YOUR NAME');
  const [number, setNumber] = useState('00');
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [selectedSize, setSelectedSize] = useState('L');
  const [draftSaved, setDraftSaved] = useState(false);

  const handleSave = () => {
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: `CUSTOM ${selectedPattern.name} JERSEY`,
      price: 120,
      image: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=800',
      category: 'Fusion' as const,
      description: `Custom ${selectedPattern.name} jersey with personalization.`
    };
    addToCart(customProduct, { 
        name, 
        number, 
        basePattern: selectedPattern.id, 
        accentColor: selectedColor.hex,
        font: selectedFont.id,
        size: selectedSize
    });
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Preview Area */}
        <div className="flex-1 w-full">
          <div className="lg:sticky lg:top-32">
            <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 border-zinc-200 dark:border-zinc-700 shadow-2xl flex items-center justify-center p-6 md:p-12">
               {/* Studio Background Effect */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-black opacity-80" />
              
              {/* Jersey SVG representation */}
              <div className="relative w-full max-w-lg h-full transition-all duration-500 group flex items-center justify-center z-10">
                <svg viewBox="0 0 500 600" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <defs>
                    {/* Realistic Texture Pattern */}
                    <pattern id="jerseyMesh" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
                        <circle cx="1.5" cy="1.5" r="0.5" fill="#000" fillOpacity="0.1" />
                    </pattern>
                    
                    {/* Cloth Folds Gradient */}
                    <linearGradient id="folds" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
                        <stop offset="20%" stopColor="#fff" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#000" stopOpacity="0.05" />
                        <stop offset="80%" stopColor="#fff" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
                    </linearGradient>

                    <clipPath id="jerseyShape">
                       <path d="M 200 50 Q 250 80 300 50 L 450 100 L 410 230 L 350 200 L 350 550 L 150 550 L 150 200 L 90 230 L 50 100 L 200 50 Z" />
                    </clipPath>
                  </defs>

                  {/* Jersey Body Base */}
                  <path 
                    d="M 200 50 Q 250 80 300 50 L 450 100 L 410 230 L 350 200 L 350 550 L 150 550 L 150 200 L 90 230 L 50 100 L 200 50 Z" 
                    fill={selectedColor.hex}
                    className="transition-colors duration-500"
                  />
                  
                  {/* Pattern Overlay */}
                  <rect 
                    x="0" 
                    y="0" 
                    width="500" 
                    height="600" 
                    fill="transparent" 
                    clipPath="url(#jerseyShape)" 
                  >
                     {/* Simplified pattern visual logic for SVG */}
                     {selectedPattern.id !== 'minimal' && (
                        <animate 
                            attributeName="fill" 
                            values="transparent" 
                            dur="0s" 
                            fill="freeze" 
                        />
                     )}
                  </rect>
                  {/* For specific patterns, we can use SVG patterns, but keeping it simple with color overlay for now or custom elements */}
                  {selectedPattern.id !== 'minimal' && (
                      <g clipPath="url(#jerseyShape)" className="opacity-10 mix-blend-multiply pointer-events-none">
                          <rect x="0" y="0" width="500" height="600" fill={selectedPattern.color.replace('bg-', '') === 'amber-500' ? 'orange' : 'black'} />
                          <path d="M0 0 L500 600 M500 0 L0 600" stroke="black" strokeWidth="5" />
                          <path d="M250 0 L250 600 M0 300 L500 300" stroke="black" strokeWidth="5" />
                      </g>
                  )}

                  {/* Texture & Folds Overlay */}
                  <path 
                    d="M 200 50 Q 250 80 300 50 L 450 100 L 410 230 L 350 200 L 350 550 L 150 550 L 150 200 L 90 230 L 50 100 L 200 50 Z" 
                    fill="url(#jerseyMesh)"
                    className="pointer-events-none"
                  />
                  <path 
                    d="M 200 50 Q 250 80 300 50 L 450 100 L 410 230 L 350 200 L 350 550 L 150 550 L 150 200 L 90 230 L 50 100 L 200 50 Z" 
                    fill="url(#folds)"
                    className="pointer-events-none mix-blend-overlay"
                  />

                  {/* Collar Detail */}
                  <path 
                    d="M 200 50 Q 250 80 300 50" 
                    fill="none" 
                    stroke="rgba(0,0,0,0.2)" 
                    strokeWidth="5"
                  />

                  {/* Personalization */}
                  <text 
                    x="250" y="200" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    fill="white" 
                    className="uppercase"
                    style={{ 
                        fontFamily: selectedFont.family,
                        fontSize: '36px',
                        fontWeight: 900,
                        letterSpacing: selectedFont.letterSpacing,
                        filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'
                    }}
                  >
                    {name || 'YOUR NAME'}
                  </text>
                  <text 
                    x="250" y="380" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    fill="white" 
                    style={{ 
                        fontFamily: selectedFont.family,
                        fontSize: '160px',
                        fontWeight: 900,
                        letterSpacing: '-0.05em',
                        filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.3))'
                    }}
                  >
                    {number || '00'}
                  </text>
                </svg>
              </div>
            </div>
            
            <div className="mt-4 md:mt-8 flex items-center gap-4 text-zinc-500 justify-center lg:justify-start">
              <Info size={16} />
              <p className="text-[10px] md:text-xs font-medium uppercase tracking-widest">3D Real-time visualization powered by TribeEngine™</p>
            </div>
          </div>
        </div>

        {/* Controls Area */}
        <div className="w-full lg:w-[450px] space-y-6 md:space-y-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-syne font-black mb-2 uppercase tracking-tighter">DESIGN LAB</h1>
            <p className="text-zinc-500 font-medium text-sm md:text-base">Create your legacy. Each piece is crafted by hand to your specs.</p>
          </div>

          {/* Text Inputs */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Name on Back</label>
                <input 
                  maxLength={10}
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 px-4 md:px-5 py-3 md:py-4 rounded-2xl font-bold uppercase focus:outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all text-sm md:text-base"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Number</label>
                <input 
                  maxLength={2}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 px-4 md:px-5 py-3 md:py-4 rounded-2xl font-bold focus:outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all text-center text-sm md:text-base"
                />
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                <Ruler size={12} /> Select Size
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 min-w-[3rem] py-3 md:py-3.5 rounded-xl border-2 transition-all font-black text-xs md:text-sm ${
                      selectedSize === size
                        ? 'border-amber-500 bg-amber-500 text-black'
                        : 'border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Selection */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                <Type size={12} /> Typography Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setSelectedFont(font)}
                    className={`px-3 py-3 rounded-xl border-2 transition-all text-center ${
                      selectedFont.id === font.id 
                        ? 'border-amber-500 bg-amber-500/10 text-black dark:text-white' 
                        : 'border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-black uppercase block" style={{ fontFamily: font.family }}>{font.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Patterns */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block">Tribal Pattern</label>
              <div className="grid grid-cols-2 gap-3">
                {PATTERNS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPattern(p)}
                    className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedPattern.id === p.id 
                        ? 'border-amber-500 bg-amber-500/5' 
                        : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg ${p.color}`} />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-tight">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block">Base Color</label>
              <div className="flex flex-wrap gap-4">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`group relative`}
                    title={c.name}
                  >
                    <div 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm transition-transform group-hover:scale-110" 
                      style={{ backgroundColor: c.hex }} 
                    />
                    {selectedColor.name === c.name && (
                      <div className="absolute -inset-1 border-2 border-amber-500 rounded-full animate-in zoom-in-50" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 md:pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4 pb-8 lg:pb-0">
            <button 
              onClick={handleSave}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black py-4 md:py-5 rounded-2xl font-syne font-black text-base md:text-lg tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
              <Save size={20} />
              ADD TO BAG - $120
            </button>
            <button 
                onClick={handleSaveDraft}
                className={`w-full py-4 md:py-5 rounded-2xl font-bold text-sm tracking-widest transition-all border flex items-center justify-center gap-2 ${
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
