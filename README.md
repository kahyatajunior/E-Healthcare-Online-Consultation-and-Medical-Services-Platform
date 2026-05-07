# E-Healthcare – Online Consultation and Medical Services Platform

A scaffolded full-stack digital healthcare application with role-based authentication for Admin, Doctor, and Patient users.

## Project structure

- `backend/` - Node.js + Express + TypeScript API server
- `frontend/` - React + Vite + Tailwind CSS client application

## Backend

1. Navigate to `backend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Start development server: `npm run dev`

## Frontend

1. Navigate to `frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Architecture highlights

- Role-based access control with JWT authentication
- Doctor approval workflow for admin-managed registration
- Appointment booking system with status updates
- Prescription issuance and patient history retrieval
- Socket.io chat scaffold for real-time consultation support
- Tailwind CSS enabled for responsive UI styling

## Notes

This scaffold includes the foundational architecture and functional route skeletons for the full E-Healthcare platform.
