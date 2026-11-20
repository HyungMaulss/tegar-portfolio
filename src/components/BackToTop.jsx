import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUp } from './Icons';

// Appears after the first screen; sits above the "Ask about Tegar" launcher.
export default function BackToTop() {
    const { t } = useLanguage();
    const [on, setOn] = useState(false);

    useEffect(() => {
        const onScroll = () => setOn(window.scrollY > 600);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <button
            type="button"
            className={`to-top ${on ? 'is-on' : ''}`}
            aria-label={t.footer.top}
            tabIndex={on ? 0 : -1}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <ArrowUp />
        </button>
    );
}
