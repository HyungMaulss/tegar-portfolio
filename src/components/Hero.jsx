import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import { ArrowRight, Checked, Download } from './Icons';
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
    const [first, last] = profile.name.split(' ');
    const [currentLabel, currentValue] = h.current;

    return (
        <div className="hero-wrap">
            {/* Background shapes: decoration only. */}
            <div className="hero-deco" aria-hidden="true">
                <span className="hero-deco__circle hero-deco__circle--tl" />
                <span className="hero-deco__circle hero-deco__circle--br" />
                <span className="hero-deco__glow" />
                <span className="hero-deco__dots hero-deco__dots--a" />
                <span className="hero-deco__dots hero-deco__dots--b" />
            </div>

            <section id="top" className="hero container">
                <div className="hero__text">
                    <motion.p className="hero__badge" {...rise(0)}>
                        <span className="hero__badge-dot" aria-hidden="true" />{h.badge}
                    </motion.p>
                    <motion.p className="hero__hello" {...rise(0.08)}>{h.hello}</motion.p>
                    <motion.h1 className="hero__name" {...rise(0.14)}>
                        <span>{first}</span>
                        <span>{last}<span className="hero__dot" aria-hidden="true">.</span></span>
                    </motion.h1>
                    <motion.p className="hero__role" {...rise(0.2)}>{h.role}</motion.p>
                    <motion.p className="hero__title" {...rise(0.26)}>
                        {before} <Hl>{mark}</Hl> {after}
                    </motion.p>
                    <motion.p className="hero__lede" {...rise(0.32)}>{h.lede}</motion.p>
                    <motion.div className="hero__cta" {...rise(0.4)}>
                        <a href="#projects" className="btn btn--ink">{h.ctaWork}<ArrowRight /></a>
                        <a href="#contact" className="btn">{h.ctaContact}</a>
                    </motion.div>
                    <motion.a href={profile.resume} download className="text-link hero__resume" {...rise(0.46)}>
                        <Download />{t.nav.resume}
                    </motion.a>
                </div>

                <motion.div
                    className="hero__visual"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
                >
                    <span className="hero__shape" aria-hidden="true" />
                    <span className="hero__outline" aria-hidden="true" />
                    <svg className="hero__spark" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M10 22 4 18M18 12l-2-8M28 14l6-6" />
                    </svg>
                    <img
                        className="hero__photo"
                        src={profile.photo}
                        alt={h.photoAlt}
                        width="760"
                        height="928"
                        fetchPriority="high"
                    />

                    <div className="float float--current">
                        <Checked />
                        <p><span className="float__label">{currentLabel}</span>{currentValue}</p>
                    </div>

                    {/* The QA idea in one glance: four checks done, the visitor's release is the open one. */}
                    <a href="#contact" className="float float--check">
                        <span className="float__row">
                            <strong>{c.title}</strong>
                            <span className="float__label">{c.progress}</span>
                        </span>
                        <span className="float__bar" aria-hidden="true"><span /></span>
                        <span className="float__next">{c.next} →</span>
                    </a>
                </motion.div>
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
        </div>
    );
}
