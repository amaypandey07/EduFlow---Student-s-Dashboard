# EduFlow — Student Dashboard

A modern, responsive student productivity dashboard built for academic
tracking — attendance, grades, assignments, and timetable — in a single
clean web app.

## 📋 Description

EduFlow is a SaaS-style college student portal that brings together
everything a student needs to track their academic life: attendance
percentages, subject-wise performance, assignment deadlines, and weekly
timetable — all in one polished dashboard with light/dark mode.

Built as a college project to demonstrate frontend engineering
fundamentals: semantic HTML, a CSS design system, and modular vanilla
JavaScript — no frameworks, no backend, no build tools.


## ✨ Features

- **Dashboard overview** — attendance ring, CGPA, pending assignments,
  academic performance, today's classes, recent activity
- **Academics page** — semester-wise subject performance with grades
- **Attendance tracking** — subject-wise attendance with visual warnings
  for low attendance
- **Assignment management** — full CRUD (add/edit/delete/complete),
  search, and filters, persisted via LocalStorage
- **Weekly timetable** — responsive: table on desktop, cards on mobile
- **Profile page** — editable student details, persisted via LocalStorage
- **Light / Dark mode** — persisted theme preference
- **Fully responsive** — desktop, tablet, and mobile layouts
- **Toast notifications**, modals, and micro-interactions throughout

## 📸 Screenshots

> _Add screenshots here before submission — a Dashboard (light mode),
> Dashboard (dark mode), Assignments page, and Mobile view are enough
> to show the range of the project._

```text
![Dashboard - Light Mode](screenshots/dashboard-light.png)
![Dashboard - Dark Mode](screenshots/dashboard-dark.png)
![Assignments Page](screenshots/assignments.png)
![Mobile View](screenshots/mobile.png)
```

## 🛠 Tech Stack

- HTML5 (semantic markup)
- CSS3 (custom properties / design tokens, Grid, Flexbox)
- Vanilla JavaScript (ES6+, no frameworks)
- LocalStorage (client-side persistence)
- [Font Awesome](https://fontawesome.com/) (icons, via CDN)
- [Inter](https://fonts.google.com/specimen/Inter) (typeface, via Google Fonts CDN)

No backend, no database, no build tools — everything runs directly in
the browser.

## 📁 Folder Structure

```text
student-dashboard/
├── index.html              # Dashboard (landing page)
├── pages/                  # Secondary pages
│   ├── academics.html
│   ├── attendance.html
│   ├── assignments.html
│   ├── timetable.html
│   └── profile.html
├── css/
│   ├── reset.css           # Browser default reset
│   ├── variables.css       # Design tokens (colors, spacing, light/dark theme)
│   ├── layout.css          # App shell: sidebar + header
│   ├── components.css      # Reusable UI: cards, buttons, modals, toasts
│   ├── responsive.css      # Breakpoint overrides
│   └── [page].css          # Page-specific styles
├── js/
│   ├── storage.js          # LocalStorage abstraction
│   ├── data.js              # Mock student data
│   ├── theme.js             # Dark/light mode logic
│   ├── navigation.js        # Sidebar behavior
│   ├── notifications.js     # Toast notifications
│   └── [page].js            # Page-specific logic
├── assets/
│   ├── images/
│   └── icons/
└── README.md
```

## 🚀 How to Run

No installation or build step required.

1. Clone or download this repository
2. Open `index.html` directly in a browser, **or** serve it with a
   simple local server (recommended, avoids some browser file:// quirks):
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
3. Navigate the sidebar to explore each page

## 🔮 Future Improvements

- Replace mock data (`data.js`) with real API calls to a backend
- Add user authentication
- Add a real database instead of LocalStorage
- Add unit tests for the CRUD logic
- Migrate to a component framework (React/Vue) to eliminate the HTML
  duplication that comes with a pure multi-page vanilla setup

## 🎓 Learning Outcomes

- Structuring a multi-page vanilla JS application without a framework
- Building a CSS design system with custom properties for theming
- Implementing client-side CRUD with LocalStorage persistence
- Writing modular, single-responsibility JavaScript files
- Building fully responsive layouts that restructure (not just shrink)
  across breakpoints
