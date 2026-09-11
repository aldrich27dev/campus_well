# CampusWell
Student Mental Health and Wellness Management System for Global Reciprocal Colleges (GRC).

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Powered%20by-Vite-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deployment-GitHub%20Pages-181717?style=flat-square&logo=github)](https://pages.github.com/)

## Overview
CampusWell is a frontend-based wellness portal that connects students, counselors, and administrators through a role-based interface. It focuses on common campus support flows such as authentication, wellness checks, appointment booking, notifications, reporting, analytics, and audit logging.

Recent additions include:
- MFA verification during login when required by the backend
- A forgot-password flow with email, OTP, reset, and success steps
- A registration privacy notice modal
- A dedicated student action center for appointment follow-up
- Role-aware notifications and appointment status updates
- Session timeout and logout handling
- Profile syncing from the local backend when available

## Tech Stack
- Frontend: React 19
- Build Tool: Vite
- Styling: Tailwind CSS
- Animation: Framer Motion
- Routing: React Router with `HashRouter`
- State Management: Context API
- Icons: Lucide React

## Core Features

### Student Portal
- Mood tracking
- Wellness assessment questionnaire
- Counseling appointment booking with date and slot capacity checks
- Wellness resource library
- Appointment follow-up and confirmation flows
- Settings page for password updates and profile display

### Counselor Portal
- Counselor dashboard
- Pending appointment review
- Confirm, complete, and reschedule appointment actions
- Counselor-facing reports and analytics views
- Notifications for student requests and high-risk alerts

### Admin Portal
- Admin dashboard
- User registry view
- Audit log view
- Reports and analytics views
- Security and system status summaries

### Shared System Features
- Dark mode toggle
- Persistent role, user, profile, appointment, and notification state
- Role-based notification center
- Toast-style notifications
- Responsive navigation with mobile menu support
- Animated UI transitions

## Supabase setup

CampusWell now uses Supabase for authentication, profiles, appointments, notifications, and assessment records. The former PHP files are retained only as legacy reference and are no longer called by the frontend.

1. Create a Supabase project.
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.example` to `.env.local`, then add the Project URL and public anon key from **Project Settings > API**.
4. In **Authentication > URL Configuration**, add your local and production URLs. Ensure the password-reset redirect URL is permitted, for example `http://localhost:5173/#/forgot-password`.
5. Configure email delivery in **Authentication > Email** before relying on password recovery or email confirmation.

The app intentionally has no service-role key. Row Level Security in the schema limits student data to its owner while allowing counselors and admins to manage appointment workflows.

New public registrations are always students. Create a staff user through Supabase Auth, then promote it from the SQL Editor with `update public.profiles set role = 'counselor' where id = '<auth-user-uuid>';` (or `admin`).

## Mock Credentials
Use these accounts for testing and demonstration:

| Role | Email | Password |
| :--- | :--- | :--- |
| Student | `aldrich@grc.edu.ph` | `password123` |
| Student | `jether@grc.edu.ph` | `password123` |
| Counselor | `counselor@grc.edu.ph` | `admin123` |
| Admin | `admin@grc.edu.ph` | `root` |

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```
3. Run the local backend API if you want login, registration, MFA, password recovery, and profile sync to work.

## Scripts
- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint
- `npm run deploy` - build and deploy to GitHub Pages

## UI Notes
- Bento-style card layout
- Night-mode first visual language
- Strong motion feedback for login and modal interactions
