import React, { useState, useEffect } from 'react';

interface StoreClosedModalProps {
  isOpen: boolean; // Si la tienda está cerrada
}

export const StoreClosedModal: React.FC<StoreClosedModalProps> = ({ isOpen }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Si la tienda cierra, mostrar el modal. 
    // Si ya lo vio en esta sesión (podríamos usar sessionStorage), tal vez no mostrarlo de nuevo,
    // pero por ahora lo mostramos siempre que isOpen sea false al cargar.
    if (!isOpen) {
      const hasSeen = sessionStorage.getItem('martina_closed_seen');
      if (!hasSeen) {
          setVisible(true);
      }
    }
  }, [isOpen]);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('martina_closed_seen', 'true');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-bounce-in overflow-hidden">
        {/* Decorative Moon/Zzz */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
        
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
            🌙
        </div>

        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">Estamos Descansando</h2>
        <p className="text-stone-500 mb-8 leading-relaxed">
          Nuestro local está cerrado en este momento, pero puedes dejar tu pedido armado y lo prepararemos para el próximo turno.
        </p>

        <button 
          onClick={handleDismiss}
          className="w-full py-3.5 rounded-xl font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-lg active:scale-95"
        >
          Ver Menú y Programar Pedido
        </button>
      </div>
    </div>
  );
};