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

## Phase 2 - Admin CRUD
**Depends on:** Phase 1

### Tasks
- [x] Convert `src/pages/AdminPage.tsx` from read-only table to full create/edit/delete UI.
- [x] Connect form actions to `createProduct`, `updateProduct`, and `deleteProduct` methods.
- [x] Add validation for required fields: `name`, `description`, `price`, `imageUrl`, `purchaseUrl`, `modelUrl`.
- [x] Add loading and error states for all admin operations.

### Acceptance criteria
- [x] Admin can create a product and see it in list immediately.
- [x] Admin can edit and persist product fields.
- [x] Admin can delete a product with confirmation flow.

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

## Phase 4 - Storage uploads
**Depends on:** Phases 1-3

### Tasks
- [ ] Add file upload controls (image + model) in `src/pages/AdminPage.tsx`.
- [ ] Add Firebase Storage upload helpers in `src/services/`.
- [ ] Save resulting download URLs into product docs (`imageUrl`, `modelUrl`).
- [ ] Ensure catalog/product pages consume stored URLs.

### Acceptance criteria
- [ ] Admin uploads image and model files successfully.
- [ ] Uploaded `imageUrl` appears in `src/components/catalog/ProductCard.tsx`.
- [ ] Uploaded `modelUrl` appears in `src/components/viewer/ProductViewer.tsx`.

---

## Phase 5 - Security rules
**Depends on:** Phases 1-4

### Tasks
- [ ] Add Firebase config/rules files in repo root: `firebase.json`, `firestore.rules`, `storage.rules`.
- [ ] Allow public/authorized reads as intended, but restrict writes to admin users only.
- [ ] Align backend role logic with `src/features/auth/RequireRole.tsx` and user role source.

### Acceptance criteria
- [ ] Non-admin users cannot create/update/delete products.
- [ ] Non-admin users cannot upload or overwrite assets.
- [ ] Admin users can complete CRUD and upload actions.

---

## Phase 6 - Responsive polish
**Depends on:** Phases 1-5

### Tasks
- [ ] Improve small-screen layout in `src/index.css` for header, grid, table, and viewer canvas.
- [ ] Improve admin table mobile usability in `src/pages/AdminPage.tsx`.
- [ ] Optimize product action button layout in `src/pages/ProductPage.tsx`.
- [ ] Decide on styling strategy: hybrid CSS + Tailwind or fuller Tailwind migration.

### Acceptance criteria
- [ ] No major overflow/cutoff issues on common mobile widths.
- [ ] Admin actions are usable on touch devices.
- [ ] Viewer and CTA controls remain visible and accessible across breakpoints.

---

## Phase 7 - Optional backlog
**Depends on:** Phases 1-6

### Tasks
- [ ] Add favorites/preferences data model to `src/domain/types.ts` and service methods in `src/domain/services.ts`.
- [ ] Add saved-item UI in `src/pages/CatalogPage.tsx` and/or `src/pages/ProductPage.tsx`.
- [ ] Add optional viewer enhancements (auto-rotate toggle, reset camera).

### Acceptance criteria
- [ ] Signed-in users can save and view favorites.
- [ ] Optional viewer controls do not regress core interactions.

---

## Delivery order
- [ ] Execute in order: **1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7**.
- [ ] Do not start Storage/Security before Firebase adapters are stable.
- [ ] Keep optional features as backlog until all core criteria pass.

