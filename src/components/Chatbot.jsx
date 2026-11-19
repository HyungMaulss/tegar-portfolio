import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { reply, MAX_INPUT } from '../lib/chatbot';
import './Chatbot.css';

// **bold** and line breaks only; everything else renders as plain text (no HTML injection).
function Rich({ text }) {
    return text.split('\n').map((line, i) => (
        <span key={i} className="chat__line">
            {line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
                part.startsWith('**') && part.endsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part,
            )}
        </span>
    ));
}

export default function Chatbot() {
    const { t, language } = useLanguage();
    const c = t.chatbot;
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const listRef = useRef(null);
    const inputRef = useRef(null);
    const launcherRef = useRef(null);
    const timer = useRef(0);

    useEffect(() => () => clearTimeout(timer.current), []);

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, typing]);

    useEffect(() => {
        if (!open) return;
        inputRef.current?.focus();
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            setOpen(false);
            launcherRef.current?.focus();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    const ask = (text) => {
        const q = text.trim().slice(0, MAX_INPUT);
        if (!q || typing) return;
        setMessages((m) => [...m, { from: 'user', text: q }]);
        setInput('');
        setTyping(true);
        // Short pause so the answer reads as a reply, not a page jump.
        timer.current = setTimeout(() => {
            setMessages((m) => [...m, { from: 'bot', text: reply(q, language) }]);
            setTyping(false);
        }, 450);
    };

    return (
        <>
            <button
                ref={launcherRef}
                type="button"
                className={`chat-launcher ${open ? 'is-open' : ''}`}
                aria-expanded={open}
                aria-controls="chat-panel"
                onClick={() => setOpen((o) => !o)}
            >
                <span className="chat-launcher__mark mono" aria-hidden="true">{open ? '×' : '?'}</span>
                <span>{open ? c.close : c.launcher}</span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.section
                        id="chat-panel"
                        className="chat"
                        role="dialog"
                        aria-label={c.title}
                        initial={{ opacity: 0, y: 16, clipPath: 'inset(100% 0 0 0)' }}
                        animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
                        exit={{ opacity: 0, y: 16, clipPath: 'inset(100% 0 0 0)' }}
                        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.1, 1] }}
                    >
                        <header className="chat__head">
                            <div>
                                <h2 className="chat__title">{c.title}</h2>
                                <p className="chat__scope mono">{c.scope}</p>
                            </div>
                            <button type="button" className="toggle" aria-label={c.close} onClick={() => { setOpen(false); launcherRef.current?.focus(); }}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </header>

                        <div className="chat__log" ref={listRef} aria-live="polite">
                            <p className="chat__msg is-bot"><Rich text={c.welcome} /></p>
                            {messages.map((m, i) => (
                                <p key={i} className={`chat__msg ${m.from === 'bot' ? 'is-bot' : 'is-user'}`}>
                                    <Rich text={m.text} />
                                </p>
                            ))}
                            {typing && (
                                <p className="chat__msg is-bot chat__typing" aria-label={c.typing}>
                                    <span /><span /><span />
                                </p>
                            )}
                        </div>

                        <div className="chat__suggest">
                            {c.suggestions.map((s) => (
                                <button key={s} type="button" className="chat__chip" onClick={() => ask(s)} disabled={typing}>{s}</button>
                            ))}
                        </div>

                        <form className="chat__form" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
                            <label htmlFor="chat-input" className="chat__label mono">{c.label}</label>
                            <div className="chat__row">
                                <input
                                    id="chat-input"
                                    ref={inputRef}
                                    type="text"
                                    autoComplete="off"
                                    maxLength={MAX_INPUT}
                                    placeholder={c.placeholder}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button type="submit" className="btn btn--solid chat__send" disabled={!input.trim() || typing}>{c.send}</button>
                            </div>
                        </form>
                    </motion.section>
                )}
            </AnimatePresence>
        </>
    );
}
