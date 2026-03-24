import React from 'react';
import { SocialLinks, BusinessInfo } from '../services/storeService';
import { StoreHours } from './StoreHoursConfig';
import { StoreLocation, formatLocationLink } from './StoreLocationConfig';

interface ClientSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    socialLinks: SocialLinks;
    storeHours?: StoreHours;
    storeLocation?: StoreLocation;
    storeOpen: boolean;
    businessInfo?: BusinessInfo;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({
    isOpen,
    onClose,
    socialLinks,
    storeHours,
    storeLocation,
    storeOpen,
    businessInfo
}) => {
    if (!isOpen) return null;

    const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] as const;
    const dayLabels: Record<string, string> = {
        lunes: 'Lun',
        martes: 'Mar',
        miércoles: 'Mié',
        jueves: 'Jue',
        viernes: 'Vie',
        sábado: 'Sáb',
        domingo: 'Dom'
    };

    // Helper functions for URLs
    const getInstagramUrl = () => socialLinks?.instagram ? `https://instagram.com/${socialLinks.instagram.replace('@', '')}` : '#';
    const getWhatsappUrl = () => socialLinks?.whatsapp ? `https://wa.me/${socialLinks.whatsapp}` : '#';
    const getTiktokUrl = () => socialLinks?.tiktok ? `https://tiktok.com/@${socialLinks.tiktok.replace('@', '')}` : '#';
    const getFacebookUrl = () => socialLinks?.facebook ? (socialLinks.facebook.startsWith('http') ? socialLinks.facebook : `https://facebook.com/${socialLinks.facebook}`) : '#';

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55]"
                onClick={onClose}
            />

            {/* Sidebar - Elegant Light Marble Design */}
            <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-stone-50 z-[56] shadow-2xl animate-slide-in-left flex flex-col border-r border-stone-200">

                {/* Header: Banner + Logo + Status - RESTORED */}
                <div className="flex-shrink-0">
                    {/* Banner Image */}
                    <div className="w-full h-28 overflow-hidden">
                        <img
                            src="https://i.imgur.com/uG9pQ8q.jpeg"
                            alt="Banner Heladería"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Logo and Status */}
                    <div className="relative flex flex-col items-center -mt-10 px-4 pb-3 border-b border-stone-200">
                        {/* Logo */}
                        <div className="w-20 h-20 rounded-full overflow-hidden shadow-xl border-4 border-white mb-2 relative z-10 bg-white">
                            <img
                                src="/logo-monte-bianco.jpg"
                                alt="Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h2 className="text-stone-800 font-serif text-lg font-bold tracking-wide">
                            Heladería Artesanal
                        </h2>

                        {/* Status Badge - RESTORED */}
                        <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${storeOpen
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                            {storeOpen ? '🟢 Abierto ahora' : '🔴 Cerrado'}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-marble">

                    {/* Store Hours Section */}
                    {storeHours && (
                        <div className="px-4 py-3 border-b border-stone-200 bg-white/80">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">🕐 Horarios</h3>
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {days.map(day => {
                                    const schedule = storeHours[day];
                                    if (!schedule) return null;
                                    const isToday = new Date().toLocaleDateString('es-AR', { weekday: 'long' }).toLowerCase() === day;
                                    return (
                                        <div key={day} className={`flex flex-col py-1 rounded ${isToday ? 'bg-emerald-50 ring-1 ring-emerald-200' : ''}`}>
                                            <span className={`text-[9px] font-bold ${isToday ? 'text-emerald-600' : 'text-stone-400'}`}>{dayLabels[day]}</span>
                                            {schedule.closed ? (
                                                <span className="text-[9px] text-red-400">—</span>
                                            ) : (
                                                <>
                                                    <span className="text-[10px] font-medium text-stone-700">{schedule.open?.slice(0, 5)}</span>
                                                    <span className="text-[9px] text-stone-400">{schedule.close?.slice(0, 5)}</span>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Location */}
                    {storeLocation?.address && (
                        <a
                            href={formatLocationLink(storeLocation)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 border-b border-stone-200 flex items-center gap-3 hover:bg-white/80 transition-colors group bg-white/60"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-stone-700 truncate">{storeLocation.address}</p>
                                <p className="text-[10px] text-emerald-600 group-hover:text-emerald-700">Ver en Google Maps →</p>
                            </div>
                        </a>
                    )}

                    {/* Social Icons */}
                    <div className="px-4 py-4 flex-1 bg-white/60">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 text-center">📱 Contacto</h3>
                        <div className="flex justify-center gap-3 flex-wrap">
                            {/* Instagram */}
                            {socialLinks.instagram && (
                                <a href={getInstagramUrl()} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                                    </div>
                                    <span className="text-[9px] text-stone-500 font-medium">Instagram</span>
                                </a>
                            )}

                            {/* WhatsApp */}
                            {socialLinks.whatsapp && (
                                <a href={getWhatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                                    <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    </div>
                                    <span className="text-[9px] text-stone-500 font-medium">WhatsApp</span>
                                </a>
                            )}

                            {/* Phone */}
                            {socialLinks.phone && (
                                <a href={`tel:${socialLinks.phone}`} className="flex flex-col items-center gap-1 group">
                                    <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </div>
                                    <span className="text-[9px] text-stone-500 font-medium">Llamar</span>
                                </a>
                            )}

                            {/* TikTok */}
                            {socialLinks.tiktok && (
                                <a href={getTiktokUrl()} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                                    <div className="w-11 h-11 rounded-full bg-stone-800 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                                    </div>
                                    <span className="text-[9px] text-stone-500 font-medium">TikTok</span>
                                </a>
                            )}

                            {/* Facebook */}
                            {socialLinks.facebook && (
                                <a href={getFacebookUrl()} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                                    <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    </div>
                                    <span className="text-[9px] text-stone-500 font-medium">Facebook</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer - Always visible at bottom */}
                <div className="flex-shrink-0 mt-auto bg-stone-100 border-t border-stone-200">

                    {/* Payment Methods */}
                    <div className="px-4 py-2 border-b border-stone-200">
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-[9px] text-stone-400 uppercase tracking-wider font-medium">Aceptamos:</span>
                            <div className="flex gap-2">
                                <span className="text-base" title="Efectivo">💵</span>
                                <span className="text-base" title="Tarjetas">💳</span>
                                <span className="text-base" title="Transferencia">🏦</span>
                                <span className="text-base" title="MercadoPago">📱</span>
                            </div>
                        </div>
                    </div>

                    {/* Business Info & Legal */}
                    <div className="px-4 py-2 space-y-1.5">
                        {/* CUIT */}
                        {businessInfo?.cuit && (
                            <p className="text-[9px] text-stone-400 text-center font-mono">CUIT: {businessInfo.cuit}</p>
                        )}

                        {/* Consumer Rights */}
                        <div className="flex justify-center gap-2 flex-wrap">
                            {businessInfo?.complaintsBookUrl && (
                                <a
                                    href={businessInfo.complaintsBookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[9px] text-stone-400 hover:text-stone-700 transition-colors underline underline-offset-2"
                                >
                                    Libro de Quejas
                                </a>
                            )}
                            <span className="text-stone-300">|</span>
                            <a
                                href="https://www.argentina.gob.ar/produccion/defensadelconsumidor"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] text-stone-400 hover:text-stone-700 transition-colors underline underline-offset-2"
                            >
                                Defensa del Consumidor
                            </a>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="bg-[#14532D] py-2">
                        <p className="text-center text-emerald-200/70 text-[9px]">
                            © {new Date().getFullYear()} Heladería Artesanal · Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
