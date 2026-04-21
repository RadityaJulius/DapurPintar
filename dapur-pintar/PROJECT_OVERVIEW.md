# Dapur Pintar – Smart Recipe Generator

## Overview
Dapur Pintar is a **Next.js** web application that helps users generate custom recipes based on the ingredients they have, their mood, preferred meal type, cooking time, and language. The app leverages the **OpenRouter** API (Mistral‑7B‑Instruct model) to generate detailed cooking instructions, stores the results in a database via **Prisma**, and allows users to view or delete their saved recipes.

---

## How It Works
| Layer | Technology | Responsibility |
|-------|------------|----------------|
| **Frontend** | Next.js (App Router) + React | UI pages for registration, login, recipe generation, and saved‑recipe management. Communicates with backend APIs via `fetch` using a JWT token for authentication. |
| **API Layer** | Next.js serverless route handlers (e.g., `src/app/api/generate/route.ts`) | Validates JWT, parses request payload, forwards a prompt to OpenAI, stores the generated recipe, and returns the result. |
| **AI Provider** | OpenRouter (Mistral‑7B‑Instruct) | Generates a recipe text given a structured prompt. |
| **Authentication** | JSON Web Tokens (JWT) | Tokens are issued on login (not shown in the excerpt) and verified on each protected API route. |
| **Persistence** | Prisma ORM + underlying DB (SQLite/PostgreSQL, defined in `prisma/schema.prisma`) | Stores `User`, `Recipe`, and `SavedRecipe` records. |
| **Styling** | Tailwind/Global CSS (see `globals.css`) | Provides responsive UI components (Navbar, PricingCard, FeatureCard, etc.). |

---

## Core Workflow
1. **User registration** – `/api/auth/register` creates a new `User` with a hashed password (`hashPassword`).
2. **Login** – (login endpoint not shown) validates credentials and returns a JWT.
3. **Generate recipe** –
   - The client sends a POST to `/api/generate` with:
     ```json
     { "ingredients": "...", "mood": "...", "mealType": "...", "cookingTime": "30", "language": "English" }
     ```
   - The route verifies the JWT, builds a prompt (including language‑specific instructions), and calls `openai.chat.completions.create`.
   - The AI response is saved in the `Recipe` table and returned to the client.
4. **View saved recipes** – GET `/api/recipes` returns the list of recipes belonging to the authenticated user, ordered by newest first.
5. **Delete recipes** – DELETE `/api/recipes` removes all recipes for the user.
6. **Frontend rendering** – Pages (`src/app/u/...`, `src/app/page.tsx`, etc.) consume these API endpoints, display the recipe details, and allow the user to navigate between generation, saved list, and account pages.

---

## Tech Stack
- **Framework**: Next.js 13 (App Router) / React
- **Language**: TypeScript
- **Database**: Prisma ORM (any provider supported by Prisma)
- **Authentication**: JWT (`jsonwebtoken`)
- **AI Generation**: OpenRouter API (Mistral‑7B‑Instruct)
- **Styling**: Tailwind CSS + global CSS
- **Deployment**: Vercel (default Next.js deployment, see README)

---

## Getting Started (Brief)
```bash
# Install dependencies
npm install   # or pnpm/yarn/bun
# Set environment variables (see .env.example)
#   OPENROUTER_API_KEY, JWT_SECRET, DATABASE_URL, etc.
# Run dev server
npm run dev
```
Open `http://localhost:3000` and explore the UI.

---

*This document provides a high‑level understanding of Dapur Pintar’s purpose, architecture, and primary user flow.*