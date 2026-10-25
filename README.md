# 🐍 Python Quiz – Lecture 1

A simple, mobile-friendly MCQ quiz based on **Lecture 1: Introduction to Programming and Python** (Fundamentals of Programming with Python).

It is a single HTML file. No installation, no server, no API key needed.

## Features

- **40-question bank**, written in the same words as the lecture notes
- Every attempt shows **20 random questions**, and the options are shuffled too
- **One question at a time**: once an option is selected, it is locked and the next question opens
- **3 attempts** per browser. Leaving the quiz midway (closing or refreshing the page) counts as one attempt
- **Pass mark: 12 / 20.** Fewer than 12 correct answers means FAIL
- Final result with score, percentage, and a review of every question showing your answer and the correct answer
- Reminder at the end: *Take a screenshot of your result and send it to your CR.*

## How to use it on GitHub Pages

1. Create a new **public** repository on GitHub.
2. Upload `index.html` (rename `python-quiz-v2.html` to `index.html` first).
3. Go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**, then select `main` and `/ (root)`, and press **Save**.
5. After a minute or two your quiz is live at:
   `https://<your-username>.github.io/<repository-name>/`
6. Share that link in your WhatsApp group.

## Customising the quiz

Open `index.html` in any text editor.

| What to change | What to look for |
| --- | --- |
| Questions | `const BANK=[ ... ]` (each item is `[question, [options], 0]`; the first option is the correct one, and options are shuffled automatically) |
| Number of questions per attempt | `TOTAL` (default 20) |
| Number of attempts | `MAX` (default 3) |
| Pass mark | `PASS` (default 12) |
| Message shown on FAIL | `ROAST` |

## Good to know

- Attempts and scores are saved in the **student's own browser** (`localStorage`). Clearing browser data, using incognito mode, or switching to another device gives a fresh start. This is a limit of a quiz that has no server.
- The quiz has an owner-only reset for testing. Keep that code private and do not share it in the group.

## Built with

Plain HTML, CSS and JavaScript. Source material: *Fundamentals of Programming with Python – Lecture 1* by Rana Faraz.
