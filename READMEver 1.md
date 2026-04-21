# 3D Furniture Preview Front End

React + TypeScript + Vite implementation of the proposal, with an architecture that is easy to wire to Firebase later.

## What is included

- Public pages: home, catalog, product detail (with interactive 3D viewer), login
- Role-gated admin route scaffold (`/admin`)
- Service interfaces (`AuthService`, `ProductService`) to decouple UI from backend
- Mock backend adapters so UI can run now without Firebase
- React Three Fiber + Drei placeholder furniture mesh in the viewer

## Project structure

- `src/domain`: shared types and service contracts
- `src/services/mock`: in-memory mock implementations and seed data
- `src/services/serviceContainer.ts`: central service wiring point
- `src/features/auth`: auth context and role guard
- `src/components`: layout, product card, 3D viewer
- `src/pages`: route-level pages

## Run

```powershell
npm install
npm run dev
```

## Demo accounts

- Admin: `admin@furniture.demo`
- User: `user@furniture.demo`
- Password can be any 6+ chars in mock mode

## Firebase integration path

1. Add Firebase config and SDK initialization.
2. Create Firebase adapters that implement `AuthService` and `ProductService`.
3. Replace mock services in `src/services/serviceContainer.ts` with Firebase services.
4. Connect product CRUD to Firestore and model/image URLs to Firebase Storage.
5. Enforce admin-only writes with Firebase Auth + Firestore security rules.
