import React from 'react';

export interface PromoBannerConfig {
    enabled: boolean;
    text: string;
    gradient: 'warm' | 'cool' | 'rainbow' | 'custom';
    customGradient?: string;
    textColor?: string;
}

interface PromoBannerProps {
    config: PromoBannerConfig;
}

const GRADIENTS = {
    warm: 'bg-gradient-to-r from-yellow-200 via-orange-100 to-yellow-200',
    cool: 'bg-gradient-to-r from-blue-200 via-cyan-100 to-blue-200',
    rainbow: 'bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300',
    custom: '',
};

const TEXT_COLORS = {
    warm: 'text-orange-900',
    cool: 'text-blue-900',
    rainbow: 'text-purple-900',
    custom: 'text-stone-900',
};

export const PromoBanner: React.FC<PromoBannerProps> = ({ config }) => {
    if (!config.enabled || !config.text.trim()) return null;

    const gradientClass = config.gradient === 'custom'
        ? config.customGradient || GRADIENTS.rainbow
        : GRADIENTS[config.gradient];

    const textColorClass = config.gradient === 'custom'
        ? config.textColor || TEXT_COLORS.custom
        : TEXT_COLORS[config.gradient];

    // Repeat content for infinite scroll effect
    const displayContent = `${config.text} • ${config.text} • ${config.text} • ${config.text}`;

    return (
        <div className={`fixed top-20 left-0 right-0 z-[35] h-8 flex items-center overflow-hidden shadow-sm border-b border-white/20 ${gradientClass}`}>
            <div className="w-full whitespace-nowrap overflow-hidden flex">
                <div className={`animate-marquee inline-block font-bold text-xs tracking-widest uppercase ${textColorClass}`}>
                    {displayContent}
                </div>
            </div>
        </div>
    );
};

// Add marquee keyframes to index.css or inline
export const MARQUEE_STYLES = `
@keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
}
.animate-marquee {
    animation: marquee 25s linear infinite;
}
`;
