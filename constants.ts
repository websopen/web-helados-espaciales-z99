import { Product } from './types';

// Precios por cantidad (se pueden editar desde admin)
export const PRICES = {
  cuarto: 3500,    // 1/4 kg
  medio: 6500,     // 1/2 kg
  kilo: 12000,     // 1 kg
  cucurucho: 2500, // Cucurucho simple
  doble: 4000,     // Cucurucho doble
};

// Default Social Links
export const defaultSocialLinks = {
  instagram: '',
  whatsapp: ''
};

// Sabores de helado organizados por categoría
export const FLAVORS: Product[] = [
  // --- CHOCOLATES ---
  { id: 'c1', name: 'Chocolate', description: 'Intenso tradicional', price: 0, category: 'chocolate', gradient: 'from-amber-900 to-stone-900' },
  { id: 'c2', name: 'Chocolate Suizo', description: 'Con dulce de leche y merengue', price: 0, category: 'chocolate', gradient: 'from-amber-800 to-amber-950' },
  { id: 'c3', name: 'Chocolate Blanco', description: 'Cremoso y suave', price: 0, category: 'chocolate', gradient: 'from-amber-100 to-amber-200' },
  { id: 'c4', name: 'Almendrado', description: 'Con almendras tostadas', price: 0, category: 'chocolate', gradient: 'from-amber-700 to-stone-800' },
  { id: 'c5', name: 'Choco Brownie', description: 'Con trozos de brownie', price: 0, category: 'chocolate', gradient: 'from-stone-700 to-stone-900' },
  { id: 'c6', name: 'Chocolate Amargo', description: '70% Cacao', price: 0, category: 'chocolate', gradient: 'from-black to-stone-800' },
  { id: 'c7', name: 'Chocolate con Avellanas', description: 'Tipo Nutella', price: 0, category: 'chocolate', gradient: 'from-amber-800 to-orange-900' },
  { id: 'c8', name: 'Chocolate Rocher', description: 'Con bombones', price: 0, category: 'chocolate', gradient: 'from-amber-700 to-yellow-800' },
  { id: 'c9', name: 'Chocolate Marroc', description: 'Con bocaditos Marroc', price: 0, category: 'chocolate', gradient: 'from-stone-600 to-stone-800' },
  { id: 'c10', name: 'Mousse de Chocolate', description: 'Aireado y suave', price: 0, category: 'chocolate', gradient: 'from-amber-800 to-stone-700' },

  // --- CREMAS ---
  { id: 'cr1', name: 'Americana', description: 'Clásica crema vainilla', price: 0, category: 'crema', gradient: 'from-amber-50 to-amber-100' },
  { id: 'cr2', name: 'Dulce de Leche', description: 'El clásico argentino', price: 0, category: 'crema', gradient: 'from-amber-400 to-amber-600' },
  { id: 'cr3', name: 'DDL Granizado', description: 'Con chips de chocolate', price: 0, category: 'crema', gradient: 'from-amber-500 to-amber-700' },
  { id: 'cr4', name: 'Tramontana', description: 'DDL y microgalletitas', price: 0, category: 'crema', gradient: 'from-amber-200 to-amber-400' },
  { id: 'cr5', name: 'Mascarpone', description: 'Con frutos rojos', price: 0, category: 'crema', gradient: 'from-amber-100 to-stone-200' },
  { id: 'cr6', name: 'Crema Oreo', description: 'Con galletitas Oreo', price: 0, category: 'crema', gradient: 'from-stone-800 to-stone-950' },
  { id: 'cr7', name: 'Granizado', description: 'Americana con chips', price: 0, category: 'crema', gradient: 'from-amber-50 to-stone-300' },
  { id: 'cr8', name: 'Banana Split', description: 'Con DDL puro', price: 0, category: 'crema', gradient: 'from-yellow-200 to-amber-300' },
  { id: 'cr9', name: 'Vainilla', description: 'Vainilla natural', price: 0, category: 'crema', gradient: 'from-yellow-100 to-amber-100' },
  { id: 'cr10', name: 'Crema Rusa', description: 'Con nueces', price: 0, category: 'crema', gradient: 'from-orange-100 to-amber-200' },
  { id: 'cr11', name: 'Cereza a la Crema', description: 'Con cerezas enteras', price: 0, category: 'crema', gradient: 'from-pink-100 to-red-200' },
  { id: 'cr12', name: 'Flan con DDL', description: 'Sabor casero', price: 0, category: 'crema', gradient: 'from-yellow-300 to-amber-500' },

  // --- FRUTALES ---
  { id: 'f1', name: 'Frutilla al Agua', description: 'Frutillas frescas', price: 0, category: 'frutal', gradient: 'from-red-400 to-pink-500' },
  { id: 'f2', name: 'Limón', description: 'Patagónico', price: 0, category: 'frutal', gradient: 'from-lime-300 to-yellow-400' },
  { id: 'f3', name: 'Naranja', description: 'Exprimido natural', price: 0, category: 'frutal', gradient: 'from-orange-300 to-orange-500' },
  { id: 'f4', name: 'Durazno', description: 'Selección natural', price: 0, category: 'frutal', gradient: 'from-orange-200 to-orange-400' },
  { id: 'f5', name: 'Ananá', description: 'Tropical', price: 0, category: 'frutal', gradient: 'from-yellow-300 to-yellow-500' },
  { id: 'f6', name: 'Mango', description: 'Dulce y fresco', price: 0, category: 'frutal', gradient: 'from-amber-400 to-orange-500' },
  { id: 'f7', name: 'Maracuyá', description: 'Con semillas', price: 0, category: 'frutal', gradient: 'from-yellow-400 to-orange-400' },
  { id: 'f8', name: 'Frutos del Bosque', description: 'Mix de berries', price: 0, category: 'frutal', gradient: 'from-purple-400 to-pink-500' },
  { id: 'f9', name: 'Melón', description: 'Rocío de Miel', price: 0, category: 'frutal', gradient: 'from-green-200 to-green-400' },

  // --- ESPECIALES ---
  { id: 'e1', name: 'Menta Granizada', description: 'Refrescante con chips', price: 0, category: 'especial', gradient: 'from-emerald-300 to-emerald-500' },
  { id: 'e2', name: 'Pistacho', description: 'Siciliano puro', price: 0, category: 'especial', gradient: 'from-green-300 to-green-500' },
  { id: 'e3', name: 'Nutella', description: 'Crema de avellanas original', price: 0, category: 'especial', gradient: 'from-amber-600 to-amber-800' },
  { id: 'e4', name: 'Cheesecake', description: 'Con salsa de frutos rojos', price: 0, category: 'especial', gradient: 'from-amber-100 to-rose-200' },
  { id: 'e5', name: 'Sambayón', description: 'Con oporto', price: 0, category: 'especial', gradient: 'from-yellow-100 to-amber-200' },
  { id: 'e6', name: 'Café', description: 'Espresso intenso', price: 0, category: 'especial', gradient: 'from-amber-700 to-stone-800' },
  { id: 'e7', name: 'Tiramisú', description: 'Postre italiano', price: 0, category: 'especial', gradient: 'from-stone-200 to-stone-400' },
  { id: 'e8', name: 'Kinotos al Whisky', description: ' macerados', price: 0, category: 'especial', gradient: 'from-orange-400 to-orange-600' },
];

export const PRODUCTS = FLAVORS;