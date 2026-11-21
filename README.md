# CodeTrail

A phone-friendly interview-prep app for Platform/SRE, DevOps, storage, security and Python automation roles.
Plain HTML, CSS and JavaScript: no build step, no server, no accounts. Progress stays in your browser.

## What's inside
- **8 tracks, 76 lessons:** Python · DevOps/SRE (incl. CKA-level Kubernetes) · Automation · Concepts · Storage · Security (CompTIA Security+ SY0-701 domains) · Cloud (AWS) · Real-world outages.
- **Every question explained:** a full walkthrough, plus why each wrong option is wrong.
- **Write-it-yourself tasks:** commands are checked automatically; explanations are self-scored against key points.
- **32 Python drills** that run real Python in the browser (Pyodide in a Web Worker), with an **interview mode** (timed, no hints).
- **IDE:** several files that import each other, input and arguments, a built-in pytest runner, templates, and a .zip download.
- **Q&A decks** with spaced repetition: 42 questions candidates report from real interviews (each linked to its source), concepts, behavioural, HR & offer, plus mock interviews and an incident simulator.
- **Honest progress:** only active learning time counts; a focus timer for study outside the app; a 90-day calendar with per-day history; completed vs demonstrated skill.

## Project layout
```
index.html               page shell
css/app.css              styles
js/lessons.js            tracks, lessons and steps
js/content.js            Q&A decks, drills and solutions, roles, plans, simulations, option notes
js/app.js                app logic: screens, lesson engine, Q&A, Python runner, IDE, tracking
js/personal.example.js   template for your personal data
js/personal.js           your personal data — git-ignored, never committed
icons/, manifest.webmanifest, sw.js   install-to-home-screen (PWA) and offline cache
docs/SOURCES.md          official sources the content is based on
tests/emulator/          end-to-end tests on an emulated iPhone with real Python
```

## Personal data
Your job pipeline, resumes, story drafts and personal answers live in `js/personal.js`, which `.gitignore` keeps out of the repo.
To set it up, copy `js/personal.example.js` to `js/personal.js` and fill it in. The app works without it.

## Open it on your phone

There are two ways. **A** has everything, including your personal data. **B** needs no Claude account, but personal data (pipeline, stories, answers) isn't included because `js/personal.js` isn't in the repo.

### A. Your private Claude link (recommended)
**iPhone**
1. Open the CodeTrail link in **Safari** and sign in to Claude if asked.
2. Tap **Share** (square with an arrow) → **Add to Home Screen** → **Add**.
3. Open CodeTrail from the new icon.

**Android**
1. Open the CodeTrail link in **Chrome** and sign in to Claude if asked.
2. Tap **⋮** (top right) → **Add to Home screen** (or **Install app**) → **Add**.
3. Open CodeTrail from the new icon.

You can also open the link inside the Claude app on either phone.

### B. GitHub Pages (public, installable, works offline)
One-time setup on github.com: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/ (root)` → Save**.
After a minute or two the app is live at **https://sri-charan-tummala.github.io/codetrail/**. (GitHub Pages needs a public repo on the free plan.)

**iPhone:** open that address in **Safari** → **Share** → **Add to Home Screen** → **Add**. It opens full-screen like an app.
**Android:** open it in **Chrome** → **⋮** → **Install app** (or **Add to Home screen**) → **Install**.

After installing, the lessons work offline. Python drills and the IDE need internet the first time (about 10 MB).

### Moving your progress between phones or browsers
Each browser and each home-screen app keeps its own progress. On the old one go to **Progress → Download backup file**, then on the new one use **Progress → Restore from file**. **Copy progress code** and **Import** do the same through the clipboard.

## Run it on a computer
Open `index.html` in a browser, or serve the folder with `python3 -m http.server` and go to http://localhost:8000.

## Tests
See [tests/emulator/README.md](tests/emulator/README.md).

All explanations are written in our own words; official sources are linked, not copied — see [docs/SOURCES.md](docs/SOURCES.md).
