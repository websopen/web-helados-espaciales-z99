import React, { useState } from 'react';
import { PRICES } from '../constants';

interface PriceTableProps {
    prices: typeof PRICES;
    isAdmin: boolean;
    onPriceChange: (key: keyof typeof PRICES, value: number) => void;
}

export const PriceTable: React.FC<PriceTableProps> = ({
    prices,
    isAdmin,
    onPriceChange
}) => {
    const [editingKey, setEditingKey] = useState<keyof typeof PRICES | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleStartEdit = (key: keyof typeof PRICES) => {
        setEditingKey(key);
        setEditValue(prices[key].toString());
    };

    const handleSaveEdit = () => {
        if (editingKey && editValue) {
            onPriceChange(editingKey, parseInt(editValue));
        }
        setEditingKey(null);
        setEditValue('');
    };

    const priceRows = [
        { key: 'cucurucho' as const, label: '🍦 Cucurucho', sublabel: '1 sabor' },
        { key: 'doble' as const, label: '🍦 Cucurucho Doble', sublabel: '2 sabores' },
        { key: 'cuarto' as const, label: '🥡 1/4 Kilo', sublabel: '250g' },
        { key: 'medio' as const, label: '🥡 1/2 Kilo', sublabel: '500g' },
        { key: 'kilo' as const, label: '🥡 1 Kilo', sublabel: '1000g' },
    ];

    return (
        <div className="mb-8">
            {/* Header */}
            <div className="mb-4 flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg flex items-center justify-center text-xl">
                    🍨
                </div>
                <div className="flex flex-col">
                    <h1 className="font-serif font-bold text-2xl text-stone-800 dark:text-stone-100 leading-none">Precios</h1>
                    <span className="text-xs text-stone-400 font-medium tracking-wide">CARTA DE HELADOS</span>
                </div>
            </div>

            {/* Price Table */}
            <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 dark:border-stone-700 overflow-hidden">
                {priceRows.map((row, index) => (
                    <div
                        key={row.key}
                        className={`flex items-center justify-between px-4 py-3 ${index !== priceRows.length - 1 ? 'border-b border-stone-100 dark:border-stone-700' : ''
                            }`}
                    >
                        <div className="flex flex-col">
                            <span className="font-medium text-stone-800 dark:text-stone-100">{row.label}</span>
                            <span className="text-xs text-stone-400">{row.sublabel}</span>
                        </div>

                        {isAdmin && editingKey === row.key ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-20 px-2 py-1 text-right rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-white"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSaveEdit}
                                    className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"
                                >
                                    ✓
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => isAdmin && handleStartEdit(row.key)}
                                className={`text-lg font-bold text-pink-600 dark:text-pink-400 ${isAdmin ? 'hover:bg-pink-100 dark:hover:bg-pink-900/30 px-3 py-1 rounded-lg transition-colors cursor-pointer' : ''
                                    }`}
                                disabled={!isAdmin}
                            >
                                ${prices[row.key].toLocaleString()}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-stone-400 mt-3 px-4">
                Los precios pueden variar. Consultá disponibilidad de sabores.
            </p>
        </div>
    );
};
