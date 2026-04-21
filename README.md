# 3D Furniture Preview Web Application

## Proposal Overview

A 3D web application designed for a furniture retail company to improve the online shopping experience by allowing customers to interact with furniture models in real time. Instead of relying only on static images, users can rotate, zoom, and inspect products from multiple angles before making a purchase. The application will also redirect users to the main e-commerce website to complete purchases. :contentReference[oaicite:0]{index=0}

---

## Client Scenario / Problem

A furniture retail company wants to improve the online shopping experience by helping customers better visualise products before purchasing. Static images do not provide enough detail about the design, scale, or appearance of furniture.

To solve this issue, the company requires a 3D interactive web application where users can explore furniture models in a realistic environment. :contentReference[oaicite:1]{index=1}

---

## Target Audience

- Online furniture shoppers
- Interior designers
- Customers who prefer visual and interactive product previews :contentReference[oaicite:2]{index=2}

---

## Functional Requirements

- User authentication (Login / Register)
- Browse a list of available furniture items
- Select and load a 3D furniture model
- Interact with the model (rotate, zoom, inspect)
- Redirect to the main website purchase page
- Admin users can add, edit, or delete furniture items
- Responsive design for mobile and desktop devices :contentReference[oaicite:3]{index=3}

---

## 3D Features to be Implemented

- Real-time rendering using React Three Fiber
- Lighting and shadows for realistic presentation
- Camera controls (orbit, zoom, pan)
- Smooth animations (auto-rotation or user-triggered rotation)
- Multiple viewpoints (front, side, top view)
- Texture and material application for realism :contentReference[oaicite:4]{index=4}

---

## Data to be Stored in Firestore

### Furniture Items

- Name
- Description
- Price
- 3D model file URL (GLTF / GLB)
- Image preview
- Purchase link (redirect URL)

### User Data

- Email
- Role (Admin / User)

### Optional Data

- User preferences
- Saved items / favourites :contentReference[oaicite:5]{index=5}

---

## Authentication & Role-Based Access Plan

Firebase Authentication will be used with email and password login.

### Users

- Can view furniture items
- Can interact with 3D models
- Can access product purchase links

### Admins

- Can create, update, and delete furniture entries
- Can manage product data in Firestore

### Security

Firestore security rules will ensure only authorised users can modify data. :contentReference[oaicite:6]{index=6}

---

## Technologies Used

- React (Frontend Framework)
- Vite (Build Tool)
- React Three Fiber + Drei (3D Rendering)
- Firebase Authentication (User Management)
- Firestore Database (Data Storage)
- Firebase Storage (3D Models & Images)
- React Router (Navigation)
- Tailwind CSS (Responsive UI Styling) :contentReference[oaicite:7]{index=7}

---

## Hosting Platform

The application can be deployed using:

- Firebase Hosting
- Vercel
- GitHub Pages :contentReference[oaicite:8]{index=8}

---

## Expected Outcome

This project will provide customers with a more immersive and informative shopping experience, helping them make confident purchasing decisions while increasing engagement and potential sales for the furniture retailer.