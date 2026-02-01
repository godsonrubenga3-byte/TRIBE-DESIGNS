
import { Product } from './types';

export const JERSEYS: Product[] = [
  // HERITAGE SECTION
  {
    id: 'h1',
    name: 'ASHANTI ROYAL BAG',
    price: 150,
    image: 'https://images.unsplash.com/photo-1590874103328-27cf2de7a905?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    description: 'Hand-woven Kente cloth structured bag with gold clasps.'
  },
  {
    id: 'h2',
    name: 'MAASAI BEAD CUFF',
    price: 45,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    description: 'Authentic beaded bracelet sourced from Kenya.'
  },
  {
    id: 'h3',
    name: 'YORUBA AGBADA ROBE',
    price: 220,
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    description: 'Traditional ceremonial wear with intricate embroidery.'
  },
  {
    id: 'h4',
    name: 'ZULU LEATHER SANDALS',
    price: 65,
    image: 'https://images.unsplash.com/photo-1603487742131-4160d6e1843e?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    description: 'Handcrafted leather sandals with tire-tread soles.'
  },

  // MODERN SECTION
  {
    id: 'm1',
    name: 'Y-3 KAIWA',
    price: 400,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    description: 'Avant-garde silhouette. Black and white monochrome.'
  },
  {
    id: 'm2',
    name: 'CUSTOM CROP HOODIE',
    price: 95,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    description: 'Oversized fit, heavy-weight cotton. Fully customizable.'
  },
  {
    id: 'm3',
    name: 'RASTA CROCHET TOP',
    price: 55,
    image: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    description: 'Hand-crocheted intricate patterns. Women’s summer fit.'
  },
  {
    id: 'm4',
    name: 'DIESEL DISTRESSED JEANS',
    price: 180,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    description: 'Heavy denim with street-ready distressing and patches.'
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
