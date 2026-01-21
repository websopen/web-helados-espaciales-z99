import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FlavorCard } from './components/FlavorCard';
import { PriceTable } from './components/PriceTable';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { StoreClosedModal } from './components/StoreClosedModal';
import { SelectionBar } from './components/SelectionBar';
import { Product, Store, Cart, OrderItem, PRODUCT_CONFIG } from './types';
import { defaultSocialLinks, FLAVORS as INITIAL_FLAVORS, PRICES } from './constants';
import { checkAuth, validateToken, activateAdmin, getTokenFromUrl, clearTokenFromUrl } from './services/authService';
import { loadStoreData, saveStoreData, SocialLinks } from './services/storeService';

import { CartModal } from './components/CartModal';

const App: React.FC = () => {
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Token from URL for admin activation
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  // --- THEME LOGIC REMOVED ---


  // State for Batch Updates
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Store data
  const [customPrices, setCustomPrices] = useState(PRICES);
  const [flavors, setFlavors] = useState<Product[]>(INITIAL_FLAVORS);
  const [stockStatus, setStockStatus] = useState<Record<string, boolean>>({});
  const [storeSettings, setStoreSettings] = useState({ isOpen: true });
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);

  // --- ORDERING STATE ---
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<{ key: string; price: number; label: string } | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ----------------------

  // Admin / Edit Mode
  const [isAdmin, setIsAdmin] = useState(false);

  // New Flavor Form State
  const [showAddFlavor, setShowAddFlavor] = useState(false);
  const [newFlavor, setNewFlavor] = useState<Partial<Product>>({
    category: 'crema',
    gradient: 'from-stone-100 to-stone-200'
  });

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

      // Check if current user is admin
      const authStatus = await checkAuth();
      setHasAdminAccess(authStatus.isAdmin);
      setIsAdmin(authStatus.isAdmin); // Set isAdmin based on auth status

      // Load store data from KV
      const data = await loadStoreData();

      // Initialize stock
      if (Object.keys(data.stock).length > 0) {
        setStockStatus(prev => ({ ...prev, ...data.stock }));
      } else {
        // If no stock data, assume all initial flavors are in stock
        const initialStock: { [key: string]: boolean } = {};
        INITIAL_FLAVORS.forEach(f => initialStock[f.id] = true);
        setStockStatus(initialStock);
      }

      if (data.prices) setCustomPrices(prev => ({ ...prev, ...data.prices }));
      setStoreSettings(data.settings);
      setSocialLinks(data.socialLinks || defaultSocialLinks);

      // Load dynamic flavors if exist, otherwise use constants
      if (data.flavors && data.flavors.length > 0) {
        setFlavors(data.flavors);
      } else {
        setFlavors(INITIAL_FLAVORS);
      }

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
      setIsAdmin(true); // Also set isAdmin here
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
      flavors: flavors // Save dynamic flavors
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

  // --- ORDERING HANDLERS ---
  const handleSelectProduct = (key: string, price: number, label: string) => {
    if (!storeSettings.isOpen && !isEditing) {
      alert('El local está cerrado en este momento.');
      return;
    }
    setCurrentProduct({ key, price, label });
    setSelectedFlavors([]);
    setIsSelecting(true);
    // Smooth scroll to flavors
    const flavorSection = document.getElementById('flavors-start');
    if (flavorSection) flavorSection.scrollIntoView({ behavior: 'smooth' });
  };

  const getMaxFlavors = () => {
    if (!currentProduct) return 0;
    return PRODUCT_CONFIG[currentProduct.key]?.maxFlavors || 4;
  };

  const handleFlavorClick = (flavorName: string) => {
    if (!isSelecting || !currentProduct) return;

    if (selectedFlavors.includes(flavorName)) {
      setSelectedFlavors(prev => prev.filter(f => f !== flavorName));
    } else {
      if (selectedFlavors.length < getMaxFlavors()) {
        setSelectedFlavors(prev => [...prev, flavorName]);
      }
    }
  };

  const handleAddToCart = () => {
    if (!currentProduct) return;
    const newItem: OrderItem = {
      id: crypto.randomUUID(),
      productKey: currentProduct.key,
      productName: currentProduct.label,
      price: currentProduct.price,
      flavors: [...selectedFlavors]
    };
    setCart(prev => ({
      items: [...prev.items, newItem],
      total: prev.total + newItem.price
    }));
    setIsSelecting(false);
    setCurrentProduct(null);
    setSelectedFlavors([]);
  };

  const handleCancelSelection = () => {
    setIsSelecting(false);
    setCurrentProduct(null);
    setSelectedFlavors([]);
  };
  // -------------------------

  const handleAddFlavor = () => {
    if (!newFlavor.name || !newFlavor.category) return;

    const id = `new_${Date.now()}`;
    const flavorToAdd: Product = {
      id,
      name: newFlavor.name,
      description: newFlavor.description || '',
      price: 0,
      category: newFlavor.category as any,
      gradient: newFlavor.gradient || 'from-stone-100 to-stone-200'
    };

    setFlavors(prev => [...prev, flavorToAdd]);
    setStockStatus(prev => ({ ...prev, [id]: true })); // Default to in stock
    setNewFlavor({ category: 'crema', gradient: 'from-stone-100 to-stone-200' });
    setShowAddFlavor(false);
    setHasUnsavedChanges(true);
  };

  const handleDeleteFlavor = (id: string) => {
    if (!confirm('¿Eliminar este sabor?')) return;
    setFlavors(prev => prev.filter(f => f.id !== id));
    setHasUnsavedChanges(true);
  };

  // VISIBILITY LOGIC:
  // If Admin: Show ALL flavors (transparency for out of stock)
  // If Public: Show ONLY flavors that are IN STOCK
  const visibleFlavors = flavors.filter(f => {
    if (isEditing) return true; // Editor sees all
    return stockStatus[f.id] !== false; // Public sees only in-stock
  });

  const chocolateFlavors = visibleFlavors.filter(p => p.category === 'chocolate');
  const cremaFlavors = visibleFlavors.filter(p => p.category === 'crema');
  const frutalFlavors = visibleFlavors.filter(p => p.category === 'frutal');
  const especialFlavors = visibleFlavors.filter(p => p.category === 'especial');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="animate-spin w-10 h-10 border-4 border-stone-300 border-t-stone-600 rounded-full"></div>
      </div>
    );
  }

  const renderFlavorSection = (title: string, subtitle: string, items: Product[]) => {
    if (items.length === 0 && !isEditing) return null; // Hide empty sections for public

    return (
      <div className="mb-16">
        <div className="mb-8 flex flex-col items-center text-center px-1">
          <h2 className="font-serif font-bold text-3xl text-stone-800 dark:text-stone-100 mb-2 tracking-wide border-b-2 border-stone-200 dark:border-stone-800 pb-2 px-8 inline-block">
            {title}
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-[0.2em]">
            {subtitle}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map(flavor => (
            <div key={flavor.id} className="relative group/item">
              <FlavorCard
                flavor={flavor}
                inStock={stockStatus[flavor.id] ?? true}
                isAdmin={isEditing}
                onToggleStock={handleToggleStock}
                selectable={isSelecting}
                selected={selectedFlavors.includes(flavor.name)}
                onSelect={() => handleFlavorClick(flavor.name)}
              />
              {isEditing && (
                <button
                  onClick={() => handleDeleteFlavor(flavor.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover/item:opacity-100 transition-opacity shadow-md z-10"
                  title="Eliminar sabor"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-stone-800 selection:bg-stone-500/30 selection:text-stone-900">
      {/* Background Layer (Light Marble Only) - Force Rebuild v3 */}
      <div className="fixed inset-0 z-[-1] bg-marble bg-repeat bg-fixed pointer-events-none" />


      {/* Main Content */}
      <Navbar
        showAdminSwitch={hasAdminAccess}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        storeOpen={storeSettings.isOpen}
        onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        cartCount={cart.items.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <StoreClosedModal isOpen={storeSettings.isOpen} />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={(id) => setCart(prev => ({
          items: prev.items.filter(item => item.id !== id),
          total: prev.items.filter(item => item.id !== id).reduce((acc, curr) => acc + curr.price, 0)
        }))}
      />

      <SelectionBar
        currentProduct={currentProduct}
        selectedCount={selectedFlavors.length}
        maxFlavors={getMaxFlavors()}
        onAdd={handleAddToCart}
        onCancel={handleCancelSelection}
      />


      <main className="pt-20 px-4 max-w-6xl mx-auto transition-all duration-300 pb-24">
        <div id="flavors-start"></div>
        {/* PRICE TABLE - Always visible at top */}
        <PriceTable
          prices={customPrices}
          isAdmin={isEditing}
          onPriceChange={handlePriceChange}
          onSelect={handleSelectProduct}
        />

        {/* ADMIN PANEL */}
        {isEditing && (
          <div className="mb-8 bg-stone-900 dark:bg-stone-800 rounded-2xl p-5 shadow-xl text-white animate-fade-in-up border border-stone-800 dark:border-stone-700">
            <div className="flex justify-between items-center mb-6 border-b border-stone-700 pb-4">
              <div>
                <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Panel de Control</h3>
                <p className="text-xs text-stone-400">Gestiona precios, stock y nuevos sabores</p>
              </div>
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                Modo Edición
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-3">Estado del Local</label>
                <button
                  onClick={() => toggleStoreSetting('isOpen')}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${storeSettings.isOpen
                    ? 'bg-stone-700 text-green-400 border border-green-500/30'
                    : 'bg-red-900/30 text-red-400 border border-red-500/30'
                    }`}
                >
                  <span className="text-xl">{storeSettings.isOpen ? '🟢' : '🔴'}</span>
                  {storeSettings.isOpen ? 'ABIERTO AL PÚBLICO' : 'CERRADO'}
                </button>

                <div className="mt-6">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-3">Redes Sociales</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-stone-800 p-2 rounded-lg border border-stone-700">
                      <span className="text-xl">📸</span>
                      <input
                        type="text"
                        value={socialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        placeholder="Usuario Instagram (ej: helados.ok)"
                        className="bg-transparent w-full text-sm outline-none placeholder-stone-600"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-stone-800 p-2 rounded-lg border border-stone-700">
                      <span className="text-xl">💬</span>
                      <input
                        type="text"
                        value={socialLinks.whatsapp}
                        onChange={(e) => handleSocialLinkChange('whatsapp', e.target.value)}
                        placeholder="WhatsApp (ej: 54911...)"
                        className="bg-transparent w-full text-sm outline-none placeholder-stone-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-3">Agregar Nuevo Sabor</label>
                <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 space-y-3">
                  <input
                    placeholder="Nombre del sabor (ej: Mousse de Limón)"
                    className="w-full bg-stone-900 border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-stone-500"
                    value={newFlavor.name || ''}
                    onChange={e => setNewFlavor(curr => ({ ...curr, name: e.target.value }))}
                  />
                  <input
                    placeholder="Descripción corta (opcional)"
                    className="w-full bg-stone-900 border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-stone-500"
                    value={newFlavor.description || ''}
                    onChange={e => setNewFlavor(curr => ({ ...curr, description: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <select
                      className="bg-stone-900 border-none rounded-lg p-2 text-sm flex-1"
                      value={newFlavor.category}
                      onChange={e => setNewFlavor(curr => ({ ...curr, category: e.target.value as any }))}
                    >
                      <option value="crema">Crema</option>
                      <option value="chocolate">Chocolate</option>
                      <option value="frutal">Frutal</option>
                      <option value="especial">Especial</option>
                    </select>
                    <button
                      onClick={handleAddFlavor}
                      disabled={!newFlavor.name}
                      className="bg-stone-100 text-stone-900 font-bold px-4 rounded-lg text-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLAVOR SECTIONS */}
        <div className={isSelecting ? "ring-4 ring-emerald-500/50 rounded-xl p-4 transition-all" : ""}>
          {renderFlavorSection('Cremas', 'CLÁSICOS & DULCES', cremaFlavors)}
          {renderFlavorSection('Chocolates', 'INTENSOS & CREMOSOS', chocolateFlavors)}
          {renderFlavorSection('Frutales', 'FRESCOS & NATURALES', frutalFlavors)}
          {renderFlavorSection('Especiales', 'ÚNICOS & PREMIUM', especialFlavors)}
        </div>

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
                  setStockStatus(Object.keys(data.stock).length > 0 ? data.stock : {});
                  // Reload flavors as well to revert deletions/additions
                  if (data.flavors) setFlavors(data.flavors);
                  else setFlavors(INITIAL_FLAVORS);

                  if (data.prices) setCustomPrices(prev => ({ ...prev, ...data.prices }));
                  setStoreSettings(data.settings);
                  setSocialLinks(data.socialLinks || defaultSocialLinks);
                  setHasUnsavedChanges(false);
                }
              }}
              className="w-full py-3 rounded-full bg-stone-800/90 text-white font-medium text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/10 backdrop-blur-sm"
            >
              <span>Descartar Cambios</span>
            </button>
            <button
              onClick={saveAllChanges}
              className="w-full py-4 rounded-full bg-stone-100 text-stone-900 font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border border-stone-200"
            >
              <span>Guardar Todo</span>
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