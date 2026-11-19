import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { skillGroups, usageOf } from '../data/profile';
import SectionHeader from './SectionHeader';
import './Skills.css';

// No self-rated percentages: each tool points to the jobs and projects where it was actually used.
export default function Skills() {
    const { t } = useLanguage();
    const [active, setActive] = useState(null);
    const used = active ? usageOf(active, t) : [];

    return (
        <section className="skills" id="skills">
            <div className="container">
                <SectionHeader index="04" label={t.skills.label} title={t.skills.title} />
                <div className="skills__grid">
                    <div className="skills__groups">
                        {skillGroups.map((g) => (
                            <div key={g.key} className="skills__group">
                                <h3 className="skills__group-title mono">{t.skills.groups[g.key]}</h3>
                                <ul>
                                    {g.tools.map((tool) => (
                                        <li key={tool.name}>
                                            <button
                                                type="button"
                                                className="skills__tool"
                                                aria-pressed={active?.name === tool.name}
                                                aria-controls="skills-usage"
                                                onMouseEnter={() => setActive(tool)}
                                                onFocus={() => setActive(tool)}
                                                onClick={() => setActive(tool)}
                                            >
                                                {tool.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <aside id="skills-usage" className="skills__usage" aria-live="polite" data-inspect="aside.usage">
                        <AnimatePresence mode="wait">
                            {active ? (
                                <motion.div
                                    key={active.name}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <p className="skills__usage-name">{active.name}</p>
                                    <p className="mono skills__usage-label">{t.skills.usedIn}</p>
                                    {used.length ? (
                                        <ul className="skills__usage-list">
                                            {used.map((u) => <li key={u}>{u}</li>)}
                                        </ul>
                                    ) : (
                                        <p className="skills__usage-empty">{t.skills.notUsed}</p>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.p key="hint" className="skills__hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {t.skills.hint}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </aside>
                </div>
            </div>
        </section>
    );
}
