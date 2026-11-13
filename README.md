# 📚 Class 9 Revision Notes

CBSE Class 9 **Physics, Chemistry and Maths** notes and tests, following the new NCERT books (2026-27):
*Exploration* (Science) and *Ganita Manjari* (Maths).

A simple website with chapter-wise **notes** (HTML pages) and **practice test papers** (PDFs).
The home page builds itself from the folders. **You never edit a menu by hand.**

## How the folders work

Every PCM chapter already has a folder. Folder numbers are the **NCERT chapter numbers**. Physics and Chemistry
both come from the *Exploration* Science book, so Physics is Ch 4, 6, 7, 10 and Chemistry is Ch 5, 8, 9.

```
physics/                                    ← subject
  04-describing-motion-around-us/
    title.txt                               ← exact chapter title (placeholder = "Coming soon")
  07-work-energy-and-simple-machines/
    title.txt
    Work_Energy_Simple_Machines_Notes.html  ← notes page (any name)
    CBSE_Work_Energy_Test_Set1.pdf          ← test papers (any number of them)
    Work_Energy_Test_Set1.pdf
  10-sound-waves/
chemistry/   05-exploring-mixtures-…/  08-journey-inside-the-atom/  09-atomic-foundations-of-matter/
maths/       01-orienting-yourself/ … 14-math-of-space/
```

- **To fill a chapter, drop the notes `.html` and/or test `.pdf`s into its folder.** The "Coming soon" card
  turns into a full card with a "Read notes" button and test chips.
- **Chapter name** comes from `title.txt`, or the notes page's `<title>`, or the folder name.
- **Test labels** come from the PDF file names. Words that repeat the chapter name are dropped, so
  `CBSE_Work_Energy_Test_Set1.pdf` shows as **CBSE Set 1**.
- A chapter can have notes only, tests only, or both. Sub-folders inside a chapter (e.g. `tests/`) are fine.
- Images for a notes page can go in the chapter folder too (e.g. `images/diagram.png`).

## Add notes or tests: option A, on the GitHub website (no setup)

1. Open the repo on github.com and go into the chapter folder (e.g. `physics/04-describing-motion-around-us/`).
2. **Add file → Upload files**, drag in the notes HTML and/or test PDFs.
3. Click **Commit changes**.

A GitHub Action (`Update site menu`) then rebuilds the menu automatically. The site updates within a minute or two.

## Add notes or tests: option B, on your computer

```bash
npm run new -- physics 4               # adds a starter notes.html to Physics chapter 4
npm run new -- maths "Quadrilaterals"  # same, finding the chapter by title
# …write notes / copy PDFs into that folder…
npm run build                          # updates the menu (assets/catalog.js)
npm run preview                        # optional: view at http://localhost:8000
git add -A && git commit -m "Add Describing Motion notes" && git push
```

If the title doesn't match an existing chapter, `npm run new` creates the next numbered folder.
(If you forget `npm run build`, the GitHub Action does it for you after you push.)

## Add a new subject

Create a folder (e.g. `biology/`) with chapter folders inside. Each folder holds a `title.txt` and/or files.
Set its display name, icon and position in `site.config.json`:

```json
"biology": { "name": "Biology", "icon": "🧬", "order": 4 }
```

`site.config.json` also holds the site title, tagline, and how many days a chapter shows the **New** badge.

## Writing notes with the template

`npm run new` copies `templates/notes-template.html`, which has these ready-made boxes:

| Code | Looks like |
|---|---|
| `<div class="formula">…</div>` | blue formula box |
| `<div class="important">…</div>` | yellow key point |
| `<div class="mistake">…</div>` | red common mistake |
| `<div class="tip">…</div>` | green tip |
| `<details><summary>Q</summary>A</details>` | click-to-reveal flashcard |

Maths: write `$E = mc^2$` (MathJax). Your own fully-designed HTML pages work too. Just drop them in.

## Project files

| Path | What it is |
|---|---|
| `index.html`, `assets/app.js`, `assets/style.css` | home page |
| `assets/catalog.js` | **auto-generated** list of chapters (don't edit) |
| `assets/notes.css`, `templates/` | look of template-based notes pages |
| `tools/build.mjs` | scans folders → writes the catalog |
| `tools/new-chapter.mjs` | creates a new chapter folder |
| `.github/workflows/build-catalog.yml` | runs the build on every push |
