import { Product } from './types';

// Precios por cantidad (se pueden editar desde admin)
export const PRICES = {
  cuarto: 3500,    // 1/4 kg
  medio: 6500,     // 1/2 kg
  kilo: 12000,     // 1 kg
  cucurucho: 2500, // Cucurucho simple
  doble: 4000,     // Cucurucho doble
};

// Sabores de helado organizados por categoría
export const FLAVORS: Product[] = [
  // --- CHOCOLATES ---
  {
    id: 'c1',
    name: 'Chocolate',
    description: 'El clásico chocolate intenso.',
    price: 0,
    category: 'chocolate',
    gradient: 'from-amber-900 to-stone-900',
  },
  {
    id: 'c2',
    name: 'Chocolate Suizo',
    description: 'Chocolate premium con toque suave.',
    price: 0,
    category: 'chocolate',
    gradient: 'from-amber-800 to-amber-950',
  },
  {
    id: 'c3',
    name: 'Chocolate Blanco',
    description: 'Cremoso y suave chocolate blanco.',
    price: 0,
    category: 'chocolate',
    gradient: 'from-amber-100 to-amber-200',
  },
  {
    id: 'c4',
    name: 'Chocolate con Almendras',
    description: 'Chocolate con trozos de almendras.',
    price: 0,
    category: 'chocolate',
    gradient: 'from-amber-700 to-stone-800',
  },
  {
    id: 'c5',
    name: 'Brownie',
    description: 'Chocolate intenso con trozos de brownie.',
    price: 0,
    category: 'chocolate',
    gradient: 'from-stone-700 to-stone-900',
  },

  // --- CREMAS ---
  {
    id: 'cr1',
    name: 'Crema Americana',
    description: 'El clásico sabor a vainilla.',
    price: 0,
    category: 'crema',
    gradient: 'from-amber-50 to-amber-100',
  },
  {
    id: 'cr2',
    name: 'Dulce de Leche',
    description: 'El favorito de los argentinos.',
    price: 0,
    category: 'crema',
    gradient: 'from-amber-400 to-amber-600',
  },
  {
    id: 'cr3',
    name: 'Dulce de Leche Granizado',
    description: 'Dulce de leche con chips de chocolate.',
    price: 0,
    category: 'crema',
    gradient: 'from-amber-500 to-amber-700',
  },
  {
    id: 'cr4',
    name: 'Tramontana',
    description: 'Crema con nueces y chocolate.',
    price: 0,
    category: 'crema',
    gradient: 'from-amber-200 to-amber-400',
  },
  {
    id: 'cr5',
    name: 'Mascarpone',
    description: 'Sabor tiramisú cremoso.',
    price: 0,
    category: 'crema',
    gradient: 'from-amber-100 to-stone-200',
  },
  {
    id: 'cr6',
    name: 'Crema Oreo',
    description: 'Crema con galletas Oreo.',
    price: 0,
    category: 'crema',
    gradient: 'from-stone-800 to-stone-950',
  },
  {
    id: 'cr7',
    name: 'Granizado',
    description: 'Crema con chips de chocolate.',
    price: 0,
    category: 'crema',
    gradient: 'from-amber-50 to-stone-300',
  },
  {
    id: 'cr8',
    name: 'Banana Split',
    description: 'Banana con chocolate y crema.',
    price: 0,
    category: 'crema',
    gradient: 'from-yellow-200 to-amber-300',
  },

  // --- FRUTALES ---
  {
    id: 'f1',
    name: 'Frutilla',
    description: 'Fresco sabor a frutilla.',
    price: 0,
    category: 'frutal',
    gradient: 'from-red-400 to-pink-500',
  },
  {
    id: 'f2',
    name: 'Limón',
    description: 'Refrescante y cítrico.',
    price: 0,
    category: 'frutal',
    gradient: 'from-lime-300 to-yellow-400',
  },
  {
    id: 'f3',
    name: 'Naranja',
    description: 'Dulce cítrico natural.',
    price: 0,
    category: 'frutal',
    gradient: 'from-orange-300 to-orange-500',
  },
  {
    id: 'f4',
    name: 'Durazno',
    description: 'Suave sabor a durazno.',
    price: 0,
    category: 'frutal',
    gradient: 'from-orange-200 to-orange-400',
  },
  {
    id: 'f5',
    name: 'Ananá',
    description: 'Tropical y refrescante.',
    price: 0,
    category: 'frutal',
    gradient: 'from-yellow-300 to-yellow-500',
  },
  {
    id: 'f6',
    name: 'Mango',
    description: 'Exótico y dulce.',
    price: 0,
    category: 'frutal',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'f7',
    name: 'Maracuyá',
    description: 'Intenso y tropical.',
    price: 0,
    category: 'frutal',
    gradient: 'from-yellow-400 to-orange-400',
  },
  {
    id: 'f8',
    name: 'Frutos del Bosque',
    description: 'Mix de berries.',
    price: 0,
    category: 'frutal',
    gradient: 'from-purple-400 to-pink-500',
  },

  // --- ESPECIALES ---
  {
    id: 'e1',
    name: 'Menta Granizada',
    description: 'Menta fresca con chips.',
    price: 0,
    category: 'especial',
    gradient: 'from-emerald-300 to-emerald-500',
  },
  {
    id: 'e2',
    name: 'Pistacho',
    description: 'Cremoso sabor a pistacho.',
    price: 0,
    category: 'especial',
    gradient: 'from-green-300 to-green-500',
  },
  {
    id: 'e3',
    name: 'Nutella',
    description: 'Crema de avellanas.',
    price: 0,
    category: 'especial',
    gradient: 'from-amber-600 to-amber-800',
  },
  {
    id: 'e4',
    name: 'Cheesecake',
    description: 'Tarta de queso cremosa.',
    price: 0,
    category: 'especial',
    gradient: 'from-amber-100 to-rose-200',
  },
  {
    id: 'e5',
    name: 'Sambayón',
    description: 'El clásico italiano.',
    price: 0,
    category: 'especial',
    gradient: 'from-yellow-100 to-amber-200',
  },
  {
    id: 'e6',
    name: 'Café',
    description: 'Intenso sabor a café.',
    price: 0,
    category: 'especial',
    gradient: 'from-amber-700 to-stone-800',
  },
];

// Alias for backward compatibility
export const PRODUCTS = FLAVORS;