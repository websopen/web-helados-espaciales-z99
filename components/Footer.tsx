import React from 'react';

interface SocialLinks {
  instagram: string;
  whatsapp: string;
}

interface FooterProps {
  socialLinks?: SocialLinks;
}

export const Footer: React.FC<FooterProps> = ({ socialLinks }) => {
  const hasInstagram = socialLinks?.instagram && socialLinks.instagram.trim() !== '';
  const hasWhatsapp = socialLinks?.whatsapp && socialLinks.whatsapp.trim() !== '';

  const getInstagramUrl = () => {
    if (!socialLinks?.instagram) return '#';
    const handle = socialLinks.instagram.replace('@', '');
    return `https://instagram.com/${handle}`;
  };

  const getWhatsappUrl = () => {
    if (!socialLinks?.whatsapp) return '#';
    return `https://wa.me/${socialLinks.whatsapp}`;
  };

  return (
    <footer className="w-full mt-6 pt-6 pb-24 px-6 border-t border-stone-200 dark:border-stone-800 text-center transition-colors duration-300">
      <div className="max-w-md mx-auto">

        {/* Social Links Section */}
        <div className="mb-5">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-4">
            {hasInstagram || hasWhatsapp ? 'Contacto' : 'Heladería'}
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
                <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <span className="text-[9px] text-stone-400 font-medium">Instagram</span>
              </div>
            )}

            {/* WhatsApp */}
            {hasWhatsapp ? (
              <a
                href={getWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
                <span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium">WhatsApp</span>
              </a>
            ) : (
              <div className="flex flex-col items-center gap-1.5 group cursor-default">
                <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
                <span className="text-[9px] text-stone-400 font-medium">WhatsApp</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-8 h-0.5 bg-stone-100 dark:bg-stone-800 rounded-full mx-auto mb-4"></div>

        {/* Copyright */}
        <p className="text-[10px] text-stone-400 dark:text-stone-600 mb-2">
          © {new Date().getFullYear()} Heladería. Todos los derechos reservados.
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
