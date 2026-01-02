import { SOCIAL_CONFIG } from '@/lib/social-config';

export function Footer() {
  return (
    <footer className="w-full mt-auto pt-16 pb-20 flex flex-col items-center gap-8 border-t border-white/5">
      {/* Socials / Contact */}
      <div className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
        <a href={SOCIAL_CONFIG.twitter.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="X (Twitter)">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href={SOCIAL_CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Instagram">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>
        </a>
        <a href={SOCIAL_CONFIG.email.url} className="hover:text-primary transition-colors" aria-label="Email">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </a>
      </div>
      
      <div className="text-center text-text-muted text-[10px] md:text-xs opacity-30 tracking-[0.3em] uppercase">
        <p>© {new Date().getFullYear()} LingoGames • Daily Challenges</p>
      </div>
    </footer>
  );
}
