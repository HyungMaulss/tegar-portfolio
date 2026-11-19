import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import { ThemeToggle, LanguageSwitch } from './Toggles';
import Logo from './Logo';
import './Navbar.css';

const LINKS = [
    ['about', 'about'],
    ['experience', 'experience'],
    ['work', 'projects'],
    ['contact', 'contact'],
];

export default function Navbar() {
    const { t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState('');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
            { rootMargin: '-35% 0px -60% 0px' },
        );
        LINKS.forEach(([, id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
        return () => {
            window.removeEventListener('scroll', onScroll);
            io.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open]);

    const close = () => setOpen(false);

    return (
        <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
            <nav className="nav__inner container" aria-label="Primary">
                <a href="#top" className="nav__logo" aria-label={t.nav.home} onClick={close}>
                    <Logo />
                </a>

                <div id="nav-menu" className="nav__menu">
                    <ul className="nav__links">
                        {LINKS.map(([key, id]) => (
                            <li key={id}>
                                <a href={`#${id}`} className="nav__link" aria-current={active === id ? 'location' : undefined} onClick={close}>
                                    {t.nav[key]}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="nav__tools">
                        <LanguageSwitch />
                        <ThemeToggle />
                        <a href={profile.cv} download className="btn nav__cv">{t.nav.cv}</a>
                    </div>
                </div>

                <button
                    type="button"
                    className="nav__toggle"
                    aria-expanded={open}
                    aria-controls="nav-menu"
                    onClick={() => setOpen((o) => !o)}
                >
                    {open ? t.nav.close : t.nav.menu}
                </button>
            </nav>
        </header>
    );
}
