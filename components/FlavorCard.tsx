import React from 'react';
import { Product } from '../types';

interface FlavorCardProps {
    flavor: Product;
    inStock: boolean;
    isAdmin?: boolean;
    onToggleStock: (id: string) => void;
    // Selection Props
    selectable?: boolean;
    selected?: boolean;
    onSelect?: () => void;
}

export const FlavorCard: React.FC<FlavorCardProps> = ({
    flavor,
    inStock,
    isAdmin,
    onToggleStock,
    selectable,
    selected,
    onSelect
}) => {
    // Dynamic Image Logic
    const getFlavorImage = (name: string, category: string) => {
        const lowerName = name.toLowerCase();
        if (category === 'chocolate' || lowerName.includes('chocolate')) return '/images/scoop-chocolate.png';
        if (category === 'frutal' || lowerName.includes('frutilla') || lowerName.includes('frambuesa')) return '/images/scoop-strawberry.png';
        if (lowerName.includes('limon') || lowerName.includes('anana')) return '/images/scoop-limon.png';
        return '/images/scoop-ddl.png'; // Default (Dulce de Leche / Cremas)
    };

    const imageSrc = getFlavorImage(flavor.name, flavor.category);

    return (
        <div
            onClick={selectable && inStock ? onSelect : undefined}
            className={`
        relative overflow-hidden rounded-xl transition-all duration-300 shadow-sm group
        ${selectable
                    ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                    : ''}
        ${selected
                    ? 'ring-4 ring-emerald-500 ring-offset-2 transform scale-[1.02] z-10'
                    : 'bg-white border border-stone-100'}
        ${!inStock && !isAdmin ? 'grayscale opacity-60 pointer-events-none' : ''}
    `}>

            {/* Background (Subtle Gradient based on category - Keep it minimal white) */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white via-white to-stone-100`} />

            <div className="relative flex flex-row items-center p-3 h-full gap-3">

                {/* Image Scoop */}
                <div className="w-14 h-14 shrink-0 drop-shadow-md group-hover:drop-shadow-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <img src={imageSrc} alt={flavor.name} className="w-full h-full object-contain" />
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className={`font-serif font-bold text-stone-800 leading-tight ${flavor.name.length > 20 ? 'text-xs' : 'text-sm'}`}>
                        {flavor.name}
                    </h3>
                    {flavor.description && (
                        <p className="text-[10px] text-stone-400 truncate mt-0.5 font-medium">
                            {flavor.description}
                        </p>
                    )}

                    {/* Selection Indicator Badge */}
                    {selected && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce-in">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Admin Toggle Switch */}
                {isAdmin && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStock(flavor.id);
                        }}
                        className={`
                w-8 h-4 rounded-full transition-colors relative shrink-0
                ${inStock ? 'bg-emerald-500' : 'bg-stone-300'}
              `}
                    >
                        <div
                            className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform
                  ${inStock ? 'left-4.5' : 'left-0.5'}
                `}
                        />
                    </button>
                )}
            </div>
        </div>
    );
};
