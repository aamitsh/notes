#!/usr/bin/env node
// Add a starter notes page to a chapter.
//   npm run new -- science 4                 (fills existing chapter 4 placeholder)
//   npm run new -- science "Describing Motion" (same, matched by title)
//   npm run new -- science "A Brand New Topic" (no match → creates the next numbered folder)
//   add --no-notes to create/use the folder without a notes page (tests-only chapter)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const noNotes = args.includes("--no-notes");
const [subject, title] = args.filter(a => !a.startsWith("--"));

if (!subject || !title) {
  console.log('Usage: npm run new -- <subject-folder> <chapter number | "Chapter title"> [--no-notes]');
  console.log('   eg: npm run new -- science 4');
  process.exit(1);
}

const slug = title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const subjectDir = path.join(ROOT, subject.toLowerCase());
fs.mkdirSync(subjectDir, { recursive: true });

const dirs = fs.readdirSync(subjectDir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);
const titleOf = d => { try { return fs.readFileSync(path.join(subjectDir, d, "title.txt"), "utf8").trim(); } catch { return ""; } };
const norm = s => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
const existing = /^\d+$/.test(title)
  ? dirs.find(d => parseInt(d, 10) === Number(title))
  : dirs.find(d => norm(titleOf(d)).startsWith(norm(title)) || d.replace(/^\d+-/, "").startsWith(slug));

let chapterDir, chapterTitle = title;
if (existing) {
  chapterDir = path.join(subjectDir, existing);
  chapterTitle = titleOf(existing) || title;
  if (fs.readdirSync(chapterDir).some(f => /\.html?$/i.test(f))) {
    console.log(`${path.relative(ROOT, chapterDir)}/ already has a notes page — nothing to do.`);
    process.exit(0);
  }
} else if (/^\d+$/.test(title)) {
  console.log(`No chapter ${title} in ${subject}/. Give a title to create a new chapter.`);
  process.exit(1);
} else {
  const nums = dirs.map(d => parseInt(d, 10)).filter(n => !isNaN(n));
  const num = String((nums.length ? Math.max(...nums) : 0) + 1).padStart(2, "0");
  chapterDir = path.join(subjectDir, `${num}-${slug}`);
  fs.mkdirSync(chapterDir);
  fs.writeFileSync(path.join(chapterDir, "title.txt"), title + "\n");
}

const config = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));
const subjectName = config.subjects?.[subject.toLowerCase()]?.name || subject[0].toUpperCase() + subject.slice(1);

if (!noNotes) {
  const tpl = fs.readFileSync(path.join(ROOT, "templates", "notes-template.html"), "utf8");
  const escTitle = chapterTitle.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  fs.writeFileSync(path.join(chapterDir, "notes.html"),
    tpl.replaceAll("{{TITLE}}", escTitle).replaceAll("{{SUBJECT}}", subjectName));
}

const rel = path.relative(ROOT, chapterDir);
console.log(`${existing ? "Using" : "Created"} ${rel}/  — ${chapterTitle}${noNotes ? "" : "  (added notes.html)"}`);
console.log(`Next: put your test PDFs in ${rel}/, then run  npm run build`);
