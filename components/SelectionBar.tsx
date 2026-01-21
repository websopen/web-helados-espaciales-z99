import React from 'react';

interface SelectionBarProps {
    currentProduct: { label: string; price: number } | null;
    selectedCount: number;
    maxFlavors: number;
    onAdd: () => void;
    onCancel: () => void;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
    currentProduct,
    selectedCount,
    maxFlavors,
    onAdd,
    onCancel
}) => {
    if (!currentProduct) return null;

    const isComplete = selectedCount > 0; // Can add partial if they want? Or enforce? Let's allow partial for now.
    const progress = (selectedCount / maxFlavors) * 100;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in-up">
            <div className="max-w-xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-200 p-4">
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <h3 className="font-bold text-stone-800 text-lg leading-tight">
                            {currentProduct.label}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">
                            Elegí hasta {maxFlavors} gustos
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold font-serif text-stone-800">
                            {selectedCount}/{maxFlavors}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-stone-100 rounded-full mb-4 overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-stone-500 hover:bg-stone-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onAdd}
                        disabled={selectedCount === 0}
                        className="flex-[2] py-3 px-4 rounded-xl font-bold text-white bg-stone-900 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        Agregar al Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};
