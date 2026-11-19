import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import SectionHeader from './SectionHeader';
import Check from './Check';
import './Experience.css';

export default function Experience() {
    const { t } = useLanguage();
    const [lead, key] = t.experience.title;

    return (
        <section className="experience section" id="experience">
            <div className="container">
                <SectionHeader label={t.experience.label}>
                    {lead} <Check>{key}</Check>
                </SectionHeader>

                <ol className="jobs">
                    {t.experience.jobs.map((job, i) => (
                        <motion.li
                            key={job.company}
                            className={`job ${job.current ? 'is-current' : ''}`}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <p className="job__date">{job.date}</p>
                            <div className="job__main">
                                <h3 className="job__role">{job.role}</h3>
                                <p className="job__company">{job.company}, {job.location}</p>
                            </div>
                            <p className="job__summary">{job.summary}</p>
                        </motion.li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
