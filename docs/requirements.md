# Requirements – Computer Asset Registry (SE411 Part 1)

**Asset type:** company computers (laptops, desktops, workstations, servers, tablets).
**Scope:** React frontend only. Data is held in memory in an array of objects (no database). Part 2 adds a Spring Boot REST backend.

## Data model (Asset)
| Field | Type | Rules |
|---|---|---|
| id | number | Generated automatically, never edited |
| assetTag | string | Required, unique (case-insensitive), e.g. `PC-1001` |
| name | string | Required – model name |
| type | enum | Laptop, Desktop, Workstation, Server, Tablet |
| brand | string | Required |
| assignedTo | string | Optional |
| purchaseDate | date (YYYY-MM-DD) | Required |
| status | enum | In use, In stock, In repair, Retired |
| price | number (USD) | Required, ≥ 0 |

## User stories
1. As an IT manager, I can **see all computers** in a table so I know what the company owns.
2. As an IT manager, I can **search** by tag, model, brand, type or user and **filter by status**.
3. As an IT manager, I can **add** a computer; the form validates required fields and duplicate tags.
4. As an IT manager, I can **edit** a computer; the form is pre-filled with its current values.
5. As an IT manager, I can **delete** a computer after confirming the action.
6. As a user, I can use a **menu** on every page to move between features.
7. As a visitor, I can open an **About** page showing the team members (name, student ID).

## Pages / routes
| Route | Page | Purpose |
|---|---|---|
| `/` | AssetList | Display, search, filter, edit link, delete |
| `/add` | AssetForm (add mode) | Create |
| `/edit/:id` | AssetForm (edit mode) | Update |
| `/about` | About | Team members |

## Non-functional
Responsive layout, keyboard-accessible controls with visible focus, labelled form fields, clear error messages.
