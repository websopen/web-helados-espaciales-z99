/**
 * Store Service - Manages store data via Cloudflare KV
 * Simplified for ice cream menu (no ordering)
 */

import { Product } from '../types';

// API URL - using worker directly, will be updated when custom domain is set
const API_BASE = 'https://helados-api.nicolasqw31.workers.dev/api';

interface StoreSettings {
    isOpen: boolean;
    deliveryAvailable: boolean;
    pickupAvailable: boolean;
}

export interface SocialLinks {
    instagram: string;
    whatsapp: string;
    tiktok?: string;
    facebook?: string;
    phone?: string;
}

export interface DeliveryConfig {
    enabled: boolean;
    maxDistanceKm: number;
    baseCost: number;
    costPerKm: number;
    estimatedMinutes: number;
}

export interface BusinessInfo {
    cuit: string;
    businessName: string;
    complaintsBookUrl?: string;
}

export interface Prices {
    cuarto: number;    // 1/4 kg
    medio: number;     // 1/2 kg
    kilo: number;      // 1 kg
    cucurucho: number;
    doble: number;
}

export interface StoreData {
    stock: Record<string, boolean | number>;  // Flavor availability (legacy: boolean, new: number)
    prices: Prices;                   // Prices by quantity (legacy)
    settings: StoreSettings;
    socialLinks: SocialLinks;
    flavors?: Product[];             // Dynamic list of flavors
    priceProducts?: PriceProduct[];  // Dynamic price menu products
    deliveryConfig?: DeliveryConfig;
    businessInfo?: BusinessInfo;
    // Sidebar config states
    promoBanner?: {
        enabled: boolean;
        text: string;
        gradient: 'warm' | 'cool' | 'rainbow';
    };
    storeHours?: Record<string, { open: string; close: string; closed?: boolean }>;
    storeLocation?: {
        address: string;
        lat?: number;
        lng?: number;
        googleMapsUrl?: string;
    };
}

// Price product interface (imported from PriceTable but defined here for service)
export interface PriceProduct {
    id: string;
    label: string;
    price: number;
    category: 'alPaso' | 'paraLlevar';
    maxFlavors: number;
}

interface SaveResponse {
    success?: boolean;
    error?: string;
    message?: string;
}

// Default values
export const defaultSocialLinks: SocialLinks = {
    instagram: '',
    whatsapp: '',
    tiktok: '',
    facebook: '',
    phone: ''
};

export const defaultDeliveryConfig: DeliveryConfig = {
    enabled: true,
    maxDistanceKm: 5,
    baseCost: 500,
    costPerKm: 100,
    estimatedMinutes: 30
};

export const defaultBusinessInfo: BusinessInfo = {
    cuit: '',
    businessName: 'Monte Bianco',
    complaintsBookUrl: ''
};

export const defaultPrices: Prices = {
    cuarto: 3500,
    medio: 6500,
    kilo: 12000,
    cucurucho: 2500,
    doble: 4000,
};

/**
 * Load all store data (stock, prices, settings, flavors)
 */
export async function loadStoreData(): Promise<StoreData> {
    try {
        const response = await fetch(`${API_BASE}/store/data`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to load store data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading store data:', error);
        // Return defaults
        return {
            stock: {},
            prices: defaultPrices,
            settings: { isOpen: true, deliveryAvailable: true, pickupAvailable: true },
            socialLinks: defaultSocialLinks,
            flavors: [], // Default to empty if failed, App will fall back to constants
        };
    }
}

/**
 * Save store data (requires admin)
 */
export async function saveStoreData(data: Partial<StoreData>): Promise<SaveResponse> {
    try {
        const response = await fetch(`${API_BASE}/store/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        return await response.json();
    } catch (error) {
        console.error('Error saving store data:', error);
        return { error: 'Network error' };
    }
}
