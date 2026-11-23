import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
    const { t } = useLanguage();
    const links = [
        [t.contact.linkedin, profile.linkedin],
        [t.contact.github, profile.github],
    ];

    return (
        <footer className="footer container">
            <p className="footer__brand">
                <Logo variant="mark" title="" />
                <span>© {new Date().getFullYear()} {profile.name} · {t.footer.place}</span>
            </p>
            <ul className="footer__links">
                {links.map(([label, href]) => (
                    <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" className="text-link">{label}</a></li>
                ))}
                <li><a href={`mailto:${profile.email}`} className="text-link">Email</a></li>
            </ul>
        </footer>
    );
}
