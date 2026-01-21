import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FlavorCard } from './components/FlavorCard';
import { PriceTable } from './components/PriceTable';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { StoreClosedModal } from './components/StoreClosedModal';
import { FLAVORS, PRICES } from './constants';
import { Product } from './types';
import { checkAuth, validateToken, activateAdmin, getTokenFromUrl, clearTokenFromUrl } from './services/authService';
import { loadStoreData, saveStoreData, SocialLinks, defaultSocialLinks, defaultPrices } from './services/storeService';

const App: React.FC = () => {
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Token from URL for admin activation
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  // Dark Mode Logic
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // State for Batch Updates
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Store data from KV
  const [stockStatus, setStockStatus] = useState<{ [key: string]: boolean }>(() => {
    const initial: { [key: string]: boolean } = {};
    FLAVORS.forEach(p => initial[p.id] = true);
    return initial;
  });
  const [customPrices, setCustomPrices] = useState(PRICES);
  const [storeSettings, setStoreSettings] = useState({
    isOpen: true
  });
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocialLinks);

  // Initial load: check auth and load store data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      // Check if there's a token in the URL
      const token = getTokenFromUrl();
      if (token) {
        const result = await validateToken(token);
        if (result.valid) {
          setPendingToken(token);
          setShowPinModal(true);
          clearTokenFromUrl();
        } else if (result.alreadyAssociated) {
          clearTokenFromUrl();
        }
      }

      // Check if current user is admin (via cookie)
      const authStatus = await checkAuth();
      setHasAdminAccess(authStatus.isAdmin);

      // Load store data from KV
      const data = await loadStoreData();
      if (Object.keys(data.stock).length > 0) {
        setStockStatus(prev => ({ ...prev, ...data.stock }));
      }
      if (data.prices) {
        setCustomPrices(prev => ({ ...prev, ...data.prices }));
      }
      setStoreSettings(data.settings);
      setSocialLinks(data.socialLinks || defaultSocialLinks);

      setIsLoading(false);
    };

    init();
  }, []);

  // Handle PIN validation
  const handleValidatePin = async (pin: string): Promise<boolean> => {
    if (!pendingToken) return false;

    const result = await activateAdmin(pendingToken, pin);
    if (result.success) {
      setHasAdminAccess(true);
      setIsEditing(true);
      setPendingToken(null);
      return true;
    }
    return false;
  };

  // --- BATCH UPDATE LOGIC ---
  const saveAllChanges = async () => {
    const result = await saveStoreData({
      stock: stockStatus,
      prices: customPrices,
      settings: storeSettings,
      socialLinks: socialLinks,
    });

    if (result.success) {
      setHasUnsavedChanges(false);
      alert("¡Cambios aplicados correctamente!");
    } else {
      alert("Error al guardar: " + (result.error || 'Unknown error'));
    }
  };

  const handleToggleStock = (id: string) => {
    if (!hasAdminAccess || !isEditing) return;
    setStockStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setHasUnsavedChanges(true);
  };

  const handlePriceChange = (key: keyof typeof PRICES, value: number) => {
    if (!hasAdminAccess || !isEditing) return;
    setCustomPrices(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const toggleStoreSetting = (setting: 'deliveryAvailable' | 'pickupAvailable' | 'isOpen') => {
    setStoreSettings((prev: any) => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    setHasUnsavedChanges(true);
  };

  const handleSocialLinkChange = (key: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  // Filter by category
  const chocolateFlavors = FLAVORS.filter(p => p.category === 'chocolate');
  const cremaFlavors = FLAVORS.filter(p => p.category === 'crema');
  const frutalFlavors = FLAVORS.filter(p => p.category === 'frutal');
  const especialFlavors = FLAVORS.filter(p => p.category === 'especial');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 dark:bg-stone-900">
        <div className="animate-spin w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full"></div>
      </div>
    );
  }

  const renderFlavorSection = (title: string, emoji: string, subtitle: string, flavors: Product[]) => (
    <div className="mb-8">
      <div className="mb-5 flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-2xl bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm border border-white/60 dark:border-stone-700 shadow-sm flex items-center justify-center text-xl">
          {emoji}
        </div>
        <div className="flex flex-col">
          <h2 className="font-serif font-bold text-2xl text-stone-800 dark:text-stone-100 leading-none">{title}</h2>
          <span className="text-xs text-stone-400 font-medium tracking-wide">{subtitle}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {flavors.map(flavor => (
          <FlavorCard
            key={flavor.id}
            flavor={flavor}
            inStock={stockStatus[flavor.id] ?? true}
            isAdmin={isEditing}
            onToggleStock={handleToggleStock}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-stone-800 dark:text-stone-100 bg-gradient-to-b from-pink-50 to-amber-50 dark:from-stone-900 dark:to-stone-950 transition-colors duration-300">
      <Navbar
        showAdminSwitch={hasAdminAccess}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        storeOpen={storeSettings.isOpen}
        onLogoClick={() => { }}
        isDarkMode={theme === 'dark'}
        toggleTheme={toggleTheme}
      />

      <StoreClosedModal isOpen={storeSettings.isOpen} />

      <main className="pt-20 px-4 max-w-lg mx-auto transition-all duration-300">

        {/* PRICE TABLE - Always visible at top */}
        <PriceTable
          prices={customPrices}
          isAdmin={isEditing}
          onPriceChange={handlePriceChange}
        />

        {/* ADMIN PANEL */}
        {isEditing && (
          <div className="mb-8 bg-stone-900 dark:bg-stone-800 rounded-2xl p-5 shadow-xl text-white animate-fade-in-up border border-stone-800 dark:border-stone-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="font-bold uppercase tracking-wider text-xs">Panel de Control</h3>
              </div>

              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                Admin Activo
              </span>
            </div>

            <button
              onClick={() => toggleStoreSetting('isOpen')}
              className={`w-full py-3 rounded-xl font-bold text-lg mb-4 transition-all shadow-md flex items-center justify-center gap-2 ${storeSettings.isOpen
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                : 'bg-stone-700 text-stone-300'
                }`}
            >
              <span className="text-2xl">{storeSettings.isOpen ? '🔓' : '🔒'}</span>
              {storeSettings.isOpen ? 'HELADERÍA ABIERTA' : 'HELADERÍA CERRADA'}
            </button>

            {/* Social Links Section */}
            <div className="border-t border-stone-700 pt-4 mt-4">
              <h4 className="text-xs font-bold uppercase text-stone-400 mb-3 tracking-wider">📱 Redes Sociales</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Instagram (@usuario)</label>
                  <input
                    type="text"
                    value={socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="@tu_instagram"
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">WhatsApp (número con código país)</label>
                  <input
                    type="text"
                    value={socialLinks.whatsapp}
                    onChange={(e) => handleSocialLinkChange('whatsapp', e.target.value)}
                    placeholder="5491155146230"
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLAVOR SECTIONS */}
        {renderFlavorSection('Cremas', '🍨', 'CLÁSICOS & DULCES', cremaFlavors)}
        {renderFlavorSection('Chocolates', '🍫', 'INTENSOS & CREMOSOS', chocolateFlavors)}
        {renderFlavorSection('Frutales', '🍓', 'FRESCOS & NATURALES', frutalFlavors)}
        {renderFlavorSection('Especiales', '⭐', 'ÚNICOS & PREMIUM', especialFlavors)}

        {/* FOOTER */}
        <Footer socialLinks={socialLinks} />

      </main>

      {/* ADMIN SAVE BUTTON */}
      {isEditing && hasUnsavedChanges && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none">
          <div className="w-full max-w-sm pointer-events-auto animate-bounce-in flex flex-col gap-2">
            <button
              onClick={async () => {
                if (confirm('¿Seguro que querés descartar los cambios?')) {
                  const data = await loadStoreData();
                  setStockStatus(prev => ({ ...prev, ...data.stock }));
                  if (data.prices) setCustomPrices(prev => ({ ...prev, ...data.prices }));
                  setStoreSettings(data.settings);
                  setSocialLinks(data.socialLinks || defaultSocialLinks);
                  setHasUnsavedChanges(false);
                }
              }}
              className="w-full py-3 rounded-full bg-stone-800/80 text-white font-medium text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/10 backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Descartar Cambios</span>
            </button>
            <button
              onClick={saveAllChanges}
              className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-lg shadow-[0_8px_25px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/20"
            >
              <span>Aplicar Cambios</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <AdminModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onActivateSuccess={() => setShowPinModal(false)}
        token={pendingToken}
        onValidatePin={handleValidatePin}
      />
    </div>
  );
};

export default App;