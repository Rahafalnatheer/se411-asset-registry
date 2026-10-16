# Architecture – Computer Asset Registry

## Technology stack
| Concern | Choice |
|---|---|
| UI library | React 19 (function components + hooks) |
| Build tool / dev server | Vite |
| Routing | react-router-dom |
| State management | React Context + `useState` (no external state library) |
| Styling | Plain CSS (`src/index.css`) with CSS variables |
| Testing | Vitest + React Testing Library + jest-dom + user-event (jsdom) |
| AI assistance | GitHub Copilot (requirements, code, tests, docs) |

## Folder structure
```
src/
  main.jsx               entry: BrowserRouter > AssetProvider > App
  App.jsx                NavBar + route table
  data/assets.js         seed data + ASSET_TYPES / ASSET_STATUSES
  context/AssetContext.jsx   state + CRUD functions + useAssets hook
  components/NavBar.jsx  main menu
  pages/AssetList.jsx    display / search / filter / delete
  pages/AssetForm.jsx    add + edit (one component, two modes)
  pages/About.jsx        team members
  __tests__/             unit + integration tests
```

## Component tree
```
BrowserRouter
└─ AssetProvider            (owns the assets array)
   └─ App
      ├─ NavBar             (links: Computers, Add computer, About)
      └─ Routes
         ├─ "/"          → AssetList
         ├─ "/add"       → AssetForm (add)
         ├─ "/edit/:id"  → AssetForm (edit)
         └─ "/about"     → About
```

## State management
`AssetProvider` keeps the array of assets in `useState`, seeded from `data/assets.js`, and exposes through `useAssets()`:
`assets`, `addAsset(data)`, `updateAsset(id, changes)`, `deleteAsset(id)`, `getAsset(id)`.
IDs come from a counter (`useRef`) starting after the highest seed id. Pages only talk to this API, never to the array directly. This is the seam Part 2 replaces with `fetch` calls to the Spring Boot REST API.
Local UI state (search text, status filter, form values, validation errors) stays inside the page that uses it.

## Features
- Display all computers with status badges, count and total value
- Search and status filter
- Add with validation (required fields, price ≥ 0, unique asset tag)
- Edit using the same form, pre-filled
- Delete with confirmation
- Success notices after add/edit
- Main menu on every page; About page with team name + student ID
- Not-found screen for unknown edit ids; unknown URLs redirect to the list

## Testing
`npm test` runs 15 tests: context CRUD logic (unit), and rendered-app flows – navigation, list/search/filter, delete with confirm/cancel, add validation, duplicate tag, add, edit, not-found.

## Limitations (by design for Part 1)
Data resets on page refresh because nothing is persisted. Part 2 adds the backend and database.
