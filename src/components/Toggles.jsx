import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Toggles.css';

export function ThemeToggle() {
    const { t } = useLanguage();
    // index.html sets data-theme before paint; read it back instead of duplicating the logic.
    const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
    const next = theme === 'dark' ? 'light' : 'dark';

    const toggle = () => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch { /* private mode */ }
        setTheme(next);
    };

    return (
        <button type="button" className="toggle theme-toggle" onClick={toggle} aria-label={next === 'dark' ? t.theme.toDark : t.theme.toLight}>
            <span className="theme-toggle__icon" data-theme={theme} aria-hidden="true" />
        </button>
    );
}

export function LanguageSwitch() {
    const { language, setLanguage, t } = useLanguage();
    return (
        <div className="lang-switch" role="group" aria-label={t.lang.label}>
            {['en', 'id'].map((code) => (
                <button
                    key={code}
                    type="button"
                    className="toggle"
                    aria-pressed={language === code}
                    onClick={() => setLanguage(code)}
                >
                    {code.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
