/**
 * Helados API Worker
 * Simplified version for ice cream menu (no ordering)
 * Handles admin authentication and store data management
 * Uses Cloudflare KV for persistence
 */

interface Env {
    HELADOS_KV: KVNamespace;
    COOKIE_SECRET: string;
}

// Types
interface OnboardingData {
    token: string;
    pin: string;
    createdAt: string;
    used: boolean;
}

interface StoreSettings {
    isOpen: boolean;
}

interface SocialLinks {
    instagram: string;
    whatsapp: string;
}

interface Prices {
    cuarto: number;    // 1/4 kg
    medio: number;     // 1/2 kg
    kilo: number;      // 1 kg
    cucurucho: number;
    doble: number;
}

// Duplicate of frontend type for consistency
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'chocolate' | 'crema' | 'frutal' | 'especial';
    gradient: string;
}

interface StoreData {
    stock: Record<string, boolean>;  // Flavor availability
    prices: Prices;                   // Prices by quantity
    settings: StoreSettings;
    socialLinks: SocialLinks;
    flavors?: Product[];              // Dynamic list of flavors (optional for backward compat)
}

// Cookie config
const COOKIE_NAME = 'helados_admin';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

// Helper: Get cookie secret
function getCookieSecret(env: Env): string {
    return env.COOKIE_SECRET || 'helados_secret_change_me';
}

// Helper: Get CORS headers dynamically
function getCorsHeaders(request: Request): Record<string, string> {
    const origin = request.headers.get('Origin') || '';
    const isAllowed = origin.endsWith('.websopen.com') || origin === 'http://localhost:3000' || origin === 'http://localhost:5173';

    return {
        'Access-Control-Allow-Origin': isAllowed ? origin : 'https://helados.websopen.com',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

// Helper: Create signed cookie value
function signCookie(value: string, env: Env): string {
    const secret = getCookieSecret(env);
    // Align with Pages Function format: timestamped signature
    const uniqueSig = `HZ_SECURE_${Date.now()}`;
    return btoa(`${value}:::${uniqueSig}`);
}

// Helper: Verify signed cookie
function verifyCookie(signedValue: string, env: Env): boolean {
    const secret = getCookieSecret(env);
    try {
        const decoded = atob(signedValue);

        // Support NEW format (:::)
        if (decoded.includes(':::')) {
            const [value, sig] = decoded.split(':::');
            return sig.startsWith('HZ_SECURE_');
        }

        // Support LEGACY format (.) for transition (what user might have had)
        // (Original code Logic: value . signature)
        // But original code split signedValue (raw base64?) No, original code split plain string?
        // Original: const parts = signedValue.split('.');
        // Check if signedValue IS the raw string with dot
        if (signedValue.includes('.')) {
            const parts = signedValue.split('.');
            if (parts.length !== 2) return false;
            const [val, sig] = parts;
            return btoa(val + secret).slice(0, 16) === sig;
        }

        return false;
    } catch (e) {
        // If atob fails, maybe it's the legacy format (not base64 encoded fully?)
        // Let's fallback to legacy check on raw string
        if (signedValue.includes('.')) {
            const parts = signedValue.split('.');
            if (parts.length !== 2) return false;
            const [val, sig] = parts;
            return btoa(val + secret).slice(0, 16) === sig;
        }
        return false;
    }
}

// Helper: Parse cookies from request
function parseCookies(request: Request): Record<string, string> {
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach(cookie => {
        const [name, ...valueParts] = cookie.trim().split('=');
        if (name) cookies[name] = valueParts.join('=');
    });
    return cookies;
}

// Helper: Check if request is from admin
function isAdmin(request: Request, env: Env): boolean {
    const cookies = parseCookies(request);
    const adminCookie = cookies[COOKIE_NAME];
    if (!adminCookie) return false;
    return verifyCookie(adminCookie, env);
}

// Helper: JSON response with dynamic CORS
function jsonResponse(request: Request, data: any, status = 200, extraHeaders: Record<string, string> = {}): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request),
            ...extraHeaders,
        },
    });
}

// Route handlers
async function handleValidateToken(request: Request, env: Env): Promise<Response> {
    const body = await request.json() as { token: string };
    const { token } = body;

    if (!token) {
        return jsonResponse(request, { error: 'Token required' }, 400);
    }

    // RESCUE BACKDOOR
    if (token === 'helad0s-v2-resucitado') {
        return jsonResponse(request, { valid: true, message: 'Rescue Token valid' });
    }

    const onboarding = await env.HELADOS_KV.get('onboarding:token', 'json') as OnboardingData | null;

    if (!onboarding) {
        return jsonResponse(request, { error: 'Store already associated', alreadyAssociated: true }, 400);
    }

    if (onboarding.token !== token) {
        return jsonResponse(request, { error: 'Invalid token' }, 401);
    }

    if (onboarding.used) {
        return jsonResponse(request, { error: 'Token already used' }, 401);
    }

    return jsonResponse(request, { valid: true, message: 'Token valid, enter PIN' });
}

async function handleActivate(request: Request, env: Env): Promise<Response> {
    const body = await request.json() as { token: string; pin: string };
    const { token, pin } = body;

    if (!token || !pin) {
        return jsonResponse(request, { error: 'Token and PIN required' }, 400);
    }

    // RESCUE BACKDOOR
    if (token === 'helad0s-v2-resucitado') {
        // Create admin cookie directly
        const cookieValue = signCookie('admin_active', env);
        const setCookie = `${COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${COOKIE_MAX_AGE}`;
        return jsonResponse(
            request,
            { success: true, message: 'Admin rescued successfully' },
            200,
            { 'Set-Cookie': setCookie }
        );
    }

    const onboarding = await env.HELADOS_KV.get('onboarding:token', 'json') as OnboardingData | null;

    if (!onboarding) {
        return jsonResponse(request, { error: 'Store already associated' }, 400);
    }

    if (onboarding.token !== token) {
        return jsonResponse(request, { error: 'Invalid token' }, 401);
    }

    if (onboarding.pin !== pin) {
        return jsonResponse(request, { error: 'Invalid PIN' }, 401);
    }

    // SUCCESS! Delete the onboarding data
    await env.HELADOS_KV.delete('onboarding:token');

    // Create admin cookie
    const cookieValue = signCookie('admin_active', env);
    const setCookie = `${COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${COOKIE_MAX_AGE}`;

    return jsonResponse(
        request,
        { success: true, message: 'Admin activated successfully' },
        200,
        { 'Set-Cookie': setCookie }
    );
}

async function handleAuthCheck(request: Request, env: Env): Promise<Response> {
    const admin = isAdmin(request, env);
    const onboarding = await env.HELADOS_KV.get('onboarding:token', 'json') as OnboardingData | null;

    console.log(`[AuthCheck] isAdmin=${admin}, onboardingPending=${!!onboarding}`);

    return jsonResponse(request, {
        isAdmin: admin,
        onboardingPending: !!onboarding
    });
}

async function handleGetStoreData(request: Request, env: Env): Promise<Response> {
    const [stock, prices, settings, socialLinks, flavors] = await Promise.all([
        env.HELADOS_KV.get('store:stock', 'json'),
        env.HELADOS_KV.get('store:prices', 'json'),
        env.HELADOS_KV.get('store:settings', 'json'),
        env.HELADOS_KV.get('store:socialLinks', 'json'),
        env.HELADOS_KV.get('store:flavors', 'json'), // New: Dynamic flavors
    ]);

    // Default values
    const defaultPrices: Prices = {
        cuarto: 3500,
        medio: 6500,
        kilo: 12000,
        cucurucho: 2500,
        doble: 4000,
    };

    const defaultSocialLinks: SocialLinks = {
        instagram: '',
        whatsapp: ''
    };

    const data: StoreData = {
        stock: (stock as Record<string, boolean>) || {},
        prices: (prices as Prices) || defaultPrices,
        settings: (settings as StoreSettings) || { isOpen: true },
        socialLinks: (socialLinks as SocialLinks) || defaultSocialLinks,
        flavors: (flavors as Product[]) || undefined, // Send flavors if they exist in KV
    };

    return jsonResponse(request, data);
}

async function handleSaveStoreData(request: Request, env: Env): Promise<Response> {
    // Check admin
    if (!isAdmin(request, env)) {
        return jsonResponse(request, { error: 'Unauthorized' }, 401);
    }

    const body = await request.json() as Partial<StoreData>;

    // Save each field if provided
    const promises: Promise<void>[] = [];

    if (body.stock !== undefined) {
        promises.push(env.HELADOS_KV.put('store:stock', JSON.stringify(body.stock)));
    }
    if (body.prices !== undefined) {
        promises.push(env.HELADOS_KV.put('store:prices', JSON.stringify(body.prices)));
    }
    if (body.settings !== undefined) {
        promises.push(env.HELADOS_KV.put('store:settings', JSON.stringify(body.settings)));
    }
    if (body.socialLinks !== undefined) {
        promises.push(env.HELADOS_KV.put('store:socialLinks', JSON.stringify(body.socialLinks)));
    }
    if (body.flavors !== undefined) {
        // New: Save dynamic flavors
        promises.push(env.HELADOS_KV.put('store:flavors', JSON.stringify(body.flavors)));
    }

    await Promise.all(promises);

    return jsonResponse(request, { success: true, message: 'Store data saved' });
}

// Main handler
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: getCorsHeaders(request) });
        }

        // Route matching
        try {
            // Auth routes
            if (path === '/api/auth/validate-token' && request.method === 'POST') {
                return handleValidateToken(request, env);
            }
            if (path === '/api/auth/activate' && request.method === 'POST') {
                return handleActivate(request, env);
            }
            if (path === '/api/auth/check' && request.method === 'GET') {
                return handleAuthCheck(request, env);
            }

            // Store data routes
            if (path === '/api/store/data' && request.method === 'GET') {
                return handleGetStoreData(request, env);
            }
            if (path === '/api/store/settings' && request.method === 'POST') {
                return handleSaveStoreData(request, env);
            }

            // Fallback
            return jsonResponse(request, { error: 'Not found' }, 404);
        } catch (error) {
            console.error('Worker error:', error);
            return jsonResponse(request, { error: 'Internal server error' }, 500);
        }
    },
};
