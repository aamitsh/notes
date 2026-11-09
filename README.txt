MY REVISION NOTES — QUICK GUIDE

Each chapter has:
  • NOTES — one HTML page.
  • TESTS — one or more PDF files (a chapter can have several).
Notes and test PDFs both live in the subject folder, and are listed
in assets/nav.js. The home page and the left menu link to them.

FOLDER LAYOUT (example)
  physics/
    Work_Energy_Simple_Machines_Notes.html   <- notes page (HTML)
    Work_Energy_Test_Set1.pdf                 <- chapter tests (PDF)
    Work_Energy_Test_Set2.pdf

ADD A NEW CHAPTER
1. Put the notes HTML file in the subject folder (e.g. physics/).
   (You can start from TEMPLATE-chapter.html, or use your own HTML.)
2. Put the test PDF(s) in the SAME subject folder.
3. Open assets/nav.js and add one block under that subject:
      { title: "Ch 4 – Gravitation",
        notes: "gravitation.html",
        tests: [
          ["gravitation-test-1.pdf", "Set 1"],
          ["gravitation-test-2.pdf", "Set 2"]
        ] }

TEST ENTRIES — each item in "tests" is either:
      "gravitation-test-1.pdf"            -> auto-labelled "Test 1", "Test 2", …
      ["gravitation-mock.pdf", "Mock"]    -> your own label
  Add as many as you like. Use  tests: []  (or omit it) for no test yet.

ADD A NEW SUBJECT
1. Create the folder, e.g.  biology/
2. In assets/nav.js add a block:
      { subject: "Biology", folder: "biology", chapters: [
        { title: "Ch 1 – The Cell",
          notes: "ch01-cell.html",
          tests: ["ch01-cell-test-1.pdf"] }
      ]}

NOTE BOXES YOU CAN USE (on template-based notes pages)
  <div class="formula">...</div>    blue box for formulas
  <div class="important">...</div>  yellow box for key points
  <div class="mistake">...</div>    red box for common mistakes
  <div class="tip">...</div>        green box for tips
  <details><summary>Question</summary>Answer</details>   click-to-reveal flashcard

MATHS: write equations between $ ... $  e.g.  $E = mc^2$
IMAGES: put them in an images/ folder inside the subject folder and use
  <img src="images/diagram.png" alt="diagram">
PRINT / PDF: press Ctrl+P on a notes page — the menu is hidden automatically.
