
import { Product } from './types';

export const JERSEYS: Product[] = [
  // --- HERITAGE: JERSEYS ---
  {
    id: 'h-jersey-1',
    name: 'NAIJA SPIRIT KIT',
    price: 120,
    image: 'https://images.unsplash.com/photo-1518005020250-68594f214652?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'jerseys',
    description: 'Inspired by the 1994 Nigerian energy. Eagle wing patterns on shoulders.',
    customizable: true,
    gender: 'unisex'
  },
  {
    id: 'h-jersey-2',
    name: 'BLACK STAR RETRO',
    price: 115,
    image: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'jerseys',
    description: 'Ghanaian Kente trim on a solid black base. Gold accents.',
    customizable: true,
    gender: 'unisex'
  },
  {
    id: 'h-jersey-3',
    name: 'ATLAS LIONS HOME',
    price: 120,
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'jerseys',
    description: 'Deep red with green geometric Islamic art patterns.',
    customizable: true,
    gender: 'unisex'
  },
  {
    id: 'h-jersey-4',
    name: 'BAFANA LEGACY',
    price: 110,
    image: 'https://images.unsplash.com/photo-1544218847-f07612f170f7?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'jerseys',
    description: 'South African gold and green with Protea detailed texture.',
    customizable: true,
    gender: 'unisex'
  },
  {
    id: 'h-jersey-5',
    name: 'PHARAOH ELITE',
    price: 125,
    image: 'https://images.unsplash.com/photo-1616124619460-c9fa7914022f?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'jerseys',
    description: 'Egyptian cotton blend with hieroglyphic side panels.',
    customizable: true,
    gender: 'unisex'
  },
  {
    id: 'h-jersey-6',
    name: 'KILIMANJARO AWAY',
    price: 115,
    image: 'https://images.unsplash.com/photo-1518386345917-a0a33c2a8f8c?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'jerseys',
    description: 'Tanzanian blue and black gradient representing the mountain peak.',
    customizable: true,
    gender: 'unisex'
  },

  // --- MODERN: HOODIES ---
  {
    id: 'm-hood-1',
    name: 'ESSENTIAL CROP HOODIE',
    price: 95,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'hoodies',
    description: 'Raw hem crop hoodie. Heavyweight cotton. Perfect for print.',
    customizable: true,
    gender: 'female'
  },
  {
    id: 'm-hood-2',
    name: 'STREET ZIP-UP',
    price: 110,
    image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'hoodies',
    description: 'Boxy fit zip-up. Customizable back panel area.',
    customizable: true,
    gender: 'unisex'
  },
  {
    id: 'm-hood-3',
    name: 'OVERSIZED PULLOVER',
    price: 105,
    image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'hoodies',
    description: 'Drop shoulder silhouette. 450 GSM french terry.',
    customizable: true,
    gender: 'unisex'
  },

  // --- MODERN: T-SHIRTS (PRINTOUTS) ---
  {
    id: 'm-tee-1',
    name: 'HEAVYWEIGHT BOX TEE',
    price: 65,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 't-shirts',
    description: 'The standard street blank. Thick collar, boxy fit.',
    customizable: true,
    gender: 'unisex'
  },
  {
    id: 'm-tee-2',
    name: 'VINTAGE WASH TEE',
    price: 70,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 't-shirts',
    description: 'Acid washed charcoal fabric. Soft vintage feel.',
    customizable: true,
    gender: 'unisex'
  },
  {
    id: 'm-tee-3',
    name: 'LONG SLEEVE MOTO',
    price: 80,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 't-shirts',
    description: 'Racing inspired long sleeve with rib cuffs.',
    customizable: true,
    gender: 'unisex'
  }
];

export const PRINTOUT_COLORS = [
  { name: 'Pure White', hex: '#ffffff', class: 'bg-white' },
  { name: 'Royal Blue', hex: '#2563eb', class: 'bg-blue-600' },
  { name: 'Heather Gray', hex: '#9ca3af', class: 'bg-gray-400' },
  { name: 'Fire Red', hex: '#dc2626', class: 'bg-red-600' },
  { name: 'Sunset Orange', hex: '#ea580c', class: 'bg-orange-600' }
];

export const SIZE_CHART = {
  'XS': { chest: '32-34"', neck: '13-13.5"' },
  'S': { chest: '35-37"', neck: '14-14.5"' },
  'M': { chest: '38-40"', neck: '15-15.5"' },
  'L': { chest: '41-43"', neck: '16-16.5"' },
  'XL': { chest: '44-46"', neck: '17-17.5"' },
  '2XL': { chest: '47-49"', neck: '18-18.5"' },
  '3XL': { chest: '50-53"', neck: '19-19.5"' }
};
