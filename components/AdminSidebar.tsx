'use client';

import React, { useState, useEffect } from 'react';
import { UserAccount, hasPermission, getStoredUsers, saveUsers, ROLE_CONFIG, PERMISSIONS } from '../services/authConfig';
import { logout } from '../services/authConfig';
import { SocialLinks, DeliveryConfig, BusinessInfo } from '../services/storeService';
import { Product } from '../types';
import { StoreHoursConfig, StoreHours } from './StoreHoursConfig';
import { StoreLocationConfig, StoreLocation } from './StoreLocationConfig';
import { PromoBannerConfig } from './PromoBanner';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserAccount | null;
    onOpenRestock: () => void;
    storeSettings: { isOpen: boolean; deliveryAvailable: boolean; pickupAvailable: boolean };
    setStoreSettings: (settings: any) => void;
    promoBanner: PromoBannerConfig;
    setPromoBanner: (config: any) => void;
    storeHours: StoreHours;
    setStoreHours: (hours: StoreHours) => void;
    storeLocation: StoreLocation;
    setStoreLocation: (location: StoreLocation) => void;
    socialLinks: SocialLinks;
    setSocialLinks: (links: SocialLinks) => void;
    setHasUnsavedChanges: (hasChanges: boolean) => void;
    deliveryConfig: DeliveryConfig;
    setDeliveryConfig: (config: DeliveryConfig) => void;
    businessInfo: BusinessInfo;
    setBusinessInfo: (info: BusinessInfo) => void;
    newFlavor: Partial<Product>;
    setNewFlavor: (flavor: Partial<Product>) => void;
    onAddFlavor: () => void;
}

type MainTab = 'horarios' | 'tienda' | 'datos' | 'metricas' | 'staff';
type MetricasSubTab = 'resumen' | 'ventas' | 'sabores' | 'inventario';

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    isOpen,
    onClose,
    currentUser,
    onOpenRestock,
    storeSettings,
    setStoreSettings,
    promoBanner,
    setPromoBanner,
    storeHours,
    setStoreHours,
    storeLocation,
    setStoreLocation,
    socialLinks,
    setSocialLinks,
    setHasUnsavedChanges,
    deliveryConfig,
    setDeliveryConfig,
    businessInfo,
    setBusinessInfo,
    newFlavor,
    setNewFlavor,
    onAddFlavor
}) => {
    const [activeTab, setActiveTab] = useState<MainTab>('horarios');
    const [metricasSubTab, setMetricasSubTab] = useState<MetricasSubTab>('resumen');
    const [users, setUsers] = useState<UserAccount[]>(() => getStoredUsers());
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [showAddFlavor, setShowAddFlavor] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const canManageUsers = hasPermission(currentUser, 'manage_users');
    const canEditSettings = hasPermission(currentUser, 'edit_settings');

    const handleSaveUser = (updatedUser: UserAccount) => {
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
        setEditingUser(null);
    };

    const togglePermission = (userId: string, permKey: string) => {
        const updatedUsers = users.map(u => {
            if (u.id === userId) {
                return { ...u, permissions: { ...u.permissions, [permKey]: !u.permissions[permKey] } };
            }
            return u;
        });
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
    };

    // Block body scroll when menu is open (must be before conditional return)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Define tabs - 5 main tabs
    const tabs = [
        { key: 'horarios' as const, icon: '🕒', label: 'Horarios', show: true },
        { key: 'tienda' as const, icon: '🏪', label: 'Tienda', show: canEditSettings },
        { key: 'datos' as const, icon: '📋', label: 'Datos', show: canEditSettings },
        { key: 'metricas' as const, icon: '📊', label: 'Métricas', show: canEditSettings },
        { key: 'staff' as const, icon: '👥', label: 'Staff', show: canManageUsers },
    ].filter(t => t.show);

    // Pill button component for sub-navigation
    const PillButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${active
                ? 'bg-emerald-500 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
        >
            {children}
        </button>
    );

    return (
        <>
            {/* Fullscreen Menu - Black Background, 100dvh for mobile browsers */}
            <div
                className="fixed inset-0 bg-black z-50 flex flex-col"
                style={{ height: '100dvh', minHeight: '-webkit-fill-available' }}
            >
                {/* Header - Same height as Navbar (h-14) */}
                <div className="flex items-center justify-between px-3 h-14 border-b border-stone-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {currentUser && (
                            <div className={`w-10 h-10 rounded-full ${ROLE_CONFIG[currentUser.role].color} flex items-center justify-center text-lg`}>
                                {ROLE_CONFIG[currentUser.role].emoji}
                            </div>
                        )}
                        <div>
                            <p className="text-white font-bold text-sm">{currentUser?.name || 'Admin'}</p>
                            <p className="text-stone-400 text-xs">{currentUser ? ROLE_CONFIG[currentUser.role].label : 'Usuario'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={logout}
                            className="w-9 h-9 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all flex items-center justify-center"
                            title="Cerrar sesión"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16,17 21,12 16,7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs - 5 tabs row */}
                <div className="flex justify-center p-3 border-b border-stone-700 flex-shrink-0">
                    <div className="grid grid-cols-5 gap-2 w-full max-w-lg">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all ${activeTab === tab.key
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-stone-800 text-stone-400 hover:bg-stone-750 hover:text-stone-200 border border-transparent'
                                    }`}
                            >
                                <span className="text-xl">{tab.icon}</span>
                                <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area - NO SCROLL */}
                <div className="flex-1 p-4 overflow-hidden">
                    <div className="max-w-lg mx-auto h-full flex flex-col">

                        {/* TAB: Horarios */}
                        {activeTab === 'horarios' && (
                            <div className="space-y-3 animate-fade-in h-full flex flex-col">
                                {/* Store Toggle - Big */}
                                <button
                                    onClick={() => {
                                        setStoreSettings({ ...storeSettings, isOpen: !storeSettings.isOpen });
                                        setHasUnsavedChanges(true);
                                    }}
                                    className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 flex-shrink-0 ${storeSettings.isOpen
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                                        : 'bg-stone-700 text-stone-300'
                                        }`}
                                >
                                    <span className="text-2xl">{storeSettings.isOpen ? '🔓' : '🔒'}</span>
                                    {storeSettings.isOpen ? 'ABIERTO' : 'CERRADO'}
                                </button>

                                {/* Store Hours Config */}
                                <div className="flex-1 overflow-y-auto">
                                    <StoreHoursConfig
                                        hours={storeHours}
                                        onChange={(hours) => {
                                            setStoreHours(hours);
                                            setHasUnsavedChanges(true);
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* TAB: Tienda - Unified (no sub-tabs) */}
                        {activeTab === 'tienda' && canEditSettings && (
                            <div className="space-y-4 animate-fade-in overflow-y-auto">
                                {/* Envíos/Retiro toggles */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            setStoreSettings({ ...storeSettings, deliveryAvailable: !storeSettings.deliveryAvailable });
                                            setHasUnsavedChanges(true);
                                        }}
                                        className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${storeSettings.deliveryAvailable ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-stone-800 border-stone-700 text-stone-500'}`}
                                    >
                                        <span className="text-3xl mb-1">🛵</span>
                                        <span className="font-bold text-sm">Envíos</span>
                                        <span className="text-[10px] mt-0.5">{storeSettings.deliveryAvailable ? 'ACTIVO' : 'INACTIVO'}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStoreSettings({ ...storeSettings, pickupAvailable: !storeSettings.pickupAvailable });
                                            setHasUnsavedChanges(true);
                                        }}
                                        className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${storeSettings.pickupAvailable ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-stone-800 border-stone-700 text-stone-500'}`}
                                    >
                                        <span className="text-3xl mb-1">🛍️</span>
                                        <span className="font-bold text-sm">Retiro</span>
                                        <span className="text-[10px] mt-0.5">{storeSettings.pickupAvailable ? 'ACTIVO' : 'INACTIVO'}</span>
                                    </button>
                                </div>

                                {/* Delivery Config - Always visible */}
                                <div className="bg-stone-800 p-3 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white font-medium">🚚 Config Delivery</span>
                                        <button
                                            onClick={() => {
                                                setDeliveryConfig({ ...deliveryConfig, enabled: !deliveryConfig.enabled });
                                                setHasUnsavedChanges(true);
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${deliveryConfig.enabled ? 'bg-emerald-500 text-white' : 'bg-stone-700 text-stone-400'}`}
                                        >
                                            {deliveryConfig.enabled ? 'ON' : 'OFF'}
                                        </button>
                                    </div>
                                    {deliveryConfig.enabled && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-stone-900 p-2 rounded-lg">
                                                <label className="text-[9px] text-stone-500 block">Dist. máx (km)</label>
                                                <input
                                                    type="number"
                                                    value={deliveryConfig.maxDistanceKm}
                                                    onChange={(e) => {
                                                        setDeliveryConfig({ ...deliveryConfig, maxDistanceKm: parseFloat(e.target.value) || 0 });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="bg-transparent w-full text-base font-bold outline-none text-white"
                                                />
                                            </div>
                                            <div className="bg-stone-900 p-2 rounded-lg">
                                                <label className="text-[9px] text-stone-500 block">Tiempo (min)</label>
                                                <input
                                                    type="number"
                                                    value={deliveryConfig.estimatedMinutes}
                                                    onChange={(e) => {
                                                        setDeliveryConfig({ ...deliveryConfig, estimatedMinutes: parseInt(e.target.value) || 0 });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="bg-transparent w-full text-base font-bold outline-none text-white"
                                                />
                                            </div>
                                            <div className="bg-stone-900 p-2 rounded-lg">
                                                <label className="text-[9px] text-stone-500 block">Costo base ($)</label>
                                                <input
                                                    type="number"
                                                    value={deliveryConfig.baseCost}
                                                    onChange={(e) => {
                                                        setDeliveryConfig({ ...deliveryConfig, baseCost: parseFloat(e.target.value) || 0 });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="bg-transparent w-full text-base font-bold outline-none text-white"
                                                />
                                            </div>
                                            <div className="bg-stone-900 p-2 rounded-lg">
                                                <label className="text-[9px] text-stone-500 block">$/km extra</label>
                                                <input
                                                    type="number"
                                                    value={deliveryConfig.costPerKm}
                                                    onChange={(e) => {
                                                        setDeliveryConfig({ ...deliveryConfig, costPerKm: parseFloat(e.target.value) || 0 });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="bg-transparent w-full text-base font-bold outline-none text-white"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB: Datos (Todo junto sin sub-tabs) */}
                        {activeTab === 'datos' && canEditSettings && (
                            <div className="space-y-3 animate-fade-in overflow-y-auto flex-1">
                                {/* Ubicación */}
                                <StoreLocationConfig
                                    location={storeLocation}
                                    onChange={(location) => {
                                        setStoreLocation(location);
                                        setHasUnsavedChanges(true);
                                    }}
                                />

                                {/* Redes Sociales - Grid compacto */}
                                <div className="grid grid-cols-3 gap-1.5">
                                    {/* Instagram */}
                                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-2 rounded-lg border border-purple-500/30">
                                        <span className="text-xs">📸</span>
                                        <input
                                            type="text"
                                            value={socialLinks.instagram}
                                            onChange={(e) => {
                                                setSocialLinks({ ...socialLinks, instagram: e.target.value });
                                                setHasUnsavedChanges(true);
                                            }}
                                            placeholder="@ig"
                                            className="bg-transparent w-full text-[10px] outline-none placeholder-stone-500 text-white mt-0.5"
                                        />
                                    </div>
                                    {/* WhatsApp */}
                                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-2 rounded-lg border border-green-500/30">
                                        <span className="text-xs">💬</span>
                                        <input
                                            type="text"
                                            value={socialLinks.whatsapp}
                                            onChange={(e) => {
                                                setSocialLinks({ ...socialLinks, whatsapp: e.target.value });
                                                setHasUnsavedChanges(true);
                                            }}
                                            placeholder="WhatsApp"
                                            className="bg-transparent w-full text-[10px] outline-none placeholder-stone-500 text-white font-mono mt-0.5"
                                        />
                                    </div>
                                    {/* Teléfono */}
                                    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-2 rounded-lg border border-amber-500/30">
                                        <span className="text-xs">📞</span>
                                        <input
                                            type="text"
                                            value={socialLinks.phone || ''}
                                            onChange={(e) => {
                                                setSocialLinks({ ...socialLinks, phone: e.target.value });
                                                setHasUnsavedChanges(true);
                                            }}
                                            placeholder="Tel"
                                            className="bg-transparent w-full text-[10px] outline-none placeholder-stone-500 text-white mt-0.5"
                                        />
                                    </div>
                                    {/* TikTok */}
                                    <div className="bg-stone-800 p-2 rounded-lg border border-stone-700">
                                        <span className="text-xs">🎵</span>
                                        <input
                                            type="text"
                                            value={socialLinks.tiktok || ''}
                                            onChange={(e) => {
                                                setSocialLinks({ ...socialLinks, tiktok: e.target.value });
                                                setHasUnsavedChanges(true);
                                            }}
                                            placeholder="@tik"
                                            className="bg-transparent w-full text-[10px] outline-none placeholder-stone-500 text-white mt-0.5"
                                        />
                                    </div>
                                    {/* Facebook */}
                                    <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-2 rounded-lg border border-blue-500/30">
                                        <span className="text-xs">👍</span>
                                        <input
                                            type="text"
                                            value={socialLinks.facebook || ''}
                                            onChange={(e) => {
                                                setSocialLinks({ ...socialLinks, facebook: e.target.value });
                                                setHasUnsavedChanges(true);
                                            }}
                                            placeholder="FB"
                                            className="bg-transparent w-full text-[10px] outline-none placeholder-stone-500 text-white mt-0.5"
                                        />
                                    </div>
                                </div>

                                {/* Datos del Negocio - Compacto */}
                                <div className="bg-stone-800 p-2.5 rounded-xl space-y-2">
                                    <input
                                        type="text"
                                        value={businessInfo.businessName}
                                        onChange={(e) => {
                                            setBusinessInfo({ ...businessInfo, businessName: e.target.value });
                                            setHasUnsavedChanges(true);
                                        }}
                                        placeholder="Nombre del Negocio"
                                        className="bg-stone-900 w-full text-sm rounded-lg p-2 outline-none placeholder-stone-600 text-white font-medium"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={businessInfo.cuit}
                                            onChange={(e) => {
                                                setBusinessInfo({ ...businessInfo, cuit: e.target.value });
                                                setHasUnsavedChanges(true);
                                            }}
                                            placeholder="CUIT"
                                            className="bg-stone-900 w-full text-xs rounded-lg p-2 outline-none placeholder-stone-600 text-white font-mono"
                                        />
                                        <input
                                            type="text"
                                            value={businessInfo.complaintsBookUrl || ''}
                                            onChange={(e) => {
                                                setBusinessInfo({ ...businessInfo, complaintsBookUrl: e.target.value });
                                                setHasUnsavedChanges(true);
                                            }}
                                            placeholder="URL Reclamos"
                                            className="bg-stone-900 w-full text-xs rounded-lg p-2 outline-none placeholder-stone-600 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: Métricas - Enhanced with sections */}
                        {activeTab === 'metricas' && canEditSettings && (
                            <div className="space-y-3 animate-fade-in h-full flex flex-col">
                                {/* Sub-tabs Pills */}
                                <div className="flex gap-1.5 flex-shrink-0">
                                    <PillButton active={metricasSubTab === 'resumen'} onClick={() => setMetricasSubTab('resumen')}>📊 Resumen</PillButton>
                                    <PillButton active={metricasSubTab === 'ventas'} onClick={() => setMetricasSubTab('ventas')}>💰 Ventas</PillButton>
                                    <PillButton active={metricasSubTab === 'sabores'} onClick={() => setMetricasSubTab('sabores')}>🍦 Sabores</PillButton>
                                    <PillButton active={metricasSubTab === 'inventario'} onClick={() => setMetricasSubTab('inventario')}>📦 Stock</PillButton>
                                </div>

                                {/* Sub-content */}
                                <div className="flex-1 overflow-y-auto space-y-3">
                                    {metricasSubTab === 'resumen' && (
                                        <>
                                            {/* Quick Stats Grid */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 p-3 rounded-xl border border-emerald-500/30">
                                                    <span className="text-2xl">📦</span>
                                                    <p className="text-xl font-bold text-white mt-1">12</p>
                                                    <p className="text-[10px] text-stone-400">Pedidos hoy</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-3 rounded-xl border border-blue-500/30">
                                                    <span className="text-2xl">💰</span>
                                                    <p className="text-xl font-bold text-white mt-1">$45.800</p>
                                                    <p className="text-[10px] text-stone-400">Ventas hoy</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-3 rounded-xl border border-purple-500/30">
                                                    <span className="text-2xl">🍦</span>
                                                    <p className="text-xl font-bold text-white mt-1">DDL</p>
                                                    <p className="text-[10px] text-stone-400">Sabor top</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-3 rounded-xl border border-amber-500/30">
                                                    <span className="text-2xl">👥</span>
                                                    <p className="text-xl font-bold text-white mt-1">89</p>
                                                    <p className="text-[10px] text-stone-400">Visitas web</p>
                                                </div>
                                            </div>
                                            {/* Trend indicator */}
                                            <div className="bg-stone-800 p-3 rounded-xl flex items-center justify-between">
                                                <span className="text-sm text-stone-300">Tendencia semanal</span>
                                                <span className="text-emerald-400 font-bold text-sm">↑ +15%</span>
                                            </div>
                                        </>
                                    )}

                                    {metricasSubTab === 'ventas' && (
                                        <>
                                            <div className="bg-stone-800 p-3 rounded-xl space-y-2">
                                                <p className="text-xs text-stone-400 font-medium">Ventas por día</p>
                                                <div className="flex items-end justify-between h-20 gap-1">
                                                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                                                        <div key={day} className="flex flex-col items-center flex-1">
                                                            <div
                                                                className="w-full bg-emerald-500/50 rounded-t"
                                                                style={{ height: `${[40, 55, 45, 70, 85, 100, 60][i]}%` }}
                                                            />
                                                            <span className="text-[9px] text-stone-500 mt-1">{day}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-stone-800 p-3 rounded-xl">
                                                    <p className="text-[10px] text-stone-500">Promedio/día</p>
                                                    <p className="text-lg font-bold text-white">$38.500</p>
                                                </div>
                                                <div className="bg-stone-800 p-3 rounded-xl">
                                                    <p className="text-[10px] text-stone-500">Total semana</p>
                                                    <p className="text-lg font-bold text-white">$269.500</p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {metricasSubTab === 'sabores' && (
                                        <>
                                            <p className="text-xs text-stone-400 font-medium px-1">🏆 Top 5 sabores más pedidos</p>
                                            <div className="space-y-1.5">
                                                {[
                                                    { name: 'Dulce de Leche', pct: 100, sales: 48 },
                                                    { name: 'Chocolate', pct: 85, sales: 41 },
                                                    { name: 'Frutilla', pct: 70, sales: 34 },
                                                    { name: 'Sambayón', pct: 55, sales: 26 },
                                                    { name: 'Limón', pct: 40, sales: 19 },
                                                ].map((s, i) => (
                                                    <div key={s.name} className="bg-stone-800 p-2 rounded-lg">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs text-white font-medium">#{i + 1} {s.name}</span>
                                                            <span className="text-[10px] text-stone-400">{s.sales} ventas</span>
                                                        </div>
                                                        <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                                                style={{ width: `${s.pct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {metricasSubTab === 'inventario' && (
                                        <>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="bg-emerald-500/20 p-2 rounded-lg text-center border border-emerald-500/30">
                                                    <p className="text-xl font-bold text-emerald-400">18</p>
                                                    <p className="text-[9px] text-stone-400">Stock alto</p>
                                                </div>
                                                <div className="bg-amber-500/20 p-2 rounded-lg text-center border border-amber-500/30">
                                                    <p className="text-xl font-bold text-amber-400">5</p>
                                                    <p className="text-[9px] text-stone-400">Stock medio</p>
                                                </div>
                                                <div className="bg-red-500/20 p-2 rounded-lg text-center border border-red-500/30">
                                                    <p className="text-xl font-bold text-red-400">2</p>
                                                    <p className="text-[9px] text-stone-400">Stock bajo</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-stone-400 font-medium px-1">⚠️ Sabores con stock bajo</p>
                                            <div className="space-y-1">
                                                {['Pistacho', 'Maracuyá'].map(name => (
                                                    <div key={name} className="bg-red-500/10 p-2 rounded-lg flex justify-between items-center border border-red-500/20">
                                                        <span className="text-xs text-white">{name}</span>
                                                        <span className="text-[10px] text-red-400 font-bold">1 unidad</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB: Staff */}
                        {activeTab === 'staff' && canManageUsers && (
                            <div className="space-y-2 animate-fade-in">
                                {/* User Pills - Compact, single row, just emojis */}
                                <div className="flex gap-1.5 justify-center">
                                    {users.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${selectedUserId === user.id
                                                ? 'bg-emerald-500 ring-2 ring-emerald-300'
                                                : 'bg-stone-800 hover:bg-stone-700'
                                                }`}
                                            title={user.name}
                                        >
                                            {ROLE_CONFIG[user.role].emoji}
                                        </button>
                                    ))}
                                </div>

                                {/* Selected User Details - Super Compact */}
                                {selectedUserId && (() => {
                                    const user = users.find(u => u.id === selectedUserId);
                                    if (!user) return null;
                                    return (
                                        <div className="bg-stone-800 rounded-xl p-3 border border-stone-700 space-y-2">
                                            {/* User Info - Inline */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-8 h-8 rounded-full ${ROLE_CONFIG[user.role].color} flex items-center justify-center text-base`}>
                                                        {ROLE_CONFIG[user.role].emoji}
                                                    </span>
                                                    <div>
                                                        <p className="text-white text-sm font-bold">{user.name}</p>
                                                        <p className="text-stone-500 text-[10px]">@{user.username}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] bg-stone-700 px-2 py-0.5 rounded-full text-stone-400">
                                                    {ROLE_CONFIG[user.role].label}
                                                </span>
                                            </div>

                                            {/* Permissions - Compact grid with small switches */}
                                            {user.role !== 'dueño' && (
                                                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                                    {PERMISSIONS.filter(p => p.key !== 'manage_users').map(perm => (
                                                        <div key={perm.key} className="flex items-center justify-between py-1">
                                                            <span className="text-[11px] text-stone-300">{perm.label}</span>
                                                            <button
                                                                onClick={() => togglePermission(user.id, perm.key)}
                                                                className={`w-8 h-4 rounded-full transition-all relative ${user.permissions[perm.key]
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-stone-600'
                                                                    }`}
                                                            >
                                                                <div className={`w-3 h-3 rounded-full bg-white shadow absolute top-0.5 transition-all ${user.permissions[perm.key] ? 'right-0.5' : 'left-0.5'}`} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Change Password - Compact inline */}
                                            {editingUser?.id === user.id ? (
                                                <div className="flex gap-1">
                                                    <input
                                                        type="password"
                                                        value={editingUser.password}
                                                        onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                                        className="flex-1 bg-stone-700 rounded-lg px-2 py-1.5 text-xs text-white"
                                                        placeholder="Nueva contraseña"
                                                    />
                                                    <button onClick={() => handleSaveUser(editingUser)} className="px-2 py-1.5 bg-emerald-600 text-white rounded-lg text-xs">OK</button>
                                                    <button onClick={() => setEditingUser(null)} className="px-2 py-1.5 bg-stone-700 text-stone-300 rounded-lg text-xs">✕</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingUser({ ...user })}
                                                    className="w-full py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg text-[11px] transition-colors"
                                                >
                                                    🔑 Cambiar Contraseña
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* No user selected hint - Compact */}
                                {!selectedUserId && (
                                    <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700 text-center">
                                        <p className="text-xs text-stone-400">👆 Tocá un usuario para editar</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
