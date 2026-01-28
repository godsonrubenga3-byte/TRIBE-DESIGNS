
import React, { useState } from 'react';
import { PATTERNS, COLORS } from '../constants';
import { useApp } from '../App';
import { Save, Info, Check, Type } from 'lucide-react';

const FONT_OPTIONS = [
  { id: 'syne', name: 'TRIBE BOLD', family: "'Syne', sans-serif", letterSpacing: '0.1em' },
  { id: 'poppins', name: 'ATHLETIC', family: "'Poppins', sans-serif", letterSpacing: '0.05em' },
  { id: 'space', name: 'STREET', family: "'Space Grotesk', sans-serif", letterSpacing: '0.05em' }
];

const CustomizerPage: React.FC = () => {
  const { addToCart } = useApp();
  const [name, setName] = useState('YOUR NAME');
  const [number, setNumber] = useState('00');
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
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
        font: selectedFont.id 
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
            <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 border-zinc-200 dark:border-zinc-800 shadow-2xl flex items-center justify-center p-6 md:p-12">
              {/* Fake Jersey SVG representation */}
              <div className="relative w-full max-w-md h-full transition-all duration-500 group">
                <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-2xl">
                  {/* Jersey Body */}
                  <path 
                    d="M100 100 L300 100 L350 200 L320 220 L280 180 L280 450 L120 450 L120 180 L80 220 L50 200 Z" 
                    fill={selectedColor.hex}
                    className="transition-colors duration-500"
                  />
                  {/* Pattern Overlay - simplified */}
                  <rect x="120" y="100" width="160" height="350" fill="white" fillOpacity="0.1" />
                  
                  {/* Personalization */}
                  <text 
                    x="200" y="160" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    fill="white" 
                    className="uppercase"
                    style={{ 
                        fontFamily: selectedFont.family,
                        fontSize: '24px',
                        fontWeight: 900,
                        letterSpacing: selectedFont.letterSpacing
                    }}
                  >
                    {name || 'YOUR NAME'}
                  </text>
                  <text 
                    x="200" y="310" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    fill="white" 
                    style={{ 
                        fontFamily: selectedFont.family,
                        fontSize: '110px',
                        fontWeight: 900,
                        letterSpacing: '-0.05em'
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
