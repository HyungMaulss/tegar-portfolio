// The few icons the design uses. All decorative: the text next to them carries the meaning.
const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const ArrowRight = () => <svg {...base}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>;
export const Download = () => <svg {...base}><path d="M12 4v12" /><path d="M6 11l6 6 6-6" /><path d="M5 20h14" /></svg>;
export const Menu = () => <svg {...base} width="20" height="20"><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></svg>;
export const Close = () => <svg {...base} width="20" height="20"><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>;

export const Checked = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="tick">
        <rect x="1" y="1" width="22" height="22" rx="6" fill="var(--on-sun)" />
        <path className="tick__mark" d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="var(--sun)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Unchecked = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--on-sun)" strokeWidth="2" strokeDasharray="3 3" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="6" />
    </svg>
);
