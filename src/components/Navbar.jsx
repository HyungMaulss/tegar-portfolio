import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import { ThemeToggle, LanguageSwitch } from './Toggles';
import './Navbar.css';

const SECTIONS = ['about', 'experience', 'projects', 'skills', 'contact'];

export default function Navbar() {
    const { t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState('');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        // Active link = the section crossing the upper third of the viewport.
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
            { rootMargin: '-30% 0px -65% 0px' },
        );
        SECTIONS.forEach((id) => document.getElementById(id) && io.observe(document.getElementById(id)));
        return () => {
            window.removeEventListener('scroll', onScroll);
            io.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
            <nav className="nav__inner container" aria-label="Primary">
                <a href="#top" className="nav__mark" aria-label={t.nav.home} onClick={() => setOpen(false)}>
                    TM<span aria-hidden="true">.</span>
                </a>

                <ul id="nav-menu" className="nav__links">
                    {SECTIONS.map((id, i) => (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                className="nav__link"
                                aria-current={active === id ? 'location' : undefined}
                                onClick={() => setOpen(false)}
                            >
                                <span className="nav__num mono" aria-hidden="true">0{i + 1}</span>
                                {t.nav[id]}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="nav__tools">
                    <a href={profile.cv} download className="nav__cv link">{t.nav.cv}</a>
                    <LanguageSwitch />
                    <ThemeToggle />
                    <button
                        type="button"
                        className="nav__burger toggle"
                        aria-expanded={open}
                        aria-controls="nav-menu"
                        aria-label={open ? t.nav.close : t.nav.menu}
                        onClick={() => setOpen((o) => !o)}
                    >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </button>
                </div>
            </nav>
        </header>
    );
}
