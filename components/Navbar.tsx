import React from 'react';
import { UserAccount } from '../services/authConfig';

interface NavbarProps {
  showAdminSwitch: boolean;
  isEditing: boolean;
  onOpenSidebar: () => void;
  onOpenClientSidebar: () => void;
  storeOpen: boolean;
  onLogoClick: () => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser?: UserAccount | null;
  onOpenMetrics?: () => void;
  // New props for admin preview mode
  adminPreviewMode?: boolean;
  onTogglePreviewMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  showAdminSwitch,
  isEditing,
  onOpenSidebar,
  onOpenClientSidebar,
  storeOpen,
  onLogoClick,
  cartCount,
  onOpenCart,
  currentUser,
  onOpenMetrics,
  adminPreviewMode,
  onTogglePreviewMode
}) => {
  // Handle logo button click - admin opens admin sidebar, clients open client sidebar
  // When admin is in preview mode, show client sidebar instead
  const handleLogoButtonClick = () => {
    if (showAdminSwitch && !adminPreviewMode) {
      onOpenSidebar();
    } else {
      onOpenClientSidebar();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-xl">
      {/* Mosaic Background */}
      <div className="absolute inset-0 bg-[#14532D] border-b border-white/10 shadow-lg" />

      <div className="relative px-3 flex items-center justify-between h-14 w-full mx-auto">

        {/* Left Section: Hamburger Menu Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogoButtonClick}
            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 backdrop-blur-md ${isEditing
              ? 'bg-emerald-500/30 border border-emerald-400/50 shadow-lg shadow-emerald-500/20'
              : 'bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 shadow-lg shadow-black/10'
              }`}
            title={showAdminSwitch ? "Menú Admin" : "Información del local"}
          >
            <span className={`block w-5 h-0.5 rounded-full transition-all ${isEditing ? 'bg-emerald-400' : 'bg-white'}`}></span>
            <span className={`block w-5 h-0.5 rounded-full transition-all ${isEditing ? 'bg-emerald-400' : 'bg-white'}`}></span>
            <span className={`block w-5 h-0.5 rounded-full transition-all ${isEditing ? 'bg-emerald-400' : 'bg-white'}`}></span>
          </button>

          {/* Admin Preview Mode Toggle - Only visible for admins */}
          {showAdminSwitch && onTogglePreviewMode && (
            <button
              onClick={onTogglePreviewMode}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 backdrop-blur-md shadow-lg ${adminPreviewMode
                ? 'bg-blue-500/30 border border-blue-400/50 text-blue-300 shadow-blue-500/20'
                : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 hover:text-white shadow-black/10'
                }`}
              title={adminPreviewMode ? "Modo Vista Cliente (Activo)" : "Ver como Cliente"}
            >
              {adminPreviewMode ? '👁️' : '👤'}
            </button>
          )}
        </div>

        {/* Center: Logo / Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={onLogoClick}
            className="flex flex-col items-center group focus:outline-none"
          >
            <span className="font-serif font-bold text-4xl text-white leading-none tracking-wide whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Heladeria
            </span>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {!storeOpen && (
            <span className="bg-red-500/20 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Cerrado
            </span>
          )}

          {/* Admin Preview Mode Label */}
          {adminPreviewMode && (
            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full font-medium">
              Vista Cliente
            </span>
          )}

          {/* Cart Button - Liquid Glass Effect */}
          <button
            onClick={onOpenCart}
            className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg shadow-black/10 hover:bg-white/30 hover:border-white/40 text-white flex items-center justify-center transition-all relative group active:scale-95"
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