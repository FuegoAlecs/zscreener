# Zscreener

Advanced Zcash privacy block explorer with cross-chain insights and analytics for shielded transactions.

## Overview

Zscreener leverages NEAR Intents and privacy chain signatures to provide cross-chain insights while preserving user privacy. The system enables users to analyze Zcash shielded transactions, view NFT data through ZSA/ZIP 231 integration, and access privacy-preserving analytics through Nillion's confidential compute and private storage solutions.

## Project Structure

This is a monorepo containing three main packages:

```
zscreener/
├── packages/
│   ├── frontend/     # React web application
│   ├── backend/      # Node.js Express API server
│   └── sdk/          # Zscreener SDK for developers
└── package.json      # Root package configuration
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Redis >= 6
- Zcash node (for indexing)

## Getting Started

### Installation

```bash
# Install dependencies for all packages
npm install
```

### Development

```bash
# Run all packages in development mode
npm run dev

# Or run individual packages
cd packages/frontend && npm run dev
cd packages/backend && npm run dev
```

### Environment Configuration

For this project, the required environment keys (including Supabase and Nillion credentials) have been committed to `.env.example` for ease of setup in this hackathon context.

**To start locally:**

1. Rename the example files to active `.env` files:
   ```bash
   # Backend
   cp packages/backend/.env.example packages/backend/.env

   # Frontend
   cp packages/frontend/.env.example packages/frontend/.env
   ```

2. That's it! The configurations are pre-filled with the necessary live credentials.

**To Deploy on Vercel:**

1. Import the `packages/frontend` directory as your project in Vercel.
2. In the **Environment Variables** settings, copy the contents of `packages/frontend/.env.example` (key-value pairs).
3. Ensure the Build Command is `npm run build` and Output Directory is `dist`.
4. Add the rewrite rule from `vercel.json` if not automatically detected (handled by the file included in the repo).

## Building

```bash
# Build all packages
npm run build
```

## Code Quality

```bash
# Lint all packages
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## Architecture

- **Frontend**: React 18+ with TypeScript, TailwindCSS, React Query
- **Backend**: Node.js with Express, PostgreSQL, Redis, Bull queues
- **SDK**: TypeScript library for programmatic access

## Key Features

- Shielded transaction analytics
- Viewing key support for private transaction history
- ZSA and ZIP 231 NFT integration
- NEAR Intents for cross-chain data
- Nillion confidential compute and private storage
- Real-time alerts and notifications
- Developer SDK for integration

## Repository

https://github.com/web3chima/zscreener.git

## License

MIT
