import React, { useState } from 'react';

export interface PriceProduct {
    id: string;
    label: string;
    price: number;
    category: 'alPaso' | 'paraLlevar';
    maxFlavors: number;
    promo?: string; // "2x1", "10% OFF", etc.
    order?: number; // For sorting
}

interface PriceTableProps {
    products: PriceProduct[];
    isAdmin: boolean;
    onProductsChange: (products: PriceProduct[]) => void;
    onSelect: (key: string, price: number, label: string) => void;
}

export const PriceTable: React.FC<PriceTableProps> = ({ products, isAdmin, onProductsChange, onSelect }) => {
    const [selectedProduct, setSelectedProduct] = useState<PriceProduct | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState<Partial<PriceProduct>>({
        label: '',
        price: 0,
        category: 'paraLlevar',
        maxFlavors: 2,
        promo: ''
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleProductClick = (product: PriceProduct) => {
        if (isAdmin) return;
        setSelectedProduct(product);
    };

    const handleConfirm = () => {
        if (selectedProduct) {
            onSelect(selectedProduct.id, selectedProduct.price, selectedProduct.label);
            setSelectedProduct(null);
            setTimeout(() => {
                const flavorSection = document.getElementById('flavors-start');
                if (flavorSection) {
                    flavorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };

    const handleCancel = () => {
        setSelectedProduct(null);
    };

    const handlePriceChange = (id: string, price: number) => {
        onProductsChange(products.map(p => p.id === id ? { ...p, price } : p));
    };

    const handleLabelChange = (id: string, label: string) => {
        onProductsChange(products.map(p => p.id === id ? { ...p, label } : p));
    };

    const handleMaxFlavorsChange = (id: string, maxFlavors: number) => {
        onProductsChange(products.map(p => p.id === id ? { ...p, maxFlavors } : p));
    };

    const handlePromoChange = (id: string, promo: string) => {
        onProductsChange(products.map(p => p.id === id ? { ...p, promo } : p));
    };

    const handleDeleteProduct = (id: string) => {
        if (confirm('¿Eliminar este producto?')) {
            onProductsChange(products.filter(p => p.id !== id));
        }
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newProducts = [...products];
        [newProducts[index - 1], newProducts[index]] = [newProducts[index], newProducts[index - 1]];
        onProductsChange(newProducts);
    };

    const handleMoveDown = (index: number) => {
        if (index === products.length - 1) return;
        const newProducts = [...products];
        [newProducts[index], newProducts[index + 1]] = [newProducts[index + 1], newProducts[index]];
        onProductsChange(newProducts);
    };

    const handleAddProduct = () => {
        if (!newProduct.label?.trim()) return;
        const product: PriceProduct = {
            id: `product_${Date.now()}`,
            label: newProduct.label.trim(),
            price: newProduct.price || 0,
            category: newProduct.category || 'paraLlevar',
            maxFlavors: newProduct.maxFlavors || 2,
            promo: newProduct.promo?.trim() || undefined
        };
        onProductsChange([...products, product]);
        setNewProduct({ label: '', price: 0, category: 'paraLlevar', maxFlavors: 2, promo: '' });
        setShowAddForm(false);
    };

    return (
        <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-xl max-w-2xl mx-auto my-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-stone-800 font-serif tracking-widest border-b-2 border-amber-900/10 pb-1">
                    MENÚ DE PRECIOS
                </h2>
                {isAdmin && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors flex items-center gap-1"
                    >
                        {showAddForm ? '✕ Cancelar' : '+ Producto'}
                    </button>
                )}
            </div>

            {/* Add Product Form */}
            {isAdmin && showAddForm && (
                <div className="mb-4 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-300 animate-bounce-in">
                    <h4 className="text-sm font-bold text-emerald-800 mb-3">Nuevo Producto</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Nombre (ej: 1/4 Kilo)"
                            value={newProduct.label || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, label: e.target.value })}
                            className="col-span-2 px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-400"
                        />
                        <input
                            type="number"
                            placeholder="Precio"
                            value={newProduct.price || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                            className="px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-400"
                        />
                        <input
                            type="text"
                            placeholder="Promo (ej: 2x1)"
                            value={newProduct.promo || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, promo: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-400"
                        />
                        <select
                            value={newProduct.maxFlavors || 2}
                            onChange={(e) => setNewProduct({ ...newProduct, maxFlavors: parseInt(e.target.value) })}
                            className="px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-400"
                        >
                            {[1, 2, 3, 4, 5, 6].map(n => (
                                <option key={n} value={n}>{n} sabor{n > 1 ? 'es' : ''}</option>
                            ))}
                        </select>
                        <select
                            value={newProduct.category || 'paraLlevar'}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as 'alPaso' | 'paraLlevar' })}
                            className="px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-400"
                        >
                            <option value="alPaso">🍦 Al Paso</option>
                            <option value="paraLlevar">🍨 Para Llevar</option>
                        </select>
                        <button
                            onClick={handleAddProduct}
                            disabled={!newProduct.label?.trim()}
                            className="col-span-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            )}

            {/* Product List */}
            <div className="space-y-2">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${selectedProduct?.id === product.id
                            ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400'
                            : product.category === 'paraLlevar'
                                ? 'bg-amber-50/80 border-amber-200 hover:border-amber-400'
                                : 'bg-white/80 border-stone-200 hover:border-stone-400'
                            } ${!isAdmin && 'cursor-pointer hover:shadow-md active:scale-[0.99]'}`}
                    >
                        {/* Reorder Arrows */}
                        {isAdmin && (
                            <div className="flex flex-col gap-0.5">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleMoveUp(index); }}
                                    disabled={index === 0}
                                    className="w-6 h-6 rounded bg-stone-200 hover:bg-stone-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs"
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleMoveDown(index); }}
                                    disabled={index === products.length - 1}
                                    className="w-6 h-6 rounded bg-stone-200 hover:bg-stone-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs"
                                >
                                    ↓
                                </button>
                            </div>
                        )}

                        {/* Icon & Label */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-2xl shrink-0">
                                {product.category === 'paraLlevar' ? '🍨' : '🍦'}
                            </span>
                            <div className="flex-1 min-w-0">
                                {isAdmin ? (
                                    <input
                                        type="text"
                                        value={product.label}
                                        onChange={(e) => handleLabelChange(product.id, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="font-bold text-stone-800 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-500 outline-none w-full"
                                    />
                                ) : (
                                    <span className="font-bold text-stone-800">{product.label}</span>
                                )}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {isAdmin ? (
                                        <select
                                            value={product.maxFlavors}
                                            onChange={(e) => handleMaxFlavorsChange(product.id, parseInt(e.target.value))}
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-xs text-stone-500 bg-transparent border-none outline-none cursor-pointer"
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(n => (
                                                <option key={n} value={n}>hasta {n} sabor{n > 1 ? 'es' : ''}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="text-xs text-stone-500">
                                            (hasta {product.maxFlavors} sabores)
                                        </span>
                                    )}
                                    {/* Promo Badge */}
                                    {product.promo && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                                            {product.promo}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Promo Input, Price & Delete */}
                        <div className="flex items-center gap-2 shrink-0">
                            {isAdmin && (
                                <input
                                    type="text"
                                    value={product.promo || ''}
                                    onChange={(e) => handlePromoChange(product.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Promo"
                                    className="w-14 text-center text-xs bg-pink-50 border border-pink-300 rounded px-1 py-0.5 focus:outline-none focus:border-pink-400"
                                />
                            )}
                            {isAdmin ? (
                                <>
                                    <input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => handlePriceChange(product.id, parseInt(e.target.value) || 0)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-20 text-right font-bold text-lg bg-white border border-stone-300 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-400"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProduct(product.id);
                                        }}
                                        className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center text-sm transition-colors"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </>
                            ) : (
                                <span className={`font-bold text-xl ${product.category === 'paraLlevar' ? 'text-amber-700' : 'text-stone-800'
                                    }`}>
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirmation Modal */}
            {selectedProduct && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-400 animate-bounce-in">
                    <div className="text-center mb-3">
                        <span className="text-lg font-bold text-emerald-700">
                            ¿Agregar {selectedProduct.label} ({formatPrice(selectedProduct.price)})?
                        </span>
                        {selectedProduct.promo && (
                            <span className="ml-2 text-sm font-bold text-pink-600">{selectedProduct.promo}</span>
                        )}
                        <p className="text-sm text-emerald-600 mt-1">
                            Podrás elegir hasta {selectedProduct.maxFlavors} sabores
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 py-3 rounded-xl font-bold text-stone-600 bg-white border border-stone-300 hover:bg-stone-50 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg"
                        >
                            ✓ Confirmar
                        </button>
                    </div>
                </div>
            )}

            {/* Category Labels */}
            <div className="flex justify-between mt-4 px-2 text-xs text-stone-500">
                <span>🍦 Al Paso</span>
                <span>🍨 Para Llevar</span>
            </div>
        </div>
    );
};

// Default products for initialization
export const DEFAULT_PRODUCTS: PriceProduct[] = [
    { id: 'cucurucho', label: 'Cucurucho', price: 2500, category: 'alPaso', maxFlavors: 2 },
    { id: 'doble', label: 'Cucurucho Doble', price: 4000, category: 'alPaso', maxFlavors: 2 },
    { id: 'cuarto', label: '1/4 Kilo', price: 3500, category: 'paraLlevar', maxFlavors: 3 },
    { id: 'medio', label: '1/2 Kilo', price: 6500, category: 'paraLlevar', maxFlavors: 3 },
    { id: 'kilo', label: '1 Kilo', price: 12000, category: 'paraLlevar', maxFlavors: 4 },
];
