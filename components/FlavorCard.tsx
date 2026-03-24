import React, { useState } from 'react';
import { Product } from '../types';

interface FlavorCardProps {
    flavor: Product;
    quantity: number;
    isAdmin?: boolean;
    onQuantityChange: (id: string, newQuantity: number) => void;
    onFlavorEdit?: (id: string, updates: Partial<Product>) => void;
    selectable?: boolean;
    selected?: boolean;
    onSelect?: () => void;
}

const STOCK_OPTIONS = [0, 0.25, 0.5, 0.75, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const formatQuantity = (qty: number): string => {
    if (qty === 0) return '0';
    if (qty === 0.25) return '¼';
    if (qty === 0.5) return '½';
    if (qty === 0.75) return '¾';
    return qty.toString();
};

export const FlavorCard: React.FC<FlavorCardProps> = ({
    flavor,
    quantity,
    isAdmin,
    onQuantityChange,
    onFlavorEdit,
    selectable,
    selected,
    onSelect
}) => {
    const inStock = quantity > 0;
    const [editName, setEditName] = useState(flavor.name);
    const [editDesc, setEditDesc] = useState(flavor.description || '');
    const [editImageUrl, setEditImageUrl] = useState(flavor.imageUrl || '');
    const [editAlert, setEditAlert] = useState(flavor.alert || '');
    const [showAlert, setShowAlert] = useState(false);

    // Dynamic Image Logic - Using new transparent PNGs
    const getFlavorImage = () => {
        if (flavor.imageUrl) return flavor.imageUrl;
        const lowerName = flavor.name.toLowerCase();

        // Chocolates
        if (flavor.category === 'chocolate' || lowerName.includes('chocolate') || lowerName.includes('brownie') || lowerName.includes('almendrado') || lowerName.includes('marroc') || lowerName.includes('rocher') || lowerName.includes('mousse')) {
            return '/images/scoop-chocolate-solid.png';
        }
        // Cremas
        if (lowerName.includes('dulce de leche') || lowerName.includes('ddl') || lowerName.includes('tramontana') || lowerName.includes('granizado')) {
            return '/images/scoop-ddl-solid.png';
        }
        if (lowerName.includes('americana') || lowerName.includes('vainilla') || lowerName.includes('crema rusa') || lowerName.includes('mascarpone') || lowerName.includes('flan') || lowerName.includes('banana')) {
            return '/images/scoop-vainilla-solid.png';
        }
        if (lowerName.includes('oreo')) {
            return '/images/scoop-oreo.png';
        }
        // Frutales
        if (lowerName.includes('frutilla') || lowerName.includes('cereza')) {
            return '/images/scoop-frutilla-solid.png';
        }
        if (lowerName.includes('limón') || lowerName.includes('limon') || lowerName.includes('ananá') || lowerName.includes('anana') || lowerName.includes('maracuyá') || lowerName.includes('maracuya')) {
            return '/images/scoop-limon-solid.png';
        }
        if (lowerName.includes('frutos') || lowerName.includes('bosque') || lowerName.includes('frambuesa') || lowerName.includes('mora') || lowerName.includes('arándano')) {
            return '/images/scoop-berries.png';
        }
        if (flavor.category === 'frutal') {
            return '/images/scoop-frutilla-solid.png';
        }
        // Especiales
        if (lowerName.includes('menta')) {
            return '/images/scoop-menta-solid.png';
        }
        if (lowerName.includes('pistacho')) {
            return '/images/scoop-pistacho.png';
        }
        if (lowerName.includes('café') || lowerName.includes('cafe') || lowerName.includes('tiramisú') || lowerName.includes('tiramisu')) {
            return '/images/scoop-cafe.png';
        }
        // Default según categoría
        if (flavor.category === 'crema') return '/images/scoop-vainilla-solid.png';
        if (flavor.category === 'especial') return '/images/scoop-menta-solid.png';
        return '/images/scoop-ddl-solid.png';
    };

    const imageSrc = getFlavorImage();

    const handleSaveField = (field: string, value: string) => {
        if (onFlavorEdit) {
            onFlavorEdit(flavor.id, { [field]: value.trim() || undefined });
        }
    };

    // PUBLIC VIEW: Vertical card (imagen arriba, datos abajo)
    if (!isAdmin) {
        return (
            <div
                onClick={selectable && inStock ? onSelect : undefined}
                className={`
                    relative overflow-hidden rounded-xl transition-all duration-300 shadow-sm group bg-stone-100
                    ${selectable && inStock ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
                    ${selected ? 'ring-4 ring-emerald-500 ring-offset-2 transform scale-[1.02] z-10' : 'border border-stone-200'}
                    ${!inStock ? 'grayscale opacity-70' : ''}
                `}>

                {/* Imagen arriba - Solid background to hide checkerboard pattern */}
                <div className={`relative w-full aspect-square bg-stone-100 flex items-center justify-center p-3 ${!inStock ? 'grayscale' : ''}`}>
                    <img
                        src={imageSrc}
                        alt={flavor.name}
                        className={`w-full h-full object-contain drop-shadow-lg transition-all duration-500 ${inStock ? 'group-hover:scale-110 group-hover:rotate-6' : ''}`}
                    />

                    {/* Alert badge */}
                    {flavor.alert && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowAlert(!showAlert); }}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg animate-pulse hover:animate-none hover:bg-amber-600 z-10"
                            title="Ver alerta"
                        >
                            ⚠️
                        </button>
                    )}

                    {/* Selected checkmark */}
                    {selected && (
                        <div className="absolute top-1.5 left-1.5 bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md animate-bounce-in">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}

                    {/* Sin Stock badge */}
                    {!inStock && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-xs bg-stone-700 text-white px-2 py-1 rounded-full font-medium">
                                Sin Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Alert tooltip */}
                {showAlert && flavor.alert && (
                    <div className="absolute top-full left-0 right-0 mt-1 mx-2 p-2 bg-amber-100 border border-amber-300 rounded-lg text-xs text-amber-800 shadow-lg z-20 animate-fade-in">
                        ⚠️ {flavor.alert}
                    </div>
                )}

                {/* Datos abajo */}
                <div className="p-2 text-center">
                    <h3 className={`font-serif font-bold text-stone-800 leading-tight ${flavor.name.length > 15 ? 'text-[11px]' : 'text-xs'}`}>
                        {flavor.name}
                    </h3>
                    {flavor.description && (
                        <p className="text-[9px] text-stone-400 truncate mt-0.5">
                            {flavor.description}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // ADMIN VIEW: Vertical layout with all editable fields
    return (
        <div className={`
            relative overflow-hidden rounded-xl transition-all duration-300 shadow-sm
            bg-white border-2 ${inStock ? 'border-stone-200' : 'border-red-200 bg-red-50/30'}
        `}>
            {/* Imagen arriba */}
            <div className={`relative w-full aspect-square bg-stone-100 flex items-center justify-center p-2 ${!inStock ? 'grayscale opacity-50' : ''}`}>
                <img src={imageSrc} alt={flavor.name} className="w-full h-full object-contain" />

                {/* Category badge */}
                <span className="absolute top-1 left-1 text-[8px] text-stone-500 uppercase tracking-wider bg-white/80 px-1.5 py-0.5 rounded-full">
                    {flavor.category}
                </span>
            </div>

            {/* Datos editables abajo */}
            <div className="p-2 space-y-1.5">
                {/* Name Input */}
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleSaveField('name', editName)}
                    placeholder="Nombre"
                    className="w-full px-2 py-1 text-xs font-bold text-stone-800 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-emerald-400 transition-colors"
                />

                {/* Description Input */}
                <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    onBlur={() => handleSaveField('description', editDesc)}
                    placeholder="Descripción..."
                    className="w-full px-2 py-1 text-[10px] text-stone-600 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-emerald-400 transition-colors"
                />

                {/* Image URL Input */}
                <input
                    type="text"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    onBlur={() => handleSaveField('imageUrl', editImageUrl)}
                    placeholder="URL imagen"
                    className="w-full px-2 py-1 text-[10px] text-stone-500 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-emerald-400 transition-colors"
                />

                {/* Alert Input */}
                <div className="flex gap-1">
                    <span className="text-xs">⚠️</span>
                    <input
                        type="text"
                        value={editAlert}
                        onChange={(e) => setEditAlert(e.target.value)}
                        onBlur={() => handleSaveField('alert', editAlert)}
                        placeholder="Alerta (ej: Sabor raro)"
                        className="flex-1 px-2 py-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg outline-none focus:border-amber-400 transition-colors"
                    />
                </div>

                {/* Stock Selector */}
                <div className="flex items-center justify-between gap-1 pt-1">
                    <span className="text-[10px] text-stone-500">Stock:</span>
                    <select
                        value={quantity}
                        onChange={(e) => onQuantityChange(flavor.id, parseFloat(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer outline-none transition-colors ${quantity === 0
                            ? 'bg-red-100 text-red-600 border-red-200'
                            : quantity <= 1
                                ? 'bg-amber-100 text-amber-700 border-amber-200'
                                : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                    >
                        {STOCK_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>
                                {formatQuantity(opt)} 🪣
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
