// Portfolio assistant: a closed-domain intent matcher. It can only return answers built from
// the portfolio data, so it cannot drift outside Tegar's context the way an open LLM can.
import { translations } from '../data/translations.js';
import { profile, skillGroups, sourceIds, usageOf } from '../data/profile.js';

export const MAX_INPUT = 300;

// Requests the assistant must refuse even when they mention a portfolio word ("write me a cypress test").
const OFF_TOPIC = [
    'weather', 'cuaca', 'recipe', 'resep', 'joke', 'lelucon', 'lawak', 'politic', 'politik', 'president', 'presiden',
    'bitcoin', 'crypto', 'saham', 'stock price', 'football', 'sepak bola', 'movie', 'film', 'song', 'lagu', 'math',
    'matematika', 'calculate', 'hitung', 'translate', 'terjemah', 'terjemahkan', 'capital', 'ibukota', 'news', 'berita',
    'chatgpt', 'openai', 'write a', 'write me', 'tuliskan', 'buatkan', 'generate', 'poem', 'puisi', 'essay', 'esai',
    'homework', 'pr saya', 'ignore previous', 'ignore all', 'abaikan', 'system prompt', 'pretend', 'roleplay', 'act as',
    'jailbreak', 'girlfriend', 'pacar', 'salary', 'gaji', 'religion', 'agama',
];

// Order = priority on equal score. Small talk is last and only used when nothing else matched.
const INTENTS = [
    ['cv', ['cv', 'resume', 'curriculum vitae', 'download cv', 'unduh cv']],
    ['hire', ['hire', 'hiring', 'available', 'availability', 'open to work', 'opportunity', 'opportunities', 'recruit', 'freelance', 'rekrut', 'lowongan', 'tersedia', 'peluang', 'kesempatan', 'why should']],
    ['education', ['education', 'university', 'college', 'campus', 'degree', 'major', 'graduate', 'gpa', 'gunadarma', 'study', 'studied', 'pendidikan', 'kuliah', 'kampus', 'universitas', 'jurusan', 'lulusan', 'sarjana', 'ipk', 'gelar']],
    ['location', ['location', 'located', 'live', 'lives', 'based', 'which city', 'where is he', 'lokasi', 'tinggal', 'domisili', 'berdomisili', 'alamat', 'kota']],
    ['contact', ['contact', 'email', 'mail', 'whatsapp', 'wa', 'phone', 'linkedin', 'github', 'reach', 'kontak', 'hubungi', 'menghubungi', 'nomor', 'telepon']],
    ['approach', ['approach', 'process', 'how does he test', 'how he tests', 'methodology', 'strategy', 'test case', 'bug report', 'workflow', 'pendekatan', 'proses', 'cara testing', 'cara dia testing', 'strategi', 'metodologi', 'cara kerja']],
    ['projects', ['project', 'projects', 'portfolio', 'proyek', 'projek', 'portofolio', 'songketa', 'capstone', 'showcase']],
    ['current', ['current', 'currently', 'now', 'job', 'work', 'works', 'working', 'role', 'position', 'company', 'sekarang', 'saat ini', 'kerja', 'bekerja', 'pekerjaan', 'posisi', 'jabatan', 'kantor', 'perusahaan', 'nusapala']],
    ['experience', ['work experience', 'pengalaman kerja', 'experience', 'experiences', 'career', 'history', 'background', 'intern', 'internship', 'previous', 'pengalaman', 'karir', 'karier', 'riwayat', 'magang', 'sanqua', 'evermos', 'bangkit', 'it support']],
    ['skills', ['skill', 'skills', 'stack', 'tech stack', 'tools', 'tool', 'technology', 'technologies', 'toolbox', 'keahlian', 'kemampuan', 'teknologi', 'bisa apa', 'programming', 'pemrograman', 'perkakas']],
    ['identity', ['who is', 'who are you', 'about tegar', 'tell me about', 'introduce', 'profile', 'siapa', 'perkenalan', 'profil', 'tentang tegar']],
    ['thanks', ['thanks', 'thank you', 'thx', 'makasih', 'terima kasih', 'tengkyu']],
    ['greeting', ['hi', 'hello', 'hey', 'halo', 'hai', 'hallo', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum', 'permisi', 'how are you', 'apa kabar', 'good morning']],
];
const SMALL_TALK = new Set(['thanks', 'greeting']);

// Tool aliases people actually type.
const TOOL_ALIASES = {
    'git / github': ['git', 'github'],
    'html / css': ['html', 'css'],
    javascript: ['javascript', 'js'],
    golang: ['golang', 'go lang'],
    'e2e testing': ['e2e', 'end to end'],
    'api testing': ['api testing', 'api test', 'pengujian api'],
    'performance testing': ['performance', 'load test', 'load testing', 'performa', 'uji beban'],
    'manual testing': ['manual testing', 'manual test', 'pengujian manual'],
};

export function normalize(text) {
    const base = text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s/+#]/g, ' ').replace(/\s+/g, ' ').trim();
    // Indonesian "-nya" suffix: "keahliannya" should match "keahlian".
    const stems = base.split(' ').filter((w) => w.length > 5 && w.endsWith('nya')).map((w) => w.slice(0, -3));
    return ` ${[base, ...stems].join(' ')} `;
}

const has = (text, phrase) => text.includes(` ${phrase} `);

function findTool(text) {
    for (const group of skillGroups) {
        for (const tool of group.tools) {
            const key = tool.name.toLowerCase();
            const names = TOOL_ALIASES[key] || [key];
            if (names.some((n) => has(text, n))) return { tool, group: group.key };
        }
    }
    return null;
}

export function classify(input) {
    const text = normalize(input.slice(0, MAX_INPUT));
    if (!text.trim()) return { intent: 'unknown' };
    if (OFF_TOPIC.some((w) => has(text, w))) return { intent: 'offTopic' };

    const scored = INTENTS
        .map(([id, words]) => [id, words.reduce((s, w) => s + (has(text, w) ? (w.includes(' ') ? 2 : 1) : 0), 0)])
        .filter(([, s]) => s > 0);
    const real = scored.filter(([id]) => !SMALL_TALK.has(id));
    const pool = real.length ? real : scored;
    const best = pool.reduce((a, b) => (b[1] > a[1] ? b : a), pool[0] || ['unknown', 0])[0];

    // A named tool is more specific than generic skills/experience/projects questions.
    const tool = findTool(text);
    if (tool && !['cv', 'hire', 'contact', 'education', 'location'].includes(best)) return { intent: 'tool', ...tool };
    return { intent: best };
}

const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

export function reply(input, lang = 'en') {
    const t = translations[lang] || translations.en;
    const a = t.chatbot.answers;
    const c = classify(input);

    switch (c.intent) {
        case 'experience':
            return [a.experienceIntro, ...t.experience.jobs.map((j) => `• **${j.role}**, ${j.company} (${j.date})`)].join('\n');
        case 'skills':
            return [a.skillsIntro, ...skillGroups.map((g) => `• **${t.skills.groups[g.key]}:** ${g.tools.map((x) => x.name).join(', ')}`)].join('\n');
        case 'projects':
            return [a.projectsIntro, ...t.projects.items.map((p) => `• **${p.title}**: ${p.type}`), '', fill(a.projectsSource, { n: sourceIds.length })].join('\n');
        case 'contact':
            return [a.contactIntro, `• **Email:** ${profile.email}`, `• **WhatsApp:** ${profile.phone}`, `• **LinkedIn:** ${profile.linkedin.replace(/^https:\/\/(www\.)?/, '')}`, `• **GitHub:** ${profile.github.replace(/^https:\/\//, '')}`].join('\n');
        case 'hire':
            return fill(a.hire, { email: profile.email });
        case 'tool': {
            const used = usageOf(c.tool, t);
            const head = fill(a.toolIntro, { tool: c.tool.name, group: t.skills.groups[c.group].toLowerCase() });
            return used.length ? [head, a.toolUsed, ...used.map((u) => `• ${u}`)].join('\n') : `${head} ${a.toolNone}`;
        }
        default:
            return a[c.intent] || a.unknown;
    }
}
