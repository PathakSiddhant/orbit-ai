# 🪐 Orbit - AI Automation SaaS

> **Automate your work, relax your mind.**
> Orbit is a visual workflow automation platform (like Zapier or Make) that connects your favorite apps (Google Drive, Notion, Slack) with the power of AI.

---

## 📖 Table of Contents
1. [What is Orbit?](#-what-is-orbit)
2. [Key Features](#-key-features)
3. [Project Structure (Map)](#-project-structure-where-is-what)
4. [Tech Stack](#-tech-stack)
5. [Environment Variables](#-environment-variables)

---

## 🌟 What is Orbit?
Orbit allows users to create **"Workflows"**. A workflow is a chain of actions.
* **Example:** Monitor Google Drive -> Summarize File (AI) -> Save to Notion -> Email Me.

---

## 🚀 Key Features

### 🧠 The Brains
* **Visual Editor:** Drag and drop nodes (`CustomNode.tsx`) to build automation.
* **AI Agent (Gemini):** Summarizes and extracts data logic.

### 🔗 The Integrations (Nodes)
* **Google Drive:** Listen for new files.
* **Notion:** Create pages automatically.
* **Slack/Email:** Send notifications.

### ⚙️ The Engine
* **Cron Jobs:** Runs automatically via `/api/cron`.
* **Logs & Connections:** Dedicated dashboards to monitor activity and manage OAuth.

---

## 📂 Project Structure (Where is what?)

Based on the actual codebase structure:

```bash
src/
├── app/
│   ├── actions/          # ⚡ Server Actions (Backend Logic)
│   │   ├── workflows.ts  # The Core Engine (runWorkflow)
│   │   ├── google.ts     # Drive Logic
│   │   ├── gmail.ts      # Email Logic
│   │   ├── notion.ts     # Notion Logic
│   │   └── billing.ts    # Credits & Payments
│   │
│   ├── api/              # 🌐 Backend Routes
│   │   ├── auth/         # OAuth Callbacks (Google/Notion)
│   │   └── cron/         # Automation Trigger (route.ts)
│   │
│   ├── dashboard/        # 🖥️ The Main App UI
│   │   ├── workflows/
│   │   │   ├── _components/
│   │   │   │   ├── CustomNode.tsx    # The Visual Node Card
│   │   │   │   ├── editor.tsx        # The Canvas (React Flow)
│   │   │   │   ├── SettingsPanel.tsx # Right Sidebar
│   │   │   │   └── Tray.tsx          # Drag-drop Menu
│   │   │   └── [workflowId]/         # Editor Page
│   │   │
│   │   ├── logs/         # Activity History Page
│   │   ├── connections/  # Manage Integrations Page
│   │   ├── billing/      # Credits Page
│   │   └── settings/     # User Profile
│   │
│   ├── (auth)/           # Login/Signup Pages (Clerk)
│   └── layout.tsx        # Main App Wrapper
│
├── components/
│   └── ui/               # 🎨 Shadcn UI Components (Buttons, Cards, etc.)
│
├── lib/
│   ├── db/               # 🗄️ Database
│   │   ├── schema.ts     # Users, Workflows Tables
│   │   └── index.ts      # DB Connection
│   └── utils.ts          # Helper Functions
│
└── middleware.ts         # 🔒 Route Protection (Clerk)

```

## 🛠️ Tech Stack
* **Framework:** Next.js 14 (App Router)

* **Language:** TypeScript

* **Styling:** Tailwind CSS + Shadcn UI

* **Database:** PostgreSQL (Neon Tech)

* **ORM:** Drizzle ORM

* **Auth:** Clerk

* **State Management:** Zustand (For the editor)

* **Payment:** Stripe (Integrated in billing)


## 🔑 Environment Variables (.env.local)

```bash

# Database
DATABASE_URL=...

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Google (Drive & Gmail)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...

# Notion
NOTION_CLIENT_ID=...
NOTION_CLIENT_SECRET=...

# AI
GEMINI_API_KEY=...

```




## 👨‍💻 Author
Built with ❤️ by Siddhant Pathak.
