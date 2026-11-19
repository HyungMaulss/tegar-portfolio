import { motion } from 'framer-motion';

// The logo's check, revealed left to right under a word (clip-path, so the stroke keeps an even width at any length).
export default function Check({ children, delay = 0.2, immediate = false }) {
    const shown = { clipPath: 'inset(0 0% 0 0)' };
    return (
        <span className="check">
            {children}
            <motion.svg
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                aria-hidden="true"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                {...(immediate ? { animate: shown } : { whileInView: shown, viewport: { once: true, margin: '-60px' } })}
                transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
            >
                <path d="M2 9 L12 17 L98 3" />
            </motion.svg>
        </span>
    );
}
