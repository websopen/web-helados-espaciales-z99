/**
 * Logout Function - Clear session cookie
 */

const COOKIE_NAME = 'helados_admin';

export const onRequest: PagesFunction = async (context) => {
    // Clear cookie by setting Max-Age=0
    const setCookie = `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

    // Redirect to home (now as guest)
    return new Response(null, {
        status: 302,
        headers: {
            'Location': '/',
            'Set-Cookie': setCookie
        }
    });
};
