import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { sourceIds } from '../data/profile';
import SectionHeader from './SectionHeader';
import Check from './Check';
import './Projects.css';

// The first card is wide: Cypress is the tool of the current job, so it leads.
export default function Projects() {
    const { t } = useLanguage();
    const [lead, key] = t.projects.title;

    return (
        <section className="projects section" id="projects">
            <div className="container">
                <SectionHeader label={t.projects.label}>
                    {lead} <Check>{key}</Check>
                </SectionHeader>

                <ul className="cards">
                    {t.projects.items.map((p, i) => {
                        const hasSource = sourceIds.includes(p.id);
                        return (
                            <motion.li
                                key={p.id}
                                className={`card ${hasSource ? 'has-link' : ''}`}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <p className="card__type">{p.type}</p>
                                <h3 className="card__title">
                                    {hasSource ? <Link to={`/code/${p.id}`} className="card__link">{p.title}</Link> : p.title}
                                </h3>
                                <p className="card__desc">{p.desc}</p>
                                <div className="card__foot">
                                    <p className="card__stack">{p.tags.join(' · ')}</p>
                                    {hasSource && <span className="card__cta" aria-hidden="true">{t.projects.source}</span>}
                                </div>
                            </motion.li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
