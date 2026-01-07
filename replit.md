# Overview

This is a privacy-first single-page web application called "SecureGPS" that removes image metadata (especially GPS data) entirely in the browser. The application processes JPEG, PNG, and WebP images locally without any file uploads, stripping EXIF, IPTC, and XMP metadata to protect user privacy. It features a simple drop-and-download workflow with support for multiple files, automatic ZIP creation, and internationalization.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server. The application is a single-page application (SPA) with client-side routing handled by Wouter.

**UI Framework**: Utilizes shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable components. TailwindCSS handles styling with a custom design system using CSS variables for theming.

**State Management**: Uses React hooks and context for state management. The main image processing logic is encapsulated in a custom hook (`useImageProcessor`) that manages processing state, options, and file handling.

**Component Structure**: 
- Modular component architecture with separation of concerns
- UI components in `/components/ui/` following shadcn patterns
- Feature-specific components in `/components/`
- Type definitions centralized in `/types/`

## Backend Architecture

**Server Framework**: Express.js with TypeScript providing a minimal API structure. The server primarily serves the static frontend application and includes basic routing infrastructure.

**Development Setup**: Vite middleware integration for hot module replacement and development server functionality. The build process creates optimized static assets for production deployment.

**Architecture Pattern**: The backend follows a simple MVC-like pattern with routes, storage interface, and server configuration separated into distinct modules.

## Image Processing Architecture

**Client-Side Processing**: All image processing occurs in the browser using Canvas API and Web Workers. This ensures complete privacy as no files are uploaded to any server.

**Metadata Removal Strategy**: 
- Decodes images using Canvas API which strips metadata
- Re-encodes images with specified quality and format options
- Uses OffscreenCanvas in Web Workers for background processing
- Supports format conversion (PNG/WebP to JPEG) when requested

**File Handling**: 
- Drag-and-drop interface with file validation
- Multiple file processing with progress tracking
- Automatic ZIP creation for multiple files using JSZip (lazy-loaded)
- Direct download trigger for processed files

## Internationalization

**Multi-language Support**: JSON-based translation system supporting English, Korean, Spanish, and Japanese. Language selection persists in localStorage with runtime switching capability.

**Translation Architecture**: 
- Translation files in `/i18n/` directory
- Custom hook (`useLanguage`) for translation management
- Dynamic loading of translation files to reduce bundle size

## Data Storage Solutions

**Local Storage**: Browser localStorage for persisting user preferences (language selection, advanced options).

**Database Schema**: Includes Drizzle ORM configuration for PostgreSQL with user schema definition, though the current application operates entirely client-side.

**Session Management**: Basic session handling infrastructure present but not actively used in the current privacy-focused implementation.

# External Dependencies

## Core Frontend Dependencies

- **React** (^18.x): Core UI library with hooks and context
- **Vite**: Build tool and development server with fast HMR
- **TypeScript**: Type safety and enhanced development experience
- **Wouter**: Lightweight client-side routing
- **TailwindCSS**: Utility-first CSS framework

## UI Component Libraries

- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives including dialogs, dropdowns, tooltips, and form components
- **Lucide React**: Icon library providing consistent iconography
- **shadcn/ui**: Pre-built component system based on Radix UI
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional CSS class handling

## Image Processing & File Handling

- **JSZip**: Client-side ZIP file creation for multiple file downloads
- **Canvas API**: Native browser API for image manipulation and metadata removal
- **Web Workers**: Background processing to maintain UI responsiveness
- **File API**: Browser file handling for drag-and-drop functionality

## Backend Infrastructure

- **Express.js**: Web server framework
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)
- **connect-pg-simple**: PostgreSQL session store for Express

## Development & Build Tools

- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Autoprefixer
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

## Form Handling & Validation

- **React Hook Form**: Form state management with performance optimization
- **@hookform/resolvers**: Form validation resolvers
- **Zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

## Utility Libraries

- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **embla-carousel-react**: Carousel/slider component functionality