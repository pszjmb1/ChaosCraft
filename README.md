# ChaosCraft: Distributed Game of Life Evolution

A real-time collaborative Conway's Game of Life implementation showcasing Supabase Launch Week 13's groundbreaking features. ChaosCraft demonstrates the convergence of edge computing, real-time collaboration, and scheduled automation in a visually engaging experience.

![Game Board Example](/public/opengraph-image.png)

## 🏆 Hackathon Implementation Highlights

### Innovative Feature Integration
- **Edge Functions with WebSocket**: Real-time board state synchronization and cursor tracking
- **Background Tasks**: Pattern analysis and evolution tracking running asynchronously
- **Supabase Cron**: Scheduled chaos events that inject entropy into evolving patterns
- **database.build and Bolt.new generation**: AI-assisted schema and application design and evolution

### Development Approach
1. **Schema Design** ([database.build/db/06uxcld4q4k5oqql](https://database.build/db/06uxcld4q4k5oqql))
   - Leveraged AI assistance for optimal table structure
   - Implemented advanced PostgreSQL features     ```

2. **Application Development**
   - Primary Board Logic: [bolt.new/~/sb1-gjzhdix3](https://bolt.new/~/sb1-gjzhdix3)
     - WebSocket integration for real-time updates
     - Edge function implementation
   - Event System: [bolt.new/~/sb1-mmhnnpwx](https://bolt.new/~/sb1-mmhnnpwx)
     - Chaos event scheduling
     - Background task management

## Core Features

- **Real-time Collaboration**
  - Shared game boards with live updates
  - Multi-user cursor tracking
  - Pattern synchronisation across clients

- **Pattern Evolution**
  - AI-driven pattern analysis
  - Historical pattern tracking
  - Performance metrics collection

- **Chaos Events**
  - Scheduled environmental changes
  - Random pattern injections
  - Dynamic rule modifications

## Technical Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - TailwindCSS
  - Shadcn/UI

- **Backend**
  - Supabase (PostgreSQL)
  - Edge Functions
  - Real-time subscriptions
  - Row Level Security

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or pnpm
- Docker (for local Supabase development)
- Git

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chaoscraft.git
   cd chaoscraft
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your local Supabase project:
   - Create a new project at [database.new](https://database.new)
   - Copy the project URL and anon key

4. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

5. Run database migrations:
   ```bash
   npx supabase migrate up
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application running.

## Project Structure

```
app/
├── (auth-pages)/     # Authentication-related pages
├── board/            # Game board routes
│   ├── [id]/         # Individual board view
│   └── page.tsx      # Boards listing
├── protected/        # Protected routes
└── layout.tsx        # Root layout
components/
├── client/           # Client-side components
└── server/           # Server components
lib/
├── types/            # TypeScript definitions
└── utils/            # Utility functions
supabase/
├── migrations/       # Database migrations
└── seed.sql          # Seed data
```

## Database Schema

The application uses the following core tables:

- `game_boards`: Stores board configurations and states
- `user_participation`: Tracks user interactions with boards
- `pattern_evolution`: Records pattern analysis and history
- `scheduled_events`: Manages chaos events and modifications
- `analytics`: Stores performance and engagement metrics

## Authentication

ChaosCraft uses Supabase Auth with:
- Email/password authentication
- Protected routes
- Row Level Security policies
- Session management

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use React Server Components where possible
- Implement proper error boundaries
- Add tests for new features
- Follow the existing code style

## Testing

Run the test suite:
```bash
npm test
```

## Security Considerations

- All database access is controlled through RLS policies
- Authentication state is managed server-side
- Real-time subscriptions are authenticated
- Input validation on all user data

## Performance Optimisation

- Server-side rendering for initial load
- Client-side updates for interactivity
- Optimised WebSocket connections
- Efficient database queries

## Useful links
- [Relatred Bol.new project](https://bolt.new/~/sb1-mmhnnpwx)
- [Related Claude project 1](https://claude.ai/chat/9162dd18-b8d0-4abe-9acd-9a32c9ef149e)
- [Related Claude project 2](https://claude.ai/chat/a5fc19ff-0d51-42f2-a80c-36fa78c85275)
- [Related Claude project 3](https://claude.ai/chat/1dcacad0-2c3e-47ed-b829-b858db50994f)
- [Claude background ideas 1](https://claude.ai/chat/809866a8-a089-41b0-befd-2bf067dfa75f)
- [Claude background ideas 2](https://claude.ai/chat/809866a8-a089-41b0-befd-2bf067dfa75f)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Supabase team for real-time infrastructure
- Next.js team for the application framework
- Conway's Game of Life community
