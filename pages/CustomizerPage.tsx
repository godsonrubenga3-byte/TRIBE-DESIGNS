
import React, { useState, useEffect } from 'react';
import { PATTERNS, COLORS } from '../constants';
import { getDesignAdvice } from '../services/geminiService';
import { useApp } from '../App';
import { Sparkles, Loader2, Save, Send, Trash2, Info } from 'lucide-react';

const CustomizerPage: React.FC = () => {
  const { addToCart } = useApp();
  const [name, setName] = useState('YOUR NAME');
  const [number, setNumber] = useState('00');
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [prompt, setPrompt] = useState('');
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAISuggestion = async () => {
    if (!prompt) return;
    setIsLoading(true);
    const advice = await getDesignAdvice(prompt);
    setAiAdvice(advice);
    setIsLoading(false);
  };

  const handleSave = () => {
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: `CUSTOM ${selectedPattern.name} JERSEY`,
      price: 120,
      image: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=800',
      category: 'Fusion' as const,
      description: `Custom ${selectedPattern.name} jersey with personalization.`
    };
    addToCart(customProduct, { name, number, basePattern: selectedPattern.id, accentColor: selectedColor.hex });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Preview Area */}
        <div className="flex-1">
          <div className="sticky top-32">
            <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border-4 border-zinc-200 dark:border-zinc-800 shadow-2xl flex items-center justify-center p-12">
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
                    x="200" y="180" 
                    textAnchor="middle" 
                    fill="white" 
                    className="font-syne font-black text-4xl uppercase tracking-widest"
                  >
                    {name || 'YOUR NAME'}
                  </text>
                  <text 
                    x="200" y="320" 
                    textAnchor="middle" 
                    fill="white" 
                    className="font-syne font-black text-9xl tracking-tighter"
                  >
                    {number || '00'}
                  </text>
                </svg>
                
                {/* AI Advice Bubble */}
                {aiAdvice && (
                  <div className="absolute top-4 right-4 max-w-[200px] bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-xl border-l-4 border-amber-500 animate-in fade-in slide-in-from-right-4">
                    <p className="text-[10px] font-black uppercase text-amber-500 mb-1 flex items-center gap-1">
                      <Sparkles size={10} /> AI Stylist
                    </p>
                    <p className="text-xs font-bold leading-tight italic">"{aiAdvice.vibeDescription}"</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-zinc-500">
              <Info size={16} />
              <p className="text-xs font-medium uppercase tracking-widest">3D Real-time visualization powered by TribeEngine™</p>
            </div>
          </div>
        </div>

        {/* Controls Area */}
        <div className="w-full lg:w-[450px] space-y-10">
          <div>
            <h1 className="text-5xl font-syne font-black mb-2 uppercase tracking-tighter">DESIGN LAB</h1>
            <p className="text-zinc-500 font-medium">Create your legacy. Each piece is crafted by hand to your specs.</p>
          </div>

          {/* AI Helper - Enhanced Visibility */}
          <div className="bg-amber-50 dark:bg-zinc-900 p-8 rounded-[2rem] border-2 border-amber-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform">
                    <Sparkles size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="font-syne font-black text-xl uppercase tracking-tight leading-none">AI Style Assistant</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Powered by Gemini</p>
                </div>
                </div>
                
                <div className="space-y-3">
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your vibe... (e.g. 'Royal purple Kente pattern with gold accents for a wedding')"
                        className="w-full h-32 bg-white dark:bg-black border-2 border-zinc-200 dark:border-zinc-700 px-5 py-4 rounded-2xl text-base font-medium focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-zinc-400 resize-none"
                    />
                    <button 
                        onClick={handleAISuggestion}
                        disabled={isLoading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl hover:bg-amber-500 hover:text-black transition-all disabled:opacity-50 font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25 active:scale-95"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                GENERATING...
                            </>
                        ) : (
                            <>
                                GENERATE CONCEPT <Send size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {aiAdvice && (
              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top-4 fade-in duration-500">
                <div className="flex flex-wrap gap-2 mb-3">
                  {aiAdvice.palette.map((c: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">{c}</span>
                  ))}
                </div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 italic bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                    "{aiAdvice.patternConcept}"
                </p>
              </div>
            )}
          </div>

          {/* Text Inputs */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Name on Back</label>
                <input 
                  maxLength={12}
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 px-5 py-4 rounded-2xl font-bold uppercase focus:outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Number</label>
                <input 
                  maxLength={2}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 px-5 py-4 rounded-2xl font-bold focus:outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all text-center"
                />
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
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedPattern.id === p.id 
                        ? 'border-amber-500 bg-amber-500/5' 
                        : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${p.color}`} />
                    <span className="text-xs font-black uppercase tracking-tight">{p.name}</span>
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
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm transition-transform group-hover:scale-110" 
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

          <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
            <button 
              onClick={handleSave}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black py-5 rounded-2xl font-syne font-black text-lg tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
              <Save size={20} />
              ADD TO BAG - $120
            </button>
            <button className="w-full py-5 rounded-2xl font-bold text-sm tracking-widest transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              SAVE DRAFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizerPage;
