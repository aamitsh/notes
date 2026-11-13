// =============================================================
//  YOUR MENU — edit this list to add subjects and chapters.
//
//  Each chapter is an object:
//    { title: "Ch 1 – Work, Energy & Simple Machines",
//      notes: "Work_Energy_Simple_Machines_Notes.html",  // notes page (HTML)
//      tests: [                                            // one or more test PDFs
//        ["Work_Energy_Test_Set1.pdf", "Set 1"],
//        ["Work_Energy_Test_Set2.pdf", "Set 2"]
//      ] }
//
//  • notes  → an HTML file in the subject folder.
//  • tests  → PDF files in the SAME subject folder. A chapter can have
//             any number of tests (or none). Each entry is either
//             "file.pdf"            (auto-labelled Test 1, Test 2, …)  or
//             ["file.pdf", "Label"] (your own label).
//  The old short form  ["file.html", "Title"]  still works
//  (it is treated as a notes-only chapter).
// =============================================================
const NOTES = [
  { subject: "Physics", folder: "physics", chapters: [
    { title: "Ch 1 – Work, Energy & Simple Machines",
      notes: "Work_Energy_Simple_Machines_Notes.html",
      tests: [["tests/Work_Energy_Test_Set1.pdf", "Set 1"], ["tests/Work_Energy_Test_Set2.pdf", "Set 2"],
              ["tests/CBSE_Work_Energy_Test_Set1.pdf", "CBSE Set 1"], ["tests/CBSE_Work_Energy_Test_Set2.pdf", "CBSE Set 2"]] },
    { title: "Ch 2 – Kinematics",     notes: "ch01-kinematics.html",     tests: [] },
    { title: "Ch 3 – Laws of Motion", notes: "ch02-laws-of-motion.html", tests: [] }
  ]},
  { subject: "Chemistry", folder: "chemistry", chapters: [
    { title: "Ch 1 – Atomic Structure", notes: "ch01-atomic-structure.html", tests: [] },
    { title: "Ch 2 – Chemical Bonding", notes: "ch02-chemical-bonding.html", tests: [] }
  ]},
  { subject: "Maths", folder: "maths", chapters: [
    { title: "Ch 1 – Sets",         notes: "ch01-sets.html",         tests: [] },
    { title: "Ch 2 – Trigonometry", notes: "ch02-trigonometry.html", tests: [] }
  ]}
];

// ---------- You don't need to edit below this line ----------
(function () {
  const root = document.body.dataset.root || "";
  const path = decodeURIComponent(location.pathname);

  // Normalise a chapter into { title, notes, tests:[{file,label}] }.
  const norm = c => {
    if (Array.isArray(c)) return { title: c[1], notes: c[0], tests: [] };
    const tests = (c.tests || []).map((t, i) =>
      Array.isArray(t) ? { file: t[0], label: t[1] } : { file: t, label: `Test ${i + 1}` });
    return { title: c.title, notes: c.notes || null, tests };
  };

  const isActive = (folder, file) => !!file && path.endsWith(`/${folder}/${file}`);

  const flat = [];            // ordered list of notes pages for prev/next
  let html = `<a class="home" href="${root}index.html">🏠 Home</a>
    <input id="navsearch" type="search" placeholder="Filter chapters…">`;

  NOTES.forEach(s => {
    html += `<div class="subject"><h3>${s.subject}</h3><ul>`;
    s.chapters.forEach(raw => {
      const c = norm(raw);
      const notesHref = c.notes ? `${root}${s.folder}/${c.notes}` : null;
      const notesActive = isActive(s.folder, c.notes);
      if (notesHref) flat.push({ href: notesHref, title: c.title, subject: s.subject, active: notesActive });

      const titleHtml = notesHref
        ? `<a href="${notesHref}"${notesActive ? ' class="active"' : ''}>${c.title}</a>`
        : `<span class="ch-title">${c.title}</span>`;
      const testsHtml = c.tests.length
        ? `<span class="tests">` + c.tests.map(t =>
            `<a class="test-link" href="${root}${s.folder}/${t.file}" target="_blank" rel="noopener" title="Open test PDF">📄 ${t.label}</a>`
          ).join("") + `</span>`
        : "";
      html += `<li class="chapter">${titleHtml}${testsHtml}</li>`;
    });
    html += `</ul></div>`;
  });

  const nav = document.getElementById("sidebar");
  if (nav) nav.innerHTML = html;

  // Filter box
  const box = document.getElementById("navsearch");
  if (box) box.addEventListener("input", () => {
    const q = box.value.toLowerCase();
    document.querySelectorAll("#sidebar .subject").forEach(div => {
      let any = false;
      div.querySelectorAll("li").forEach(li => {
        const show = li.textContent.toLowerCase().includes(q) ||
                     div.querySelector("h3").textContent.toLowerCase().includes(q);
        li.style.display = show ? "" : "none";
        if (show) any = true;
      });
      div.style.display = any ? "" : "none";
    });
  });

  // Previous / Next chapter buttons (flows through notes pages)
  const i = flat.findIndex(c => c.active);
  const pn = document.getElementById("prevnext");
  if (pn && i >= 0) {
    const p = flat[i - 1], n = flat[i + 1];
    pn.innerHTML = (p ? `<a href="${p.href}">← ${p.title}</a>` : "<span></span>") +
                   (n ? `<a href="${n.href}">${n.title} →</a>` : "<span></span>");
  }

  // Subject cards on the home page
  const cards = document.getElementById("subjects");
  if (cards) cards.innerHTML = NOTES.map(s => `
    <div class="card"><h2>${s.subject}</h2><ol>` +
    s.chapters.map(raw => {
      const c = norm(raw);
      const notesLink = c.notes
        ? `<a href="${root}${s.folder}/${c.notes}">${c.title}</a>`
        : `<span>${c.title}</span>`;
      const testLinks = c.tests.map(t =>
        `<a class="test-link" href="${root}${s.folder}/${t.file}" target="_blank" rel="noopener">📄 ${t.label}</a>`
      ).join("");
      return `<li>${notesLink}${testLinks ? `<span class="tests">${testLinks}</span>` : ""}</li>`;
    }).join("") +
    `</ol></div>`).join("");

  // Mobile menu toggle
  const btn = document.getElementById("menubtn");
  if (btn && nav) btn.onclick = () => nav.classList.toggle("open");
})();
