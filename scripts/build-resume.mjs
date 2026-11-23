// Builds public/Tegar-Maulana-Resume.pptx from the same data the website renders.
// Run: npm run resume   (re-run after editing src/data/*)
//
// Morph: shapes that persist between slides share a "!!name" (PowerPoint's forced-match prefix),
// and every slide gets a Morph transition injected into its XML (pptxgenjs cannot write it).
// Images in scripts/assets were rendered once from the site (portrait fade, glow, dot patterns).
import pptxgen from 'pptxgenjs';
import JSZip from 'jszip';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { translations } from '../src/data/translations.js';
import { profile, skillGroups, sourceIds } from '../src/data/profile.js';

const t = translations.en;
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const OUT = here('../public/Tegar-Maulana-Resume.pptx');
const img = (name) => 'image/png;base64,' + readFileSync(here(`./assets/${name}.png`)).toString('base64');

// Site light theme. Sun is a fill, never text on Sky; text on Sun stays INK.
const BG = 'F4F6FF';
const INK = '1A1B3A';
const SUN = 'FFC83D';
const MUTED = '4A4B65'; // ink at 78%
const LINE = 'A5A7B8'; // ink at 36%
const RING = 'E6A800'; // deeper Sun for thin rings
const SKY_MUTED = 'B9BBD6'; // muted text on the ink panel
const FONT = 'Arial';
const MONO = 'Consolas';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in
pres.author = profile.name;
pres.title = `${profile.name} | QA Engineer`;
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };

const W = 13.333;
const M = 0.6; // outer margin

const text = (slide, value, opts) => slide.addText(value, { fontFace: FONT, margin: 0, isTextBox: true, valign: 'top', ...opts });
const hardShadow = (offset) => ({ type: 'outer', angle: 45, blur: 0, offset, color: INK, opacity: 1 });
const rule = (slide, y, x = M, w = W - 2 * M) => slide.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color: LINE, width: 1 } });
const ring = (slide, x, y, d) =>
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: BG, transparency: 100 }, line: { color: RING, width: 2.5 } });

// Persistent objects: same names on every slide so Morph tweens them.
const sun = (slide, x, y, w, h, opts = {}) =>
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.22, fill: { color: SUN }, line: { color: INK, width: 1.5 }, objectName: '!!sun', ...opts });
const brand = (slide, onDark = false, x = M, y = 0.45, w = 0.82) =>
    slide.addImage({ data: img(onDark ? 'logo-sky' : 'logo-ink'), x, y, w, h: w / 1.624, objectName: '!!logo', altText: 'TM logo' });
const title = (slide, value, opts = {}) =>
    text(slide, value, { x: M, y: 0.95, w: 11, h: 0.75, fontSize: 32, bold: true, color: INK, objectName: '!!title', ...opts });
const eyebrow = (slide, value, color = MUTED) =>
    text(slide, value.toUpperCase(), { x: M + 1.1, y: 0.55, w: 6, h: 0.3, fontSize: 11, bold: true, color, charSpacing: 2, objectName: '!!eyebrow' });
const lightSlide = () => {
    const s = pres.addSlide();
    s.background = { color: BG };
    return s;
};

// ---------- 1. Cover: the site's hero ----------
{
    const s = lightSlide();
    // Centred off the corner so only the arcs show, clear of the logo.
    ring(s, -3.2, -3.2, 3.8);
    ring(s, -3.6, -3.6, 4.6);
    brand(s);
    text(s, t.hero.hello, { x: M, y: 1.55, w: 6, h: 0.4, fontSize: 18, color: MUTED });
    title(s, [
        { text: profile.name.split(' ')[0], options: { breakLine: true } },
        { text: profile.name.split(' ')[1] },
        { text: '.', options: { color: SUN } },
    ], { y: 1.95, w: 6.6, h: 2.0, fontSize: 60, lineSpacingMultiple: 0.9 });
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: 4.3, w: 0.4, h: 0.07, fill: { color: SUN }, line: { color: SUN, width: 0 } });
    text(s, t.hero.role, { x: M + 0.55, y: 4.13, w: 6, h: 0.4, fontSize: 20, bold: true, color: INK });
    const [before, mark, after] = t.hero.title;
    text(s, [
        { text: `${before} ` },
        { text: ` ${mark} `, options: { bold: true, color: INK, highlight: SUN } },
        { text: ` ${after}` },
    ], { x: M, y: 4.7, w: 5.6, h: 0.9, fontSize: 18, color: MUTED, lineSpacingMultiple: 1.2 });
    text(s, `${profile.email}   ·   Jakarta, Indonesia`, { x: M, y: 6.6, w: 7, h: 0.35, fontSize: 12, color: MUTED });

    s.addImage({ data: img('glow'), x: 6.9, y: 0.1, w: 6.6, h: 6.6 });
    s.addImage({ data: img('dots-ink'), x: 10.75, y: 0.45, w: 2.2, h: 1.6 });
    sun(s, 8.3, 2.05, 3.95, 4.55, { rotate: -5, shadow: hardShadow(8) });
    s.addImage({ data: img('portrait'), x: 7.95, y: 1.05, w: 4.65, h: 4.65 * 733 / 600, altText: t.hero.photoAlt });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.45, y: 5.35, w: 2.85, h: 0.78, rectRadius: 0.14, fill: { color: BG }, line: { color: INK, width: 1.5 }, shadow: hardShadow(4) });
    s.addShape(pres.shapes.OVAL, { x: 7.65, y: 5.63, w: 0.2, h: 0.2, fill: { color: SUN }, line: { color: INK, width: 0.75 } });
    text(s, t.hero.badge, { x: 7.97, y: 5.38, w: 2.25, h: 0.72, fontSize: 11.5, bold: true, color: INK, valign: 'middle' });
}

// ---------- 2. About + quick facts ----------
{
    const s = lightSlide();
    brand(s);
    eyebrow(s, t.about.label);
    const [lead, accent] = t.about.title;
    title(s, [{ text: `${lead} ` }, { text: ` ${accent} `, options: { highlight: SUN } }], { h: 1.2, w: 11.5, fontSize: 30 });

    sun(s, M, 2.45, 4.7, 4.45);
    t.facts.forEach(([label, value], i) => {
        const y = 2.75 + i * 1.02;
        text(s, label.toUpperCase(), { x: M + 0.35, y, w: 4.0, h: 0.28, fontSize: 10, bold: true, color: INK, charSpacing: 1 });
        text(s, value, { x: M + 0.35, y: y + 0.3, w: 4.0, h: 0.6, fontSize: 14, bold: true, color: INK });
    });
    text(s, t.about.p1, { x: 5.85, y: 2.5, w: 6.85, h: 2.4, fontSize: 16, color: INK, lineSpacingMultiple: 1.25 });
    text(s, t.about.p2, { x: 5.85, y: 4.65, w: 6.85, h: 1.4, fontSize: 15, color: MUTED, lineSpacingMultiple: 1.25 });
    s.addImage({ data: img('dots-ink'), x: 10.9, y: 5.6, w: 2.0, h: 1.45 });
}

// ---------- 3. Experience: rows, the current job tagged NOW ----------
{
    const s = lightSlide();
    brand(s);
    eyebrow(s, t.experience.label);
    title(s, t.experience.title);

    const top = 1.95;
    const rowH = 1.22;
    rule(s, top);
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: top - 0.025, w: 1.4, h: 0.05, fill: { color: SUN }, line: { color: SUN, width: 0 } });
    t.experience.jobs.forEach((job, i) => {
        const y = top + i * rowH;
        text(s, job.date, { x: M, y: y + 0.24, w: 2.1, h: 0.28, fontSize: 12, bold: true, color: INK });
        text(s, job.location, { x: M, y: y + 0.52, w: 2.1, h: 0.26, fontSize: 11, color: MUTED });
        if (job.current) {
            sun(s, M, y + 0.84, 0.62, 0.24, { rectRadius: 0.05, line: { color: SUN, width: 0 } });
            text(s, t.experience.now.toUpperCase(), { x: M, y: y + 0.84, w: 0.62, h: 0.24, fontSize: 9, bold: true, color: INK, align: 'center', valign: 'middle', charSpacing: 1 });
        }
        text(s, job.role, { x: 2.85, y: y + 0.22, w: 3.7, h: 0.36, fontSize: 17, bold: true, color: INK });
        text(s, job.company, { x: 2.85, y: y + 0.6, w: 3.7, h: 0.3, fontSize: 12, color: MUTED });
        text(s, job.summary, { x: 6.75, y: y + 0.22, w: 5.95, h: 0.58, fontSize: 13, color: INK });
        text(s, job.tags.join(' · '), { x: 6.75, y: y + 0.82, w: 5.95, h: 0.26, fontSize: 10.5, bold: true, color: MUTED });
        rule(s, y + rowH);
    });
}

// ---------- 4. Toolbox: one row per group, plain chips ----------
{
    const s = lightSlide();
    brand(s);
    eyebrow(s, t.about.toolbox);
    title(s, 'My toolbox');
    sun(s, M, 1.68, 0.9, 0.08, { rectRadius: 0.04, line: { color: SUN, width: 0 } });

    const top = 2.1;
    const rowH = 1.15;
    skillGroups.forEach((g, i) => {
        const y = top + i * rowH;
        text(s, t.skills.groups[g.key].toUpperCase(), { x: M, y: y + 0.36, w: 2.1, h: 0.3, fontSize: 11, bold: true, color: MUTED, charSpacing: 1 });
        // Chips laid out by estimated width, wrapping inside the row.
        let cx = 2.85;
        let cy = y + 0.3;
        g.tools.forEach((tool) => {
            const w = 0.36 + tool.name.length * 0.105;
            if (cx + w > W - M) { cx = 2.85; cy += 0.48; }
            s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w, h: 0.38, rectRadius: 0.08, fill: { color: BG }, line: { color: LINE, width: 1 } });
            text(s, tool.name, { x: cx, y: cy, w, h: 0.38, fontSize: 12, bold: true, color: INK, align: 'center', valign: 'middle' });
            cx += w + 0.12;
        });
        if (i < skillGroups.length - 1) rule(s, y + rowH);
    });
}

// ---------- 5. Projects: featured card with the replayed Cypress run ----------
{
    const s = lightSlide();
    brand(s);
    eyebrow(s, t.projects.label);
    title(s, t.projects.title);

    const [feat, ...rest] = t.projects.items;
    sun(s, M, 1.95, 5.5, 4.95);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M + 0.35, y: 2.25, w: 2.9, h: 0.36, rectRadius: 0.07, fill: { color: INK }, line: { color: INK, width: 0 } });
    text(s, `${t.projects.featured} · ${feat.type}`, { x: M + 0.35, y: 2.25, w: 2.9, h: 0.36, fontSize: 11, bold: true, color: BG, align: 'center', valign: 'middle' });

    // Same replayed run the site shows (src/components/Projects.jsx).
    const px = M + 0.35;
    const pw = 4.8;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: 2.8, w: pw, h: 2.3, rectRadius: 0.1, fill: { color: INK }, line: { color: INK, width: 0 } });
    text(s, [{ text: 'cypress-e2e.cy.js' }], { x: px + 0.2, y: 2.92, w: 3, h: 0.25, fontSize: 9.5, fontFace: MONO, color: SKY_MUTED });
    text(s, t.projects.sampleRun, { x: px + pw - 1.7, y: 2.92, w: 1.5, h: 0.25, fontSize: 9.5, fontFace: MONO, color: SKY_MUTED, align: 'right' });
    s.addShape(pres.shapes.LINE, { x: px + 0.2, y: 3.22, w: pw - 0.4, h: 0, line: { color: '3A3C60', width: 0.75 } });
    const run = [
        ['✓ ', 'should login with valid credentials', '1.8s', true],
        ['  ↳ ', 'POST /api/auth/login → 200 OK', ''],
        ['  ↳ ', 'Redirected to /dashboard', ''],
        ['✓ ', 'should add item to cart', '2.3s', true],
        ['  ↳ ', 'Login via API → 200 OK', ''],
        ['  ↳ ', 'Added to cart → badge shows "1"', ''],
        ['', '2 passing · 0 failing', '4.1s', true],
    ];
    const lineOpts = (i) => (i < run.length - 1 ? { breakLine: true } : {});
    // No empty runs: pptxgenjs turns one into a second <a:pPr>, which PowerPoint refuses.
    text(s, run.flatMap(([mark, body, , strong], i) => [
        ...(mark ? [{ text: mark, options: { color: SUN, bold: true } }] : []),
        { text: body, options: { color: strong ? BG : SKY_MUTED, bold: !!strong, ...lineOpts(i) } },
    ]), { x: px + 0.2, y: 3.32, w: pw - 1.0, h: 1.7, fontSize: 10, fontFace: MONO, lineSpacing: 14.5 });
    text(s, run.map(([, , time], i) => ({ text: time || ' ', options: lineOpts(i) })),
        { x: px + pw - 0.9, y: 3.32, w: 0.7, h: 1.7, fontSize: 10, fontFace: MONO, color: SKY_MUTED, align: 'right', lineSpacing: 14.5 });

    text(s, feat.title, { x: px, y: 5.3, w: pw, h: 0.55, fontSize: 26, bold: true, color: INK });
    text(s, feat.desc, { x: px, y: 5.88, w: pw, h: 0.55, fontSize: 13, color: INK });
    text(s, feat.tags.join(' · '), { x: px, y: 6.48, w: pw, h: 0.28, fontSize: 10.5, bold: true, color: INK });

    rest.forEach((p, i) => {
        const y = 1.95 + i * 1.0;
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.4, y, w: W - M - 6.4, h: 0.88, rectRadius: 0.14, fill: { color: BG }, line: { color: LINE, width: 1 } });
        text(s, p.title, { x: 6.65, y: y + 0.14, w: 3.5, h: 0.32, fontSize: 15, bold: true, color: INK });
        text(s, sourceIds.includes(p.id) ? `${p.type} · code on the portfolio` : p.type, { x: 6.65, y: y + 0.5, w: 3.5, h: 0.26, fontSize: 10.5, color: MUTED });
        text(s, p.desc, { x: 10.25, y: y + 0.1, w: 2.3, h: 0.68, fontSize: 10.5, color: MUTED, valign: 'middle' });
    });
}

// ---------- 6. How I test ----------
{
    const s = lightSlide();
    brand(s);
    eyebrow(s, 'Approach');
    title(s, 'How I approach testing');

    const steps = [
        'Read the requirements (SRS) first to set the scope',
        'Write test scenarios and test cases before executing',
        'Combine manual exploration with Cypress automation',
        'Cover APIs and load with K6',
        'Report bugs with clear steps and follow the fix with developers',
    ];
    steps.forEach((step, i) => {
        const y = 2.0 + i * 0.95;
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: 0.55, h: 0.55, rectRadius: 0.1, fill: { color: BG }, line: { color: INK, width: 1.5 } });
        text(s, String(i + 1), { x: M, y, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: INK, align: 'center', valign: 'middle' });
        text(s, step, { x: M + 0.8, y: y + 0.04, w: 6.4, h: 0.5, fontSize: 16, color: INK, valign: 'middle' });
    });
    sun(s, 8.0, 1.95, 4.73, 3.55, { shadow: hardShadow(6) });
    text(s, '“', { x: 8.35, y: 2.15, w: 1, h: 0.9, fontSize: 64, bold: true, color: INK });
    text(s, 'Bug reports developers can reproduce on the first try.', { x: 8.35, y: 3.1, w: 4.0, h: 2.0, fontSize: 24, bold: true, color: INK });
    text(s, 'Steps, evidence, expected vs actual.', { x: 8.35, y: 4.75, w: 4.0, h: 0.4, fontSize: 14, color: INK });
    s.addImage({ data: img('dots-ink'), x: 10.7, y: 5.75, w: 2.0, h: 1.45 });
}

// ---------- 7. Contact: the site's dark panel ----------
{
    const s = lightSlide();
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.35, y: 0.3, w: W - 0.7, h: 6.9, rectRadius: 0.3, fill: { color: INK }, line: { color: INK, width: 0 } });
    s.addImage({ data: img('dots-sky'), x: 4.6, y: 5.55, w: 2.4, h: 1.6 });
    brand(s, true);
    eyebrow(s, t.contact.label, SKY_MUTED);
    title(s, t.contact.title[0], { y: 2.0, w: 6.4, h: 1.5, fontSize: 40, color: BG });
    text(s, t.contact.title[1], { x: M, y: 3.55, w: 6.4, h: 0.7, fontSize: 30, bold: true, color: SUN });
    text(s, t.contact.body, { x: M, y: 4.5, w: 6.0, h: 0.8, fontSize: 16, color: SKY_MUTED });

    sun(s, 7.65, 1.55, 5.1, 4.6);
    const rows = [
        ['Email', profile.email, `mailto:${profile.email}`],
        ['LinkedIn', profile.linkedin.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''), profile.linkedin],
        ['GitHub', profile.github.replace(/^https:\/\//, ''), profile.github],
        ['WhatsApp', profile.phone, profile.whatsapp],
    ];
    rows.forEach(([label, value, url], i) => {
        const y = 1.95 + i * 1.0;
        text(s, label.toUpperCase(), { x: 8.05, y, w: 4.3, h: 0.28, fontSize: 10, bold: true, color: INK, charSpacing: 1 });
        text(s, [{ text: value, options: { hyperlink: { url } } }], { x: 8.05, y: y + 0.3, w: 4.5, h: 0.4, fontSize: 16, bold: true, color: INK });
    });
}

// ---------- write + inject Morph ----------
const MORPH = '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
    + '<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">'
    + '<p:transition spd="slow"><p159:morph option="byObject"/></p:transition></mc:Choice>'
    + '<mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>';

const zip = await JSZip.loadAsync(await pres.write({ outputType: 'nodebuffer' }));
const slides = Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f));
for (const f of slides) {
    const xml = await zip.file(f).async('string');
    if (!xml.includes('</p:clrMapOvr>')) throw new Error(`${f}: no clrMapOvr to anchor the transition`);
    // pptxgenjs writes an <a:pPr> before every styled run, even mid-paragraph; PowerPoint refuses
    // the file. Paragraph properties are only valid at the start, so drop the stray ones.
    const fixed = xml.replace(/<\/a:r><a:pPr\b[^>]*?(?:\/>|>.*?<\/a:pPr>)(?=<a:r>)/g, '</a:r>');
    // <p:transition> must come right after <p:clrMapOvr> and before <p:timing>.
    zip.file(f, fixed.replace('</p:clrMapOvr>', `</p:clrMapOvr>${MORPH}`));
}
// Repack files only: folder entries make the deck fail to open from some cloud drives.
const out = new JSZip();
for (const [name, entry] of Object.entries(zip.files)) {
    if (!entry.dir) out.file(name, await entry.async('nodebuffer'), { createFolders: false });
}
writeFileSync(OUT, await out.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
console.log(`wrote ${OUT} (${slides.length} slides, Morph on each)`);
