import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { skillGroups } from '../data/profile';
import SectionHeader from './SectionHeader';
import Check from './Check';
import './About.css';

const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function About() {
    const { t } = useLanguage();
    const [lead, key] = t.about.title;

    return (
        <section className="about section" id="about">
            <div className="container">
                <SectionHeader label={t.about.label}>
                    {lead} <Check>{key}</Check>
                </SectionHeader>

                <div className="about__grid">
                    <motion.div className="about__text" {...reveal()}>
                        <p>{t.about.p1}</p>
                        <p>{t.about.p2}</p>
                    </motion.div>

                    <motion.div className="about__tools" {...reveal(0.15)}>
                        <h3 className="about__tools-title">{t.about.toolsTitle}</h3>
                        {skillGroups.map((g) => (
                            <div key={g.key} className="about__group">
                                <span className="about__group-name">{t.skills.groups[g.key]}</span>
                                <ul className="about__list">
                                    {g.tools.map((tool) => <li key={tool.name}>{tool.name}</li>)}
                                </ul>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
