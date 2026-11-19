import { motion } from 'framer-motion';

// The rule draws and the title rises once on entry: it marks where a new section starts.
export default function SectionHeader({ index, label, meta, title }) {
    return (
        <header className="section-head">
            <div className="section-head__bar mono">
                <span><span className="section-head__index">{index}</span> / {label.toLowerCase()}</span>
                {meta && <span>{meta}</span>}
            </div>
            <motion.div
                className="section-head__rule"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.2, 0.7, 0.1, 1] }}
            />
            <motion.h2
                className="section-head__title"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.7, 0.1, 1] }}
            >
                {title}
            </motion.h2>
        </header>
    );
}
