import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { reveal } from '../lib/motion';
import './Experience.css';

export default function Experience() {
    const { t } = useLanguage();

    return (
        <section id="experience" className="section container">
            <motion.div {...reveal()}>
                <p className="eyebrow">{t.experience.label}</p>
                <h2 className="h2">{t.experience.title}</h2>
            </motion.div>

            <ol className="timeline">
                {t.experience.jobs.map((job, i) => (
                    <motion.li key={job.company} className={`job ${job.current ? 'is-current' : ''}`} {...reveal(i * 0.08)}>
                        <span className="job__marker" aria-hidden="true" />
                        <div className="job__head">
                            <p className="job__date">{job.date} · {job.location}</p>
                            <h3 className="job__role">{job.role}</h3>
                            <p className="job__company">{job.company}</p>
                        </div>
                        <div className="job__body">
                            <p className="job__summary">{job.summary}</p>
                            <p className="job__tags">{job.tags.join(' · ')}</p>
                        </div>
                    </motion.li>
                ))}
            </ol>
        </section>
    );
}
