
# Learning Path Platform

## Project Overview

A comprehensive learning platform that enables users to track their education journey, access personalized course recommendations, and build a professional portfolio showcasing their skills and achievements.

## Features

- **User Authentication**: Secure login and registration with role-based access control
- **Personalized Dashboard**: Track enrolled courses, learning progress, and upcoming goals
- **Course Catalog**: Browse, search, and enroll in a variety of courses
- **AI-Powered Recommendations**: Get personalized course suggestions based on your learning history and goals
- **Learning Roadmap**: Visual representation of your learning journey and next steps
- **Portfolio Builder**: Create a professional portfolio showcasing your skills and certifications
- **Instructor Tools**: Create and manage courses with AI-assisted content generation

## Tech Stack

This project is built with:

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: React Context API, TanStack Query
- **Styling**: Tailwind CSS with dark/light mode support
- **Animation**: Framer Motion
- **UI Components**: shadcn/ui design system
- **Authentication**: Clerk Auth
- **Database**: Supabase
- **Serverless Functions**: Supabase Edge Functions

## Getting Started

### Prerequisites

- Node.js & npm - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Supabase account (for database and authentication)
- A Clerk account (for user management)

### Installation

```sh
# Clone the repository
git clone <YOUR_REPOSITORY_URL>

# Navigate to the project directory
cd learning-path-platform

# Install dependencies
npm install

# Set up environment variables
# Create a .env file based on .env.example

# Start the development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── course/         # Course-related components
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout components
│   └── ui/             # UI library components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── integrations/       # Third-party service integrations
│   └── supabase/       # Supabase client and types
├── pages/              # Application pages
├── services/           # API services
└── utils/              # Utility functions

supabase/               # Supabase configuration
└── functions/          # Serverless edge functions
```

## Development Workflow

### Running the Development Server

```sh
npm run dev
```

### Building for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Deployment

The application can be deployed to any static site hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your preferred hosting service

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
