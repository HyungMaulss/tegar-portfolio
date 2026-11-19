import { useEffect, useState } from 'react';

// DevTools-style outline that follows hovered [data-inspect] elements. Decorative, so aria-hidden.
export default function Inspector() {
    const [box, setBox] = useState({ on: false, x: 0, y: 0, w: 0, h: 0, label: '' });

    useEffect(() => {
        if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const hide = () => setBox((b) => (b.on ? { ...b, on: false } : b));
        const over = (e) => {
            const el = e.target.closest?.('[data-inspect]');
            if (!el) return hide();
            const r = el.getBoundingClientRect();
            setBox({ on: true, x: r.left, y: r.top, w: r.width, h: r.height, label: el.dataset.inspect });
        };
        document.addEventListener('pointerover', over);
        document.documentElement.addEventListener('pointerleave', hide);
        window.addEventListener('scroll', hide, { passive: true });
        return () => {
            document.removeEventListener('pointerover', over);
            document.documentElement.removeEventListener('pointerleave', hide);
            window.removeEventListener('scroll', hide);
        };
    }, []);

    return (
        <div
            className="inspector"
            aria-hidden="true"
            style={{ transform: `translate(${box.x}px, ${box.y}px)`, width: box.w, height: box.h, opacity: box.on ? 1 : 0 }}
        >
            <span className="inspector__tag">{box.label}<span>{Math.round(box.w)}×{Math.round(box.h)}</span></span>
        </div>
    );
}
