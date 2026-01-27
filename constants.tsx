
import { Product } from './types';

export const JERSEYS: Product[] = [
  {
    id: 'j1',
    name: 'THE KENTE SHIFT',
    price: 85,
    image: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    description: 'A bold take on traditional Kente patterns with a high-performance breathable mesh.'
  },
  {
    id: 'j2',
    name: 'NEO-LAGOS FLOW',
    price: 75,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    description: 'Electric blue accents inspired by the night lights of Lagos.'
  },
  {
    id: 'j3',
    name: 'ZULU WARRIOR V3',
    price: 90,
    image: 'https://images.unsplash.com/photo-1532332248682-206cc786359f?auto=format&fit=crop&q=80&w=800',
    category: 'Heritage',
    description: 'Strong geometric lines referencing the shield patterns of South Africa.'
  },
  {
    id: 'j4',
    name: 'SAHARA GOLD',
    price: 80,
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&q=80&w=800',
    category: 'Fusion',
    description: 'Minimalist sand-colored base with intricate gold embroidery on the sleeves.'
  }
];

export const PATTERNS = [
  { id: 'kente', name: 'Royal Kente', color: 'bg-amber-500' },
  { id: 'bogolan', name: 'Mud Cloth', color: 'bg-stone-800' },
  { id: 'ankara', name: 'Electric Ankara', color: 'bg-indigo-600' },
  { id: 'minimal', name: 'Modern Minimal', color: 'bg-zinc-200' }
];

export const COLORS = [
  { name: 'Naija Green', hex: '#008751' },
  { name: 'Royal Gold', hex: '#FFD700' },
  { name: 'Black Panther', hex: '#1A1A1A' },
  { name: 'Savanna Orange', hex: '#FF4500' }
];
