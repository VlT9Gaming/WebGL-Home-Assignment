# Implementation Task Board Checklist

## How to use this board
- Work top-to-bottom by phase.
- Do not start the next phase until current acceptance criteria are checked.
- Keep `src/services/serviceContainer.ts` as the switching point so UI files stay backend-agnostic.

## Phase 1 - Firebase foundation
**Depends on:** None

### Tasks
- [x] Move Firebase keys from `src/firebase-config.ts` into Vite env vars (`.env`) and keep only app initialization in code.
- [x] Add Firebase-backed adapters in `src/services/` that implement `AuthService` and `ProductService` from `src/domain/services.ts`.
- [x] Update `src/services/serviceContainer.ts` to use Firebase services instead of mock services.
- [x] Remove mock fallback and keep a Firebase-only service container.

### Acceptance criteria
- [x] App initializes Firebase from env vars.
- [x] `AuthContext` and product pages call `services.*` without direct Firebase SDK calls.
- [x] No hardcoded Firebase secrets remain in tracked source.

---

## Phase 2 - Admin pricing controls
**Depends on:** Phase 1

### Tasks
- [x] Restrict `src/pages/AdminPage.tsx` to update-only actions for existing products.
- [x] Remove create/delete product actions from admin UI and service usage.
- [x] Add discount fields in `src/domain/types.ts` and map them in `src/services/firebase/firebaseProductService.ts`.
- [x] Add price + discount validation and update states in `src/pages/AdminPage.tsx`.

### Acceptance criteria
- [x] Admin can update base price for an existing product and persist it.
- [x] Admin can apply and persist discount values for an existing product.
- [x] Admin cannot create or delete products from the implementation UI.

---

## Phase 3 - Real 3D model loading
**Depends on:** Phase 2

### Tasks
- [x] Update `src/components/viewer/ProductViewer.tsx` to load GLTF/GLB from `product.modelUrl`.
- [x] Keep `PlaceholderFurniture` as fallback when model URL is missing or invalid.
- [x] Add model loading and error UI states.
- [ ] Verify camera presets from `src/pages/ProductPage.tsx` still work.

### Acceptance criteria
- [ ] Valid model URLs render interactively.
- [ ] Invalid/missing model URLs fall back cleanly without crashes.
- [ ] Orbit controls, zoom, and camera view switching still work.

---

## Phase 4 - Security rules
**Depends on:** Phases 1-3

### Tasks
- [x] Add Firestore rules file in repo root: `firestore.rules` and wire it with `firebase.json`.
- [x] Allow public/authorized reads as intended, but restrict product price/discount writes to admin users only.
- [x] Align backend role logic with `src/features/auth/RequireRole.tsx` and user role source.

### Acceptance criteria
- [ ] Non-admin users cannot update product price/discount fields.
- [ ] Admin users can update price/discount fields.
- [ ] No storage-specific write paths are required for this implementation.

---

## Phase 5 - Responsive polish
**Depends on:** Phases 1-4

### Tasks
- [x] Improve small-screen layout in `src/index.css` for header, grid, table, and viewer canvas.
- [x] Improve admin table mobile usability in `src/pages/AdminPage.tsx`.
- [x] Optimize product action button layout in `src/pages/ProductPage.tsx`.
- [x] Decide on styling strategy: hybrid CSS + Tailwind or fuller Tailwind migration. (Chosen: hybrid CSS + Tailwind)

### Acceptance criteria
- [ ] No major overflow/cutoff issues on common mobile widths.
- [ ] Admin actions are usable on touch devices.
- [ ] Viewer and CTA controls remain visible and accessible across breakpoints.

---

## Phase 6 - Optional backlog
**Depends on:** Phases 1-5

### Tasks
- [x] Add favorites/preferences data model to `src/domain/types.ts` and service methods in `src/domain/services.ts`.
- [x] Add saved-item UI in `src/pages/CatalogPage.tsx` and/or `src/pages/ProductPage.tsx`.
- [x] Add optional viewer enhancements (auto-rotate toggle, reset camera).

### Acceptance criteria
- [x] Signed-in users can save and view favorites.
- [x] Optional viewer controls do not regress core interactions.

---

## Delivery order
- [ ] Execute in order: **1 -> 2 -> 3 -> 4 -> 5 -> 6**.
- [ ] Do not start Security rules before Firebase adapters and viewer loading are stable.
- [ ] Keep optional features as backlog until all core criteria pass.

