import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import { ThemeToggle, LanguageSwitch } from './Toggles';
import { Menu, Close } from './Icons';
import DownloadMenu from './DownloadMenu';
import Logo from './Logo';
import './Navbar.css';

const LINKS = [
    ['about', 'about'],
    ['experience', 'experience'],
    ['projects', 'projects'],
    ['contact', 'contact'],
];

export default function Navbar() {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    const close = () => setOpen(false);

    return (
        <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
            <nav className="nav__inner container" aria-label="Primary">
                <a href="#top" className="nav__brand" aria-label={t.nav.home} onClick={close}>
                    <Logo variant="mark" title="" />
                    <span className="nav__name">
                        {profile.name.split(' ').map((part) => <span key={part}>{part}</span>)}
                    </span>
                </a>

                <div id="nav-menu" className="nav__menu">
                    <ul className="nav__links">
                        {LINKS.map(([key, id]) => (
                            <li key={id}><a href={`#${id}`} className="nav__link" onClick={close}>{t.nav[key]}</a></li>
                        ))}
                    </ul>
                    <div className="nav__tools">
                        <LanguageSwitch />
                        <ThemeToggle />
                        <DownloadMenu />
                    </div>
                </div>

                <div className="nav__mobile">
                    <DownloadMenu className="dl--short" />
                    <button
                        type="button"
                        className="nav__toggle"
                        aria-expanded={open}
                        aria-controls="nav-menu"
                        aria-label={open ? t.nav.close : t.nav.menu}
                        onClick={() => setOpen((o) => !o)}
                    >
                        {open ? <Close /> : <Menu />}
                    </button>
                </div>
            </nav>
        </header>
    );
}
