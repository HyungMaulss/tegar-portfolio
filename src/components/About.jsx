import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { skillGroups } from '../data/profile';
import { reveal } from '../lib/motion';
import Hl from './Hl';
import './About.css';

export default function About() {
    const { t } = useLanguage();
    const [lead, mark] = t.about.title;

    return (
        <section id="about" className="about section container">
            <motion.div className="about__text" {...reveal()}>
                <p className="eyebrow">{t.about.label}</p>
                <h2 className="h2">{lead} <Hl>{mark}</Hl></h2>
                <p className="about__p">{t.about.p1}</p>
                <p className="about__p about__p--muted">{t.about.p2}</p>
            </motion.div>

            <motion.div className="toolbox" {...reveal(0.12)}>
                <p className="toolbox__title">{t.about.toolbox}</p>
                <div className="toolbox__groups">
                    {skillGroups.map((g) => (
                        <div key={g.key} className="toolbox__row">
                            <p className="toolbox__group">{t.skills.groups[g.key]}</p>
                            <ul className="toolbox__chips">
                                {g.tools.map((tool) => (
                                    <li key={tool.name} className="chip">{tool.name}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
