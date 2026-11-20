import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="footer container">
            <span>© {new Date().getFullYear()} Tegar Maulana · {t.footer.place}</span>
            <a href="#top" className="text-link">{t.footer.top} ↑</a>
        </footer>
    );
}
