import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import { ArrowRight } from './Icons';
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
    const [before, mark, after] = h.title;
    const [first, last] = profile.name.split(' ');

    return (
        <div className="hero-wrap">
            {/* Background shapes: decoration only. */}
            <div className="hero-deco" aria-hidden="true">
                <span className="hero-deco__circle hero-deco__circle--tl" />
                <span className="hero-deco__glow" />
                <span className="hero-deco__dots hero-deco__dots--a" />
            </div>

            <section id="top" className="hero container">
                <div className="hero__text">
                    <motion.p className="hero__hello" {...rise(0.08)}>{h.hello}</motion.p>
                    <motion.h1 className="hero__name" {...rise(0.14)}>
                        <span>{first}</span>
                        <span>{last}<span className="hero__dot" aria-hidden="true">.</span></span>
                    </motion.h1>
                    <motion.p className="hero__role" {...rise(0.2)}>{h.role}</motion.p>
                    <motion.p className="hero__title" {...rise(0.26)}>
                        {before} <Hl>{mark}</Hl> {after}
                    </motion.p>
                    <motion.div className="hero__cta" {...rise(0.4)}>
                        <a href="#projects" className="btn btn--ink">{h.ctaWork}<ArrowRight /></a>
                        <a href="#contact" className="btn">{h.ctaContact}</a>
                    </motion.div>
                </div>

                <motion.div
                    className="hero__visual"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
                >
                    <span className="hero__shape" aria-hidden="true" />
                    <img
                        className="hero__photo"
                        src={profile.photo}
                        alt={h.photoAlt}
                        width="760"
                        height="928"
                        fetchPriority="high"
                    />

                    <p className="float">
                        <span className="float__dot" aria-hidden="true" />{h.badge}
                    </p>
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
