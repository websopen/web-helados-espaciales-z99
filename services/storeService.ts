/**
 * Store Service - Manages store data via Cloudflare KV
 */

const API_BASE = '/api';

interface StoreSettings {
    isOpen: boolean;
    deliveryAvailable: boolean;
    pickupAvailable: boolean;
}

export interface SocialLinks {
    instagram: string;
    tiktok: string;
    whatsapp: string;
}

export interface ElementColors {
    navbarColor: string;      // Barra Superior (color)
    navbarOpacity: number;    // Barra Superior (transparencia 0-1)
    background: string;       // Fondo de Página
    cardBg: string;          // Cards/Productos
    text: string;            // Texto Principal
    accent: string;          // Botones y Acentos
}

export interface ThemeColors {
    light: ElementColors;
    dark: ElementColors;
}

// Legacy support
export interface CustomColors {
    primary: string;
    secondary: string;
    background: string;
    cardBg: string;
    text: string;
    accent: string;
}

export interface StoreData {
    stock: Record<string, boolean>;
    prices: Record<string, number>;
    settings: StoreSettings;
    offer: string;
    sectionOrder: 'milky-first' | 'water-first';
    socialLinks: SocialLinks;
    customColors: CustomColors;
    themeColors?: ThemeColors;  // New theme-aware colors
}

interface SaveResponse {
    success?: boolean;
    error?: string;
    message?: string;
}

// Default values
export const defaultSocialLinks: SocialLinks = {
    instagram: '',
    tiktok: '',
    whatsapp: '5491155146230'
};

export const defaultCustomColors: CustomColors = {
    primary: '#78716C',
    secondary: '#EC4899',
    background: '#F5F5F4',
    cardBg: '#FFFFFF',
    text: '#1C1917',
    accent: '#F97316'
};

// Real element defaults based on current design
export const defaultThemeColors: ThemeColors = {
    light: {
        navbarColor: '#FFB9D2',    // Rosa claro actual
        navbarOpacity: 0.80,
        background: '#F5F5F7',     // glacial-bg
        cardBg: '#FFFFFF',
        text: '#1C1917',           // stone-900
        accent: '#25D366',         // WhatsApp green
    },
    dark: {
        navbarColor: '#580C28',    // Rosa vino oscuro actual
        navbarOpacity: 0.85,
        background: '#1C1917',     // glacial-dark (stone-900)
        cardBg: '#292524',         // stone-800
        text: '#FAFAF9',           // stone-50
        accent: '#25D366',         // WhatsApp green
    }
};

/**
 * Load all store data (stock, prices, settings, offer)
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
            prices: {},
            settings: { isOpen: true, deliveryAvailable: true, pickupAvailable: true },
            offer: 'none',
            sectionOrder: 'milky-first',
            socialLinks: defaultSocialLinks,
            customColors: defaultCustomColors,
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
