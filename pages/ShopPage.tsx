
import React, { useState, useEffect } from 'react';
import { JERSEYS } from '../constants';
import { useApp } from '../App';
import { ShoppingCart, Edit3, Loader2, Star, StarHalf, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { supabaseService } from '../services/supabaseService';

const ShopPage: React.FC = () => {
  const { addToCart, notify } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'Heritage' | 'Modern'>('Heritage');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await supabaseService.getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        notify("Failed to load inventory. Please refresh.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Define subcategories for tabs - Derived from products
  const subCategories = ['all', ...Array.from(new Set(products.map(p => p.subcategory)))];

  // Filter items based on active subcategory
  const filtered = products.filter(j => {
      if (activeSubCategory === 'all') return true;
      return j.subcategory === activeSubCategory;
  });

  const handleProductAction = (product: Product) => {
      if (product.customizable) {
          // Determine mode based on subcategory
          const mode = product.subcategory === 'jerseys' ? 'athletic' : 'printout';
          navigate('/customize', { state: { mode, preselectedItem: product.name } });
      } else {
          addToCart(product);
      }
  };

  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} size={12} className="fill-amber-500 text-amber-500" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} size={12} className="fill-amber-500 text-amber-500" />);
      } else {
        stars.push(<Star key={i} size={12} className="text-zinc-300 dark:text-zinc-700" />);
      }
    }
    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {loading ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">Loading Tribe Drops...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
            <h1 className="text-4xl md:text-7xl font-syne font-black tracking-tighter uppercase mb-2 md:mb-4">THE KIT SHOP</h1>
            <p className="text-sm md:text-base text-zinc-500 max-w-md font-medium">Authentic African Heritage & Pro Athletic Jerseys. Customize your legacy.</p>
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
                    {sub === 'all' ? 'VIEW ALL' : sub.replace('-', ' ')}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filtered.map((product) => (
          <div key={product.id} className="group relative">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
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
                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="px-6 py-3 bg-zinc-900/80 backdrop-blur text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl transform scale-0 group-hover:scale-100 duration-500 hover:bg-zinc-800"
                >
                   <Eye size={16} /> Quick View
                </button>
              </div>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="flex gap-2">
                    <span className="bg-black/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white uppercase border border-white/20">
                    {product.subcategory}
                    </span>
                    {product.is_new && (
                        <span className="bg-amber-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-black uppercase">
                            NEW
                        </span>
                    )}
                </div>
                {(product.stock_count !== undefined && product.stock_count <= 5) && (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase self-start ${
                        product.stock_count === 0 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                        {product.stock_count === 0 ? 'SOLD OUT' : `ONLY ${product.stock_count} LEFT`}
                    </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 flex justify-between items-start">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="text-[10px] text-zinc-500 font-bold">({product.review_count || 0})</span>
                </div>
                <h3 className="font-syne font-bold text-lg md:text-xl uppercase tracking-tighter leading-tight">{product.name}</h3>
                <p className="text-zinc-500 text-xs md:text-sm mt-1 line-clamp-2">{product.description}</p>
              </div>
              <span className="font-syne font-black text-xl md:text-2xl text-amber-500">${product.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white dark:bg-zinc-950 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative animate-in zoom-in-95 duration-300">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-6 right-6 p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:bg-amber-500 hover:text-black transition-colors z-10"
                  >
                      <X size={20} />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="aspect-[4/5] bg-zinc-100 dark:bg-zinc-900">
                          <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-8 md:p-12 flex flex-col">
                          <div className="flex items-center gap-2 mb-4">
                              <div className="flex">{renderStars(selectedProduct.rating)}</div>
                              <span className="text-xs text-zinc-500 font-bold">{selectedProduct.review_count || 0} REVIEWS</span>
                          </div>
                          <h2 className="text-3xl md:text-5xl font-syne font-black tracking-tighter uppercase mb-4 leading-none">{selectedProduct.name}</h2>
                          <p className="text-2xl font-syne font-black text-amber-500 mb-6">${selectedProduct.price}</p>
                          
                          <div className="space-y-6 mb-8">
                              <div>
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Description</h4>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{selectedProduct.description}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Category</h4>
                                      <p className="text-xs font-bold uppercase">{selectedProduct.category} / {selectedProduct.subcategory}</p>
                                  </div>
                                  <div>
                                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Availability</h4>
                                      <p className={`text-xs font-bold uppercase ${
                                          (selectedProduct.stock_count || 0) > 0 ? 'text-green-500' : 'text-red-500'
                                      }`}>
                                          {(selectedProduct.stock_count || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                                      </p>
                                  </div>
                              </div>
                          </div>

                          <div className="mt-auto space-y-3">
                              <button 
                                onClick={() => {
                                    handleProductAction(selectedProduct);
                                    setSelectedProduct(null);
                                }}
                                className="w-full py-4 bg-amber-500 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black font-black uppercase tracking-widest transition-all rounded-xl"
                              >
                                  {selectedProduct.customizable ? 'Customize Now' : 'Add to Bag'}
                              </button>
                              <p className="text-center text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                                  Free standard shipping on all orders over $150
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-20 opacity-50">
          <p className="text-xl md:text-2xl font-bold">NO ITEMS FOUND IN THIS COLLECTION</p>
        </div>
      )}
    </>
    )}
    </div>
  );
};

export default ShopPage;
