import React from 'react';

interface PriceTableProps {
    prices: {
        cuarto: number;
        medio: number;
        kilo: number;
        cucurucho: number;
        doble: number;
    };
    isAdmin: boolean;
    onPriceChange: (key: any, value: number) => void;
    onSelect: (key: string, price: number, label: string) => void;
}

export const PriceTable: React.FC<PriceTableProps> = ({ prices, isAdmin, onPriceChange, onSelect }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Map flat price object to sections for display
    const alPasoItems = [
        { key: 'cucurucho', label: 'Cucurucho', price: prices.cucurucho },
        { key: 'doble', label: 'Cucurucho Doble', price: prices.doble },
    ];

    const paraLlevarItems = [
        { key: 'cuarto', label: '1/4 Kilo', price: prices.cuarto },
        { key: 'medio', label: '1/2 Kilo', price: prices.medio },
        { key: 'kilo', label: '1 Kilo', price: prices.kilo },
    ];

    // The provided instruction implies a refactoring of the 'prices' prop structure
    // and the 'onPriceChange' handler.
    // To make the provided code snippet syntactically correct and functional,
    // I will adapt the existing 'prices' and 'onPriceChange' to fit the new structure.
    // This means creating a temporary 'prices' object with 'alPaso' and 'paraLlevar' arrays
    // and a compatible 'updatePrice' function.

    const newPricesStructure = {
        alPaso: alPasoItems,
        paraLlevar: paraLlevarItems,
    };

    const updatePrice = (category: 'alPaso' | 'paraLlevar', index: number, value: number) => {
        const item = newPricesStructure[category][index];
        if (item) {
            onPriceChange(item.key, value);
        }
    };

    return (
        <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-xl max-w-5xl mx-auto my-6">
            <div className="flex items-center justify-center mb-6">
                <h2 className="text-xl font-bold text-stone-800 font-serif tracking-widest border-b-2 border-amber-900/10 pb-1">
                    PRECIOS & TAMAÑOS
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Al Paso Column */}
                <div>
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4 text-center">Al Paso</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {newPricesStructure.alPaso.map((item, index) => (
                            <PriceCard
                                key={`aso-${index}`}
                                {...item}
                                isAdmin={isAdmin}
                                onChange={(price) => updatePrice('alPaso', index, price)}
                                onSelect={() => onSelect(item.key, item.price, item.label)}
                                formatPrice={formatPrice}
                                highlight={false}
                            />
                        ))}
                    </div>
                </div>

                {/* Para Llevar Column */}
                <div>
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4 text-center">Para Llevar</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {newPricesStructure.paraLlevar.map((item, index) => (
                            <PriceCard
                                key={`llevar-${index}`}
                                {...item}
                                isAdmin={isAdmin}
                                onChange={(price) => updatePrice('paraLlevar', index, price)}
                                onSelect={() => onSelect(item.key, item.price, item.label)}
                                formatPrice={formatPrice}
                                highlight={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface PriceCardProps {
    label: string;
    price: number;
    isAdmin: boolean;
    onChange: (val: number) => void;
    onSelect?: () => void;
    formatPrice: (val: number) => string;
    highlight?: boolean;
}

const PriceCard: React.FC<PriceCardProps> = ({ label, price, isAdmin, onChange, onSelect, formatPrice, highlight }) => (
    <button
        onClick={isAdmin ? undefined : onSelect}
        disabled={isAdmin}
        className={`relative w-full text-left p-3 rounded-xl border transition-all duration-300 overflow-hidden backdrop-blur-md flex flex-row items-center gap-3
        ${highlight
                ? 'bg-amber-100/90 border-amber-500/50 shadow-amber-900/10 scale-100 z-10'
                : 'bg-white/80 border-white/40 shadow-sm hover:shadow-md'
            }
        ${!isAdmin && 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer ring-amber-500 hover:ring-2'} group
        `}
    >
        {/* Product Image */}
        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-white border border-stone-100 shadow-inner">
            <img
                src="/images/pot-mixed.png"
                alt="Helado"
                className="w-full h-full object-cover mix-blend-multiply"
            />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                {label}
            </span>

            {isAdmin ? (
                <input
                    type="number"
                    value={price || 0}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                    className="w-full text-left font-bold text-xl bg-transparent text-stone-800 focus:outline-none border-b border-stone-400/50"
                />
            ) : (
                <span className={`font-bold text-xl leading-none mt-0.5 ${highlight ? 'text-amber-700' : 'text-stone-800'}`}>
                    {formatPrice(price || 0)}
                </span>
            )}
        </div>
    </button>
);
