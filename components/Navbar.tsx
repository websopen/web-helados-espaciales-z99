import React from 'react';

interface NavbarProps {
  showAdminSwitch: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
  storeOpen: boolean;
  onLogoClick: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  showAdminSwitch,
  isEditing,
  onToggleEdit,
  storeOpen,
  onLogoClick,
  isDarkMode,
  toggleTheme
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-100/80 to-rose-100/80 dark:from-stone-900/90 dark:to-stone-800/90 backdrop-blur-lg border-b border-white/30 dark:border-stone-700/50" />

      <div className="relative px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
        {/* Logo / Title */}
        <button onClick={onLogoClick} className="flex items-center gap-2">
          <span className="text-2xl">🍨</span>
          <div className="flex flex-col items-start">
            <span className="font-serif font-bold text-lg text-stone-800 dark:text-white leading-none">
              Heladería
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Carta de Sabores
            </span>
          </div>
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {!storeOpen && (
            <span className="bg-red-500/20 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full font-medium">
              Cerrado
            </span>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-white/50 dark:bg-stone-700/50 flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* Admin Toggle */}
          {showAdminSwitch && (
            <button
              onClick={onToggleEdit}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95 ${isEditing
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'bg-white/50 dark:bg-stone-700/50'
                }`}
            >
              {isEditing ? '✏️' : '⚙️'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};