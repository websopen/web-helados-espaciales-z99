/**
 * Hub Login Function - Pages Function to handle JWT from Hub
 */

const JWT_SECRET = 'hub-jwt-secret-change-in-production-2025';
const COOKIE_NAME = 'helados_admin';
const COOKIE_SECRET = 'helados-hub-secret-2025';

// Simple JWT decode (no signature verification needed for Edge)
function decodeJwt(token: string): any {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (e) {
        return null;
    }
}

// Simple cookie signing (HMAC-like)
function signCookie(value: string): string {
    // Robust signature with timestamp to prevent replay/stale issues
    const uniqueSig = `HZ_SECURE_${Date.now()}`;
    return btoa(`${value}:::${uniqueSig}`);
}

export const onRequest: PagesFunction = async (context) => {
    const url = new URL(context.request.url);
    const hubToken = url.searchParams.get('hub_token');

    if (!hubToken) {
        return new Response(JSON.stringify({ error: 'Token required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Decode JWT
    const payload = decodeJwt(hubToken);
    if (!payload || !payload.role) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
        return new Response(JSON.stringify({ error: 'Token expired' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Map role to cookie value
    // Normalize role to lowercase for comparison
    const role = (payload.role || '').toLowerCase();
    const isAdmin = role === 'owner' || role === 'admin' || role === 'dueno' || role === 'dueño' || role === 'encargado';

    const roleValue = isAdmin ? 'admin_active' : `role_${role}`;

    // Create session cookie (NO Max-Age = expires when browser closes)
    // NOTE: Not using HttpOnly so frontend JS can detect admin role
    const cookieValue = signCookie(roleValue);
    console.log(`[Hub Login DEBUG] Generated Cookie Value: ${cookieValue}`);

    // Method 1: Set cookie directly in the response header (Best practice)
    const setCookieHeader = `${COOKIE_NAME}=${encodeURIComponent(cookieValue)}; Path=/; Secure; SameSite=Lax`;

    // Method 2: Pass token in URL (Fallback/Legacy)
    // The frontend checks for this if the cookie isn't found immediately
    const encodedToken = encodeURIComponent(cookieValue);

    console.log(`[Hub Login] Redirecting with session token for role: ${role}`);

    // Determine redirect URL with backup auth_session param
    // We keep the auth_session param as a fallback for the frontend to pick up
    // if the cookie isn't immediately available (e.g. cross-domain lag)
    const redirectPath = `/?auth_session=${encodedToken}`;

    // Redirect with Set-Cookie
    return new Response(null, {
        status: 302,
        headers: {
            'Location': redirectPath,
            'Set-Cookie': setCookieHeader,
            'Cache-Control': 'no-store'
        }
    });
};
