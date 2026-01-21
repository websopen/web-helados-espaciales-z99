/**
 * Store Service - Manages store data via Cloudflare KV
 * Simplified for ice cream menu (no ordering)
 */

// API URL - using worker directly, will be updated when custom domain is set
const API_BASE = 'https://helados-api.nicolasqw31.workers.dev/api';

interface StoreSettings {
    isOpen: boolean;
}

export interface SocialLinks {
    instagram: string;
    whatsapp: string;
}

export interface Prices {
    cuarto: number;    // 1/4 kg
    medio: number;     // 1/2 kg
    kilo: number;      // 1 kg
    cucurucho: number;
    doble: number;
}

export interface StoreData {
    stock: Record<string, boolean>;  // Flavor availability
    prices: Prices;                   // Prices by quantity
    settings: StoreSettings;
    socialLinks: SocialLinks;
}

interface SaveResponse {
    success?: boolean;
    error?: string;
    message?: string;
}

// Default values
export const defaultSocialLinks: SocialLinks = {
    instagram: '',
    whatsapp: ''
};

export const defaultPrices: Prices = {
    cuarto: 3500,
    medio: 6500,
    kilo: 12000,
    cucurucho: 2500,
    doble: 4000,
};

/**
 * Load all store data (stock, prices, settings)
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
            settings: { isOpen: true },
            socialLinks: defaultSocialLinks,
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
