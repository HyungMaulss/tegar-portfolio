import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import Check from './Check';
import './Contact.css';

export default function Contact() {
    const { t } = useLanguage();
    const [status, setStatus] = useState('idle'); // idle | copied | failed
    const [lead, key] = t.contact.title;

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
        <section className="contact section" id="contact">
            <motion.div
                className="contact__panel container"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
                <span className="heading__label">{t.contact.label}</span>
                <h2 className="contact__title">{lead} <Check>{key}</Check></h2>
                <p className="contact__body">{t.contact.body}</p>

                <a href={`mailto:${profile.email}`} className="contact__email">{profile.email}</a>

                <div className="contact__actions">
                    <button type="button" className="btn btn--solid" onClick={copy}>
                        {status === 'copied' ? t.contact.copied : t.contact.copy}
                    </button>
                    <a href={profile.cv} download className="btn">{t.contact.cv}</a>
                </div>
                <p className="contact__status" role="status">{status === 'failed' ? t.contact.copyFailed : ''}</p>

                <ul className="contact__links">
                    {links.map(([label, href]) => (
                        <li key={label}>
                            <a href={href} target="_blank" rel="noopener noreferrer" className="link">{label}</a>
                        </li>
                    ))}
                </ul>
            </motion.div>
        </section>
    );
}
