# 4. Module Architecture

---

# 4.1 Purpose

This document defines the feature modules of the Personal OS backend, their responsibilities, ownership boundaries, and interaction rules.

The goal is to maximize cohesion within modules while minimizing coupling between modules.

---

# 4.2 Architectural Philosophy

The backend follows a feature-based modular architecture.

Each module encapsulates its own:

- Routes
- Controllers
- Services
- DTOs
- Validation
- Models
- Repositories
- Tests

Modules should expose functionality through well-defined service interfaces rather than allowing direct access to internal implementation details.

---

# 4.3 Module Overview

The initial Phase 1 modules are:

Authentication

User

Exercise

Workout

Weight

Nutrition

Water

Supplements

Common (Shared Infrastructure)

---

# 4.4 Module Responsibilities

## Authentication

Responsible for:

- Registration
- Login
- Logout
- Refresh Tokens
- Password Management
- Email Verification (Future)

Authentication owns identity verification only.

It does not manage user profile information.

---

## User

Responsible for:

- Profile Information
- Preferences
- Units
- Timezone
- Locale
- Account Settings

The User module does not manage nutrition goals, workouts, or supplements.

---

## Exercise

Responsible for:

- System Exercise Library
- Exercise Metadata
- Equipment Types
- Muscle Groups
- Categories

Exercises are read-only in Phase 1.

---

## Workout

Responsible for:

- Workout Templates
- Workout Sessions
- Exercise Sessions
- Set Logging
- Personal Records

The Workout module references the Exercise module but does not own exercise definitions.

---

## Weight

Responsible for:

- Weight Entries
- Weight History
- Progress Tracking

Future body measurements belong in this domain.

---

## Nutrition

Responsible for:

- Food Catalog
- Meals
- Meal Logging
- Daily Nutrition Totals
- Nutrition Goals

---

## Water

Responsible for:

- Water Intake Events
- Daily Hydration
- Container Presets

---

## Supplements

Responsible for:

- User Supplements
- Supplement Schedule
- Intake Logs

---

## Common

Contains reusable infrastructure shared across modules.

Examples:

- Error handling
- Logging
- Middleware
- Authentication middleware
- Validation utilities
- Response helpers
- Configuration
- Constants

Business logic should not reside in Common.

---

# 4.5 Module Dependencies

Allowed dependencies:

Authentication

↓

User

Workout

↓

Exercise

Nutrition

↓

User

Water

↓

User

Supplements

↓

User

Weight

↓

User

Modules should avoid circular dependencies.

---

# 4.6 Module Isolation

Each module owns its own data and business rules.

For example:

Workout owns:

- Templates
- Sessions
- Sets

Exercise owns:

- Exercise definitions

Workout must not modify Exercise data.

---

# 4.7 Communication Rules

Modules communicate through services.

Preferred:

WorkoutService

↓

ExerciseService

Avoid:

WorkoutRepository

↓

ExerciseRepository

This prevents tight coupling between persistence layers.

---

# 4.8 Shared Components

Shared infrastructure includes:

Configuration

Database Connection

Redis Connection

Authentication Middleware

Error Middleware

Logger

Environment Configuration

Response Utilities

Validation Utilities

These components reside outside feature modules.

---

# 4.9 Future Modules

The architecture supports future modules including:

Habits

Goals

Sleep

Mood

Analytics

Notifications

AI Assistant

Family

Calendar

Wearables

Each future module should remain independent whenever possible.

---

# 4.10 Folder Structure (Conceptual)

src/

modules/

authentication/

user/

exercise/

workout/

nutrition/

water/

supplements/

weight/

common/

config/

jobs/

types/

utils/

The internal structure of each module is defined in the Low-Level Design (LLD) documentation.

---

# 4.11 Design Principles

Every module should:

- Have a single responsibility
- Own its business logic
- Expose clear interfaces
- Hide implementation details
- Minimize dependencies
- Be independently testable
- Be independently maintainable
