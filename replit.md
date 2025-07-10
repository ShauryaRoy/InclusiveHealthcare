# Healthcare Plus Application

## Overview

Healthcare Plus is a comprehensive healthcare management web application built with a modern full-stack architecture. The system provides accessible, inclusive healthcare services with features including appointment booking, pharmacy services, donation management, and multilingual support. The application emphasizes accessibility, cultural sensitivity, and serves diverse communities with various accommodation needs.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom healthcare-themed color palette
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the stack
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

### Payment Processing
- **Provider**: Stripe for secure payment processing
- **Integration**: Stripe Elements for PCI-compliant payment forms
- **Use Cases**: Appointment fees, pharmacy purchases, donations

## Key Components

### Database Schema
The application uses a comprehensive PostgreSQL schema with the following main entities:
- **Users**: User authentication and profile management
- **Appointments**: Healthcare appointment scheduling with multilingual support
- **Services**: Healthcare service catalog
- **Medicines**: Pharmacy inventory management
- **Orders & Order Items**: E-commerce functionality for pharmacy
- **Contact Messages**: Customer communication system

### Authentication & Authorization
- Session-based authentication using PostgreSQL storage
- User roles and permissions system
- Secure password handling and validation

### Accessibility Features
- WCAG-compliant accessibility toolbar
- High contrast mode support
- Adjustable font sizes
- Screen reader optimizations
- Keyboard navigation support
- Skip-to-content links

### Multilingual Support
- Language preference settings
- Interpreter service coordination
- Culturally-sensitive content delivery
- Multi-language staff matching

### Payment Integration
- Stripe payment processing for appointments, pharmacy orders, and donations
- Secure payment intent handling
- Order tracking and management
- Donation program selection

## Data Flow

### Appointment Booking Flow
1. User selects service and preferred date/time
2. Form validation with accommodation needs assessment
3. Payment processing via Stripe
4. Appointment confirmation and scheduling
5. Email notifications and reminders

### Pharmacy Order Flow
1. Medicine catalog browsing with search/filter
2. Shopping cart management
3. Prescription verification for controlled substances
4. Checkout with shipping information
5. Payment processing and order tracking

### Donation Flow
1. Program selection (accessibility, community outreach, etc.)
2. Donation amount and recurring options
3. Secure payment processing
4. Impact reporting and donor recognition

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@stripe/stripe-js & @stripe/react-stripe-js**: Payment processing
- **@tanstack/react-query**: Server state management
- **react-hook-form & @hookform/resolvers**: Form handling
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Build Process
- Frontend: Vite builds optimized React application to `dist/public`
- Backend: esbuild bundles Node.js application to `dist/index.js`
- Database: Drizzle Kit manages schema migrations

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Stripe integration requires `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY`
- Development vs production environment detection

### Production Deployment
- Static asset serving through Express
- PostgreSQL database hosting on Neon
- Environment-specific configuration management

## Changelog
- July 03, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.