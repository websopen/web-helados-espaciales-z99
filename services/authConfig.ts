// Role-Based Access Control Types and Config

export type RoleType = 'dueño' | 'encargado' | 'venta' | 'produccion';

export interface Permission {
    key: string;
    label: string;
    description: string;
}

export interface UserAccount {
    id: string;
    username: string;
    password: string;
    role: RoleType;
    name: string;
    permissions: Record<string, boolean>;
}

// Available permissions
export const PERMISSIONS: Permission[] = [
    { key: 'view_stock', label: 'Ver Stock', description: 'Ver niveles de stock' },
    { key: 'edit_stock', label: 'Editar Stock', description: 'Modificar cantidades de stock' },
    { key: 'view_prices', label: 'Ver Precios', description: 'Ver lista de precios' },
    { key: 'edit_prices', label: 'Editar Precios', description: 'Modificar precios' },
    { key: 'view_flavors', label: 'Ver Sabores', description: 'Ver catálogo de sabores' },
    { key: 'edit_flavors', label: 'Editar Sabores', description: 'Agregar/modificar sabores' },
    { key: 'view_orders', label: 'Ver Pedidos', description: 'Ver historial de pedidos' },
    { key: 'view_metrics', label: 'Ver Métricas', description: 'Ver estadísticas y reportes' },
    { key: 'edit_settings', label: 'Configuración', description: 'Modificar ajustes del local' },
    { key: 'edit_promo', label: 'Promociones', description: 'Configurar banners y ofertas' },
    { key: 'manage_users', label: 'Gestionar Personal', description: 'Administrar usuarios y roles' },
];

// Default permissions by role
export const DEFAULT_ROLE_PERMISSIONS: Record<RoleType, Record<string, boolean>> = {
    dueño: {
        view_stock: true,
        edit_stock: true,
        view_prices: true,
        edit_prices: true,
        view_flavors: true,
        edit_flavors: true,
        view_orders: true,
        view_metrics: true,
        edit_settings: true,
        edit_promo: true,
        manage_users: true,
    },
    encargado: {
        view_stock: true,
        edit_stock: true,
        view_prices: true,
        edit_prices: true,
        view_flavors: true,
        edit_flavors: true,
        view_orders: true,
        view_metrics: true,
        edit_settings: true,
        edit_promo: true,
        manage_users: false,
    },
    venta: {
        view_stock: true,
        edit_stock: false,
        view_prices: true,
        edit_prices: false,
        view_flavors: true,
        edit_flavors: false,
        view_orders: true,
        view_metrics: false,
        edit_settings: false,
        edit_promo: false,
        manage_users: false,
    },
    produccion: {
        view_stock: true,
        edit_stock: true,
        view_prices: false,
        edit_prices: false,
        view_flavors: true,
        edit_flavors: false,
        view_orders: false,
        view_metrics: false,
        edit_settings: false,
        edit_promo: false,
        manage_users: false,
    },
};

// Pre-configured users
export const DEFAULT_USERS: UserAccount[] = [
    {
        id: 'user_owner',
        username: 'dueño',
        password: 'dueño2026@',
        role: 'dueño',
        name: 'Propietario',
        permissions: DEFAULT_ROLE_PERMISSIONS.dueño,
    },
    {
        id: 'user_manager',
        username: 'encargado',
        password: 'encargado2026@',
        role: 'encargado',
        name: 'Encargado',
        permissions: DEFAULT_ROLE_PERMISSIONS.encargado,
    },
    {
        id: 'user_sales',
        username: 'ventas',
        password: 'ventas2026@',
        role: 'venta',
        name: 'Vendedor',
        permissions: DEFAULT_ROLE_PERMISSIONS.venta,
    },
    {
        id: 'user_prod',
        username: 'produccion',
        password: 'produccion2026@',
        role: 'produccion',
        name: 'Producción',
        permissions: DEFAULT_ROLE_PERMISSIONS.produccion,
    },
];

// Role display names and icons
export const ROLE_CONFIG: Record<RoleType, { label: string; emoji: string; color: string }> = {
    dueño: { label: 'Dueño', emoji: '👑', color: 'bg-amber-500' },
    encargado: { label: 'Encargado', emoji: '📋', color: 'bg-blue-500' },
    venta: { label: 'Ventas', emoji: '🛒', color: 'bg-green-500' },
    produccion: { label: 'Producción', emoji: '🏭', color: 'bg-purple-500' },
};

// LocalStorage keys
export const AUTH_KEY = 'helados_admin_auth';
export const CURRENT_USER_KEY = 'helados_current_user';
export const USERS_KEY = 'helados_users';

// Helper functions
export const getStoredUsers = (): UserAccount[] => {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return DEFAULT_USERS;
        }
    }
    return DEFAULT_USERS;
};

export const saveUsers = (users: UserAccount[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): UserAccount | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    }
    return null;
};

export const setCurrentUser = (user: UserAccount | null) => {
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_KEY, 'true');
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(AUTH_KEY);
    }
};

export const hasPermission = (user: UserAccount | null, permission: string): boolean => {
    if (!user) return false;
    return user.permissions[permission] === true;
};

export const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.reload();
};
