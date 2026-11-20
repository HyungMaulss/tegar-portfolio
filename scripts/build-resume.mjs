// Builds public/Tegar-Maulana-Resume.pptx from the same data the website renders.
// Run: npm run resume   (re-run after editing src/data/*)
//
// Morph: shapes that persist between slides share a "!!name" (PowerPoint's forced-match prefix),
// and every slide gets a Morph transition injected into its XML (pptxgenjs cannot write it).
import pptxgen from 'pptxgenjs';
import JSZip from 'jszip';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { translations } from '../src/data/translations.js';
import { profile, skillGroups, sourceIds } from '../src/data/profile.js';

const t = translations.en;
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const OUT = here('../public/Tegar-Maulana-Resume.pptx');
const logo = (name) => 'image/png;base64,' + readFileSync(here(`./assets/${name}.png`)).toString('base64');

// Site palette: Sky / Ink / Sun (Sun is a fill, never text on Sky).
const SKY = 'F4F6FF';
const INK = '1A1B3A';
const SUN = 'FFC83D';
const MUTED = '585A74';
const LINE = 'D7D9EA';
const SKY_MUTED = 'B9BBD6';
const FONT = 'Arial';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in
pres.author = profile.name;
pres.title = `${profile.name} | QA Engineer`;
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };

const W = 13.333;
const M = 0.6; // outer margin

const text = (slide, value, opts) => slide.addText(value, { fontFace: FONT, margin: 0, isTextBox: true, valign: 'top', ...opts });

// Persistent objects: same names on every slide so Morph tweens them.
const sun = (slide, x, y, w, h) =>
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.22, fill: { color: SUN }, line: { color: INK, width: 1.5 }, objectName: '!!sun' });
const brand = (slide, dark, x = M, y = 0.45, w = 0.82) =>
    slide.addImage({ data: logo(dark ? 'logo-sky' : 'logo-ink'), x, y, w, h: w / 1.624, objectName: '!!logo', altText: 'TM logo' });
const title = (slide, value, opts = {}) =>
    text(slide, value, { x: M, y: 0.95, w: 9.5, h: 0.75, fontSize: 32, bold: true, color: INK, objectName: '!!title', ...opts });
const eyebrow = (slide, value, color = MUTED) =>
    text(slide, value.toUpperCase(), { x: M + 1.1, y: 0.55, w: 6, h: 0.3, fontSize: 11, bold: true, color, charSpacing: 2, objectName: '!!eyebrow' });

// ---------- 1. Cover ----------
{
    const s = pres.addSlide();
    s.background = { color: INK };
    brand(s, true);
    text(s, 'Hi, I am', { x: M, y: 1.75, w: 6, h: 0.4, fontSize: 18, color: SKY_MUTED });
    title(s, profile.name, { y: 2.2, w: 6.6, h: 1.0, fontSize: 48, color: SKY });
    text(s, 'Quality Assurance Engineer', { x: M, y: 3.25, w: 6.6, h: 0.5, fontSize: 22, bold: true, color: SUN });
    text(s, `${t.hero.title[0]} ${t.hero.title[1]} ${t.hero.title[2]}`, { x: M, y: 4.05, w: 6.3, h: 1.1, fontSize: 20, color: SKY });
    text(s, `${profile.email}   ·   Jakarta, Indonesia`, { x: M, y: 6.55, w: 7, h: 0.35, fontSize: 13, color: SKY_MUTED });

    sun(s, 7.65, 0.95, 5.1, 5.6);
    const c = t.hero.checklist;
    text(s, c.title, { x: 8.05, y: 1.35, w: 3.2, h: 0.5, fontSize: 22, bold: true, color: INK });
    text(s, c.progress, { x: 11.0, y: 1.42, w: 1.4, h: 0.35, fontSize: 12, bold: true, color: INK, align: 'right' });
    c.items.forEach(([head, sub], i) => {
        const y = 2.15 + i * 0.95;
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.05, y: y + 0.05, w: 0.3, h: 0.3, rectRadius: 0.06, fill: { color: INK }, line: { color: INK, width: 0 } });
        text(s, '✓', { x: 8.05, y: y + 0.02, w: 0.3, h: 0.32, fontSize: 13, bold: true, color: SUN, align: 'center', valign: 'middle' });
        text(s, head, { x: 8.55, y, w: 3.9, h: 0.35, fontSize: 15, bold: true, color: INK });
        text(s, sub, { x: 8.55, y: y + 0.36, w: 3.9, h: 0.3, fontSize: 12, color: INK });
    });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.05, y: 5.97, w: 0.3, h: 0.3, rectRadius: 0.06, fill: { color: SUN }, line: { color: INK, width: 1, dashType: 'dash' } });
    text(s, c.next, { x: 8.55, y: 5.95, w: 3.9, h: 0.35, fontSize: 15, bold: true, color: INK, underline: { style: 'sng' } });
}

// ---------- 2. Profile ----------
{
    const s = pres.addSlide();
    s.background = { color: SKY };
    brand(s, false);
    eyebrow(s, t.about.label);
    title(s, t.about.title.join(' '), { h: 1.2, w: 11.5, fontSize: 30 });

    sun(s, M, 2.45, 4.7, 4.45);
    t.facts.forEach(([label, value], i) => {
        const y = 2.75 + i * 1.02;
        text(s, label, { x: M + 0.35, y, w: 4.0, h: 0.28, fontSize: 11, bold: true, color: INK });
        text(s, value, { x: M + 0.35, y: y + 0.3, w: 4.0, h: 0.6, fontSize: 14, bold: true, color: INK });
    });
    text(s, t.about.p1, { x: 5.85, y: 2.5, w: 6.85, h: 2.4, fontSize: 16, color: INK, lineSpacingMultiple: 1.25 });
    text(s, t.about.p2, { x: 5.85, y: 4.65, w: 6.85, h: 1.4, fontSize: 15, color: MUTED, lineSpacingMultiple: 1.25 });
}

// ---------- 3. Experience ----------
{
    const s = pres.addSlide();
    s.background = { color: SKY };
    brand(s, false);
    eyebrow(s, t.experience.label);
    title(s, t.experience.title);

    t.experience.jobs.forEach((job, i) => {
        const y = 1.95 + i * 1.32;
        if (i === 0) sun(s, M, y, W - 2 * M, 1.18);
        else s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: W - 2 * M, h: 1.18, rectRadius: 0.16, fill: { color: SKY }, line: { color: LINE, width: 1 } });
        text(s, `${job.date} · ${job.location}`, { x: M + 0.3, y: y + 0.17, w: 4.6, h: 0.28, fontSize: 11, bold: true, color: i === 0 ? INK : MUTED });
        text(s, job.role, { x: M + 0.3, y: y + 0.45, w: 4.8, h: 0.35, fontSize: 17, bold: true, color: INK });
        text(s, job.company, { x: M + 0.3, y: y + 0.8, w: 4.8, h: 0.3, fontSize: 12, color: INK });
        text(s, job.summary, { x: 5.9, y: y + 0.2, w: 6.5, h: 0.8, fontSize: 13, color: i === 0 ? INK : MUTED, valign: 'middle' });
    });
}

// ---------- 4. Toolbox ----------
{
    const s = pres.addSlide();
    s.background = { color: SKY };
    brand(s, false);
    eyebrow(s, t.about.toolbox);
    title(s, 'My toolbox');

    const cw = (W - 2 * M - 0.3) / 2;
    skillGroups.forEach((g, i) => {
        const x = M + (i % 2) * (cw + 0.3);
        const y = 1.95 + Math.floor(i / 2) * 2.35;
        if (i === 0) sun(s, x, y, cw, 2.05);
        else s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: 2.05, rectRadius: 0.16, fill: { color: SKY }, line: { color: LINE, width: 1 } });
        text(s, t.skills.groups[g.key], { x: x + 0.3, y: y + 0.25, w: cw - 0.6, h: 0.4, fontSize: 18, bold: true, color: INK });
        // Chips laid out by estimated width, wrapping inside the card.
        let cx = x + 0.3;
        let cy = y + 0.85;
        g.tools.forEach((tool) => {
            const w = 0.36 + tool.name.length * 0.105;
            if (cx + w > x + cw - 0.3) { cx = x + 0.3; cy += 0.5; }
            s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w, h: 0.38, rectRadius: 0.08, fill: { color: SKY }, line: { color: i === 0 ? INK : LINE, width: 1 } });
            text(s, tool.name, { x: cx, y: cy, w, h: 0.38, fontSize: 12, bold: true, color: INK, align: 'center', valign: 'middle' });
            cx += w + 0.12;
        });
    });
}

// ---------- 5. Work ----------
{
    const s = pres.addSlide();
    s.background = { color: SKY };
    brand(s, false);
    eyebrow(s, t.projects.label);
    title(s, t.projects.title);

    const [feat, ...rest] = t.projects.items;
    sun(s, M, 1.95, 5.3, 4.95);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M + 0.35, y: 2.3, w: 2.9, h: 0.38, rectRadius: 0.07, fill: { color: INK }, line: { color: INK, width: 0 } });
    text(s, `${t.projects.featured} · ${feat.type}`, { x: M + 0.35, y: 2.3, w: 2.9, h: 0.38, fontSize: 11, bold: true, color: SKY, align: 'center', valign: 'middle' });
    text(s, feat.title, { x: M + 0.35, y: 4.3, w: 4.6, h: 1.0, fontSize: 30, bold: true, color: INK, valign: 'bottom' });
    text(s, feat.desc, { x: M + 0.35, y: 5.4, w: 4.6, h: 0.75, fontSize: 14, color: INK });
    text(s, feat.tags.join(' · '), { x: M + 0.35, y: 6.25, w: 4.6, h: 0.3, fontSize: 11, bold: true, color: INK });

    rest.forEach((p, i) => {
        const y = 1.95 + i * 1.0;
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y, w: W - M - 6.2, h: 0.88, rectRadius: 0.14, fill: { color: SKY }, line: { color: LINE, width: 1 } });
        text(s, p.title, { x: 6.45, y: y + 0.14, w: 3.6, h: 0.32, fontSize: 15, bold: true, color: INK });
        text(s, sourceIds.includes(p.id) ? `${p.type} · code on the portfolio` : p.type, { x: 6.45, y: y + 0.5, w: 3.6, h: 0.26, fontSize: 10.5, color: MUTED });
        text(s, p.desc, { x: 10.15, y: y + 0.1, w: 2.4, h: 0.68, fontSize: 10.5, color: MUTED, valign: 'middle' });
    });
}

// ---------- 6. How I test ----------
{
    const s = pres.addSlide();
    s.background = { color: SKY };
    brand(s, false);
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
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: 0.55, h: 0.55, rectRadius: 0.1, fill: { color: INK }, line: { color: INK, width: 0 } });
        text(s, String(i + 1), { x: M, y, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: SUN, align: 'center', valign: 'middle' });
        text(s, step, { x: M + 0.8, y: y + 0.04, w: 6.4, h: 0.5, fontSize: 16, color: INK, valign: 'middle' });
    });
    sun(s, 8.0, 1.95, 4.73, 3.55);
    text(s, '“', { x: 8.35, y: 2.15, w: 1, h: 0.9, fontSize: 64, bold: true, color: INK });
    text(s, 'Bug reports developers can reproduce on the first try.', { x: 8.35, y: 3.1, w: 4.0, h: 2.0, fontSize: 24, bold: true, color: INK });
    text(s, 'Steps, evidence, expected vs actual.', { x: 8.35, y: 4.75, w: 4.0, h: 0.4, fontSize: 14, color: INK });
}

// ---------- 7. Contact ----------
{
    const s = pres.addSlide();
    s.background = { color: INK };
    brand(s, true);
    eyebrow(s, t.contact.label, SKY_MUTED);
    title(s, t.contact.title[0], { y: 2.0, w: 6.4, h: 1.5, fontSize: 40, color: SKY });
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
        text(s, label, { x: 8.05, y, w: 4.3, h: 0.28, fontSize: 11, bold: true, color: INK });
        text(s, [{ text: value, options: { hyperlink: { url } } }], { x: 8.05, y: y + 0.3, w: 4.4, h: 0.4, fontSize: 17, bold: true, color: INK });
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
    // <p:transition> must come right after <p:clrMapOvr> and before <p:timing>.
    zip.file(f, xml.replace('</p:clrMapOvr>', `</p:clrMapOvr>${MORPH}`));
}
// Repack files only: folder entries make the deck fail to open from some cloud drives.
const out = new JSZip();
for (const [name, entry] of Object.entries(zip.files)) {
    if (!entry.dir) out.file(name, await entry.async('nodebuffer'), { createFolders: false });
}
writeFileSync(OUT, await out.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
console.log(`wrote ${OUT} (${slides.length} slides, Morph on each)`);
