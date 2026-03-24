// Version: Final Release v5.1 (Clean & Persistent)
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FlavorCard } from './components/FlavorCard';
import { PriceTable, PriceProduct, DEFAULT_PRODUCTS } from './components/PriceTable';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { StoreClosedModal } from './components/StoreClosedModal';
import { SelectionBar } from './components/SelectionBar';
import { Product, Store, Cart, OrderItem, PRODUCT_CONFIG } from './types';
import { defaultSocialLinks, FLAVORS as INITIAL_FLAVORS, PRICES } from './constants';
import { checkAuth, validateToken, activateAdmin, getTokenFromUrl, clearTokenFromUrl, checkHubCookie, initSessionFromUrl } from './services/authService';
import { loadStoreData, saveStoreData, SocialLinks, DeliveryConfig, BusinessInfo, defaultDeliveryConfig, defaultBusinessInfo } from './services/storeService';

import { CartModal } from './components/CartModal';
import { RestockModal } from './components/RestockModal';
import { PromoBanner, PromoBannerConfig } from './components/PromoBanner';
import { StoreHoursConfig, StoreHours, DEFAULT_HOURS } from './components/StoreHoursConfig';
import { StoreLocationConfig, StoreLocation, DEFAULT_LOCATION } from './components/StoreLocationConfig';
import { AdminSidebar } from './components/AdminSidebar';
import { ClientSidebar } from './components/ClientSidebar';
import { UserAccount, getCurrentUser as getUser } from './services/authConfig';

// Check if we're on admin route
const isAdminRoute = () => window.location.pathname === '/admin' || window.location.pathname === '/admin/';
const isAuthenticatedCheck = () => !!getUser();
// Check if user has admin from Hub cookie
const hasHubAdminCookie = () => checkHubCookie();

const App: React.FC = () => {
  // 1. Check for incoming session token from Hub (URL-based auth)
  // This MUST run before state initialization to capture the token immediately
  initSessionFromUrl();

  console.log('[App Debug] Initializing App. Checking Hub Cookie...');
  const hubCookieExists = hasHubAdminCookie();
  console.log('[App Debug] hasHubAdminCookie result:', hubCookieExists);

  // Admin access via URL-based login OR Hub cookie
  const [hasAdminAccess, setHasAdminAccess] = useState(() => (isAdminRoute() && isAuthenticatedCheck()) || hasHubAdminCookie());
  const [showLoginForm, setShowLoginForm] = useState(() => isAdminRoute() && !isAuthenticatedCheck() && !hasHubAdminCookie());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getUser());

  // Track if admin came from Hub
  const [isHubAdmin, setIsHubAdmin] = useState(() => hasHubAdminCookie());
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClientSidebarOpen, setIsClientSidebarOpen] = useState(false);
  const [adminPreviewMode, setAdminPreviewMode] = useState(false); // Admin views as client

  // Handle login success
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setHasAdminAccess(true);
    setShowLoginForm(false);
    setIsEditing(true); // Auto-enter edit mode after login
  };

  // Redirect to Hub if on admin route but not authenticated
  if (showLoginForm) {
    window.location.href = 'https://hub.websopen.com';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 gap-4">
        <div className="animate-spin w-10 h-10 border-4 border-stone-300 border-t-emerald-600 rounded-full"></div>
        <p className="text-stone-600 font-medium">Redirigiendo al Hub seguro...</p>
      </div>
    );
  }

  // --- THEME LOGIC REMOVED ---


  // State for Batch Updates
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Store data
  const [customPrices, setCustomPrices] = useState(PRICES);
  const [flavors, setFlavors] = useState<Product[]>(INITIAL_FLAVORS);
  const [stockQuantity, setStockQuantity] = useState<Record<string, number>>({});
  const [storeSettings, setStoreSettings] = useState({ isOpen: true, deliveryAvailable: true, pickupAvailable: true });
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [priceProducts, setPriceProducts] = useState<PriceProduct[]>(DEFAULT_PRODUCTS);

  // Promo Banner
  const [promoBanner, setPromoBanner] = useState<PromoBannerConfig>({
    enabled: false,
    text: '🍦 PROMO ESPECIAL 🍦 DESCUENTOS DE VERANO 🍦',
    gradient: 'warm'
  });

  // Store Hours
  const [storeHours, setStoreHours] = useState<StoreHours>(DEFAULT_HOURS);

  // Store Location
  const [storeLocation, setStoreLocation] = useState<StoreLocation>(DEFAULT_LOCATION);

  // Delivery Config
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfig>(defaultDeliveryConfig);

  // Business Info
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(defaultBusinessInfo);

  // --- ORDERING STATE ---
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<{ key: string; price: number; label: string } | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

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

      // For URL-based admin, check if on admin route and authenticated
      if (isAdminRoute() && isAuthenticatedCheck()) {
        setHasAdminAccess(true);
        setIsEditing(true);
        setIsAdmin(true);
        setCurrentUser(getUser());
      }

      // For Hub-based admin (coming from hub.websopen.com with JWT)
      if (hasHubAdminCookie()) {
        setHasAdminAccess(true);
        setIsEditing(true);
        setIsAdmin(true);
        setIsHubAdmin(true);
        console.log('[Hub] Admin detected from Hub cookie');
      }

      // Load store data from KV
      const data = await loadStoreData();

      // Initialize stock quantities
      if (Object.keys(data.stock).length > 0) {
        // Convert old boolean stock to quantities if needed, or load quantities
        const loadedStock = data.stock as Record<string, boolean | number>;
        const quantities: Record<string, number> = {};
        Object.entries(loadedStock).forEach(([id, value]) => {
          if (typeof value === 'boolean') {
            quantities[id] = value ? 5 : 0; // Convert: true -> 5 baldes, false -> 0
          } else {
            quantities[id] = value as number;
          }
        });
        setStockQuantity(quantities);
      } else {
        // If no stock data, assume all initial flavors have 5 baldes
        const initialStock: { [key: string]: number } = {};
        INITIAL_FLAVORS.forEach(f => initialStock[f.id] = 5);
        setStockQuantity(initialStock);
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



  // --- BATCH UPDATE LOGIC ---
  const saveAllChanges = async () => {
    const result = await saveStoreData({
      stock: stockQuantity,
      prices: customPrices,
      settings: storeSettings,
      socialLinks: socialLinks,
      flavors: flavors,
      priceProducts: priceProducts
    });

    if (result.success) {
      setHasUnsavedChanges(false);
      alert("¡Cambios aplicados correctamente!");
    } else {
      alert("Error al guardar: " + (result.error || 'Unknown error'));
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (!hasAdminAccess || !isEditing) return;
    setStockQuantity(prev => ({
      ...prev,
      [id]: newQuantity
    }));
    setHasUnsavedChanges(true);
  };

  const handleFlavorEdit = (id: string, updates: Partial<Product>) => {
    if (!hasAdminAccess || !isEditing) return;
    setFlavors(prev => prev.map(f =>
      f.id === id ? { ...f, ...updates } : f
    ));
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
    setStockQuantity(prev => ({ ...prev, [id]: 5 })); // Default to 5 baldes
    setNewFlavor({ category: 'crema', gradient: 'from-stone-100 to-stone-200' });
    setShowAddFlavor(false);
    setHasUnsavedChanges(true);
  };

  const handleDeleteFlavor = (id: string) => {
    if (!confirm('¿Eliminar este sabor?')) return;
    setFlavors(prev => prev.filter(f => f.id !== id));
    setHasUnsavedChanges(true);
  };

  // Move flavor up or down within its category
  const handleMoveFlavor = (flavorId: string, direction: 'up' | 'down') => {
    setFlavors(prev => {
      const flavor = prev.find(f => f.id === flavorId);
      if (!flavor) return prev;

      const categoryFlavors = prev.filter(f => f.category === flavor.category);
      const otherFlavors = prev.filter(f => f.category !== flavor.category);
      const currentIndex = categoryFlavors.findIndex(f => f.id === flavorId);

      if (direction === 'up' && currentIndex > 0) {
        [categoryFlavors[currentIndex - 1], categoryFlavors[currentIndex]] =
          [categoryFlavors[currentIndex], categoryFlavors[currentIndex - 1]];
      } else if (direction === 'down' && currentIndex < categoryFlavors.length - 1) {
        [categoryFlavors[currentIndex], categoryFlavors[currentIndex + 1]] =
          [categoryFlavors[currentIndex + 1], categoryFlavors[currentIndex]];
      }

      return [...otherFlavors, ...categoryFlavors];
    });
    setHasUnsavedChanges(true);
  };

  // VISIBILITY LOGIC:
  // Show ALL flavors to everyone - out of stock items appear grayed with "Sin Stock" badge
  const visibleFlavors = flavors;

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

  const renderFlavorSection = (title: string, subtitle: string, items: Product[], category: string) => {
    if (items.length === 0 && !isEditing) return null; // Hide empty sections for public

    const handleQuickAddFlavor = () => {
      const name = prompt(`Nombre del nuevo sabor (${title}):`);
      if (!name?.trim()) return;

      const id = `flavor_${Date.now()}`;
      const flavorToAdd: Product = {
        id,
        name: name.trim(),
        description: '',
        price: 0,
        category: category as any,
        gradient: 'from-stone-100 to-stone-200'
      };

      setFlavors(prev => [...prev, flavorToAdd]);
      setStockQuantity(prev => ({ ...prev, [id]: 5 }));
      setHasUnsavedChanges(true);
    };

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
          {items.map((flavor, index) => (
            <div
              key={flavor.id}
              className="relative group/item"
            >
              <FlavorCard
                flavor={flavor}
                quantity={stockQuantity[flavor.id] ?? 5}
                isAdmin={isEditing && !adminPreviewMode}
                onQuantityChange={handleQuantityChange}
                onFlavorEdit={handleFlavorEdit}
                selectable={isSelecting}
                selected={selectedFlavors.includes(flavor.name)}
                onSelect={() => handleFlavorClick(flavor.name)}
              />
              {isEditing && !adminPreviewMode && (
                <>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteFlavor(flavor.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover/item:opacity-100 transition-opacity shadow-md z-10"
                    title="Eliminar sabor"
                  >
                    ×
                  </button>
                  {/* Reorder arrows */}
                  <div className="absolute -top-2 -left-2 flex flex-col gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => handleMoveFlavor(flavor.id, 'up')}
                      disabled={index === 0}
                      className="w-5 h-5 bg-stone-600 hover:bg-stone-500 disabled:bg-stone-400 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center text-[10px] shadow-md"
                      title="Mover arriba"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveFlavor(flavor.id, 'down')}
                      disabled={index === items.length - 1}
                      className="w-5 h-5 bg-stone-600 hover:bg-stone-500 disabled:bg-stone-400 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center text-[10px] shadow-md"
                      title="Mover abajo"
                    >
                      ↓
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Add Flavor Button - Only in admin mode */}
          {isEditing && (
            <button
              onClick={handleQuickAddFlavor}
              className="min-h-[100px] border-2 border-dashed border-stone-300 hover:border-emerald-400 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-emerald-600 transition-all hover:bg-emerald-50"
            >
              <span className="text-2xl">+</span>
              <span className="text-xs font-medium">Agregar Sabor</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-stone-800 selection:bg-stone-500/30 selection:text-stone-900">
      <div className="fixed inset-0 z-[-1] bg-marble bg-repeat bg-fixed pointer-events-none" />


      {/* Main Content */}
      <Navbar
        showAdminSwitch={hasAdminAccess}
        isEditing={isEditing && !adminPreviewMode}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenClientSidebar={() => setIsClientSidebarOpen(true)}
        storeOpen={storeSettings.isOpen}
        onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        cartCount={cart.items.length}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenMetrics={() => {
          // TODO: Open metrics modal/view
          alert('Métricas próximamente');
        }}
        adminPreviewMode={adminPreviewMode}
        onTogglePreviewMode={() => setAdminPreviewMode(!adminPreviewMode)}
      />

      <StoreClosedModal isOpen={storeSettings.isOpen} />

      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
        onOpenRestock={() => setIsRestockModalOpen(true)}
        storeSettings={storeSettings}
        setStoreSettings={setStoreSettings}
        promoBanner={promoBanner}
        setPromoBanner={setPromoBanner}
        storeHours={storeHours}
        setStoreHours={setStoreHours}
        storeLocation={storeLocation}
        setStoreLocation={setStoreLocation}
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
        setHasUnsavedChanges={setHasUnsavedChanges}
        deliveryConfig={deliveryConfig}
        setDeliveryConfig={setDeliveryConfig}
        businessInfo={businessInfo}
        setBusinessInfo={setBusinessInfo}
        newFlavor={newFlavor}
        setNewFlavor={setNewFlavor}
        onAddFlavor={handleAddFlavor}
      />

      {/* Client Sidebar - for non-admin users */}
      <ClientSidebar
        isOpen={isClientSidebarOpen}
        onClose={() => setIsClientSidebarOpen(false)}
        socialLinks={socialLinks}
        storeHours={storeHours}
        storeLocation={storeLocation}
        storeOpen={storeSettings.isOpen}
        businessInfo={businessInfo}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={(id) => setCart(prev => ({
          items: prev.items.filter(item => item.id !== id),
          total: prev.items.filter(item => item.id !== id).reduce((acc, curr) => acc + curr.price, 0)
        }))}
        whatsappNumber={socialLinks.whatsapp}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        outOfStockFlavors={flavors.filter(f => (stockQuantity[f.id] ?? 5) === 0)}
        whatsappNumber={socialLinks.whatsapp}
      />

      <SelectionBar
        currentProduct={currentProduct}
        selectedCount={selectedFlavors.length}
        maxFlavors={getMaxFlavors()}
        onAdd={handleAddToCart}
        onCancel={handleCancelSelection}
      />


      {/* PROMO BANNER */}
      <PromoBanner config={promoBanner} />

      <main className={`${promoBanner.enabled ? 'pt-28' : 'pt-20'} px-4 max-w-6xl mx-auto transition-all duration-300 pb-24`}>
        {/* ADMIN CONTROL PANEL - Visible only for admins */}
        {isEditing && !adminPreviewMode && (
          <div className="mb-6 bg-gradient-to-r from-stone-800/90 to-stone-900/90 rounded-2xl p-4 border border-stone-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                🛠️ Panel Admin
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Banner Control */}
              <div className="bg-stone-800 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-300 font-medium">🎉 Banner</span>
                  <button
                    onClick={() => {
                      setPromoBanner(prev => ({ ...prev, enabled: !prev.enabled }));
                      setHasUnsavedChanges(true);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${promoBanner.enabled ? 'bg-emerald-500 text-white' : 'bg-stone-600 text-stone-400'}`}
                  >
                    {promoBanner.enabled ? 'ON' : 'OFF'}
                  </button>
                </div>
                <input
                  type="text"
                  value={promoBanner.text}
                  onChange={(e) => {
                    setPromoBanner(prev => ({ ...prev, text: e.target.value }));
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Texto del banner..."
                  className="w-full bg-stone-900 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-stone-500"
                />
                <div className="grid grid-cols-3 gap-1">
                  {(['warm', 'cool', 'rainbow'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => {
                        setPromoBanner(prev => ({ ...prev, gradient: g }));
                        setHasUnsavedChanges(true);
                      }}
                      className={`py-1 rounded text-[9px] font-bold transition-all ${promoBanner.gradient === g
                        ? g === 'warm' ? 'bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-900'
                          : g === 'cool' ? 'bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-900'
                            : 'bg-gradient-to-r from-pink-300 to-purple-300 text-purple-900'
                        : 'bg-stone-700 text-stone-500'
                        }`}
                    >
                      {g === 'warm' ? '🔥' : g === 'cool' ? '❄️' : '🌈'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aviso Control */}
              <div className="bg-stone-800 p-3 rounded-xl flex flex-col justify-center items-center">
                <span className="text-xs text-stone-300 font-medium mb-2">📢 Avisos</span>
                <button
                  onClick={() => setIsRestockModalOpen(true)}
                  className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  📢 Publicar Aviso
                </button>
                <p className="text-[9px] text-stone-500 mt-2 text-center">Notificar a clientes sobre novedades</p>
              </div>
            </div>
          </div>
        )}

        {/* PRICE TABLE */}
        <PriceTable
          products={priceProducts}
          isAdmin={isEditing && !adminPreviewMode}
          onProductsChange={(products) => {
            setPriceProducts(products);
            setHasUnsavedChanges(true);
          }}
          onSelect={handleSelectProduct}
        />

        <div id="flavors-start"></div>
        {/* FLAVOR SECTIONS */}
        <div className={isSelecting ? "ring-4 ring-emerald-500/50 rounded-xl p-4 transition-all" : ""}>
          {renderFlavorSection('Cremas', 'CLÁSICOS & DULCES', cremaFlavors, 'crema')}
          {renderFlavorSection('Chocolates', 'INTENSOS & CREMOSOS', chocolateFlavors, 'chocolate')}
          {renderFlavorSection('Frutales', 'FRESCOS & NATURALES', frutalFlavors, 'frutal')}
          {renderFlavorSection('Especiales', 'ÚNICOS & PREMIUM', especialFlavors, 'especial')}
        </div>

        {/* FOOTER */}
        <Footer socialLinks={socialLinks} />

      </main>

      {/* ADMIN SAVE/DISCARD NOTCH - Centered, between left buttons and cart */}
      {isEditing && hasUnsavedChanges && (
        <div className="fixed top-0 left-0 right-0 z-[60] flex justify-center pointer-events-none">
          <div className="pointer-events-auto animate-slide-down bg-gradient-to-b from-orange-500 to-orange-600 rounded-b-xl h-14 px-3 shadow-2xl border-x border-b border-orange-700/50 flex items-center justify-center gap-2">
            <button
              onClick={async () => {
                if (confirm('¿Seguro que querés descartar los cambios?')) {
                  const data = await loadStoreData();
                  if (Object.keys(data.stock).length > 0) {
                    const loadedStock = data.stock as Record<string, boolean | number>;
                    const quantities: Record<string, number> = {};
                    Object.entries(loadedStock).forEach(([id, value]) => {
                      if (typeof value === 'boolean') {
                        quantities[id] = value ? 5 : 0;
                      } else {
                        quantities[id] = value as number;
                      }
                    });
                    setStockQuantity(quantities);
                  } else {
                    setStockQuantity({});
                  }
                  if (data.flavors) setFlavors(data.flavors);
                  else setFlavors(INITIAL_FLAVORS);
                  if (data.prices) setCustomPrices(prev => ({ ...prev, ...data.prices }));
                  setStoreSettings(data.settings);
                  setSocialLinks(data.socialLinks || defaultSocialLinks);
                  if (data.promoBanner) setPromoBanner(data.promoBanner);
                  if (data.storeHours) setStoreHours(data.storeHours as StoreHours);
                  if (data.storeLocation) setStoreLocation(data.storeLocation as StoreLocation);
                  if (data.deliveryConfig) setDeliveryConfig(data.deliveryConfig);
                  if (data.businessInfo) setBusinessInfo(data.businessInfo);
                  if (data.priceProducts) setPriceProducts(data.priceProducts);
                  setHasUnsavedChanges(false);
                }
              }}
              className="w-10 h-10 rounded-lg bg-red-600 hover:bg-red-500 text-white text-lg font-bold transition-all flex items-center justify-center"
              title="Descartar cambios"
            >
              ✕
            </button>
            <button
              onClick={saveAllChanges}
              className="h-10 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              title="Guardar cambios"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Guardar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;