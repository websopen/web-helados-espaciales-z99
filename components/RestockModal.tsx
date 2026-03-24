import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface RestockModalProps {
    isOpen: boolean;
    onClose: () => void;
    outOfStockFlavors: Product[];
    whatsappNumber?: string;
}

export const RestockModal: React.FC<RestockModalProps> = ({
    isOpen,
    onClose,
    outOfStockFlavors,
    whatsappNumber
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Reset selection when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedIds(new Set());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const selectAll = () => {
        if (selectedIds.size === outOfStockFlavors.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(outOfStockFlavors.map(f => f.id)));
        }
    };

    const handleSendWhatsApp = () => {
        const selectedFlavors = outOfStockFlavors.filter(f => selectedIds.has(f.id));
        if (selectedFlavors.length === 0) return;

        let message = `*📦 Productos para Reponer:*%0A%0A`;
        selectedFlavors.forEach(flavor => {
            message += `• ${flavor.name}%0A`;
        });
        message += `%0A-------------------%0A`;
        message += `_Enviado desde Carta Helados_`;

        const phone = whatsappNumber || '';
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        onClose();
    };

    const allSelected = selectedIds.size === outOfStockFlavors.length && outOfStockFlavors.length > 0;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-bounce-in">
                {/* Header */}
                <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center">
                    <div>
                        <h2 className="font-serif font-bold text-xl text-stone-800">📦 Notificar Reposición</h2>
                        <p className="text-xs text-stone-500 mt-1">Selecciona los productos que necesitan reposición</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-amber-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {outOfStockFlavors.length === 0 ? (
                        <div className="text-center py-10 flex flex-col items-center">
                            <span className="text-4xl mb-3">✅</span>
                            <p className="text-stone-500 font-medium">¡Todo el stock está completo!</p>
                            <p className="text-stone-400 text-sm mt-1">No hay productos para reponer.</p>
                        </div>
                    ) : (
                        <>
                            {/* Select All Button */}
                            <button
                                onClick={selectAll}
                                className="w-full py-2 px-4 rounded-lg border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {allSelected ? '✓ Deseleccionar Todos' : '☐ Seleccionar Todos'}
                            </button>

                            {/* Product Items */}
                            {outOfStockFlavors.map(flavor => (
                                <button
                                    key={flavor.id}
                                    onClick={() => toggleSelection(flavor.id)}
                                    className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 text-left ${selectedIds.has(flavor.id)
                                            ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                                            : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                                        }`}
                                >
                                    {/* Checkbox */}
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedIds.has(flavor.id)
                                            ? 'bg-amber-500 border-amber-500 text-white'
                                            : 'border-stone-300 bg-white'
                                        }`}>
                                        {selectedIds.has(flavor.id) && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Flavor Info */}
                                    <div className="flex-1">
                                        <span className="font-semibold text-stone-800">{flavor.name}</span>
                                        <span className="text-xs text-stone-400 ml-2 capitalize">({flavor.category})</span>
                                    </div>

                                    {/* Out of Stock Badge */}
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                        Sin Stock
                                    </span>
                                </button>
                            ))}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-stone-50 border-t border-stone-100">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-stone-500 text-sm">
                            {selectedIds.size} producto{selectedIds.size !== 1 ? 's' : ''} seleccionado{selectedIds.size !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <button
                        onClick={handleSendWhatsApp}
                        disabled={selectedIds.size === 0}
                        className="w-full py-4 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.001.572 2.135.882 3.322.882 3.181 0 5.767-2.585 5.768-5.766s-2.587-5.766-5.768-5.766zm-9.068 18.261l2.457-8.969c-.722-1.724-1.11-3.631-1.112-5.594.004-7.464 6.075-13.535 13.54-13.535 3.618 0 7.017 1.409 9.575 3.966s3.968 5.957 3.968 9.574c-.004 7.463-6.076 13.534-13.54 13.534-2.028-.002-3.999-.414-5.772-1.189l-9.116 2.213zm9.068-19.183c-6.814 0-12.359 5.545-12.362 12.361.002 1.96.486 3.824 1.396 5.485l-1.63 5.94 6.088-1.595c1.598.871 3.41 1.332 5.253 1.333 6.814 0 12.359-5.545 12.362-12.362 0-3.3-1.285-6.403-3.62-8.738-2.336-2.336-5.439-3.621-8.739-3.624zm6.786 13.84c-.282-.141-1.668-.823-1.926-.917-.258-.094-.446-.141-.635.141-.188.282-.728.917-.893 1.106-.164.188-.329.211-.611.07-.282-.141-1.19-.439-2.268-1.399-.838-.747-1.403-1.669-1.567-1.951-.164-.282-.017-.435.123-.576.128-.128.282-.329.423-.494.141-.164.188-.282.282-.47.094-.188.047-.353-.023-.494-.07-.141-.635-1.529-.87-2.094-.229-.551-.462-.476-.635-.485-.164-.009-.352-.009-.54-.009-.188 0-.493.07-.751.352-.259.282-.987.964-.987 2.352 0 1.388 1.01 2.73 1.152 2.918.141.188 1.988 3.034 4.815 4.256 1.838.795 2.545.795 3.456.657.653-.099 1.668-.682 1.903-1.341.235-.659.235-1.223.164-1.341-.07-.118-.258-.165-.54-.306z" />
                        </svg>
                        Enviar por WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};
