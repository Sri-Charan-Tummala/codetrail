# CodeTrail

A phone-friendly interview-prep app for Platform/SRE, DevOps, storage, security and Python automation roles.
Plain HTML, CSS and JavaScript: no build step, no server, no accounts. Progress stays in your browser.

## What's inside
- **8 tracks, 68 lessons:** Python · DevOps/SRE (incl. CKA-level Kubernetes) · Automation · Concepts · Storage · Security (CompTIA Security+ SY0-701 domains) · Cloud (AWS) · Real-world outages.
- **Every question explained:** a full walkthrough, plus why each wrong option is wrong.
- **Write-it-yourself tasks:** commands are checked automatically; explanations are self-scored against key points.
- **32 Python drills** that run real Python in the browser (Pyodide in a Web Worker), with an **interview mode** (timed, no hints).
- **IDE:** several files that import each other, input and arguments, a built-in pytest runner, templates, and a .zip download.
- **Q&A deck** with spaced repetition, mock interviews and an incident simulator.
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

## Run it
Open `index.html` in a browser, or serve the folder: `python3 -m http.server` → http://localhost:8000.
To install on iPhone, open the hosted page in Safari → Share → Add to Home Screen.

## Tests
See [tests/emulator/README.md](tests/emulator/README.md).

All explanations are written in our own words; official sources are linked, not copied — see [docs/SOURCES.md](docs/SOURCES.md).
