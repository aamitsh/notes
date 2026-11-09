// =============================================================
//  YOUR MENU — edit this list to add subjects and chapters.
//  Each chapter: ["file-name.html", "Title shown in menu"]
// =============================================================
const NOTES = [
  { subject: "Physics", folder: "physics", chapters: [
    ["ch01-kinematics.html", "Ch 1 – Kinematics"],
    ["ch02-laws-of-motion.html", "Ch 2 – Laws of Motion"]
  ]},
  { subject: "Chemistry", folder: "chemistry", chapters: [
    ["ch01-atomic-structure.html", "Ch 1 – Atomic Structure"],
    ["ch02-chemical-bonding.html", "Ch 2 – Chemical Bonding"]
  ]},
  { subject: "Maths", folder: "maths", chapters: [
    ["ch01-sets.html", "Ch 1 – Sets"],
    ["ch02-trigonometry.html", "Ch 2 – Trigonometry"]
  ]}
];

// ---------- You don't need to edit below this line ----------
(function () {
  const root = document.body.dataset.root || "";
  const path = decodeURIComponent(location.pathname);
  const flat = [];
  let html = `<a class="home" href="${root}index.html">🏠 Home</a>
    <input id="navsearch" type="search" placeholder="Filter chapters…">`;
  NOTES.forEach(s => {
    html += `<div class="subject"><h3>${s.subject}</h3><ul>`;
    s.chapters.forEach(([file, title]) => {
      const href = `${root}${s.folder}/${file}`;
      const active = path.endsWith(`/${s.folder}/${file}`);
      flat.push({ href, title, subject: s.subject, active });
      html += `<li><a href="${href}"${active ? ' class="active"' : ''}>${title}</a></li>`;
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

  // Previous / Next chapter buttons
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
    s.chapters.map(([f, t]) => `<li><a href="${root}${s.folder}/${f}">${t}</a></li>`).join("") +
    `</ol></div>`).join("");

  // Mobile menu toggle
  const btn = document.getElementById("menubtn");
  if (btn && nav) btn.onclick = () => nav.classList.toggle("open");
})();
