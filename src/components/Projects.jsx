import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { sourceIds } from '../data/profile';
import SectionHeader from './SectionHeader';
import './Projects.css';

// A numbered list, not cards: projects with readable source are whole-row links, the rest are plain rows.
export default function Projects() {
    const { t } = useLanguage();
    const items = t.projects.items;

    return (
        <section className="projects" id="projects">
            <div className="container">
                <SectionHeader
                    index="03"
                    label={t.projects.label}
                    title={t.projects.title}
                    meta={`${sourceIds.length}/${items.length} ${t.projects.sourceNote}`}
                />
                <ol className="plist">
                    {items.map((p, i) => {
                        const hasSource = sourceIds.includes(p.id);
                        return (
                            <motion.li
                                key={p.id}
                                className={`plist__item ${hasSource ? 'has-source' : ''}`}
                                data-inspect={hasSource ? 'a.project' : 'li.project'}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.6, delay: (i % 3) * 0.06 }}
                            >
                                <span className="plist__num mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                                <div className="plist__main">
                                    <h3 className="plist__title">
                                        {hasSource ? (
                                            <Link to={`/code/${p.id}`} className="plist__link">
                                                {p.title}
                                                <span className="visually-hidden">, {t.projects.source}</span>
                                            </Link>
                                        ) : p.title}
                                    </h3>
                                    <p className="plist__desc">{p.desc}</p>
                                </div>
                                <div className="plist__side">
                                    <span className="plist__type mono">{p.type}</span>
                                    <div className="tags">
                                        {p.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                                    </div>
                                    {hasSource && <span className="plist__cta mono" aria-hidden="true">{t.projects.source} ↗</span>}
                                </div>
                            </motion.li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
