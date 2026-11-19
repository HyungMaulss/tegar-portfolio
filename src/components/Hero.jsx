import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { profile } from '../data/profile';
import './Hero.css';

const EASE = [0.2, 0.7, 0.1, 1];

// Each word rises out of a mask once; letters lift individually on hover.
function Word({ text, delay }) {
    return (
        <span className="hero__line" aria-hidden="true">
            <motion.span className="hero__word" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, delay, ease: EASE }}>
                {[...text].map((ch, i) => <span key={i} className="hero__char">{ch}</span>)}
            </motion.span>
        </span>
    );
}

export default function Hero() {
    const { t } = useLanguage();
    const heroRef = useRef(null);
    const readoutRef = useRef(null);

    // Crosshair + coordinate readout: the "measure it" habit of a tester. Written to CSS vars, no re-renders.
    useEffect(() => {
        const el = heroRef.current;
        if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        let raf = 0;
        const move = (e) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const r = el.getBoundingClientRect();
                const x = Math.round(e.clientX - r.left);
                const y = Math.round(e.clientY - r.top);
                el.style.setProperty('--cx', `${x}px`);
                el.style.setProperty('--cy', `${y}px`);
                if (readoutRef.current) readoutRef.current.textContent = `x ${x}  y ${y}`;
            });
        };
        el.addEventListener('pointermove', move);
        return () => {
            el.removeEventListener('pointermove', move);
            cancelAnimationFrame(raf);
        };
    }, []);

    const fadeIn = (delay) => ({
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: EASE },
    });

    return (
        <section className="hero" id="top" ref={heroRef}>
            <div className="hero__cross" aria-hidden="true">
                <span className="hero__cross-x" />
                <span className="hero__cross-y" />
                <span className="hero__readout mono" ref={readoutRef} />
            </div>

            <div className="hero__grid container">
                <div className="hero__text">
                    <motion.p className="hero__role mono" {...fadeIn(0)}>
                        <span className="hero__pass" aria-hidden="true">✓</span> {t.hero.role}
                    </motion.p>

                    <h1 className="hero__name" aria-label={profile.name}>
                        <Word text="Tegar" delay={0.1} />
                        <Word text="Maulana" delay={0.22} />
                    </h1>

                    <motion.p className="hero__lede" {...fadeIn(0.5)}>{t.hero.lede}</motion.p>

                    <motion.div className="hero__cta" {...fadeIn(0.62)}>
                        <a href="#projects" className="btn btn--solid">{t.hero.ctaWork}</a>
                        <a href={profile.cv} download className="btn">{t.hero.ctaCv}</a>
                    </motion.div>

                    <motion.dl className="hero__meta" {...fadeIn(0.74)}>
                        <div>
                            <dt className="mono">{t.hero.now}</dt>
                            <dd>{t.hero.nowValue}</dd>
                        </div>
                        <div>
                            <dt className="mono">{t.hero.based}</dt>
                            <dd>{t.hero.basedValue}</dd>
                        </div>
                    </motion.dl>
                </div>

                <motion.figure
                    className="hero__photo"
                    data-inspect="img.portrait"
                    initial={{ clipPath: 'inset(100% 0 0 0)' }}
                    animate={{ clipPath: 'inset(0% 0 0 0)' }}
                    transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
                >
                    <img src={profile.photo} alt={t.hero.photoAlt} width="400" height="600" fetchPriority="high" />
                </motion.figure>
            </div>
        </section>
    );
}
