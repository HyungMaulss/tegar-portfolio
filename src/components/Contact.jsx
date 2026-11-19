import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import SectionHeader from './SectionHeader';
import './Contact.css';

export default function Contact() {
    const { t } = useLanguage();
    const [status, setStatus] = useState('idle'); // idle | copied | failed

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(profile.email);
            setStatus('copied');
        } catch {
            setStatus('failed');
        }
        setTimeout(() => setStatus('idle'), 2500);
    };

    const links = [
        [t.contact.linkedin, profile.linkedin],
        [t.contact.github, profile.github],
        [t.contact.whatsapp, profile.whatsapp],
    ];

    return (
        <section className="contact" id="contact">
            <div className="container">
                <SectionHeader index="05" label={t.contact.label} title={t.contact.title} />
                <p className="contact__body">{t.contact.body}</p>

                <motion.div
                    className="contact__mail"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <a href={`mailto:${profile.email}`} className="contact__email" data-inspect="a.mailto">
                        {profile.email}
                    </a>
                    <div className="contact__copy">
                        <button type="button" className="btn" onClick={copy}>
                            {status === 'copied' ? `✓ ${t.contact.copied}` : t.contact.copy}
                        </button>
                        <p className="contact__status mono" role="status">
                            {status === 'failed' ? t.contact.copyFailed : ''}
                        </p>
                    </div>
                </motion.div>

                <ul className="contact__links">
                    {links.map(([label, href]) => (
                        <li key={label}>
                            <a href={href} target="_blank" rel="noopener noreferrer" className="contact__link" data-inspect="a.external">
                                <span>{label}</span>
                                <span className="contact__arrow" aria-hidden="true">↗</span>
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href={profile.cv} download className="contact__link" data-inspect="a.download">
                            <span>{t.contact.cv}</span>
                            <span className="contact__arrow" aria-hidden="true">↓</span>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    );
}
