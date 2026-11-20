import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getCodeSnippets } from '../data/codeSnippets.jsx';
import { sourceIds } from '../data/profile';
import { ThemeToggle, LanguageSwitch } from './Toggles';
import Logo from './Logo';
import './CodeViewer.css';

const JS_KW = 'import|from|export|default|const|let|var|function|return|if|else|class|new|async|await|describe|it|test|beforeEach|expect|require|this|throw|try|catch|typeof|for|while|of|in|null|undefined|true|false';
const PY_KW = 'import|from|class|def|return|if|else|elif|assert|self|yield|raise|try|except|finally|with|as|for|in|while|not|and|or|is|None|True|False|pass|lambda|super';
// One pass with alternation, so a later rule can never match inside markup an earlier rule produced.
const RULES = {
    javascript: new RegExp(String.raw`(\/\/.*$|\/\*[\s\S]*?\*\/)|(\x60(?:[^\x60\\]|\\.)*\x60|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|\b(${JS_KW})\b|\b(\d+(?:\.\d+)?)\b`, 'gm'),
    python: new RegExp(String.raw`(#.*$|"""[\s\S]*?""")|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|\b(${PY_KW})\b|\b(\d+(?:\.\d+)?)\b|(@\w+)`, 'gm'),
};
const TOKEN = ['cv-comment', 'cv-string', 'cv-keyword', 'cv-number', 'cv-decorator'];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function highlight(code, language) {
    let out = '';
    let last = 0;
    for (const m of code.matchAll(RULES[language] || RULES.javascript)) {
        const group = m.slice(1).findIndex((g) => g !== undefined);
        out += `${esc(code.slice(last, m.index))}<span class="${TOKEN[group]}">${esc(m[0])}</span>`;
        last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
}

// Snippet comments are bilingual (EN line, then ID line). Keep only the lines for the current language.
function filterCodeByLanguage(code, lang) {
    const idLine = /^[\s]*[/*#]*\s*(\d+\.?\s*|-\s*|[\w().%]+\s*:?\s*)?(Tujuan|Langkah|Apa ini|Cara kerja|Menangkap|Cegat|Hapus|Isi|Klik|Navigasi|Verifikasi|Tunggu|Cek|Definisikan|Menentukan|Tentukan|Catat|Validasi|Ketik|Buat|Gunakan|Enkapsulasi|Membandingkan|Deteksi|Pergi|Ambil|Jeda|Kirim|Atur|Lakukan|Ini|Script ini|Mendemonstrasikan|Alih-alih|Kenapa|Mengapa|Method|Selalu|Titik masuk|Mempelajari|Berkolaborasi|Memberikan|Memantau|Membantu|Menganalisis|Membuat|Melakukan|Persentase|Berapa lama|Bayangkan|Mulai kecil|Beban|Pendinginan|Kriteria|Tingkat|Yang diuji|Tambah|Konsep|Cara terpercaya|Logika|Reset|Keuntungan|Tanpa|Dengan|Struktur|Alamat|User|Users|Ingat|Simulasikan|Alat yang|Bahasa)\b/i;
    const idWords = /^[\s]*[/*#]+\s*.*(nya|kan|lah|mu|ang|dan|atau|ini|itu|dari|untuk|dengan|yang|di|ke|pada|saat|agar|bisa|hanya|lebih|harus|bawah|atas|dalam)\b/i;
    const enLine = /^[\s]*[/*#]+\s*(\d+\.?\s*|-\s*|[\w().%]+\s*:?\s*)?(Purpose|Step|Benefits|Define|Wait|Fill|Click|Navigate|Verify|Check|Record|If|Set|Fetch|Pause|Create|Use|Clear|Intercept|This|Instead|Why|Reusable|Always|Entry|Learned|Collaborated|Provide|Monitor|Assist|Analyzed|Designed|Executed|What is this|How it works|Simulate|Think|Start|Normal|Stress|Cooldown|Pass|Percentage|How long|Send|Validate|What it tests|Add|Key concepts|Catch|Reliable|Custom|Setup|Test|Tests|Go|Without|With|Structure|Encapsulate|Type|Detect|Tools used|Language)\b/i;

    const kept = code.split('\n').filter((line) => {
        const s = line.trim();
        return lang === 'en' ? !(idLine.test(s) || idWords.test(s)) : !enLine.test(s);
    });
    const out = [];
    let blank = 0;
    for (const line of kept) {
        const empty = ['', '*', '//'].includes(line.trim());
        blank = empty ? blank + 1 : 0;
        if (blank <= 2) out.push(line);
    }
    return out.join('\n');
}

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Output and Report are re-keyed on every run, so their state starts fresh without reset effects.
function Output({ content, filename, t }) {
    const lines = useMemo(() => content.split('\n'), [content]);
    const [count, setCount] = useState(() => (reduced() ? lines.length : 0));
    const preRef = useRef(null);

    useEffect(() => {
        if (reduced()) return;
        const id = setInterval(() => setCount((c) => (c >= lines.length ? (clearInterval(id), c) : c + 1)), 40);
        return () => clearInterval(id);
    }, [lines]);

    // Follow the newest line inside the box only; scrollIntoView would also drag the page.
    useEffect(() => {
        if (preRef.current) preRef.current.scrollTop = preRef.current.scrollHeight;
    }, [count]);
    const done = count >= lines.length;

    return (
        <div className="cv-output">
            <p className="cv-output__head mono">
                <span>$ {filename}</span>
                <span className={done ? 'is-done' : ''}>{done ? `✓ ${t.done}` : `${t.running}…`}</span>
            </p>
            <pre className="cv-output__body" ref={preRef}>{lines.slice(0, count).join('\n')}</pre>
        </div>
    );
}

function Report({ data, t }) {
    const [progress, setProgress] = useState(() => (reduced() ? 100 : 0));

    useEffect(() => {
        if (reduced()) return;
        const id = setInterval(() => setProgress((p) => (p >= 100 ? (clearInterval(id), 100) : p + 5)), 50);
        return () => clearInterval(id);
    }, [data]);

    if (progress < 100) {
        return (
            <div className="cv-report-loading" role="status">
                <p className="mono">{t.loading}… {progress}%</p>
                <div className="cv-progress"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
            </div>
        );
    }

    const r = data.reportData;
    if (!r) return <p className="cv-report-empty">No report for this suite.</p>;

    if (r.type === 'k6') {
        const stats = [
            ['requests', r.summary.totalReqs],
            ['req/s', r.summary.reqsPerSec],
            [t.failed, r.summary.failedReqs],
            ['p95', r.thresholds[0].value],
        ];
        return (
            <div className="cv-report">
                <dl className="cv-stats">
                    {stats.map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>)}
                </dl>
                <ul className="cv-checks">
                    {r.checks.map((c) => <li key={c.name}><span>✓ {c.name}</span><span className="mono">{c.pass} {t.passed}</span></li>)}
                    {r.thresholds.map((x) => <li key={x.name}><span>✓ {x.name} <span className="mono">{x.threshold}</span></span><span className="mono">{x.value}</span></li>)}
                </ul>
            </div>
        );
    }

    if (r.type === 'cypress' || r.type === 'playwright') {
        const stats = [
            [t.passed, r.stats.passes ?? r.stats.passed],
            [t.failed, r.stats.failed ?? r.stats.failures],
            [t.duration, r.stats.duration],
        ];
        return (
            <div className="cv-report">
                <dl className="cv-stats">
                    {stats.map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>)}
                </dl>
                <ul className="cv-checks">
                    {(r.suites || r.tests).map((s) => (
                        <li key={s.title || s.name} className="cv-suite">
                            <span>✓ {s.title || s.name}</span>
                            <span className="mono">{s.duration}</span>
                            {s.steps && <ol className="cv-steps">{s.steps.map((st) => <li key={st}>{st}</li>)}</ol>}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="cv-report">
            <ol className="cv-checks">
                {r.logs.map((log, i) => <li key={i}><span>{log.msg}</span><span className="mono">{log.time}</span></li>)}
            </ol>
        </div>
    );
}

export default function CodeViewer({ codeType, onBack }) {
    const { t, language } = useLanguage();
    const cv = t.codeViewer;
    const snippets = useMemo(() => getCodeSnippets(t), [t]);
    const id = snippets[codeType] ? codeType : sourceIds[0];
    const data = snippets[id];

    const [view, setView] = useState('code');
    const [run, setRun] = useState(0);
    const [copied, setCopied] = useState(false);

    const code = useMemo(() => filterCodeByLanguage(data.code, language), [data.code, language]);
    const html = useMemo(() => highlight(code, data.language), [code, data.language]);
    const lineCount = code.split('\n').length;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* clipboard blocked: the code stays selectable */ }
    };

    const download = () => {
        const url = URL.createObjectURL(new Blob([data.code], { type: 'text/plain' }));
        const a = Object.assign(document.createElement('a'), { href: url, download: data.filename });
        a.click();
        URL.revokeObjectURL(url);
    };

    const runTest = () => {
        setRun((n) => n + 1);
        setView('output');
    };

    return (
        <div className="cv">
            <header className="cv__bar">
                <div className="container cv__bar-inner">
                    <Link to="/" className="cv__back link" onClick={(e) => { e.preventDefault(); onBack(); }}><Logo variant="mark" className="cv__logo" /><span>{cv.back}</span></Link>
                    <div className="cv__tools">
                        <LanguageSwitch />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="container cv__main">
                <p className="cv__crumb mono">tegar / tests / {data.filename}</p>
                <h1 className="cv__title">{data.title}</h1>
                <p className="cv__desc">{data.description}</p>

                <nav className="cv__suites" aria-label="Test suites">
                    {sourceIds.map((s) => (
                        <NavLink key={s} to={`/code/${s}`} className="cv__suite mono">{snippets[s].filename}</NavLink>
                    ))}
                </nav>

                <div className="cv__toolbar">
                    <div className="cv__views" role="group" aria-label="View">
                        {['code', 'output', 'report'].map((v) => (
                            <button key={v} type="button" className="cv__view" aria-pressed={view === v} onClick={() => setView(v)}>
                                {cv[v]}
                            </button>
                        ))}
                    </div>
                    <div className="cv__actions">
                        <button type="button" className="cv__action" onClick={copy}>{copied ? `✓ ${cv.copied}` : cv.copy}</button>
                        <button type="button" className="cv__action" onClick={download}>{cv.download}</button>
                        <button type="button" className="btn btn--ink cv__run" onClick={runTest}>{cv.run}</button>
                    </div>
                </div>

                {view !== 'code' && <p className="cv__note mono">{cv.simulated}</p>}

                <div className="cv__viewport" data-inspect={`pre.${view}`}>
                    {view === 'code' && (
                        <div className="cv-code">
                            <ol className="cv-code__nums mono" aria-hidden="true">
                                {Array.from({ length: lineCount }, (_, i) => <li key={i}>{i + 1}</li>)}
                            </ol>
                            <pre className="cv-code__src"><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
                        </div>
                    )}
                    {view === 'output' && <Output key={`${id}-${run}`} content={data.runOutput} filename={data.filename} t={cv} />}
                    {view === 'report' && <Report key={`${id}-${run}`} data={data} t={cv} />}
                </div>
            </main>
        </div>
    );
}
