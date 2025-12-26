# Fusiontecz Workflow Management System

A production-grade multi-user workflow management system inspired by Jira/Linear.

---

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- REST APIs

---

## Architecture Overview

The backend follows a layered architecture:

- Routes: API definitions
- Controllers: Request/response handling
- Services: Business logic and rules
- Models: Database schemas
- Middlewares: Authentication, authorization, error handling

Business rules are enforced strictly at the backend level.

---

## Authentication & Authorization

- JWT-based authentication
- Secure password hashing using bcrypt
- No sensitive data exposed in APIs

### Role Strategy
- Users do not have global roles
- Ownership is project-scoped
- Project creator is the OWNER
- Invited users are MEMBERS

---

## Project Access Rules

| Action | Owner | Member |
|------|------|--------|
| Create Project | ✅ | ❌ |
| View Project | ✅ | ✅ |
| Invite Members | ✅ | ❌ |
| Create Tasks | ✅ | ✅ |
| Update Task Status | ✅ | ✅ |

---

## Task Lifecycle Rules

Task status transitions are strictly enforced:

# install modules
npm i 

#run 
npm run dev

