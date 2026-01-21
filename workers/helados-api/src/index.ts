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

interface StoreData {
    stock: Record<string, boolean>;  // Flavor availability
    prices: Prices;                   // Prices by quantity
    settings: StoreSettings;
    socialLinks: SocialLinks;
}

// Cookie config
const COOKIE_NAME = 'helados_admin';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

// Helper: Get cookie secret
function getCookieSecret(env: Env): string {
    return env.COOKIE_SECRET || 'helados_secret_change_me';
}

// CORS headers - adjust origin as needed
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Will be updated when custom domain is set
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
};

// Helper: Create signed cookie value
function signCookie(value: string, env: Env): string {
    const secret = getCookieSecret(env);
    return `${value}.${btoa(value + secret).slice(0, 16)}`;
}

// Helper: Verify signed cookie
function verifyCookie(signedValue: string, env: Env): boolean {
    const secret = getCookieSecret(env);
    const parts = signedValue.split('.');
    if (parts.length !== 2) return false;
    const [value, sig] = parts;
    return btoa(value + secret).slice(0, 16) === sig;
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

// Helper: JSON response with CORS
function jsonResponse(data: any, status = 200, extraHeaders: Record<string, string> = {}): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...extraHeaders,
        },
    });
}

// Route handlers
async function handleValidateToken(request: Request, env: Env): Promise<Response> {
    const body = await request.json() as { token: string };
    const { token } = body;

    if (!token) {
        return jsonResponse({ error: 'Token required' }, 400);
    }

    const onboarding = await env.HELADOS_KV.get('onboarding:token', 'json') as OnboardingData | null;

    if (!onboarding) {
        return jsonResponse({ error: 'Store already associated', alreadyAssociated: true }, 400);
    }

    if (onboarding.token !== token) {
        return jsonResponse({ error: 'Invalid token' }, 401);
    }

    if (onboarding.used) {
        return jsonResponse({ error: 'Token already used' }, 401);
    }

    return jsonResponse({ valid: true, message: 'Token valid, enter PIN' });
}

async function handleActivate(request: Request, env: Env): Promise<Response> {
    const body = await request.json() as { token: string; pin: string };
    const { token, pin } = body;

    if (!token || !pin) {
        return jsonResponse({ error: 'Token and PIN required' }, 400);
    }

    const onboarding = await env.HELADOS_KV.get('onboarding:token', 'json') as OnboardingData | null;

    if (!onboarding) {
        return jsonResponse({ error: 'Store already associated' }, 400);
    }

    if (onboarding.token !== token) {
        return jsonResponse({ error: 'Invalid token' }, 401);
    }

    if (onboarding.pin !== pin) {
        return jsonResponse({ error: 'Invalid PIN' }, 401);
    }

    // SUCCESS! Delete the onboarding data
    await env.HELADOS_KV.delete('onboarding:token');

    // Create admin cookie
    const cookieValue = signCookie('admin_active', env);
    const setCookie = `${COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`;

    return jsonResponse(
        { success: true, message: 'Admin activated successfully' },
        200,
        { 'Set-Cookie': setCookie }
    );
}

async function handleAuthCheck(request: Request, env: Env): Promise<Response> {
    const admin = isAdmin(request, env);
    const onboarding = await env.HELADOS_KV.get('onboarding:token', 'json') as OnboardingData | null;

    return jsonResponse({
        isAdmin: admin,
        onboardingPending: !!onboarding
    });
}

async function handleGetStoreData(request: Request, env: Env): Promise<Response> {
    const [stock, prices, settings, socialLinks] = await Promise.all([
        env.HELADOS_KV.get('store:stock', 'json'),
        env.HELADOS_KV.get('store:prices', 'json'),
        env.HELADOS_KV.get('store:settings', 'json'),
        env.HELADOS_KV.get('store:socialLinks', 'json'),
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
    };

    return jsonResponse(data);
}

async function handleSaveStoreData(request: Request, env: Env): Promise<Response> {
    // Check admin
    if (!isAdmin(request, env)) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
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

    await Promise.all(promises);

    return jsonResponse({ success: true, message: 'Store data saved' });
}

// Main handler
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
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
            return jsonResponse({ error: 'Not found' }, 404);
        } catch (error) {
            console.error('Worker error:', error);
            return jsonResponse({ error: 'Internal server error' }, 500);
        }
    },
};
