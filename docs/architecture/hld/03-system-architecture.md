# 3. System Architecture

---

# 3.1 Purpose

This document describes the high-level architecture of the Personal OS platform.

It identifies the major system components, their responsibilities, and how they interact. It intentionally avoids implementation details such as database schemas, API contracts, and business logic.

---

# 3.2 Architectural Style

Personal OS follows a layered, modular architecture.

The system is API-first, backend-first, and mobile-first.

Business logic resides exclusively in the backend.

Client applications are responsible only for presentation and user interaction.

---

# 3.3 High-Level Architecture

                   Mobile App
                        │
                        │ REST API
                        ▼
                Express Backend API
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼

Authentication Business Logic Background Jobs
│ │ │
└───────────────┼────────────────┘
▼
MongoDB Database
│
▼
Redis
(Cache & Queue)

Future integrations:

• AI Services
• Push Notifications
• Health Connect
• Apple Health
• Wearables

---

# 3.4 Major Components

## Mobile Application

Responsibilities:

- User Interface
- State Management
- Authentication
- API Consumption
- Offline Support (Future)

The mobile application contains no business logic.

---

## Backend API

Responsibilities:

- Authentication
- Authorization
- Validation
- Business Rules
- Data Processing
- Persistence
- Error Handling

The backend acts as the single source of truth.

---

## Database

MongoDB stores all persistent application data.

Examples include:

- Users
- Workouts
- Nutrition
- Water
- Supplements
- Weight Logs

---

## Redis

Redis provides:

- Caching
- Background job storage
- Rate limiting
- Temporary data

Redis is not the system of record.

---

## Background Workers

Background workers execute asynchronous tasks.

Examples:

- Reminder notifications
- Email delivery
- AI processing
- Data synchronization
- Scheduled jobs

---

# 3.5 Client-Server Interaction

Typical request flow:

Client

↓

REST Request

↓

Controller

↓

Validation

↓

Service

↓

Repository

↓

MongoDB

↓

Response

↓

Client

Business rules are executed only inside the Service layer.

---

# 3.6 Layered Backend Architecture

Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Data Access Layer

↓

Database

Responsibilities:

Presentation Layer

- HTTP
- Routing
- Request parsing

Application Layer

- Use cases
- Service orchestration

Domain Layer

- Business rules
- Domain models

Data Access Layer

- Repository implementations
- Database interaction

---

# 3.7 Modular Architecture

The backend is organized into feature modules.

Example modules:

Authentication

User

Exercise

Workout

Weight

Nutrition

Water

Supplements

Each module owns:

- Controllers
- Services
- DTOs
- Validation
- Repositories
- Models

Modules communicate through services rather than direct database access.

---

# 3.8 External Dependencies

Current:

- MongoDB
- Redis

Future:

- AI Providers
- Push Notification Service
- Email Provider
- Cloud Storage
- Wearable APIs

External services are isolated behind dedicated service abstractions.

---

# 3.9 Scalability

The architecture supports:

- Horizontal API scaling
- Stateless backend servers
- Independent background workers
- Independent mobile and web clients
- Modular feature growth

---

# 3.10 Architectural Principles

The system follows these principles:

- Separation of Concerns
- High Cohesion
- Low Coupling
- API First
- Backend First
- Single Responsibility Principle
- Open/Closed Principle
- Dependency Inversion where beneficial
- Composition over inheritance
- AI as an enhancement
