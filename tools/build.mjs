#!/usr/bin/env node
// Scans subject/chapter folders and writes assets/catalog.js.
//
//   <subject>/<NN-chapter-name>/   ← one folder per chapter
//       anything.html             ← notes page(s)
//       anything.pdf              ← test paper(s), any number, sub-folders OK
//
//       title.txt                 ← optional: exact chapter title (a folder with only
//                                   title.txt shows as a "Coming soon" placeholder)
//
// Run:  npm run build      (also runs automatically on GitHub after every push)

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set(["assets", "tools", "templates", "node_modules", ".git", ".github", ".history", ".claude"]);
const config = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));
const warnings = [];

const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
const posix = p => p.split(path.sep).join("/");
const titleCase = s => s.replace(/\b[a-z]/g, c => c.toUpperCase());

// "01-work-energy_simple machines" → { num: 1, words: "Work Energy Simple Machines" }
function parseName(name) {
  const m = name.match(/^(\d+)[\s._-]*(.*)$/);
  const rest = (m ? m[2] : name).replace(/\.[^.]+$/, "");
  const words = rest
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/\s+/g, " ").trim();
  return { num: m ? Number(m[1]) : null, words: titleCase(words) };
}

function htmlTitle(file) {
  const m = fs.readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->/g, "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  return m[1].replace(/\s+/g, " ")
    .replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s*[–—|-]\s*[^–—|-]*$/, s => (s.length < 25 ? "" : s)) // drop short " – Physics" suffix
    .replace(/\s+(revision\s+)?notes$/i, "")
    .trim() || null;
}

// Last git commit date for a path, falling back to file modification time.
function dateOf(abs) {
  try {
    const out = execFileSync("git", ["log", "-1", "--follow", "--format=%cI", "--", abs], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (out) return out.slice(0, 10);
  } catch {}
  return fs.statSync(abs).mtime.toISOString().slice(0, 10);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !e.name.startsWith(".") && !e.name.startsWith("_"))
    .flatMap(e => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

// Label a file, dropping words it shares with the chapter name ("Work_Energy_Test_Set1" → "Set 1").
const NOISE = new Set(["test", "tests", "paper", "papers", "notes", "note", "and", "the", "of"]);
function labelFor(file, chapterWords, fallback) {
  const words = parseName(path.basename(file)).words;
  const kept = words.split(" ").filter(w => !chapterWords.has(w.toLowerCase()) && !NOISE.has(w.toLowerCase()));
  return kept.length ? kept.join(" ") : (words || fallback);
}

function buildChapter(subjectDir, name, files) {
  const html = files.filter(f => /\.html?$/i.test(f)).sort(natural);
  const pdf = files.filter(f => /\.pdf$/i.test(f)).sort(natural);
  const titleFile = files.find(f => path.basename(f).toLowerCase() === "title.txt");
  const fixedTitle = titleFile && fs.readFileSync(titleFile, "utf8").trim();
  if (!html.length && !pdf.length && !fixedTitle) return null;   // empty folder → ignored

  const parsed = parseName(name);
  // Title priority: title.txt  →  notes page <title>  →  folder name
  const title = fixedTitle || (html[0] && htmlTitle(html[0])) || parsed.words || name;
  const chapterWords = new Set(
    (parsed.words + " " + title).toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean));
  const rel = f => posix(path.relative(ROOT, f));
  const dates = [...html, ...pdf].map(dateOf).sort();

  return {
    num: parsed.num,
    title,
    notes: html.map((f, i) => ({ href: rel(f), label: html.length > 1 ? labelFor(f, chapterWords, `Part ${i + 1}`) : "Notes" })),
    tests: pdf.map((f, i) => ({ href: rel(f), label: labelFor(f, chapterWords, `Test ${i + 1}`) })),
    updated: dates[dates.length - 1] || null,   // null = placeholder (no notes/tests yet)
    _sort: name,
  };
}

const subjects = [];
for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory() || SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
  const dir = path.join(ROOT, entry.name);
  const chapters = [];

  for (const child of fs.readdirSync(dir, { withFileTypes: true })) {
    if (child.name.startsWith(".") || child.name.startsWith("_")) continue;
    const abs = path.join(dir, child.name);
    if (child.isDirectory()) {
      const ch = buildChapter(dir, child.name, walk(abs));
      if (ch) chapters.push(ch);
    } else if (/\.(html?|pdf)$/i.test(child.name)) {
      warnings.push(`${entry.name}/${child.name} is not inside a chapter folder — shown as its own chapter. Tip: npm run new -- ${entry.name} "Chapter name"`);
      chapters.push(buildChapter(dir, child.name, [abs]));
    }
  }
  if (!chapters.length) continue;

  chapters.sort((a, b) => natural(a._sort, b._sort));
  chapters.forEach(c => delete c._sort);
  const meta = config.subjects?.[entry.name] || {};
  subjects.push({
    id: entry.name,
    name: meta.name || titleCase(entry.name.replace(/[_-]+/g, " ")),
    icon: meta.icon || "📘",
    order: meta.order ?? 99,
    chapters,
  });
}
subjects.sort((a, b) => a.order - b.order || natural(a.name, b.name));
subjects.forEach(s => delete s.order);

const catalog = { title: config.title, tagline: config.tagline, newForDays: config.newForDays ?? 14, subjects };
const out = `// AUTO-GENERATED by tools/build.mjs — do not edit by hand.\n// Add notes/tests by dropping files into chapter folders, then run: npm run build\nwindow.CATALOG = ${JSON.stringify(catalog, null, 2)};\n`;
const outFile = path.join(ROOT, "assets", "catalog.js");
const changed = !fs.existsSync(outFile) || fs.readFileSync(outFile, "utf8") !== out;
if (changed) fs.writeFileSync(outFile, out);

const nCh = subjects.reduce((n, s) => n + s.chapters.length, 0);
const nReady = subjects.reduce((n, s) => n + s.chapters.filter(c => c.updated).length, 0);
const nT = subjects.reduce((n, s) => n + s.chapters.reduce((m, c) => m + c.tests.length, 0), 0);
console.log(`${changed ? "Updated" : "No changes to"} assets/catalog.js — ${subjects.length} subject(s), ${nCh} chapter(s) (${nCh - nReady} placeholder), ${nT} test paper(s).`);
for (const s of subjects) for (const c of s.chapters) if (c.updated)
  console.log(`  ${s.name.padEnd(10)} ${c.num ?? "-"}. ${c.title}  [${c.notes.length} notes, ${c.tests.map(t => t.label).join(", ") || "no tests"}]`);
warnings.forEach(w => console.warn("  ⚠ " + w));
