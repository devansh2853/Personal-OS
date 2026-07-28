# 5. Data Flow Architecture

---

# 5.1 Purpose

This document describes how data flows through the Personal OS platform.

It defines the interaction between client applications, backend services, persistence layers, background workers, and future external integrations.

The objective is to establish a consistent request lifecycle across all modules while maintaining loose coupling and clear separation of responsibilities.

---

# 5.2 Request Lifecycle

Every client request follows the same processing pipeline.

```text
Mobile App
      │
      ▼
Express Route
      │
      ▼
Controller
      │
      ▼
Validation
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
MongoDB
      │
      ▼
Repository
      │
      ▼
Service
      │
      ▼
Controller
      │
      ▼
HTTP Response
      │
      ▼
Mobile App
```

Business logic is executed only within the Service layer.

Controllers remain thin and are responsible only for HTTP request handling.

Repositories interact only with persistence mechanisms.

---

# 5.3 Authentication Flow

Authenticated requests follow the sequence below.

```text
Client

↓

Access Token

↓

Authentication Middleware

↓

Token Validation

↓

User Authorization

↓

Controller

↓

Business Logic

↓

Response
```

Unauthenticated requests are rejected before reaching business logic.

---

# 5.4 Data Persistence Flow

All persistent data follows a common flow.

```text
Request

↓

Validation

↓

Service

↓

Repository

↓

MongoDB

↓

Stored Document
```

The repository layer abstracts database implementation details from business logic.

---

# 5.5 Read Operations

Typical read operations follow the sequence below.

```text
Client

↓

GET Request

↓

Controller

↓

Service

↓

Repository

↓

MongoDB

↓

Response DTO

↓

Client
```

Read operations shall never expose internal database models directly.

---

# 5.6 Write Operations

Typical write operations follow the sequence below.

```text
Client

↓

POST / PUT / PATCH / DELETE

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

Success Response
```

Business rules are evaluated before data is persisted.

---

# 5.7 Background Processing

Operations that do not require immediate user feedback shall execute asynchronously.

Examples include:

- Notification scheduling
- Reminder delivery
- Email sending
- AI processing
- Analytics generation
- Future data synchronization

---

Background processing flow:

```text
Service

↓

BullMQ Queue

↓

Worker

↓

Background Task

↓

MongoDB / External Service
```

The user receives an immediate response while background work continues independently.

---

# 5.8 Caching Flow

Frequently accessed data may be cached.

Examples include:

- Exercise Library
- Food Database
- User Preferences
- Frequently accessed reference data

Flow:

```text
Client

↓

Service

↓

Redis Cache

↓

Cache Hit?

Yes

↓

Return Cached Data

No

↓

MongoDB

↓

Update Cache

↓

Return Data
```

Redis is considered a performance optimization only.

MongoDB remains the source of truth.

---

# 5.9 AI Processing Flow (Future)

AI functionality shall execute independently of the primary application workflow.

```text
User Request

↓

Backend

↓

Collect Context

↓

AI Service

↓

LLM

↓

AI Response

↓

Client
```

If the AI service is unavailable, core application functionality shall continue operating normally.

---

# 5.10 Notification Flow

Future notification processing follows the sequence below.

```text
Scheduled Event

↓

BullMQ Queue

↓

Notification Worker

↓

Push Notification Service

↓

Mobile Device
```

Notification failures shall not impact business operations.

---

# 5.11 Error Flow

Errors follow a centralized handling process.

```text
Request

↓

Controller

↓

Service

↓

Exception

↓

Global Error Handler

↓

Standard Error Response
```

Internal implementation details shall never be exposed to clients.

---

# 5.12 Logging Flow

Every request follows a standard logging lifecycle.

```text
Incoming Request

↓

Controller

↓

Service

↓

Repository

↓

Response

↓

Structured Log
```

Logs shall include sufficient context for debugging while excluding sensitive user information.

---

# 5.13 Design Principles

The data flow architecture follows these principles:

- Single direction of responsibility
- Stateless request processing
- Centralized validation
- Centralized error handling
- Repository abstraction
- Asynchronous background processing
- Source-of-truth persistence
- AI isolation from core business logic
