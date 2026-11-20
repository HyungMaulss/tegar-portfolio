import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Checked, Unchecked } from './Icons';
import Hl from './Hl';
import './Hero.css';

const EASE = [0.22, 1, 0.36, 1];
const rise = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
});

export default function Hero() {
    const { t } = useLanguage();
    const h = t.hero;
    const c = h.checklist;
    const [before, mark, after] = h.title;

    return (
        <>
            <section id="top" className="hero container">
                <div className="hero__text">
                    <motion.p className="hero__badge" {...rise(0)}>
                        <span className="hero__badge-dot" aria-hidden="true" />{h.badge}
                    </motion.p>
                    <motion.p className="hero__hello" {...rise(0.08)}>{h.hello}</motion.p>
                    <motion.h1 className="hero__title" {...rise(0.16)}>
                        {before} <Hl>{mark}</Hl> {after}
                    </motion.h1>
                    <motion.p className="hero__lede" {...rise(0.26)}>{h.lede}</motion.p>
                    <motion.div className="hero__cta" {...rise(0.36)}>
                        <a href="#work" className="btn btn--ink">{h.ctaWork}<ArrowRight /></a>
                        <a href="#contact" className="btn">{h.ctaContact}</a>
                    </motion.div>
                </div>

                {/* The checklist is the QA idea made visible: four things done, the visitor's release is the open box. */}
                <motion.section
                    className="checklist"
                    aria-label={c.title}
                    initial={{ opacity: 0, y: 32, rotate: 1.5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                >
                    <div className="checklist__head">
                        <p className="checklist__title">{c.title}</p>
                        <p className="checklist__progress">{c.progress}</p>
                    </div>
                    <ul className="checklist__list">
                        {c.items.map(([title, sub], i) => (
                            <li key={title} className="checklist__item" style={{ '--i': i }}>
                                <Checked />
                                <span><strong>{title}</strong><br /><span className="checklist__sub">{sub}</span></span>
                            </li>
                        ))}
                        <li className="checklist__item checklist__item--open">
                            <Unchecked />
                            <a href="#contact" className="text-link">{c.next} →</a>
                        </li>
                    </ul>
                </motion.section>
            </section>

            <section className="facts container" aria-label={t.factsLabel}>
                {t.facts.map(([label, value], i) => (
                    <motion.div
                        key={label}
                        className="fact"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: EASE }}
                    >
                        <p className="fact__label">{label}</p>
                        <p className="fact__value">{value}</p>
                    </motion.div>
                ))}
            </section>
        </>
    );
}
