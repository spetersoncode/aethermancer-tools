# Aethermancer Tools - Web

A modern web application providing tools for Aethermancer players to track their monster collection and build optimal teams.

## Features

### Aetherdex
A comprehensive collection tracker for Aethermancer monsters:
- Track both base and shifted monster variants
- View collection stats with completion percentages
- Import and export collection data
- Persistent storage using browser local storage
- Search and filter capabilities

### Team Builder
Build and optimize your perfect three-monster team:
- Browse all available monsters with detailed stats
- Visual team composition with element and type badges
- Real-time team analysis and statistics
- Filter monsters by elements and types
- Quick add/remove functionality

### Additional Features
- Dark mode support with theme toggle
- Responsive design for mobile and desktop
- Server-side rendering (SSR) for optimal performance
- Fast navigation with React Router v7

## Tech Stack

- **React Router v7** - Full-stack framework with SSR
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with @tailwindcss/vite
- **shadcn/ui** - Accessible UI components built on Radix UI
- **Lucide React** - Icon library
- **Vite** - Fast build tooling

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

Install dependencies:

```bash
pnpm install
```

### Development

Start the development server with hot module replacement:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

### Type Checking

Run TypeScript type checking:

```bash
pnpm typecheck
```

## Building for Production

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

The production server runs on port 3000.

## Docker Deployment

### Building the Docker Image

```bash
docker build -t aethermancer-tools-web .
```

### Running the Container

```bash
docker run -p 3000:3000 aethermancer-tools-web
```

The application will be available at `http://localhost:3000`.

### Deployment Platforms

The containerized application can be deployed to any platform that supports Docker:

- Google Cloud Run
- AWS ECS/Fargate
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

## Project Structure

```
web/
├── app/
│   ├── components/        # Reusable UI components
│   │   ├── aetherdex/    # Aetherdex-specific components
│   │   ├── team-builder/ # Team Builder components
│   │   ├── ui/           # Base UI components (shadcn/ui)
│   │   └── layout/       # Layout components
│   ├── routes/           # React Router routes
│   ├── data/             # Monster data and types
│   ├── hooks/            # Custom React hooks
│   └── root.tsx          # App root component
├── public/               # Static assets
├── build/                # Production build output
├── Dockerfile            # Multi-stage Docker build
├── react-router.config.ts # React Router configuration
└── package.json          # Dependencies and scripts
```

## Development Notes

- Monster data is stored in `app/data/monsters.ts`
- Collection state persists in browser local storage
- The app uses SSR by default (configurable in `react-router.config.ts`)
- UI components follow the shadcn/ui pattern for easy customization

## About Aethermancer

Aethermancer is a monster collecting and battling game. This web application provides companion tools to help players track their progress and strategize their teams.

## License

See the parent project for license information.
