
import React, { useState } from 'react';
import { JERSEYS } from '../constants';
import { useApp } from '../App';
import { ShoppingCart, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

const ShopPage: React.FC = () => {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'Heritage' | 'Modern'>('Heritage');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');

  // Define subcategories for tabs
  const subCategories = activeCategory === 'Heritage' 
    ? ['all', 'bags', 'jewelry', 'clothing']
    : ['all', 'shoes', 'hoodies', 'hair', 'jeans'];

  // Filter items
  const filtered = JERSEYS.filter(j => {
      const catMatch = j.category === activeCategory;
      const subMatch = activeSubCategory === 'all' || j.subcategory === activeSubCategory;
      return catMatch && subMatch;
  });

  const handleProductAction = (product: Product) => {
      if (product.category === 'Modern' && product.subcategory === 'hoodies' && product.customizable) {
          // Redirect customizable sweaters to customizer
          navigate('/customize', { state: { mode: 'printout', preselectedItem: product.name } });
      } else {
          addToCart(product);
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
            <h1 className="text-4xl md:text-7xl font-syne font-black tracking-tighter uppercase mb-2 md:mb-4">THE SHOP</h1>
            <p className="text-sm md:text-base text-zinc-500 max-w-md font-medium">Limited release items. From traditional heritage to modern street luxury.</p>
            </div>
            
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl w-full md:w-auto">
            {['Heritage', 'Modern'].map((cat) => (
                <button
                key={cat}
                onClick={() => {
                    setActiveCategory(cat as any);
                    setActiveSubCategory('all');
                }}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-black tracking-widest uppercase transition-all ${
                    activeCategory === cat 
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' 
                    : 'text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
                >
                {cat.toUpperCase()}
                </button>
            ))}
            </div>
        </div>

        {/* Subcategory Tabs */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-hide">
            {subCategories.map((sub) => (
                <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={`px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-[10px] md:text-xs font-bold uppercase whitespace-nowrap transition-colors ${
                        activeSubCategory === sub
                        ? 'bg-amber-500 border-amber-500 text-black'
                        : 'bg-white dark:bg-zinc-900 text-zinc-500 hover:border-zinc-400'
                    }`}
                >
                    {sub === 'all' ? 'VIEW ALL' : sub}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  onClick={() => handleProductAction(product)}
                  className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl transform scale-0 group-hover:scale-100 duration-300 ${
                    product.customizable 
                    ? 'bg-white text-black hover:bg-amber-500' 
                    : 'bg-amber-500 text-black hover:bg-white'
                  }`}
                >
                   {product.customizable ? (
                       <> <Edit3 size={16} /> Customize </>
                   ) : (
                       <> <ShoppingCart size={16} /> Add to Bag </>
                   )}
                </button>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white uppercase border border-white/20">
                  {product.subcategory}
                </span>
                {product.gender && (
                    <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-black uppercase">
                        {product.gender}
                    </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h3 className="font-syne font-bold text-lg md:text-xl uppercase tracking-tighter leading-tight">{product.name}</h3>
                <p className="text-zinc-500 text-xs md:text-sm mt-1 line-clamp-2">{product.description}</p>
                {product.customizable && (
                    <span className="inline-block mt-2 text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase">
                        Customizable
                    </span>
                )}
              </div>
              <span className="font-syne font-black text-xl md:text-2xl text-amber-500">${product.price}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <p className="text-xl md:text-2xl font-bold">NO ITEMS FOUND IN THIS COLLECTION</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
