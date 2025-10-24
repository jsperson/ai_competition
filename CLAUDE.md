# AI Competition MVP Project

use context7

## Project Overview

This is a pre-configured MVP starter for rapid competition development (2.5 hour sprints).

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **State Management:** React hooks + localStorage
- **Routing:** React Router v6
- **Deployment:** Vercel
- **Icons:** Lucide React

## Project Structure

```
ai_competition/
├── src/
│   ├── components/ui/     # shadcn components (Button, Card, Input, Badge, Dialog, Separator)
│   ├── lib/               # Utils (cn function)
│   ├── utils/             # Storage utilities
│   ├── hooks/             # useCollection hook
│   ├── data/              # Mock data (mockData.json)
│   ├── pages/             # Page components
│   └── App.jsx            # Main app component
├── prompts/
│   └── master_challenge.md  # Competition workflow and component patterns
└── vercel.json            # Deployment config
```

## Competition Workflow

When building MVPs for competition challenges:

1. **Analyze the challenge** - Identify core features, data entities, and user flow
2. **Design data structure** - Update `src/data/mockData.json` with domain-specific data
3. **Map pages to patterns** - Use the 8 pre-built patterns in `prompts/master_challenge.md`
4. **Build pages** - Create in order: Landing → Browse → Detail → Form → Status
5. **Deploy early and often** - Commit and push frequently (auto-deploys to Vercel)
6. **Polish and test** - Add loading states, empty states, mobile responsive
7. **Document** - Write README with technical decisions

## Key Patterns Available

See `prompts/master_challenge.md` for copy-paste patterns:
- Navigation Header
- Hero/Landing Section
- Search & Filter Interface
- Card Grid/List
- Detail View
- Form/Input Page
- Status/Progress Tracking
- Dialog/Modal

## Development Commands

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Storage & State

Use the pre-built utilities:
- `storage.save(key, data)` / `storage.get(key)` - Generic localStorage
- `useCollection(name)` - Hook for managing collections (cart, favorites, etc.)

## Deployment

Every `git push` automatically deploys to Vercel. Test on live URL frequently.

## Notes

- Use shadcn/ui components for professional polish
- Mock data + localStorage is faster than real backend for MVP demos
- Visual polish matters - judges see UI first
- Feature completeness > code quality during sprints
