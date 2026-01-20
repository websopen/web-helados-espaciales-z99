import React from 'react';
import { Product } from '../types';

interface FlavorCardProps {
    flavor: Product;
    inStock: boolean;
    isAdmin: boolean;
    onToggleStock: (id: string) => void;
}

export const FlavorCard: React.FC<FlavorCardProps> = ({
    flavor,
    inStock,
    isAdmin,
    onToggleStock
}) => {
    return (
        <div
            className={`relative rounded-xl overflow-hidden transition-all duration-300 ${!inStock ? 'opacity-40 grayscale' : ''
                }`}
        >
            {/* Gradient background */}
            <div className={`bg-gradient-to-br ${flavor.gradient} h-20 flex items-center justify-center relative`}>
                {/* Name */}
                <span className="text-white font-semibold text-sm text-center px-2 drop-shadow-md leading-tight">
                    {flavor.name}
                </span>

                {/* Out of stock indicator */}
                {!inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="text-white text-xs font-bold">AGOTADO</span>
                    </div>
                )}
            </div>

            {/* Admin controls */}
            {isAdmin && (
                <button
                    onClick={() => onToggleStock(flavor.id)}
                    className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-lg ${inStock
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                >
                    {inStock ? '✓' : '✗'}
                </button>
            )}
        </div>
    );
};
