# Happy Store

A modern, responsive, and robust React web application for a local commerce platform. Phase 2 complete.

## Features

- **Customer App**: Browse shops, search for products, manage cart, checkout, and track orders.
- **Shop Owner Dashboard**: Manage inventory, track sales analytics, handle orders, and message customers.
- **Admin Dashboard**: System overview, user management, shop approvals, global settings, and revenue tracking.
- **Design System**: A fully custom, accessible, and responsive component library built with Vanilla CSS and Tailwind-inspired utility tokens.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a deep dive into the state management, routing, and data flow patterns.

## Tech Stack

- React 18
- React Router v6
- Redux Toolkit (Client State)
- TanStack Query (Server State)
- React Hook Form + Zod (Validation)
- Lucide React (Icons)
- Vite (Build Tool)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Development Commands

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally
