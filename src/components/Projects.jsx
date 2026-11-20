import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { sourceIds } from '../data/profile';
import { reveal } from '../lib/motion';
import { ArrowRight } from './Icons';
import './Projects.css';

export default function Projects() {
    const { t } = useLanguage();
    const p = t.projects;

    return (
        <section id="work" className="section container">
            <motion.div className="work__head" {...reveal()}>
                <div>
                    <p className="eyebrow">{p.label}</p>
                    <h2 className="h2">{p.title}</h2>
                </div>
                <p className="work__note">{p.note}</p>
            </motion.div>

            <ul className="work__grid">
                {p.items.map((item, i) => {
                    const hasSource = sourceIds.includes(item.id);
                    // The first project is featured: Cypress is the tool of the current job.
                    if (i === 0) {
                        return (
                            <motion.li key={item.id} className="card card--feat" {...reveal()}>
                                <div className="card__top">
                                    <span className="card__badge">{p.featured} · {item.type}</span>
                                    <span>{item.tags.join(' · ')}</span>
                                </div>
                                <div className="card__spacer" />
                                <h3 className="card__title card__title--feat">{item.title}</h3>
                                <p className="card__desc">{item.desc}</p>
                                {hasSource && <Link to={`/code/${item.id}`} className="btn btn--ink card__btn">{p.source}<ArrowRight /></Link>}
                            </motion.li>
                        );
                    }
                    return (
                        <motion.li key={item.id} className="card" {...reveal((i % 3) * 0.08)}>
                            <p className="card__type">{item.type}</p>
                            <div className="card__spacer" />
                            <h3 className="card__title">{item.title}</h3>
                            <p className="card__desc card__desc--muted">{item.desc}</p>
                            <div className="card__foot">
                                <span className="card__tags">{item.tags.slice(0, 2).join(' · ')}</span>
                                {hasSource && <Link to={`/code/${item.id}`} className="text-link">{p.sourceShort} →</Link>}
                            </div>
                        </motion.li>
                    );
                })}
            </ul>
        </section>
    );
}
