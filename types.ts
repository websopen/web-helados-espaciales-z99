export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'water' | 'milky'; // De Agua vs Licuados
  gradient: string; // CSS gradient class
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FlavorSuggestion {
  name: string;
  description: string;
  ingredients: string[];
}

export type OfferType = 'none' | '2x1_milky' | '2x1_water' | '2x1_all';
