// Single source for contact details used by the page and the chatbot.
export const profile = {
    name: 'Tegar Maulana',
    email: 'maulanategar117@gmail.com',
    phone: '+62 877 4125 3866',
    whatsapp: 'https://wa.me/6287741253866',
    linkedin: 'https://www.linkedin.com/in/tegarmaulana/',
    github: 'https://github.com/HyungMaulss',
    cv: '/CV - Tegar_Maulana.pdf',
    photo: '/tegar.webp',
    // Portfolio deck: `npm run resume` builds the PPT, `npm run resume:pdf` exports the PDF.
    deckPdf: '/Tegar-Maulana-Portfolio.pdf',
    deckPpt: '/Tegar-Maulana-Portfolio.pptx',
};

// Projects whose test code is readable in the CodeViewer (/code/:id).
export const sourceIds = ['cypress', 'k6', 'playwright', 'selenium'];

// Tool names are language-neutral. `match` lists extra experience/project tags that count as using the tool.
export const skillGroups = [
    { key: 'testing', tools: [
        { name: 'Manual Testing' },
        { name: 'API Testing', match: ['API'] },
        { name: 'E2E Testing' },
        { name: 'Performance Testing', match: ['Performance'] },
    ] },
    { key: 'automation', tools: [
        { name: 'Cypress' },
        { name: 'Playwright' },
        { name: 'Selenium' },
        { name: 'PyTest' },
        { name: 'K6' },
        { name: 'Postman' },
    ] },
    { key: 'languages', tools: [
        { name: 'JavaScript' },
        { name: 'Python' },
        { name: 'Golang' },
        { name: 'HTML / CSS' },
    ] },
    { key: 'everyday', tools: [
        { name: 'Git / GitHub' },
        { name: 'MySQL', match: ['Database'] },
        { name: 'Figma' },
        { name: 'Networking', match: ['Active Directory'] },
    ] },
];

// Where a tool appears across jobs and projects, from their tags. Pure, so the chatbot test can use it.
export function usageOf(tool, t) {
    const names = [tool.name, ...(tool.match || [])].map((n) => n.toLowerCase());
    const hit = (tags) => tags.some((tag) => names.includes(tag.toLowerCase()));
    return [
        ...t.experience.jobs.filter((j) => hit(j.tags)).map((j) => `${j.role}, ${j.company}`),
        ...t.projects.items.filter((p) => hit(p.tags)).map((p) => p.title),
    ];
}
