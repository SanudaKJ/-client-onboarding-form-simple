# Client Onboarding Form

A modern client onboarding form built with Next.js, React Hook Form, and Tailwind CSS.

## Features

- Responsive form with professional styling
- Real-time validation using Zod
- Service selection with multiple options
- Budget and date validation
- URL parameter pre-filling
- Form submission to external API

## Tech Stack

- Next.js 15.4.6
- React 19.1.0
- TypeScript
- Tailwind CSS 4.0
- React Hook Form
- Zod validation

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/client-onboarding-form-simple.git
cd client-onboarding-form-simple
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your API endpoint:

```env
NEXT_PUBLIC_ONBOARD_URL=https://your-api-endpoint.com/api/onboard
```

For testing, you can use:

```env
NEXT_PUBLIC_ONBOARD_URL=https://httpbin.org/post
```



### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Form Fields

- **Full Name**: Required, letters only
- **Email**: Required, valid email format
- **Company Name**: Required
- **Services**: Select one or more (UI/UX, Branding, Web Dev, Mobile App)
- **Budget**: Optional, $100 - $1,000,000
- **Project Start Date**: Today or future date
- **Terms**: Must accept to submit


## Project Structure

```
├── components/
│   └── OnboardForm.jsx     # Main form component
├── lib/
│   └── schema.js           # Validation schemas
├── src/app/
│   ├── layout.tsx          # App layout
│   └── page.tsx            # Home page
├── public/assets/Images/   # Logo and images
└── .env.local              # Environment variables
```

