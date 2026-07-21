# MedPath UK / Manas Platform - Project TODO

## Phase 1: Database & Backend Setup
- [x] Design and create database schema (users, subscriptions, questionnaire, roadmap, tasks, content, links)
- [x] Create migration SQL and apply to database
- [x] Add server-side query helpers (server/db.ts)
- [x] Add tRPC routers for all features (server/routers.ts)

## Phase 2: Content Research
- [x] Research UK medical training pathways and resources
- [x] Compile list of UK medical institutions and links
- [x] Prepare content for guides (research, QIP, clinical audit, CV, interviews)

## Phase 3: Landing Page & UI Design
- [x] Design global theme (colors, fonts, style) - Purple/orange premium SaaS theme
- [x] Build landing page with hero, features, pricing sections (Home.tsx) - English
- [x] Build navigation and footer
- [x] Build auth flow (login/register via Manus OAuth)

## Phase 4: Questionnaire & AI Roadmap
- [x] Build interactive multi-step questionnaire (Questionnaire.tsx) - English
- [x] Integrate AI to generate personalized roadmap (LLM via invokeLLM)
- [x] Display roadmap with timeline and milestones (Roadmap.tsx) - English
- [x] Save questionnaire responses and roadmap to DB

## Phase 5: Content Library & Resource Database
- [x] Build content library pages (Resources.tsx - Research, QIP, Clinical Audit, CV, Interviews) - English
- [x] Build external links database with categories (Links.tsx) - English
- [x] Implement content access control by subscription level

## Phase 6: Personal Dashboard & Progress Tracking
- [x] Build personal dashboard with progress overview (Dashboard.tsx) - English
- [x] Build task list with checkboxes and deadlines
- [x] Build document checklist by career stage
- [x] Add progress visualization

## Phase 7: Stripe Integration & Subscriptions
- [x] Create subscription plans (Free, Pro, Premium) - Pricing.tsx - English
- [x] Build pricing page with upgrade flow
- [ ] Stripe payment integration (pending user's Stripe API keys)

## Phase 8: AI Chatbot & Notifications
- [x] Build AI chatbot with medical UK knowledge base (Chat.tsx + server-side LLM) - English
- [ ] Implement automated email reminders for deadlines (pending email service setup)
- [ ] Implement subscription expiry notifications

## Rebuild Phase - Manas Platform (English + Access Code System)
- [x] Update DB schema: add access_codes table (code, email, isUsed, usedByUserId)
- [x] Update users table: add isActivated, accessCodeId, country, readinessScore fields
- [x] Add tRPC procedures: validateCode, activateAccount
- [x] Build new Landing Page in English with purple/orange design
- [x] Build Access Code Activation page (code + email verification)
- [x] Build protected registration flow (no code = no access)
- [x] Build Onboarding Assessment (multi-step) - English
- [x] Build new Dashboard with readiness score and milestones - English
- [x] Build AI Workspaces Hub (10 sections) - English
- [x] Build Resources Library - English
- [x] Build Official Links Center - English
- [x] Build Pricing page - English
- [x] Build Admin Dashboard (user management, code generation, content)
- [x] Convert all UI text to English
- [x] Update color theme to purple/orange
- [x] Database migration applied (access_codes, onboarding_assessments, chat_sessions)
- [x] All tests passing (8/8)
- [x] Save final checkpoint

## Bug Fixes
- [x] Fix Admin access: owner should automatically get admin role on login
- [x] Fix Admin page: show proper access denied message for non-admins
- [x] Make admin bypass the access code requirement

## Bug Fix - Roadmap Rendering
- [x] Fix Roadmap page: raw JSON text showing instead of visual milestone cards (was Manus debug panel, not a bug)
- [x] Fix Questionnaire: after Generate My Roadmap, redirect properly to /roadmap
- [x] Ensure roadmap milestones render as beautiful visual cards with timeline

## Bug Fix - JSON Overflow on Questionnaire Page
- [x] Fix JSON raw text appearing on right side of screen during/after roadmap generation (was Manus monitoring panel, not a website bug)
- [x] Add overflow:hidden to root layout to prevent content leaking outside viewport
- [x] Ensure roadmap generation shows a proper full-screen loading state, not raw data

## New Feature - Self Assessment Score (SAS) Tool
- [x] Research and collect SAS criteria for all major UK specialties (12 specialties)
- [x] Build SAS database table (sas_results with sectionScores, answers, competitiveLevel)
- [x] Build interactive SAS Assessment page with per-specialty questions (/sas)
- [x] Auto-calculate total score and show breakdown by domain
- [x] Show score vs typical competitive threshold for each specialty
- [x] Save SAS results to user profile
- [x] Add SAS tool to navigation and dashboard

## SAS Expansion & Roadmap Integration
- [x] Add 6 new SAS specialties: Dermatology, Cardiology, Neurology, Gastroenterology, Endocrinology, Respiratory Medicine
- [x] Build SAS-to-Roadmap AI integration: analyse weak domains and generate targeted milestone suggestions
- [x] Add new tRPC procedure: sas.generateRoadmapSuggestions
- [x] Update SAS results page UI to display AI-suggested improvement milestones per weak domain

## Bug Fix - SAS Page Colors
- [x] Fix SAS Assessment page: light/washed-out background making text invisible — enforce dark theme

## SAS Roadmap Integration & History Page
- [x] Add DB support for saving SAS AI milestones as roadmap tasks
- [x] Add tRPC procedure: sas.saveMilestonesToRoadmap
- [x] Add "Save to Roadmap" button in SAS results after AI suggestions are generated
- [x] Build SAS History page (/sas/history) with all past assessments
- [x] Add score comparison chart (line/bar) across multiple assessments over time
- [x] Add SAS History link to dashboard navigation

## Bug Fix - Save to Roadmap
- [x] Fix "Failed to save milestones to Roadmap" error in SAS results page — DB category enum was missing 'presentation', 'oet', 'application' values; migrated live DB

## Email Auth System (Replace Manus OAuth)
- [x] Add passwordHash, whatsappNumber, graduationCountry fields to users table in schema.ts
- [x] Run DB migration to add new columns
- [x] Install bcryptjs for password hashing
- [x] Add register/login tRPC procedures in routers.ts
- [x] Build Register page (name, email, graduationCountry, whatsapp, password)
- [x] Build Login page (email + password)
- [x] Update useAuth hook to work with email auth
- [x] Update App.tsx to add /login and /register routes
- [x] Update Home page to show Login/Register buttons
- [x] Remove Manus OAuth dependency from auth flow
- [x] Run tests and fix any errors
- [x] Save checkpoint to enable publishing

## Resend Email Integration
- [x] Install Resend SDK
- [x] Add RESEND_API_KEY secret
- [x] Build email service (server/email.ts)
- [x] Send welcome email on registration
- [x] Add password reset table to DB schema
- [x] Add forgotPassword and resetPassword tRPC procedures
- [x] Build ForgotPassword page (/forgot-password)
- [x] Build ResetPassword page (/reset-password)
- [x] Add links to login page
- [ ] Push to GitHub
