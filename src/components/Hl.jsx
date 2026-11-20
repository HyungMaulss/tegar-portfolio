import { useRef } from 'react';
import { useInView } from 'framer-motion';

// Sun highlighter that sweeps in once the word is on screen.
export default function Hl({ children }) {
    const ref = useRef(null);
    const on = useInView(ref, { once: true, margin: '-40px' });
    return <span ref={ref} className={`hl ${on ? 'is-on' : ''}`}>{children}</span>;
}
