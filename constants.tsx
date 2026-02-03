
import { Product } from './types';

export const JERSEYS: Product[] = [
  // --- HERITAGE: BAGS ---
  {
    id: 'h-bag-1',
    name: 'ASHANTI ROYAL BAG',
    price: 150,
    image: 'https://images.unsplash.com/photo-1590874103328-27cf2de7a905?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'bags',
    description: 'Hand-woven Kente cloth structured bag with gold clasps.'
  },
  {
    id: 'h-bag-2',
    name: 'ZULU BASKET TOTE',
    price: 85,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'bags',
    description: 'Woven grass fiber tote with natural dyes.'
  },
  {
    id: 'h-bag-3',
    name: 'MOROCCAN LEATHER SATCHEL',
    price: 120,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'bags',
    description: 'Authentic tanned leather with embossed geometric patterns.'
  },

  // --- HERITAGE: JEWELRY (BEADS/BRACELETS) ---
  {
    id: 'h-jew-1',
    name: 'MAASAI BEAD CUFF',
    price: 45,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'jewelry',
    description: 'Authentic beaded bracelet sourced from Kenya.'
  },
  {
    id: 'h-jew-2',
    name: 'BRASS COWRIE BANGLE',
    price: 35,
    image: 'https://images.unsplash.com/photo-1573408301185-a1d17300c381?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'jewelry',
    description: 'Recycled brass bangle with cowrie shell accents.'
  },
  {
    id: 'h-jew-3',
    name: 'GHANAIAN KROBO BEADS',
    price: 55,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'jewelry',
    description: 'Hand-painted glass beads on elastic cord.'
  },

  // --- HERITAGE: CLOTHING ---
  {
    id: 'h-cloth-1',
    name: 'KENTE CEREMONIAL ROBE',
    price: 250,
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'clothing',
    description: 'Full length authentic woven Kente robe.'
  },
  {
    id: 'h-cloth-2',
    name: 'MAASAI SHUKA CLOTH',
    price: 65,
    image: 'https://images.unsplash.com/photo-1530669282365-1d6837894a86?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'clothing',
    description: 'Traditional red and blue checked Maasai blanket/wrap.'
  },
  {
    id: 'h-cloth-3',
    name: 'DASHIKI PRINT SHIRT',
    price: 50,
    image: 'https://images.unsplash.com/photo-1573033502978-752119c8f0d2?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    subcategory: 'clothing',
    description: 'Cotton shirt with Angelina print pattern.'
  },

  // --- MODERN: SHOES ---
  {
    id: 'm-shoe-1',
    name: 'Y-3 SLIDES',
    price: 180,
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'shoes',
    description: 'Minimalist neoprene slides with elevated sole.'
  },
  {
    id: 'm-shoe-2',
    name: 'NIKE AIR FORCE 1',
    price: 130,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'shoes',
    description: 'Classic Triple White. The essential staple.'
  },
  {
    id: 'm-shoe-3',
    name: 'NIKE AIR JORDAN 1 HIGH',
    price: 220,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'shoes',
    description: 'High-top retro basketball sneaker. Chicago colorway.'
  },
  {
    id: 'm-shoe-4',
    name: 'NAKED WOLFE PLATFORM',
    price: 300,
    image: 'https://images.unsplash.com/photo-1617614838661-3840b2e8c950?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'shoes',
    description: 'Chunky platform sneakers. 90mm sole height.'
  },
  {
    id: 'm-shoe-5',
    name: 'ADIDAS SAMBA OG',
    price: 100,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'shoes',
    description: 'Classic indoor soccer shoe turned street icon.'
  },

  // --- MODERN: SWEATERS & HOODIES ---
  {
    id: 'm-hood-1',
    name: 'CUSTOM CROP HOODIE',
    price: 95,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'hoodies',
    description: 'Raw hem crop hoodie. Heavyweight cotton.',
    customizable: true
  },
  {
    id: 'm-hood-2',
    name: 'OVERSIZED STREET ZIP-UP',
    price: 110,
    image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'hoodies',
    description: 'Boxy fit zip-up hoodie. Customizable back panel.',
    customizable: true
  },
  {
    id: 'm-hood-3',
    name: 'VINTAGE KNIT SWEATER',
    price: 140,
    image: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'hoodies',
    description: 'Distressed knitwear. Not customizable.',
    customizable: false
  },

  // --- MODERN: RASTA HAIR ---
  {
    id: 'm-hair-1',
    name: 'RASTA CROCHET LOCS',
    price: 25,
    image: 'https://images.unsplash.com/photo-1624803597375-a04470213123?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'hair',
    description: 'Synthetic crochet dreads. Jet Black.'
  },
  {
    id: 'm-hair-2',
    name: 'OMBRE BRAIDING HAIR',
    price: 15,
    image: 'https://images.unsplash.com/photo-1632289665684-297eb0041d06?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'hair',
    description: 'Kunekalon fiber. Black to Blonde gradient.'
  },
  {
    id: 'm-hair-3',
    name: 'FAUX LOCS (RED)',
    price: 30,
    image: 'https://images.unsplash.com/photo-1595180373076-745a58957425?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'hair',
    description: 'Deep red faux locs. Pre-looped.'
  },

  // --- MODERN: JEANS ---
  {
    id: 'm-jean-1',
    name: 'DIESEL DISTRESSED (M)',
    price: 180,
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'jeans',
    description: 'Heavy distressing. Straight leg fit.',
    gender: 'male'
  },
  {
    id: 'm-jean-2',
    name: 'Y2K BAGGY DENIM (U)',
    price: 120,
    image: 'https://images.unsplash.com/photo-1584370848010-d7ccb2843de3?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'jeans',
    description: 'Ultra-wide leg cargo jeans. Unisex.',
    gender: 'unisex'
  },
  {
    id: 'm-jean-3',
    name: 'SKINNY RIPPED (F)',
    price: 90,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    subcategory: 'jeans',
    description: 'High-waisted skinny jeans with knee blowouts.',
    gender: 'female'
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
