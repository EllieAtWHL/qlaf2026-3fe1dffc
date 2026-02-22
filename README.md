# QLAF 2026 - Quiz Application

A modern, interactive quiz game application built with React and TypeScript, featuring multiple game rounds, real-time scoring, and a delightful user experience.

## 🎯 What is QLAF?

QLAF (Question of a League like A Fan) is a comprehensive quiz platform designed for engaging multiplayer quiz experiences. The application features:

- **Multiple Game Rounds**: World Rankings, Just One, Picture Board, and more
- **Real-time Scoring**: Track team and individual scores dynamically
- **Co-host Interface**: Dedicated interface for quiz moderators
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Sound Effects**: Enhanced audio experience using Howler.js
- **Team-based Gameplay**: Support for both team and individual rounds

## 🏗️ Project Origins

This project was initially built using [Lovable](https://lovable.dev) - an AI-powered development platform that helped create the foundation of this quiz application. The original Lovable project provided the initial structure and core functionality, which has since been enhanced and extended with additional features, custom rounds, and improved functionality.

The project has evolved significantly from its Lovable origins, with extensive customization, new game modes, and a comprehensive documentation suite to support ongoing development and maintenance.

## 🚀 Quick Start

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation & Development

```sh
# Step 1: Clone the repository
git clone https://github.com/EllieAtWHL/qlaf2026-3fe1dffc.git

# Step 2: Navigate to the project directory
cd qlaf2026-3fe1dffc

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Deployment

The QLAF 2026 application is deployed on **Vercel** for production hosting:

- **Main Display**: [your-app.vercel.app](https://your-app.vercel.app)
- **Co-host Interface**: [your-app.vercel.app/cohost](https://your-app.vercel.app/cohost)

Vercel provides automatic deployments from the main branch, global CDN distribution, and optimized build processes for the best performance.

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Round Management](docs/round-management.md)** - Understanding and managing quiz rounds
- **[Co-host Interface](docs/co-host-interface.md)** - Guide for quiz moderators
- **[World Rankings](docs/world-rankings.md)** - Specifics about the rankings game mode
- **[Just One Technical Guide](docs/just-one-technical-guide.md)** - Technical implementation details
- **[Timer Architecture](docs/timer-architecture.md)** - Complete timer system documentation
- **[Picture Board Delay Investigation](docs/picture-board-delay-investigation.md)** - Performance analysis and fixes

## 🛠️ Technologies Used

This project is built with modern web technologies:

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Radix UI components
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase integration
- **Audio**: Howler.js + use-sound
- **Testing**: Vitest + React Testing Library
- **Routing**: React Router DOM
- **Deployment**: Vercel (production hosting)

## 🎮 Game Features

### Available Game Rounds

1. **World Rankings** - Rank items in correct order (sports statistics, historical facts, etc.)
2. **Just One** - Give unique answers to prompts
3. **Picture Board** - Visual-based quiz rounds
4. **Custom Rounds** - Extensible framework for new game types

### Key Components

- **Main Display**: Primary game interface for players
- **Co-host Interface**: Moderator controls and score management  
- **Timer System**: Local countdown with synchronized control actions
- **Score Tracking**: Real-time score updates and leaderboard

## 🧪 Testing

```sh
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── rounds/         # Game round components
│   ├── ui/            # Reusable UI components
│   └── ...
├── data/              # Game data (questions, rounds)
├── hooks/             # Custom React hooks
├── integrations/      # External service integrations
└── ...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

- The application uses a component-based architecture with TypeScript for type safety
- Game data is stored in JSON files for easy modification
- Supabase is used for real-time data synchronization and persistence
- The UI is built with accessibility in mind using Radix UI primitives

## 📄 License

This project is private and proprietary.

---

Built with ❤️ for quiz enthusiasts everywhere
