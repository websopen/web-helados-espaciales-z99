import React from 'react';

interface SocialLinks {
  instagram: string;
  tiktok: string;
  whatsapp: string;
}

interface FooterProps {
  socialLinks?: SocialLinks;
}

export const Footer: React.FC<FooterProps> = ({ socialLinks }) => {
  const hasInstagram = socialLinks?.instagram && socialLinks.instagram.trim() !== '';
  const hasTiktok = socialLinks?.tiktok && socialLinks.tiktok.trim() !== '';

  const getInstagramUrl = () => {
    if (!socialLinks?.instagram) return '#';
    const handle = socialLinks.instagram.replace('@', '');
    return `https://instagram.com/${handle}`;
  };

  const getTiktokUrl = () => {
    if (!socialLinks?.tiktok) return '#';
    const handle = socialLinks.tiktok.replace('@', '');
    return `https://tiktok.com/@${handle}`;
  };

  return (
    <footer className="w-full mt-6 pt-6 pb-24 px-6 border-t border-stone-200 dark:border-stone-800 text-center transition-colors duration-300">
      <div className="max-w-md mx-auto">

        {/* Social Links Section */}
        <div className="mb-5">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-4">
            {hasInstagram || hasTiktok ? 'Seguinos' : 'Próximamente'}
          </h4>
          <div className="flex justify-center gap-6">
            {/* Instagram */}
            {hasInstagram ? (
              <a
                href={getInstagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium">Instagram</span>
              </a>
            ) : (
              <div className="flex flex-col items-center gap-1.5 group cursor-default">
                <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:text-pink-500 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <span className="text-[9px] text-stone-400 font-medium">Instagram</span>
              </div>
            )}

            {/* TikTok */}
            {hasTiktok ? (
              <a
                href={getTiktokUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                </div>
                <span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium">TikTok</span>
              </a>
            ) : (
              <div className="flex flex-col items-center gap-1.5 group cursor-default">
                <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:text-black dark:group-hover:text-white group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                </div>
                <span className="text-[9px] text-stone-400 font-medium">TikTok</span>
              </div>
            )}

            <div className="flex flex-col items-center gap-1.5 group cursor-default">
              <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:text-purple-500 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"></path></svg>
              </div>
              <span className="text-[9px] text-stone-400 font-medium">Sabores</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-8 h-0.5 bg-stone-100 dark:bg-stone-800 rounded-full mx-auto mb-4"></div>

        {/* Copyright */}
        <p className="text-[10px] text-stone-400 dark:text-stone-600 mb-2">
          © {new Date().getFullYear()} Marti. Todos los derechos reservados.
        </p>

        {/* Developer Branding */}
        <a
          href="https://www.websopen.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors duration-300 group opacity-60 hover:opacity-100"
        >
          <span className="text-[9px] text-stone-500 dark:text-stone-500 font-medium group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors">
            Created by
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors tracking-tight">
              WebsOpen
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-400 group-hover:bg-blue-500 transition-colors"></span>
          </div>
        </a>

      </div>
    </footer>
  );
};
