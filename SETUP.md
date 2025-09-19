# RiskShield AI - Setup Instructions

## For External Development Environments (Dyad, VS Code, etc.)

When you download or export this project, it may be wrapped in a folder called `RiskShield-AI-main` or similar. To work with the project properly:

### Option 1: Navigate to the correct directory
\`\`\`bash
cd RiskShield-AI-main
npm install
npm run dev
\`\`\`

### Option 2: Move files to root (recommended)
If you want the project files at the root level:
1. Extract all files from the `RiskShield-AI-main` folder
2. Move them to your desired project directory
3. Delete the empty `RiskShield-AI-main` folder
4. Run `npm install` and `npm run dev`

## Project Structure
\`\`\`
├── package.json          # Dependencies and scripts
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── app/                  # Next.js app directory
├── components/           # React components
├── lib/                  # Utility functions
└── scripts/              # Database scripts
\`\`\`

## Development Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Environment Setup
Make sure you have Node.js 18+ installed and configure your environment variables in your deployment platform.
