
import React, { useState } from 'react';
import { JERSEYS } from '../constants';
import { useApp } from '../App';
import { ShoppingCart, Eye, Filter } from 'lucide-react';

const ShopPage: React.FC = () => {
  const { addToCart } = useApp();
  const [activeCategory, setActiveCategory] = useState<'All' | 'Modern' | 'Heritage' | 'Fusion'>('All');

  const filtered = activeCategory === 'All' 
    ? JERSEYS 
    : JERSEYS.filter(j => j.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6 md:gap-8">
        <div>
          <h1 className="text-4xl md:text-7xl font-syne font-black tracking-tighter uppercase mb-2 md:mb-4">THE SHOP</h1>
          <p className="text-sm md:text-base text-zinc-500 max-w-md font-medium">Limited release jerseys from our signature series. Ready to wear, ready to flex.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['All', 'Modern', 'Heritage', 'Fusion'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase transition-all flex-1 md:flex-none text-center ${
                activeCategory === cat 
                  ? 'bg-amber-500 text-black' 
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-12">
        {filtered.map((product) => (
          <div key={product.id} className="group relative">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                <button 
                  onClick={() => addToCart(product)}
                  className="p-4 bg-white text-black rounded-full hover:bg-amber-500 transition-colors shadow-xl transform scale-0 group-hover:scale-100 duration-300"
                >
                  <ShoppingCart size={24} />
                </button>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-black/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white uppercase border border-white/20">
                  {product.category}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h3 className="font-syne font-bold text-lg md:text-xl uppercase tracking-tighter leading-tight">{product.name}</h3>
                <p className="text-zinc-500 text-xs md:text-sm mt-1 line-clamp-2">{product.description}</p>
              </div>
              <span className="font-syne font-black text-xl md:text-2xl text-amber-500">${product.price}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <p className="text-xl md:text-2xl font-bold">NO JERSEYS FOUND IN THIS CATEGORY</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
