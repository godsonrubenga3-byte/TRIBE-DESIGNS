
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Modern' | 'Heritage';
  subcategory: 'bags' | 'jewelry' | 'clothing' | 'shoes' | 'hoodies' | 'hair' | 'jeans';
  description: string;
  customizable?: boolean;
  gender?: 'male' | 'female' | 'unisex';
}

export interface CustomizationOptions {
  mode: 'athletic' | 'printout';
  name?: string;
  number?: string;
  layout?: 'name-top' | 'number-top';
  kit?: 'dark' | 'light';
  baseColor?: string;
  uploadedImage?: string;
  printText?: string;
  printFont?: string;
  placement?: 'front' | 'back';
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
  avatar?: string; // Base64 string for profile picture
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  paymentMethod: 'card' | 'momo' | 'crypto' | 'cod';
  shippingDetails: {
    name: string;
    address: string;
    city: string;
  };
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
