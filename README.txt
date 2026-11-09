MY REVISION NOTES — QUICK GUIDE

ADD A NEW CHAPTER
1. Copy TEMPLATE-chapter.html into the subject folder (e.g. physics/).
2. Rename it, e.g. ch03-work-energy.html, and write your notes inside <main>.
3. Open assets/nav.js and add one line under that subject:
      ["ch03-work-energy.html", "Ch 3 – Work & Energy"]

ADD A NEW SUBJECT
1. Create a new folder, e.g. biology/
2. In assets/nav.js add a block:
      { subject: "Biology", folder: "biology", chapters: [
        ["ch01-cell.html", "Ch 1 – The Cell"]
      ]}

NOTE BOXES YOU CAN USE
  <div class="formula">...</div>    blue box for formulas
  <div class="important">...</div>  yellow box for key points
  <div class="mistake">...</div>    red box for common mistakes
  <div class="tip">...</div>        green box for tips
  <details><summary>Question</summary>Answer</details>   click-to-reveal flashcard

MATHS: write equations between $ ... $  e.g.  $E = mc^2$
IMAGES: put them in an images/ folder inside the subject folder and use
  <img src="images/diagram.png" alt="diagram">
PRINT / PDF: press Ctrl+P — the menu is hidden automatically.
