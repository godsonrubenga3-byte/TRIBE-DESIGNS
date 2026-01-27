
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Modern' | 'Heritage' | 'Fusion';
  description: string;
}

export interface CustomizationOptions {
  name: string;
  number: string;
  basePattern: string;
  accentColor: string;
}

export interface CartItem extends Product {
  customization?: CustomizationOptions;
  quantity: number;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
