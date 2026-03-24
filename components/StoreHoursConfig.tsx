import React from 'react';

export interface StoreHours {
    [key: string]: {
        open: string;
        close: string;
        closed: boolean;
    };
}

interface StoreHoursConfigProps {
    hours: StoreHours;
    onChange: (hours: StoreHours) => void;
}

const DAYS = [
    { key: 'lunes', label: 'Lu' },
    { key: 'martes', label: 'Ma' },
    { key: 'miercoles', label: 'Mi' },
    { key: 'jueves', label: 'Ju' },
    { key: 'viernes', label: 'Vi' },
    { key: 'sabado', label: 'Sa' },
    { key: 'domingo', label: 'Do' },
];

export const DEFAULT_HOURS: StoreHours = {
    lunes: { open: '10:00', close: '22:00', closed: false },
    martes: { open: '10:00', close: '22:00', closed: false },
    miercoles: { open: '10:00', close: '22:00', closed: false },
    jueves: { open: '10:00', close: '22:00', closed: false },
    viernes: { open: '10:00', close: '23:00', closed: false },
    sabado: { open: '11:00', close: '23:00', closed: false },
    domingo: { open: '12:00', close: '21:00', closed: false },
};

// Compact version - always visible, no expand button
export const StoreHoursConfig: React.FC<StoreHoursConfigProps> = ({ hours, onChange }) => {
    const updateDay = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
        onChange({
            ...hours,
            [day]: {
                ...hours[day],
                [field]: value
            }
        });
    };

    const toggleClosed = (day: string) => {
        updateDay(day, 'closed', !hours[day]?.closed);
    };

    return (
        <div className="space-y-2">
            {/* Days in compact grid */}
            {DAYS.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2 bg-stone-800 rounded-lg p-2">
                    <span className="text-xs text-stone-300 w-8 font-bold">{label}</span>

                    <button
                        onClick={() => toggleClosed(key)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${hours[key]?.closed
                            ? 'bg-red-500/30 text-red-400'
                            : 'bg-emerald-500/30 text-emerald-400'
                            }`}
                    >
                        {hours[key]?.closed ? '✕' : '✓'}
                    </button>

                    {!hours[key]?.closed && (
                        <>
                            <input
                                type="time"
                                value={hours[key]?.open || '10:00'}
                                onChange={(e) => updateDay(key, 'open', e.target.value)}
                                className="bg-stone-700 text-white text-xs rounded px-2 py-1 flex-1"
                            />
                            <span className="text-stone-500 text-xs">-</span>
                            <input
                                type="time"
                                value={hours[key]?.close || '22:00'}
                                onChange={(e) => updateDay(key, 'close', e.target.value)}
                                className="bg-stone-700 text-white text-xs rounded px-2 py-1 flex-1"
                            />
                        </>
                    )}

                    {hours[key]?.closed && (
                        <span className="text-xs text-red-400 italic">Cerrado</span>
                    )}
                </div>
            ))}
        </div>
    );
};

// Helper to check if store is currently open
export const isStoreOpenNow = (hours: StoreHours): boolean => {
    const now = new Date();
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const today = days[now.getDay()];
    const dayHours = hours[today];

    if (!dayHours || dayHours.closed) return false;

    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= dayHours.open && currentTime <= dayHours.close;
};

// Format hours for display
export const formatTodayHours = (hours: StoreHours): string => {
    const now = new Date();
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const today = days[now.getDay()];
    const dayHours = hours[today];

    if (!dayHours || dayHours.closed) return 'Cerrado hoy';
    return `Hoy: ${dayHours.open} - ${dayHours.close}`;
};
