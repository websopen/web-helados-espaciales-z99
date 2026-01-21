import React from 'react';

interface NavbarProps {
  showAdminSwitch: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
  storeOpen: boolean;
  onLogoClick: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  showAdminSwitch,
  isEditing,
  onToggleEdit,
  storeOpen,
  onLogoClick,
  cartCount,
  onOpenCart
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-xl">
      {/* Mosaic Background */}
      <div className="absolute inset-0 bg-venecitas border-b border-white/10 shadow-lg" />

      <div className="relative px-6 py-3 flex items-center justify-between h-16 w-full mx-auto">

        {/* Left Section: Admin Toggle (Placeholder for alignment if hidden) */}
        <div className="w-10">
          {showAdminSwitch && (
            <button
              onClick={onToggleEdit}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95 ${isEditing
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'bg-white/50 dark:bg-stone-700/50'
                }`}
            >
              {isEditing ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-600 dark:text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Center: Logo / Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={onLogoClick}
            className="flex flex-col items-center group focus:outline-none"
          >
            <span className="font-serif font-bold text-2xl text-white leading-none drop-shadow-md tracking-tight whitespace-nowrap">
              HELADERÍA & CAFÉ
            </span>
            <span className="text-[10px] text-emerald-100/90 uppercase tracking-[0.2em] font-medium mt-1">
              Carta de Sabores
            </span>
          </button>
        </div>

        {/* Right Section: Status Badge & Cart */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {!storeOpen && (
            <span className="bg-red-500/20 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Cerrado
            </span>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl text-stone-700 flex items-center justify-center transition-all relative group active:scale-95 border border-stone-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};