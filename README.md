<div align="center">

# Photo Gallery

**A fast, modern, and responsive photo gallery web application.**

Built with **React 19**, **Vite**, and **Tailwind CSS v4** — featuring real-time search, favourites persistence, and performance-optimized rendering.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

[Quick Start](#quick-start) · [Features](#features) · [Architecture](#architecture--design) · [Requirements](#requirements-checklist) · [Documentation](#documentation)

</div>

---

## Features

- **Photo Feed** — Fetches 30 photos from the [Picsum Photos API](https://picsum.photos/) with robust loading and error states
- **Real-time Search** — Client-side filtering by author name with zero page reloads or extra API calls
- **Favourites** — Save photos to a persistent favourites list using `useReducer` + `localStorage`
- **Fully Responsive** — Adaptive grid layout across mobile, tablet, and desktop screen sizes
- **Optimized Rendering** — `useCallback` and `useMemo` prevent unnecessary re-renders during search

---

## Quick Start

> **Prerequisites:** [Node.js](https://nodejs.org/) `>=18` must be installed.

```bash
# 1. Clone the repository
git clone https://github.com/Shaurya-Dwivedi/Photo_Gallery_WebApp

# 2. Navigate into the project directory
cd photo_gallery

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server |
| `npm run build` | Builds the app for production |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint across the codebase |

---

## Architecture & Design

> For a full deep-dive, see [ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) — includes Mermaid sequence diagrams, data flow diagrams, and detailed design rationale.

### State Management & Persistence

`useReducer` manages the favourites list, cleanly separating dispatch logic from UI components. All `localStorage` reads and writes are wrapped in `try/catch` blocks, ensuring the app remains stable even if storage is unavailable.

### Custom Hook — `useFetchPhotos`

Abstracts all network logic away from the UI layer. Uses the **`AbortController`** API to cancel in-flight requests on component unmount, preventing memory leaks — a common React networking pitfall.

```
useFetchPhotos()
  ├── Fetches from Picsum API (limit=30)
  ├── Manages { photos, loading, error } state
  └── Cleans up with AbortController on unmount
```

### Performance Optimization

Typing in the search bar triggers frequent state updates. Two memoization strategies prevent this from becoming a performance bottleneck:

| Hook | Applied To | Benefit |
| :--- | :--- | :--- |
| `useCallback` | Search & favourite handlers | Stable function references → no child re-renders |
| `useMemo` | `filteredPhotos` computation | `Array.filter` only runs when `searchQuery` or `photos` changes |

---

## Requirements Checklist

| # | Requirement | Status | Notes |
| :-: | :--- | :---: | :--- |
| 1 | React + Vite + Tailwind CSS | ✅ | Bootstrapped via Vite. Styled exclusively with Tailwind utilities — no component libraries |
| 2 | Fetch from Picsum API | ✅ | `limit=30`. Loading and error states handled via custom hook |
| 3 | Responsive Grid Layout | ✅ | `grid-cols-4` desktop · `sm:grid-cols-2` tablet · `grid-cols-1` mobile |
| 4 | Real-time Search Filter | ✅ | Client-side author name filter. No API call or page reload on search |
| 5 | Favourites with `useReducer` | ✅ | Managed via `useReducer` (not `useState`). Persisted via `localStorage` |
| 6 | Custom Hook | ✅ | `useFetchPhotos` returns `{ photos, loading, error }` |
| 7 | `useCallback` & `useMemo` | ✅ | Memoized handlers and derived state for optimized render performance |

---

## Tech Stack

| Technology | Version | Role |
| :--- | :--- | :--- |
| [React](https://react.dev/) | `^19.2.4` | UI framework |
| [Vite](https://vitejs.dev/) | `^7.0.0` | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | `^4.2.1` | Utility-first styling |
| [ESLint](https://eslint.org/) | `^9.39.4` | Code linting |

---

## Documentation

| Document | Description |
| :--- | :--- |
| [ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) | System design, data flow diagrams, and technical deep-dive |
| [BUGS.md](./docs/bugs/BUGS.md) | Bugs faced during development and their solutions |
| [Picsum Photos API](https://picsum.photos/) | The public photo API used by this application |

---

<div align="center">

Made with ❤️ by **Shaurya Dwivedi**

</div>
