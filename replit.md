# NVTI Kanda Professional School Website

## Overview

A professional, minimalistic website for National Vocational Training Institute (NVTI) Kanda, featuring a public-facing educational website and an integrated news management dashboard. Built with React, Express, and TypeScript, the application provides a modern web presence for the vocational training institute while enabling staff to manage news content through multiple administrative interfaces.

The project serves three purposes:
1. **Public Website**: Showcasing the institute's programs, mission, and facilities with a clean, educational aesthetic
2. **Admin Dashboard**: Full-featured React-based content management system for news posts, media library, and site settings
3. **Standalone HTML Editor**: Simple HTML/CSS interface for easy content updates without requiring technical knowledge (accessible at `/editor`)

## Recent Changes

**October 24, 2025:**
- Added password change functionality to both interfaces:
  - Dashboard settings page includes secure password change form with proper error handling
  - HTML editor settings tab includes password change section
  - Backend API validates old password before allowing changes
  - Proper validation for password length (minimum 6 characters) and match confirmation
  - Username stored in localStorage for both interfaces to support password changes
  - Updated EDITOR_GUIDE.md with comprehensive password change instructions

**Previous Updates:**
- Migrated from in-memory storage to PostgreSQL database with full data persistence across server restarts
- Fixed critical dashboard login bug (apiRequest JSON parsing issue)
- Implemented comprehensive site settings system managing 8 image placeholders (hero banner, about section, 6 gallery images)
- Created standalone HTML editor (`/editor`) with login, news CRUD operations, and image management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: 
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library (New York style variant)
- Tailwind CSS for utility-first styling with custom design tokens
- Component architecture follows a modular pattern with shared UI components in `/client/src/components/ui`

**Routing**: 
- wouter for lightweight client-side routing
- Route structure separates public pages (home) from dashboard routes
- Dashboard routes are authentication-gated

**State Management**:
- TanStack Query (React Query) for server state management and caching
- Local React state for component-level UI state
- localStorage for authentication persistence

**Design System**:
- Custom color palette based on navy blue primary (HSL: 222 73% 29%) and gold accent (HSL: 38 95% 48%)
- Typography system using Inter font family with defined scale (hero: 60-72px, headers: 36-48px, body: 16-18px)
- Minimalistic approach emphasizing whitespace and clear hierarchy
- Reference-based design inspired by top-tier educational institutions (MIT, Stanford, Harvard)

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Design**:
- RESTful endpoints organized by resource type
- Authentication via simple username/password (stored in memory)
- API routes prefixed with `/api`
- Response logging middleware for request tracking

**Data Storage Strategy**:
- **PostgreSQL Database**: Using Replit's built-in PostgreSQL (Neon-backed) for persistent data storage
- **Drizzle ORM**: Type-safe database toolkit with schema-first approach
- Interface-based storage layer (`IStorage`) with `DatabaseStorage` implementation
- Automatic database seeding with default admin user and sample content
- Database migrations handled via `npm run db:push` command

**Storage Collections**:
- Users (authentication)
- News Posts (content management)
- Media (file uploads)
- Contact Submissions (form data)
- Site Settings (image placeholders and configuration)

### Data Schemas

**News Posts**:
- Fields: id, title, content (rich text), excerpt, featuredImage, category, status (draft/published), date, author
- Zod validation schemas derived from Drizzle table definitions

**Media**:
- Fields: id, filename, url, size, uploadDate
- Support for file upload management

**Contact Submissions**:
- Fields: id, name, email, phone, message, submittedAt
- Captures public website contact form data

**Users**:
- Fields: id, username, password
- Simple authentication system

**Site Settings**:
- Fields: id, heroBannerImage, aboutSectionImage, galleryImage1-6, updatedAt
- Manages website image placeholders
- Allows updating images from dashboard settings page

### Authentication & Authorization

**Approach**: Simple session-based authentication
- Login endpoint validates credentials against in-memory user store
- Client stores authentication status in localStorage
- Dashboard routes check authentication via `useEffect` hooks
- No JWT tokens or complex session management (suitable for MVP)

**Security Considerations**:
- Passwords stored in plain text (in-memory only, not production-ready)
- Public endpoints filter to show only published content
- Admin endpoints accessible without token validation (relies on localStorage check)

### Development Tooling

**Build Process**:
- Vite for frontend development with HMR
- esbuild for server bundling
- TypeScript compilation without emit (type checking only)

**Development Features**:
- Replit-specific plugins for runtime error overlay and development banner
- Path aliases configured (@/ for client, @shared for shared types, @assets for assets)
- Separate dev/build/start scripts for different environments

**Code Organization**:
- Monorepo structure with client, server, and shared directories
- Shared schema definitions between frontend and backend
- Type-safe API contracts using TypeScript and Zod

**Database Management**:
- Schema defined in `shared/schema.ts` using Drizzle ORM
- Database connection in `server/db.ts` using Neon serverless driver
- Seed script at `server/seed.ts` for initializing database
- Migration command: `npm run db:push` (pushes schema changes without manual SQL migrations)

## External Dependencies

### Core Framework Dependencies
- **React 18**: UI library with concurrent features
- **Express**: Node.js web server framework
- **TypeScript**: Type-safe development across full stack
- **Vite**: Frontend build tool and dev server

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Comprehensive set of accessible component primitives (accordion, dialog, dropdown, etc.)
- **shadcn/ui**: Pre-built component system using Radix primitives
- **Lucide React**: Icon library for consistent iconography

### State & Data Management
- **TanStack Query**: Server state management, caching, and data synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation and type inference
- **Drizzle ORM**: Database toolkit for schema definition and migrations (configured for PostgreSQL)

### Database
- **@neondatabase/serverless**: PostgreSQL driver for Neon serverless database
- **Drizzle ORM**: Type-safe ORM for database operations
- **Drizzle Kit**: Migration tool for database schema changes
- **PostgreSQL**: Replit's built-in PostgreSQL database (free tier available via usage-based pricing)

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx & class-variance-authority**: Conditional className utilities
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing library

### Development Tools
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast JavaScript bundler for production builds

### Notable Configuration
- PostgreSQL database fully configured and connected
- Environment variables automatically provided by Replit: `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
- Database schema pushed using Drizzle Kit (no manual migration files)
- Storage layer uses `DatabaseStorage` for persistent data
- Database seeded on first run with default admin credentials (username: admin, password: admin123)