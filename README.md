This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Personal Finance App

A modern, secure personal finance management application built with Next.js 15, Supabase, and TailwindCSS.

## Features

✅ **Authentication System**
- Email/Password authentication
- Google OAuth integration
- Email confirmation
- Secure session management
- Auto-refresh tokens

✅ **Modern UI/UX**
- Beautiful, responsive design
- Dark mode support
- Smooth animations and transitions
- Mobile-first approach

✅ **Security**
- Protected routes with middleware
- Server-side authentication
- Secure cookie handling
- Row Level Security (RLS) ready

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project credentials (URL and anon key)
3. Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

📖 **For detailed Supabase setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Test the Application

- **Sign Up**: Navigate to `/signup` to create a new account
- **Log In**: Navigate to `/login` to sign in
- **Dashboard**: After authentication, you'll be redirected to `/dashboard`

## Project Structure

```
src/
├── app/
│   ├── login/              # Login page and actions
│   ├── signup/             # Sign up page
│   ├── dashboard/          # Protected dashboard
│   ├── error/              # Error handling
│   └── auth/               # Auth callbacks
├── utils/supabase/         # Supabase clients
├── components/             # Reusable components
└── middleware.ts           # Auth middleware
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS v4
- **Icons**: Lucide React
- **Language**: TypeScript

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Never commit `.env.local` to version control!**

## Available Routes

- `/` - Home (redirects to dashboard or login)
- `/login` - Login page (public)
- `/signup` - Sign up page (public)
- `/dashboard` - User dashboard (protected)
- `/error` - Error page
- `/auth/confirm` - Email confirmation handler
- `/auth/callback` - OAuth callback handler

## Authentication Flow

1. User signs up via email/password or Google OAuth
2. Email confirmation sent (if enabled)
3. User confirms email and is redirected to dashboard
4. Middleware handles session refresh automatically
5. Protected routes require authentication

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

**Important**: Add your environment variables in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for common issues and solutions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
