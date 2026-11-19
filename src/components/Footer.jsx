import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="footer">
            <div className="footer__inner container">
                <Logo className="footer__logo" />
                <a href="#top" className="link footer__top">{t.footer.top}</a>
            </div>
        </footer>
    );
}
