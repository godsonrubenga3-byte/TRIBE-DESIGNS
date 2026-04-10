
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Modern' | 'Heritage';
  subcategory: 'jerseys' | 'hoodies' | 't-shirts';
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
  // Granular Colors
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  collarColor?: string;
  patternColor?: string;
  showPattern?: boolean;
  
  // Font Sizing
  nameSize?: 'S' | 'M' | 'L';
  numberSize?: 'S' | 'M' | 'L';
  
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
  status: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'card' | 'momo' | 'crypto' | 'cod';
  customer: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
  };
  shippingDetails: {
    address: string;
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
