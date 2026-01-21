/**
 * Auth Service - Communicates with helados-api Worker
 */

// API URL - using worker directly
const API_BASE = 'https://helados-api.nicolasqw31.workers.dev/api';

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
