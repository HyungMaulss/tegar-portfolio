import { useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import { Download } from './Icons';
import './DownloadMenu.css';

// Disclosure menu: CV, portfolio PDF and portfolio slides. Closes on outside click, Escape or a pick.
export default function DownloadMenu({ className = '' }) {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const id = useId();
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            setOpen(false);
            ref.current?.querySelector('button')?.focus();
        };
        document.addEventListener('pointerdown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const items = [
        ['cv', profile.cv],
        ['deckPdf', profile.deckPdf],
        ['deckPpt', profile.deckPpt],
    ];

    return (
        <div className={`dl ${className}`} ref={ref}>
            <button type="button" className="btn btn--sun dl__btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
                {t.nav.download}<Download />
            </button>
            <ul id={id} className="dl__menu" hidden={!open}>
                {items.map(([key, href]) => {
                    const [label, format] = t.nav.downloads[key];
                    return (
                        <li key={key}>
                            <a href={href} download onClick={() => setOpen(false)}>
                                <span>{label}</span>{' '}
                                <span className="dl__format">{format}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
