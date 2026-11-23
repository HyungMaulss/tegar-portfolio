import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import { reveal } from '../lib/motion';
import { Download } from './Icons';
import './Contact.css';

export default function Contact() {
    const { t } = useLanguage();
    const c = t.contact;
    const [status, setStatus] = useState('idle'); // idle | copied | failed
    const [lead, accent] = c.title;

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
        [c.linkedin, profile.linkedin],
        [c.github, profile.github],
        [c.whatsapp, profile.whatsapp],
    ];

    return (
        <section id="contact" className="section container contact">
            <motion.div className="contact__panel" {...reveal()}>
                <span className="contact__ring" aria-hidden="true" />
                <span className="contact__dots" aria-hidden="true" />
                <div className="contact__main">
                    <p className="eyebrow">{c.label}</p>
                    <h2 className="contact__title">{lead} <span className="contact__accent">{accent}</span></h2>
                    <p className="contact__body">{c.body}</p>
                    <a href={`mailto:${profile.email}`} className="contact__email">{profile.email}</a>
                </div>
                <div className="contact__side">
                    <button type="button" className="btn btn--sun" onClick={copy}>
                        {status === 'copied' ? c.copied : c.copy}
                    </button>
                    <a href={profile.cv} download className="btn contact__cv">{c.cv}</a>
                    <a href={profile.resume} download className="text-link contact__resume"><Download />{t.nav.resume}</a>
                    <p className="contact__status" role="status">{status === 'failed' ? c.copyFailed : ''}</p>
                    <ul className="contact__links">
                        {links.map(([label, href]) => (
                            <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" className="text-link">{label}</a></li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </section>
    );
}
