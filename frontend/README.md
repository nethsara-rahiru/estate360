# Estate 360 - Frontend Guide for Agents & Developers

Welcome to the **Estate 360** frontend application. This document outlines the architecture, design system, component hierarchy, backend integrations, and coding standards for AI agents and human developers extending this codebase.

---

## 1. Tech Stack Overview

- **Framework**: React 19 (JavaScript / JSX)
- **Bundler & Dev Server**: Vite 8 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS v4 using `@tailwindcss/vite`
- **Icons**: `lucide-react`
- **Utilities**: `clsx`, `tailwind-merge` (`cn` helper in `src/lib/utils.js`)
- **Linting**: ESLint 10 with `react-hooks` and `react-refresh` plugins

---

## 2. Design System & Strict UI Constraints

Follow these strict visual guidelines for any new components or UI modifications:

### 2.1 Color Palette
Use only the approved enterprise agricultural color palette:

| Name | Hex Code | Purpose in UI |
|---|---|---|
| **Dark Green** | `#1F3D2C` | Brand Primary, top navbar, primary buttons, major headings, footer |
| **Light Green** | `#D7E6DD` | Card borders, background accents, subtle badges, secondary buttons |
| **Brown** | `#8C6239` | Earthy accent tones, workflow step indicators (`01`, `02`, `03`), sub-labels |
| **Yellow** | `#F1C40F` | Status badges, highlights, and operational indicators |
| **Off-White / Cream** | `#F8F9FA` | Main application background, modal/card canvas |

### 2.2 Typography
- **Headings** (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `.font-heading`): **PT Sans** (`'PT Sans', sans-serif`)
- **Body & Controls** (`body`, `input`, `button`, `select`, `textarea`, `label`): **Ubuntu** (`'Ubuntu', sans-serif`)
- Both fonts are imported via Google Fonts at the top of `src/index.css` and linked in `index.html`.

### 2.3 Visual Rules
1. **No Rounded Buttons / Cards**: Always use square edges (`rounded-none`). Do NOT use `rounded-md`, `rounded-lg`, or `rounded-full` unless specifically asked.
2. **No Glowing Effects**: Do NOT apply neon glow drop shadows, intense box-shadow spreads, or multi-color ambient radial gradients. Maintain clean, crisp, flat borders (`border border-[#D7E6DD]`).
3. **Brand Naming**: The application is **Estate 360** (with a space). Do NOT add "AI" to the brand name or logos.

---

## 3. Directory Structure

```text
frontend/
├── index.html                   # HTML entry point with Google Fonts prefetching
├── vite.config.js               # Vite config with Tailwind plugin & dev proxy
├── package.json                 # Dependencies & scripts
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Root state controller (session & view routing)
│   ├── index.css                # Tailwind CSS v4 + theme variables + font imports
│   ├── api/
│   │   └── auth.js              # Auth API calls, token management, error formatting
│   ├── lib/
│   │   └── utils.js             # Tailwind class merging utility (cn)
│   └── components/
│       ├── Navbar.jsx           # Global sticky header with auth state actions
│       ├── ui/                  # Flat, sharp Shadcn-style primitive components
│       │   ├── button.jsx       # Flat buttons (default, outline, secondary, earth, ghost)
│       │   ├── card.jsx         # Card, CardHeader, CardTitle, CardContent, CardFooter
│       │   ├── input.jsx        # Flat border text/password/tel input
│       │   ├── label.jsx        # Accessible form label
│       │   ├── badge.jsx        # Flat status tag (yellow, light, primary, brown)
│       │   └── alert.jsx        # Flat notification banner (info, success, error, warning)
│       ├── landing/             # Public landing page sections
│       │   ├── Hero.jsx         # Value proposition & owner auth CTAs
│       │   ├── Features.jsx     # High-level highlights (Estates, Workforce, Payroll)
│       │   ├── HowItWorks.jsx   # 3-step workflow (Registration -> Setup -> Payouts)
│       │   └── Footer.jsx       # Minimal single-row brand footer
│       ├── auth/                # Authentication views
│       │   ├── OwnerLogin.jsx   # Owner sign-in form with password toggle
│       │   └── OwnerRegister.jsx# Owner profile creation form (name, email, phone, etc.)
│       └── dashboard/
│           └── OwnerDashboard.jsx # Logged-in owner portal & in-dashboard estate creation
```

---

## 4. Routing & View Management

The application uses lightweight state-driven view routing in [`src/App.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/App.jsx) (`currentView`):

- `'landing'`: Public landing page (`Hero`, `Features`, `HowItWorks`, `Footer`).
- `'login'`: Owner sign-in form (`OwnerLogin`).
- `'register'`: Owner account registration (`OwnerRegister`).
- `'dashboard'`: Authenticated Owner Portal (`OwnerDashboard`).

### User Flow & Architectural Rule
- **No Estate Registration on the Landing Page**: Public visitors can only register as an **Owner** (`OwnerRegister`).
- **Estates are registered after login**: Once authenticated, the owner can create and manage their estates directly inside [`OwnerDashboard.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/components/dashboard/OwnerDashboard.jsx) via the inline **"Register New Estate"** form.

---

## 5. Backend API Integration

The frontend communicates with the NestJS Core-API running on `http://localhost:3000`.

### 5.1 Dev Server Proxy
`vite.config.js` proxies the following paths directly to `http://localhost:3000`:
- `/auth`, `/estates`, `/crops`, `/owners`, `/iot`, `/employees`, `/assignments`, `/attendance`, `/payroll`

### 5.2 Storage & Authentication
- Session tokens are stored in `localStorage` under the key `'estate360_auth'`:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": { "id": "uuid", "email": "owner@estate.com", "role": "owner" }
  }
  ```
- Authenticated requests must pass the HTTP header:
  ```http
  Authorization: Bearer <accessToken>
  ```
- Helper functions in [`src/api/auth.js`](file:///c:/Users/thson/Desktop/estate360/frontend/src/api/auth.js):
  - `getStoredAuth()`
  - `setStoredAuth(data)`
  - `clearStoredAuth()`
  - `registerOwner(payload)`
  - `loginOwner(credentials)`
  - `fetchProfile(token)`

---

## 6. Coding & Linting Conventions

Before committing changes, agents must ensure:

1. **ESLint Cleanliness**:
   - No unused variables or unused imports (`no-unused-vars`).
   - Re-thrown errors in `catch` blocks must include `{ cause: err }` to satisfy `preserve-caught-error`.
   - Never call `setState` synchronously within the top-level body of a `useEffect` without an active-mount or async guard to avoid cascading renders.
2. **Class Names**:
   - Always merge dynamic classes using `cn(...)` from `src/lib/utils.js`.
   - Explicitly keep `rounded-none` on UI elements.
3. **Execution Mode**:
   - Sandboxed commands are preferred for builds and linting:
     ```powershell
     cd frontend
     npm run lint
     npm run build
     ```
   - Only package install commands (`npm install`) that require remote fetching should bypass the sandbox if packages are not in cache.

---

## 7. Useful Scripts

```bash
# Start local development server on port 5173
npm run dev

# Run ESLint validation
npm run lint

# Compile production bundle into dist/
npm run build

# Preview production build locally
npm run preview
```
