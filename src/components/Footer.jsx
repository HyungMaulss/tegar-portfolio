import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="footer">
            <div className="footer__inner container mono">
                <span>© {new Date().getFullYear()} Tegar Maulana. {t.footer.built}</span>
                <a href="#top" className="link">{t.footer.top} ↑</a>
            </div>
        </footer>
    );
}
