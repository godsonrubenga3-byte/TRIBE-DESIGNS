
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
  font?: string;
  size?: string;
}

export interface CartItem extends Product {
  customization?: CustomizationOptions;
  quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
