import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { reveal } from '../lib/motion';
import './Experience.css';

export default function Experience() {
    const { t } = useLanguage();
    const e = t.experience;

    return (
        <section id="experience" className="section container">
            <motion.div {...reveal()}>
                <p className="eyebrow">{e.label}</p>
                <h2 className="h2">{e.title}</h2>
            </motion.div>

            <ol className="jobs">
                {e.jobs.map((job, i) => (
                    <motion.li key={job.company} className={`job ${job.current ? 'is-current' : ''}`} {...reveal(i * 0.06)}>
                        <p className="job__date">
                            {job.date}
                            <span>{job.location}</span>
                        </p>
                        <div className="job__head">
                            <h3 className="job__role">
                                {job.role}
                                {job.current && <span className="job__now">{e.now}</span>}
                            </h3>
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
