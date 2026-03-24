import React, { useState } from 'react';
import { Cart, OrderItem } from '../types';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: Cart;
    onRemoveItem: (id: string) => void;
    whatsappNumber?: string;
}

type DeliveryMethod = 'pickup' | 'delivery';
type PaymentMethod = 'cash' | 'transfer' | 'card';

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cart, onRemoveItem, whatsappNumber }) => {
    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [comments, setComments] = useState('');

    if (!isOpen) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const deliveryLabels: Record<DeliveryMethod, string> = {
        pickup: '🛍️ Retiro en local',
        delivery: '🛵 Envío a domicilio'
    };

    const paymentLabels: Record<PaymentMethod, string> = {
        cash: '💵 Efectivo',
        transfer: '📱 Transferencia',
        card: '💳 Tarjeta'
    };

    const handleCheckout = () => {
        let message = `*¡Hola! Quiero realizar un pedido:*%0A%0A`;

        cart.items.forEach((item) => {
            message += `*${item.productName}* (${formatPrice(item.price)})%0A`;
            item.flavors.forEach(flavor => {
                message += `• ${flavor}%0A`;
            });
            message += `%0A`;
        });

        message += `--------------------%0A`;
        message += `*📦 Entrega:* ${deliveryLabels[deliveryMethod]}%0A`;
        message += `*💰 Pago:* ${paymentLabels[paymentMethod]}%0A`;

        if (comments.trim()) {
            message += `*📝 Comentarios:* ${comments}%0A`;
        }

        message += `--------------------%0A`;
        message += `*TOTAL: ${formatPrice(cart.total)}*`;

        const phone = whatsappNumber || '';
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-bounce-in">
                {/* Header */}
                <div className="bg-stone-50 p-4 border-b border-stone-100 flex justify-between items-center">
                    <h2 className="font-serif font-bold text-xl text-stone-800">Tu Pedido</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.items.length === 0 ? (
                        <div className="text-center py-10 flex flex-col items-center">
                            <span className="text-4xl mb-3">🛒</span>
                            <p className="text-stone-500 font-medium">El carrito está vacío</p>
                            <button onClick={onClose} className="mt-4 text-emerald-600 font-bold hover:underline">
                                Ver Menú
                            </button>
                        </div>
                    ) : (
                        <>
                            {cart.items.map(item => (
                                <div key={item.id} className="bg-stone-50 rounded-xl p-3 border border-stone-100 relative group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-stone-800">{item.productName}</h3>
                                        <span className="font-bold text-stone-900">{formatPrice(item.price)}</span>
                                    </div>
                                    <ul className="text-sm text-stone-600 space-y-1 mb-1">
                                        {item.flavors.map((flavor, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                {flavor}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                        title="Eliminar item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            {/* Delivery Method */}
                            <div className="border-t border-stone-200 pt-4">
                                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">📦 Método de entrega</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setDeliveryMethod('pickup')}
                                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border ${deliveryMethod === 'pickup'
                                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                                            }`}
                                    >
                                        🛍️ Retiro
                                    </button>
                                    <button
                                        onClick={() => setDeliveryMethod('delivery')}
                                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border ${deliveryMethod === 'delivery'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                                            }`}
                                    >
                                        🛵 Envío
                                    </button>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="border-t border-stone-200 pt-4">
                                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">💰 Método de pago</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all border ${paymentMethod === 'cash'
                                            ? 'bg-green-50 border-green-300 text-green-700'
                                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                                            }`}
                                    >
                                        💵 Efectivo
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('transfer')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all border ${paymentMethod === 'transfer'
                                            ? 'bg-purple-50 border-purple-300 text-purple-700'
                                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                                            }`}
                                    >
                                        📱 Transfer
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all border ${paymentMethod === 'card'
                                            ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                                            }`}
                                    >
                                        💳 Tarjeta
                                    </button>
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="border-t border-stone-200 pt-4">
                                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">📝 Comentarios (opcional)</h4>
                                <textarea
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Ej: Sin chocolate, extra dulce de leche..."
                                    className="w-full border border-stone-200 rounded-xl p-3 text-sm placeholder-stone-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none resize-none"
                                    rows={2}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer / Total */}
                <div className="p-4 bg-stone-50 border-t border-stone-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-stone-500 font-medium uppercase tracking-wider text-xs">Total</span>
                        <span className="text-2xl font-bold font-serif text-stone-900">{formatPrice(cart.total)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.items.length === 0}
                        className="w-full py-4 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shadow-lg hover:shadow-[#25D366]/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.001.572 2.135.882 3.322.882 3.181 0 5.767-2.585 5.768-5.766s-2.587-5.766-5.768-5.766zm-9.068 18.261l2.457-8.969c-.722-1.724-1.11-3.631-1.112-5.594.004-7.464 6.075-13.535 13.54-13.535 3.618 0 7.017 1.409 9.575 3.966s3.968 5.957 3.968 9.574c-.004 7.463-6.076 13.534-13.54 13.534-2.028-.002-3.999-.414-5.772-1.189l-9.116 2.213zm9.068-19.183c-6.814 0-12.359 5.545-12.362 12.361.002 1.96.486 3.824 1.396 5.485l-1.63 5.94 6.088-1.595c1.598.871 3.41 1.332 5.253 1.333 6.814 0 12.359-5.545 12.362-12.362 0-3.3-1.285-6.403-3.62-8.738-2.336-2.336-5.439-3.621-8.739-3.624zm6.786 13.84c-.282-.141-1.668-.823-1.926-.917-.258-.094-.446-.141-.635.141-.188.282-.728.917-.893 1.106-.164.188-.329.211-.611.07-.282-.141-1.19-.439-2.268-1.399-.838-.747-1.403-1.669-1.567-1.951-.164-.282-.017-.435.123-.576.128-.128.282-.329.423-.494.141-.164.188-.282.282-.47.094-.188.047-.353-.023-.494-.07-.141-.635-1.529-.87-2.094-.229-.551-.462-.476-.635-.485-.164-.009-.352-.009-.54-.009-.188 0-.493.07-.751.352-.259.282-.987.964-.987 2.352 0 1.388 1.01 2.73 1.152 2.918.141.188 1.988 3.034 4.815 4.256 1.838.795 2.545.795 3.456.657.653-.099 1.668-.682 1.903-1.341.235-.659.235-1.223.164-1.341-.07-.118-.258-.165-.54-.306z" />
                        </svg>
                        Enviar Pedido por WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};
