import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { sourceIds } from '../data/profile';
import { reveal } from '../lib/motion';
import { ArrowRight } from './Icons';
import './Projects.css';

// Same replayed run the code viewer shows for the Cypress suite (src/data/codeSnippets.jsx).
const RUN = [
    ['should login with valid credentials', '1.8s', ['POST /api/auth/login → 200 OK', 'Redirected to /dashboard', 'Welcome message verified']],
    ['should add item to cart', '2.3s', ['Login via API → 200 OK', 'Navigated to /products', 'Added to cart → badge shows "1"']],
];

function Run({ label }) {
    return (
        <div className="run" aria-label={`${label}: cypress-e2e.cy.js, 2 passing`}>
            <p className="run__head"><span>cypress-e2e.cy.js</span><span>{label}</span></p>
            <ul className="run__lines" aria-hidden="true">
                {RUN.map(([name, time, steps], i) => (
                    <motion.li
                        key={name}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.4 }}
                    >
                        <p className="run__test"><span className="run__ok">✓</span>{name}<span className="run__time">{time}</span></p>
                        {steps.map((step) => <p key={step} className="run__step">↳ {step}</p>)}
                    </motion.li>
                ))}
            </ul>
            <p className="run__sum" aria-hidden="true"><span className="run__ok">2 passing</span> · 0 failing<span className="run__time">4.1s</span></p>
        </div>
    );
}

export default function Projects() {
    const { t } = useLanguage();
    const p = t.projects;

    return (
        <section id="projects" className="section container">
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
                                <Run label={p.sampleRun} />
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
