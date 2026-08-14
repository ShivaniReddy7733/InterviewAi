# MockTalk — AI Mock Interview Platform

MockTalk is an AI-powered mock interview platform that helps users practice technical interviews through role-specific questions, voice-based answers, and AI-generated feedback.

Users can enter a job role, technology stack, and experience level. The platform generates interview questions using Google's Gemini API, captures answers using speech-to-text, evaluates each answer with AI, and stores the results for review.

## 🚀 Features

- 🔐 User authentication with Clerk
- 💼 Create interviews based on:
  - Job title
  - Technology stack
  - Experience level
- 🤖 AI-generated interview questions using Google Gemini
- 🎤 Voice-based answer recording with speech-to-text
- 📹 Webcam integration for a realistic interview experience
- 🧠 AI-based answer evaluation
- ⭐ Answer rating out of 10
- 💬 Detailed AI feedback for every answer
- 📊 Overall interview rating
- 🗄️ Persistent interview and feedback data using PostgreSQL
- ⚡ Responsive Next.js interface

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- JavaScript
- Tailwind CSS

### Authentication
- Clerk

### Database
- PostgreSQL
- Neon
- Drizzle ORM

### AI
- Google Gemini API

### Browser APIs / Libraries
- Speech-to-text using `react-hook-speech-to-text`
- Webcam using `react-webcam`

### Tools
- Git
- GitHub
- VS Code
- npm

## 🏗️ Application Flow

User
  ↓
Clerk Authentication
  ↓
Dashboard
  ↓
Create Interview
  ↓
Job Title + Tech Stack + Experience
  ↓
Gemini API
  ↓
AI-generated Interview Questions
  ↓
Interview Session
  ↓
Webcam + Microphone + Speech-to-Text
  ↓
Candidate Answer
  ↓
Gemini AI Evaluation
  ↓
Rating + Feedback
  ↓
PostgreSQL / Neon
  ↓
Feedback Dashboard

## 📁 Project Structure

```text
InterviewAi/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.jsx
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.jsx
│   │
│   ├── dashboard/
│   │   ├── _components/
│   │   │   ├── AddNewInterview.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── InterviewList.jsx
│   │   │   └── InterviewcardList.jsx
│   │   │
│   │   ├── interview/
│   │   │   └── [interviewid]/
│   │   │       ├── feedback/
│   │   │       │   └── page.jsx
│   │   │       ├── start/
│   │   │       │   ├── _components/
│   │   │       │   │   ├── QuestionsList.jsx
│   │   │       │   │   └── RecordAnswerSection.jsx
│   │   │       │   └── page.jsx
│   │   │       └── page.jsx
│   │   │
│   │   ├── questions/
│   │   │   └── page.jsx
│   │   ├── upgrade/
│   │   │   ├── _components/
│   │   │   │   └── PlanItemCard.jsx
│   │   │   └── page.jsx
│   │   ├── layout.jsx
│   │   └── page.jsx
│   │
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   └── ui/
│       ├── button.jsx
│       ├── collapsible.jsx
│       ├── dialog.jsx
│       ├── input.jsx
│       ├── sonner.jsx
│       └── textarea.jsx
│
├── lib/
│   └── utils.js
│
├── utils/
│   ├── db.js
│   ├── Geminimodel.js
│   ├── planData.js
│   └── schema.js
│
├── public/
│   ├── logo.svg
│   ├── webcam.png
│   └── other assets
│
├── drizzle.config.js
├── middleware.js
├── next.config.mjs
├── package.json
├── package-lock.json
├── tailwind.config.js
└── tsconfig.json


## 🧠 How AI Is Used

Gemini is used in two major parts of the application.

### 1. Interview Question Generation

The user provides:

- Job Title
- Technology Stack
- Experience Level

This information is sent to Gemini, which generates role-specific interview questions.

### 2. Answer Evaluation

After the candidate answers a question using speech-to-text, the application sends the interview question and candidate answer to Gemini.

Gemini evaluates the response and generates:

- A rating from 1 to 10
- Detailed feedback

The result is then stored in PostgreSQL.

## 🗄️ Database

The application uses PostgreSQL hosted on Neon and Drizzle ORM for database interaction.

The database stores:

- Interview information
- Interview questions
- Candidate answers
- Correct answers
- AI-generated feedback
- Ratings
- User email
- Interview timestamps

Drizzle ORM is used to define the database schema and perform database operations.

## 🔐 Environment Variables

Create a `.env.local` file in the project root.

Required environment variables include:

- Clerk publishable key
- Clerk secret key
- Gemini API key
- Neon PostgreSQL connection string
- Clerk sign-in URL
- Clerk sign-up URL

Example:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_KEY_GEMINI=your_gemini_api_key
NEXT_PUBLIC_DRIZZLE_DB_URL=your_neon_postgresql_connection_string
NEXT_PUBLIC_INFO_INTRO="Enable webcam & mic to start the interview. We never record your video."
NEXT_PUBLIC_INFO_INSTRUCT="Answer five questions; at the end you’ll receive a detailed report."

Never commit `.env.local` or expose API keys, database credentials, or Clerk secrets publicly.

## ⚙️ Getting Started

### 1. Clone the repository

git clone https://github.com/ShivaniReddy7733/InterviewAi.git
cd InterviewAi

### 2. Install dependencies

npm install

### 3. Configure environment variables

Create a `.env.local` file in the project root and add your Clerk, Gemini, and Neon credentials.

### 4. Push the database schema

npm run db-push

### 5. Start the development server

npm run dev

Open http://localhost:3000 in your browser.

## 🎯 Typical User Journey

1. User signs up or signs in using Clerk.
2. User opens the dashboard.
3. User creates a new interview.
4. User enters the target job role, technology stack, and experience level.
5. Gemini generates interview questions.
6. User enables webcam and microphone.
7. User answers each question using voice.
8. Speech-to-text converts the spoken answer into text.
9. Gemini evaluates the candidate's answer.
10. The rating and feedback are stored in PostgreSQL.
11. User reviews the complete interview feedback and overall rating.

## 🔒 Security

Sensitive environment variables are stored locally in `.env.local` and excluded through `.gitignore`.

The repository does not contain:

- API keys
- Database passwords
- Clerk secret keys
- Local environment configuration

## 📌 Current Status

The core mock interview workflow is fully functional.

### Completed

- Authentication
- Interview creation
- AI question generation
- Voice-based answers
- Speech-to-text
- Webcam integration
- AI answer evaluation
- Database persistence
- Rating generation
- Feedback generation
- Feedback dashboard
- Overall interview rating

## 🚀 Future Improvements

Possible future improvements include:

- Python-based AI backend
- Resume-based interview generation
- More advanced AI evaluation
- Interview performance analytics
- Question difficulty selection
- Personalized interview recommendations
- Technical and behavioral interview modes
- Interview history and progress tracking

## 👩‍💻 Author

Shivani Reddy

GitHub: https://github.com/ShivaniReddy7733

## ⭐ Repository

https://github.com/ShivaniReddy7733/InterviewAi

---

If you find this project useful, consider starring the repository.
