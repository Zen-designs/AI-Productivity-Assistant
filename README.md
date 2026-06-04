# AI Workplace Productivity Assistant

## Project Overview

AI Workplace Productivity Assistant is a modern, responsive SaaS-style web application designed to help professionals automate common workplace tasks using Artificial Intelligence. The platform combines multiple AI-powered productivity tools into a single dashboard, enabling users to generate emails, summarize meeting notes, create project plans, conduct research, and interact with an AI chatbot.

The goal of the application is to improve efficiency, reduce repetitive work, and support better decision-making while promoting responsible AI usage.

---

## Features

### Smart Email Generator

* Generate professional emails instantly
* Multiple tone options (Formal, Friendly, Professional, Persuasive)
* Editable AI-generated content
* Copy, save, and regenerate responses

### Meeting Notes Summarizer

* Summarize meeting transcripts
* Extract key decisions and action items
* Generate executive summaries
* Export summarized notes

### AI Task Planner

* Convert goals into structured plans
* Create milestones and timelines
* Generate task breakdowns
* Identify risks and dependencies

### AI Research Assistant

* Produce research reports on workplace topics
* Generate insights, opportunities, and recommendations
* Editable output for customization

### AI Chatbot Interface

* Conversational AI assistant
* Answer workplace-related questions
* Generate content and productivity suggestions
* Maintain conversation history

### Dashboard Features

* Modern SaaS dashboard UI
* Sidebar navigation
* Productivity analytics widgets
* Recent activity tracking
* Responsive design for desktop, tablet, and mobile devices

### Responsible AI

* AI-generated content disclaimer
* Human review recommendations
* Transparency regarding AI limitations

---

## Tools Used

### Frontend

* **TanStack Start** — Full-stack React framework with file-based routing and SSR/SSG support
* **React 19** — UI library
* **TypeScript** — Type-safe development
* **Tailwind CSS v4** — Utility-first CSS framework
* **shadcn/ui** — Accessible, customizable UI components
* **Vite 7** — Build tool and development server

### Backend

* **TanStack Start Server Functions** (`createServerFn`) — Type-safe RPC for client-server communication
* **Node.js** — Server runtime

### Database

* **PostgreSQL** — Relational database via Lovable Cloud

### Authentication

* **Supabase Auth** — Authentication and user management with email/password and social login support

### AI Integration

* **Lovable AI Gateway** — Unified API for accessing multiple AI models (Gemini, GPT, etc.)

### Storage

* **Supabase Storage** — File and asset storage

### Deployment

* **Lovable** — Managed deployment and hosting platform

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

* Node.js (v18 or later)
* Bun (recommended) or npm/yarn
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-workplace-productivity-assistant.git

cd ai-workplace-productivity-assistant
```

### 2. Install Dependencies

```bash
bun install
```

or

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
LOVABLE_API_KEY=your_lovable_ai_gateway_key
```

### 4. Run the Development Server

```bash
bun dev
```

or

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Build for Production

```bash
bun run build
```

or

```bash
npm run build
```

### 6. Preview Production Build

```bash
bun preview
```

or

```bash
npm run preview
```

---

## Project Structure

```text
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── AiDisclaimer.tsx
│   ├── AiOutputCard.tsx
│   ├── AppShell.tsx
│   └── AppSidebar.tsx
├── hooks/               # Custom React hooks
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase client, auth middleware, types
├── lib/                 # Utility functions and server functions
│   ├── ai.functions.ts  # AI server functions (generateAI, chatAI)
│   ├── utils.ts
│   └── ...
├── routes/              # TanStack Start file-based routes
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Dashboard home page
│   ├── chat.tsx         # AI Chatbot
│   ├── email.tsx        # Smart Email Generator
│   ├── planner.tsx      # AI Task Planner
│   ├── research.tsx     # AI Research Assistant
│   ├── settings.tsx     # Settings page
│   └── summarize.tsx    # Meeting Notes Summarizer
├── router.tsx           # TanStack Router configuration
├── server.ts            # Server entry point
├── start.ts             # TanStack Start configuration
└── styles.css           # Global styles and Tailwind CSS theme
```

---

## Responsible AI Notice

This application uses generative AI to assist with workplace productivity tasks.

Users should:

* Verify AI-generated content before use.
* Review important business decisions independently.
* Avoid sharing confidential or sensitive information with AI systems unless authorized.
* Understand that AI outputs may occasionally contain inaccuracies or incomplete information.

Human oversight is recommended for all AI-generated results.

---
