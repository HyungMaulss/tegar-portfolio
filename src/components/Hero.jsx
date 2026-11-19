import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import Check from './Check';
import './Hero.css';

const EASE = [0.22, 1, 0.36, 1];
const rise = (delay) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
});

export default function Hero() {
    const { t } = useLanguage();
    const visualRef = useRef(null);

    // Gentle depth: photo and arch drift in opposite directions with the pointer.
    useEffect(() => {
        const el = visualRef.current;
        if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const section = el.closest('section');
        let raf = 0;
        const move = (e) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const r = section.getBoundingClientRect();
                el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
                el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
            });
        };
        const reset = () => { el.style.setProperty('--px', 0); el.style.setProperty('--py', 0); };
        section.addEventListener('pointermove', move);
        section.addEventListener('pointerleave', reset);
        return () => {
            section.removeEventListener('pointermove', move);
            section.removeEventListener('pointerleave', reset);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <section className="hero" id="top">
            <div className="hero__grid container">
                <div className="hero__text">
                    <motion.p className="hero__hello" {...rise(0.05)}>{t.hero.hello}</motion.p>
                    <motion.h1 className="hero__name" {...rise(0.15)}>{profile.name}</motion.h1>
                    <motion.p className="hero__role" {...rise(0.3)}>
                        <Check immediate delay={1}>{t.hero.role}</Check>
                    </motion.p>
                    <motion.p className="hero__lede" {...rise(0.45)}>{t.hero.lede}</motion.p>
                    <motion.div className="hero__cta" {...rise(0.6)}>
                        <a href="#projects" className="btn btn--solid">{t.hero.ctaWork}</a>
                        <a href={profile.cv} download className="hero__cv link">{t.hero.ctaCv}</a>
                    </motion.div>
                </div>

                <div className="hero__visual" ref={visualRef}>
                    <motion.div
                        className="hero__arch"
                        aria-hidden="true"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
                    />
                    <motion.img
                        className="hero__photo"
                        src="/tegar-cutout.png"
                        alt={t.hero.photoAlt}
                        width="220"
                        height="469"
                        fetchPriority="high"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
                    />
                    <motion.p className="hero__note" aria-hidden="true" {...rise(1.2)}>
                        {t.hero.note}
                        <svg viewBox="0 0 90 60" className="hero__arrow">
                            <motion.path
                                d="M4 6 C 30 4, 58 14, 66 40 M 56 34 L 67 44 L 74 31"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: 1.5, ease: EASE }}
                            />
                        </svg>
                    </motion.p>
                </div>
            </div>

            <motion.p className="hero__now container" {...rise(0.8)}>{t.hero.now}</motion.p>
        </section>
    );
}
