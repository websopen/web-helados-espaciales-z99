import React, { useState } from 'react';
import {
    UserAccount,
    getStoredUsers,
    setCurrentUser,
    ROLE_CONFIG
} from '../services/authConfig';

interface AdminLoginProps {
    onLoginSuccess: (user: UserAccount) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate async validation
        setTimeout(() => {
            const users = getStoredUsers();
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                setCurrentUser(user);
                onLoginSuccess(user);
            } else {
                setError('Usuario o contraseña incorrectos');
                setIsLoading(false);
            }
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 p-4">
            <div className="w-full max-w-sm">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-xl">
                        <span className="text-4xl">🍦</span>
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-stone-800">Panel Admin</h1>
                    <p className="text-sm text-stone-500 mt-1">Ingresa tus credenciales</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 border border-stone-200">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center animate-bounce-in">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1.5">Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="usuario"
                                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-pink-400 outline-none transition-colors text-stone-800"
                                autoComplete="username"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1.5">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-pink-400 outline-none transition-colors text-stone-800"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 py-3 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Verificando...
                            </>
                        ) : (
                            <>🔐 Ingresar</>
                        )}
                    </button>
                </form>

                {/* Back to client view link */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
                    >
                        ← Volver a la carta
                    </a>
                </div>

                {/* Hint for users */}
                <div className="mt-8 p-4 bg-stone-100 rounded-xl">
                    <p className="text-xs text-stone-500 text-center mb-2">Usuarios disponibles:</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                        {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                            <div key={role} className="flex items-center gap-1 text-stone-600">
                                <span>{config.emoji}</span>
                                <span>{config.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Re-export for compatibility
export { getCurrentUser, logout } from '../services/authConfig';
