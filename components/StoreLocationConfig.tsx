import React, { useState } from 'react';

export interface StoreLocation {
    address: string;
    lat: number;
    lng: number;
}

interface StoreLocationConfigProps {
    location: StoreLocation;
    onChange: (location: StoreLocation) => void;
}

export const DEFAULT_LOCATION: StoreLocation = {
    address: '',
    lat: -34.6037,  // Buenos Aires default
    lng: -58.3816
};

// Compact version - no expand button, inline layout
export const StoreLocationConfig: React.FC<StoreLocationConfigProps> = ({ location, onChange }) => {
    const [isSearching, setIsSearching] = useState(false);

    const handleAddressSearch = async () => {
        if (!location.address.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location.address)}&limit=1`,
                { headers: { 'Accept-Language': 'es' } }
            );
            const data = await response.json();

            if (data.length > 0) {
                onChange({
                    address: data[0].display_name || location.address,
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                });
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
        setIsSearching(false);
    };

    return (
        <div className="space-y-3">
            {/* Address Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={location.address}
                    onChange={(e) => onChange({ ...location, address: e.target.value })}
                    placeholder="Dirección del local..."
                    className="flex-1 bg-stone-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-stone-500"
                />
                <button
                    onClick={handleAddressSearch}
                    disabled={isSearching}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium disabled:opacity-50"
                >
                    {isSearching ? '...' : '🔍'}
                </button>
            </div>

            {/* Coordinates */}
            {location.lat && location.lng && (
                <div className="flex items-center justify-between bg-stone-800 rounded-xl p-3">
                    <div className="text-xs text-stone-400">
                        <span className="mr-4">📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                    </div>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                        Ver en Maps →
                    </a>
                </div>
            )}
        </div>
    );
};

// Format location for display
export const formatLocationLink = (location: StoreLocation): string => {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
};
