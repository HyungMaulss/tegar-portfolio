import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import SectionHeader from './SectionHeader';
import './About.css';

export default function About() {
    const { t } = useLanguage();
    const s = t.about.spec;
    const spec = [
        [s.education, s.educationValue],
        [s.gpa, s.gpaValue],
        [s.location, s.locationValue],
        [s.focus, s.focusValue],
    ];

    return (
        <section className="about" id="about">
            <div className="container">
                <SectionHeader index="01" label={t.about.label} title={t.about.title} />
                <div className="about__grid">
                    <div className="about__text">
                        <p>{t.about.p1}</p>
                        <p>{t.about.p2}</p>
                    </div>
                    <dl className="about__spec">
                        {spec.map(([k, v], i) => (
                            <motion.div
                                key={k}
                                className="about__row"
                                data-inspect="dl.spec"
                                initial={{ opacity: 0, x: 16 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.08 }}
                            >
                                <dt className="mono">{k}</dt>
                                <dd>{v}</dd>
                            </motion.div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
