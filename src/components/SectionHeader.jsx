import { motion } from 'framer-motion';

// Title can contain a <Check> around its key word.
export default function SectionHeader({ label, children }) {
    return (
        <motion.header
            className="heading"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <span className="heading__label">{label}</span>
            <h2 className="heading__title">{children}</h2>
        </motion.header>
    );
}
