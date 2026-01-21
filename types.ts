export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'chocolate' | 'crema' | 'frutal' | 'especial'; // Ice cream categories
  gradient: string; // CSS gradient class
}

export interface CartItem extends Product {
  quantity: number;
}
