/**
 * Auth Service - Communicates with helados-api Worker
 */

// API URL - using worker directly
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8787/api'
    : 'https://helados-api.nicolasqw31.workers.dev/api';

interface TokenValidationResponse {
    valid?: boolean;
    error?: string;
    alreadyAssociated?: boolean;
    message?: string;
}

interface ActivationResponse {
    success?: boolean;
    error?: string;
    message?: string;
}

interface AuthCheckResponse {
    isAdmin: boolean;
    onboardingPending: boolean;
}

/**
 * Validate if a token from URL is valid
 */
export async function validateToken(token: string): Promise<TokenValidationResponse> {
    try {
        const response = await fetch(`${API_BASE}/auth/validate-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ token }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error validating token:', error);
        return { error: 'Network error' };
    }
}

/**
 * Activate admin with token + PIN
 */
export async function activateAdmin(token: string, pin: string): Promise<ActivationResponse> {
    try {
        const response = await fetch(`${API_BASE}/auth/activate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ token, pin }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error activating admin:', error);
        return { error: 'Network error' };
    }
}

/**
 * Check if current user is admin (via cookie)
 */
export async function checkAuth(): Promise<AuthCheckResponse> {
    try {
        const response = await fetch(`${API_BASE}/auth/check`, {
            method: 'GET',
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        console.error('Error checking auth:', error);
        return { isAdmin: false, onboardingPending: false };
    }
}

/**
 * Get token from URL query params
 */
export function getTokenFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
}

/**
 * Remove token from URL without reload
 */
export function clearTokenFromUrl(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState({}, '', url.toString());
}

/**
 * Initialize session from OTK (One-Time Token)
 */
export async function initSessionFromOtk(): Promise<boolean> {
    const params = new URLSearchParams(window.location.search);
    const otk = params.get('otk');

    if (otk) {
        try {
            console.log('[Auth] 🔑 Found OTK in URL, attempting login...');

            const response = await fetch(`${API_BASE}/auth/login-otk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otk }),
                credentials: 'include'
            });

            if (response.ok) {
                console.log('[Auth] ✅ OTK login successful. Reloading...');

                // Clean URL before reload
                const url = new URL(window.location.href);
                url.searchParams.delete('otk');
                window.history.replaceState({}, '', url.toString());

                window.location.reload();
                return true;
            } else {
                console.error('[Auth] ❌ OTK login failed');
                return false;
            }
        } catch (e) {
            console.error('[Auth] ❌ Error in initSessionFromOtk:', e);
            return false;
        }
    }
    return false;
}

/**
 * Check if user has admin access from Hub cookie
 * The Hub sets a cookie 'helados_admin' with value containing 'admin_active' for admin users
 */
export function checkHubCookie(): boolean {
    try {
        console.log('[Auth Debug] Checking cookies:', document.cookie);
        // Note: HttpOnly cookies can't be read from JS, but our Pages Function 
        // sets a non-HttpOnly version for frontend detection
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'helados_admin' && value) {
                console.log('[Auth Debug] Found helados_admin cookie:', value);
                // Cookie is base64 encoded, decode and check for admin_active
                try {
                    // Decode URI component (server uses encodeURIComponent)
                    const decodedValue = decodeURIComponent(value);
                    const decoded = atob(decodedValue);
                    console.log('[Auth Debug] Decoded value:', decoded);
                    return decoded.includes('admin_active');
                } catch {
                    console.log('[Auth Debug] Raw value check (fallback)');
                    return value.includes('admin');
                }
            }
        }
        console.log('[Auth Debug] No helados_admin cookie found');
        return false;
    } catch (error) {
        console.error('[Auth Debug] Error checking Hub cookie:', error);
        return false;
    }
}

/**
 * Initialize session from URL param (Token-in-URL strategy)
 * Call this on App mount to capture tokens passed from Hub
 */
export function initSessionFromUrl(): boolean {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));

    // Support all possible param names from Hub/VPS
    const authSession = searchParams.get('auth_session') ||
        searchParams.get('token') ||
        searchParams.get('hub_token') ||
        hashParams.get('hub_token') ||
        hashParams.get('token');

    if (authSession) {
        try {
            console.log('[Auth] Initializing session from URL token:', authSession.substring(0, 10) + '...');

            let cookieValueToSet = decodeURIComponent(authSession);

            // Si el token es un JWT del Hub (3 partes delimitadas por puntos), intentamos decodificar su payload
            if (authSession.split('.').length === 3) {
                try {
                    const base64Url = authSession.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

                    // Add padding if needed
                    const pad = base64.length % 4;
                    const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;

                    console.log('[Auth Debug] Decoding JWT payload (base64url):', base64Url);

                    const payloadBytes = atob(paddedBase64);
                    const payload = JSON.parse(payloadBytes);

                    console.log('[Auth Debug] Decoded payload:', payload);

                    const role = (payload.role || '').toLowerCase();
                    // Chequeamos si tiene rol dueño/admin/encargado
                    if (role === 'owner' || role === 'admin' || role === 'dueno' || role === 'dueño' || role === 'encargado' || role === 'hub_user') {
                        // Fix 2026-03-25: If it's hub_user, we should still allow if it's coming from Hub
                        const uniqueSig = `HZ_SECURE_${Date.now()}`;
                        cookieValueToSet = btoa(`admin_active:::${uniqueSig}`);
                        console.log(`[Auth] Token JWT válido con rol '${role}'. Estableciendo cookie admin segura.`);
                    } else {
                        console.warn(`[Auth] Token JWT tiene rol no administrativo: '${role}'`);
                    }
                } catch (e) {
                    console.error('[Auth] Error analizando JWT en fallback:', e);
                }
            }

            // Set cookie with broad compatibility
            document.cookie = `helados_admin=${encodeURIComponent(cookieValueToSet)}; Path=/; Secure; SameSite=Lax`;
            console.log('[Auth] Session cookie set successfully.');

            // Force reload to apply session but CLEAN URL FIRST to prevent infinite loop
            console.log('[Auth] Cleaning URL and reloading to apply session...');
            const finalUrl = new URL(window.location.href);
            finalUrl.searchParams.delete('auth_session');
            finalUrl.searchParams.delete('token');
            finalUrl.searchParams.delete('hub_token');
            // Clear hash too just in case
            if (finalUrl.hash.includes('hub_token') || finalUrl.hash.includes('token')) {
                finalUrl.hash = '';
            }
            window.history.replaceState({}, '', finalUrl.toString());

            window.location.reload();
            return true;
        } catch (e) {
            console.error('[Auth] Error initializing session:', e);
            return false;
        }
    }
    return false;
}
