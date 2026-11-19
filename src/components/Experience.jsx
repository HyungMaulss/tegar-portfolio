import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import SectionHeader from './SectionHeader';
import './Experience.css';

// Rendered like a test log: the current job is "running", finished ones "passed".
export default function Experience() {
    const { t } = useLanguage();
    const [open, setOpen] = useState(0);
    const jobs = t.experience.jobs;

    return (
        <section className="experience" id="experience">
            <div className="container">
                <SectionHeader index="02" label={t.experience.label} title={t.experience.title} meta={`${jobs.length} ${t.experience.entries}`} />
                <ol className="log">
                    {jobs.map((job, i) => {
                        const isOpen = open === i;
                        return (
                            <motion.li
                                key={job.company}
                                className={`log__item ${isOpen ? 'is-open' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.6, delay: i * 0.06 }}
                            >
                                <button
                                    type="button"
                                    className="log__head"
                                    data-inspect="li.job"
                                    aria-expanded={isOpen}
                                    aria-controls={`job-${i}`}
                                    onClick={() => setOpen(isOpen ? -1 : i)}
                                >
                                    <span className={`log__status mono ${job.current ? 'is-running' : ''}`}>
                                        <span aria-hidden="true">{job.current ? '●' : '✓'}</span> {job.current ? t.experience.running : t.experience.passed}
                                    </span>
                                    <span className="log__date mono">{job.date}</span>
                                    <span className="log__role">
                                        {job.role}
                                        <span className="log__company">{job.company}, {job.location}</span>
                                    </span>
                                    <span className="log__type mono">{job.type}</span>
                                    <span className="log__toggle" aria-hidden="true" />
                                    <span className="visually-hidden">{isOpen ? t.experience.hide : t.experience.details}</span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={`job-${i}`}
                                            className="log__body"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.1, 1] }}
                                        >
                                            <div className="log__inner">
                                                <ul className="log__desc">
                                                    {job.desc.map((d) => <li key={d}>{d}</li>)}
                                                </ul>
                                                <div className="tags">
                                                    {job.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
