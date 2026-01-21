
export interface Product {
  id: string;
  name: string;
  description?: string;
  category: 'crema' | 'chocolate' | 'frutal' | 'especial';
  inStock?: boolean;
  price?: number;
  gradient?: string;
}

export interface Store {
  stock: Record<string, boolean>;
  prices: {
    cuarto: number;
    medio: number;
    kilo: number;
    cucurucho: number;
    doble: number;
    [key: string]: number;
  }
}

// Order & Cart Types
export interface OrderItem {
  id: string; // Unique ID for cart item
  productKey: string; // e.g. 'kilo', 'cuarto'
  productName: string; // e.g. '1 Kilo'
  price: number;
  flavors: string[]; // Selected flavor names
}

export interface Cart {
  items: OrderItem[];
  total: number;
}


// Configuration for product limits
export const PRODUCT_CONFIG: Record<string, { label: string; maxFlavors: number }> = {
  cucurucho: { label: 'Cucurucho Simple', maxFlavors: 2 },
  doble: { label: 'Cucurucho Doble', maxFlavors: 2 },
  cuarto: { label: '1/4 Kilo', maxFlavors: 3 },
  medio: { label: '1/2 Kilo', maxFlavors: 3 },
  kilo: { label: '1 Kilo', maxFlavors: 4 },
};
