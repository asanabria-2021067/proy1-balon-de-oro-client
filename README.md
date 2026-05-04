# Balon de oro Tracker 🏆

Historical Balón de Oro tracker. Vanilla HTML + CSS + JS frontend, no frameworks.

## Tech Stack

- **HTML5, CSS3, JavaScript ES6+** (vanilla, no frameworks)
- **Native fetch()** for API calls
- **JSZip 3.10.1** dynamically loaded (only for Excel export)
- **Google Fonts** (Inter)

## How to Run Locally

**Option A: VS Code Live Server**
- Right click `index.html` → Open with Live Server

**Option B: Python HTTP Server**
```bash
python3 -m http.server 8080
```
Then open http://localhost:8080

**Important:** Production API is at `https://proy1-balon-de-oro-api.vercel.app/api` (already configured in `js/core/api.js`).

## Features

- **Ceremonies View**: Hero section + top 10 nominations grid with year selector (1998-2025, excluding 2020)
- **Player Management**: Full CRUD with photo upload and preview
- **Rating System**: Interactive 5-star widget with comments
- **Export**: Manual CSV and Excel (SpreadsheetML) generation
- **Dark Gold Theme**: Premium UI with CSS Grid, smooth transitions, hover effects
- **Toast Notifications**: Auto-dismiss feedback system
- **Search**: Debounced player search (300ms)

## Architecture: MVC Pattern

Clean separation of concerns using Model-View-Controller:

**CORE** → API calls + state management (no DOM, no logic)
**MODELS** → Pure transformation functions (no DOM, no fetch)
**VIEWS** → DOM manipulation only (receives processed data)
**CONTROLLERS** → Orchestration layer (api → model → view)
**UTILS** → Self-contained export logic

## Project Structure

```
├── index.html
├── css/
│   └── styles.css           # BEM methodology, dark gold theme
├── js/
│   ├── app.js               # Wires controllers, navigation, event listeners
│   ├── core/
│   │   ├── api.js           # All fetch() calls (zero DOM, zero logic)
│   │   └── state.js         # Global state management
│   ├── models/
│   │   ├── ceremony.model.js  # Pure functions: transform, filter, format
│   │   ├── player.model.js    # Pure functions: validate, transform
│   │   └── rating.model.js    # Pure functions: calculate, format
│   ├── views/
│   │   ├── ceremony.view.js   # DOM manipulation for ceremonies
│   │   ├── player.view.js     # DOM manipulation for players
│   │   ├── rating.view.js     # DOM manipulation for ratings
│   │   └── toast.view.js      # Toast notifications
│   ├── controllers/
│   │   ├── ceremony.ctrl.js   # Orchestrates ceremonies (api → model → view)
│   │   ├── player.ctrl.js     # Orchestrates players (api → model → view)
│   │   └── rating.ctrl.js     # Orchestrates ratings (api → model → view)
│   └── utils/
│       └── export.js          # CSV + Excel SpreadsheetML export
└── assets/
    ├── silhouette.svg         # Player photo fallback
    └── placeholder-hero.svg   # Hero background fallback
```

**Layer Responsibilities:**

| Layer | Can Import | Cannot Import | Purpose |
|-------|-----------|---------------|---------|
| **CORE** | Nothing | DOM, models | Fetch + state only |
| **MODELS** | Nothing | DOM, core/api | Pure data transformation |
| **VIEWS** | models (helpers) | core/api | DOM manipulation only |
| **CONTROLLERS** | All layers | Nothing | Orchestration |
| **UTILS** | core, views | models, controllers | Self-contained exports |

## Design Conventions

**BEM (Block, Element, Modifier)**
- Modular, reusable components
- Clear class structure: `block__element--modifier`
- Avoids specificity wars and naming collisions

**CSS Variables**
```css
--bg-primary: #0a0a0f
--bg-surface: #12121a
--bg-card: #1a1a2e
--color-primary: #f5c518  /* Gold */
--color-accent: #e8a900
--color-text: #ffffff
--color-muted: #888899
--color-border: #1e1e2e
```

**Responsive Breakpoints**
- Desktop: 3 columns
- Tablet (768px): 2 columns
- Mobile (480px): 1 column

## Implemented Challenges

- ✅ **[Subjetivo] Calidad visual del cliente** - Dark gold premium theme, smooth animations, responsive grid
- ✅ **[Subjetivo] Calidad del historial de Git** - Conventional commits, clean history
- ✅ **[Subjetivo] Organización del código** - MVC architecture, ES modules, BEM CSS, strict separation of concerns
- ✅ **Exportar lista** - Manual CSV + Excel (SpreadsheetML) generation with JSZip

## Backend

**Repository:** [proy1-balon-de-oro-api](https://github.com/asanabria-2021067/proy1-balon-de-oro-api)

**Stack:**
- Node.js + Express
- Supabase PostgreSQL
- Hexagonal Architecture (Ports & Adapters)
- Deployed on Vercel

## Reflection

**Would I use Vanilla JS again for a project of this scale?**

Yes, for projects where critical performance and total bundle control are priorities. Vanilla JS keeps the bundle tiny (<10KB gzipped), loads instantly, and runs without framework overhead.

However, for apps with highly dynamic state or complex forms, a framework like React or Vue would make reactivity and component reusability significantly easier. The manual DOM sync in this project works well but becomes verbose with more interactivity.

**Key Takeaway:** Vanilla JS is underrated. With ES modules, MVC architecture, and modern APIs (fetch, template literals, destructuring), you can build production-grade apps without frameworks—just requires discipline in code organization and clear separation of concerns.
