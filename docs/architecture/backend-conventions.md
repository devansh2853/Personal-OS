# Backend Conventions

---

# 1. Purpose

This document defines the common backend development conventions for the Personal OS backend.

These conventions apply across all business domains and are intended to ensure consistency in project structure, naming, API implementation, validation, error handling, database access, and code organization.

Module-specific LLD documents shall follow these conventions unless a documented exception is required.

---

# 2. Technology Stack

The backend is built using:

| Component        | Technology |
| ---------------- | ---------- |
| Runtime          | Node.js    |
| Language         | TypeScript |
| API Framework    | Express.js |
| Database         | MongoDB    |
| Database Library | Mongoose   |
| Authentication   | JWT        |
| Password Hashing | bcrypt     |
| API Style        | REST       |

---

# 3. Architectural Pattern

The backend follows a layered architecture:

```text
Request
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
MongoDB
```

Each layer has a specific responsibility.

### Controller

Responsible for:

- Receiving HTTP requests
- Extracting request data
- Calling the appropriate service
- Returning HTTP responses
- Translating service results into API responses

Controllers shall not contain business logic.

---

### Service

Responsible for:

- Business logic
- Business rule enforcement
- Coordinating multiple repositories
- Performing calculations
- Managing domain workflows
- Controlling transactions where required

Services shall not directly handle HTTP-specific concerns.

---

### Repository

Responsible for:

- Database access
- MongoDB queries
- Persistence operations
- Database-specific filtering and indexing logic

Repositories shall not contain business rules.

---

# 4. Project Structure

The backend shall use a module-oriented structure.

```text
src/
│
├── modules/
│   ├── exercise/
│   ├── workout/
│   ├── food/
│   ├── nutrition/
│   ├── water/
│   ├── supplement/
│   ├── weight/
│   ├── user/
│   └── authentication/
│
├── middleware/
├── config/
├── database/
├── errors/
├── utils/
├── types/
└── app.ts
```

Each module owns its implementation.

Example:

```text
src/modules/workout/

├── workout.controller.ts
├── workout.service.ts
├── workout.repository.ts
├── workout.model.ts
├── workout.routes.ts
├── workout.validation.ts
├── workout.dto.ts
└── workout.mapper.ts
```

The exact file structure may vary slightly depending on module complexity.

---

# 5. Module Boundaries

Each domain module shall remain independently responsible for its own data and business logic.

For example:

```text
Workout
    owns WorkoutTemplate
    owns WorkoutSession

Exercise
    owns Exercise
    owns MuscleGroup
    owns Equipment
```

A module shall not directly modify another module's data.

For example:

```text
WorkoutService
```

may reference an Exercise by ID, but shall not directly update the Exercise collection.

---

# 6. User Ownership

User-owned resources shall contain a `userId` reference.

Example:

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    ...
}
```

The authenticated user's ID shall be obtained from the JWT.

Clients shall not be trusted to provide ownership through request bodies.

### Incorrect

```json
{
  "userId": "..."
}
```

### Correct

```text
JWT
 │
 ▼
Authentication Middleware
 │
 ▼
req.user.id
 │
 ▼
Service
```

The service shall use the authenticated user ID when querying user-owned resources.

---

# 7. Authentication Middleware

Protected routes shall pass through authentication middleware.

```text
HTTP Request
     │
     ▼
Authentication Middleware
     │
     ├── Invalid / Missing JWT → 401
     │
     ▼
Authenticated User
     │
     ▼
Controller
```

The middleware shall:

1. Extract the JWT from the request.
2. Validate the JWT signature.
3. Validate token expiration.
4. Extract the authenticated user ID.
5. Attach the authenticated identity to the request.

Example:

```typescript
req.user = {
  id: userId,
};
```

Controllers and services shall use this identity instead of accepting a user ID from the client.

---

# 8. API Design Conventions

APIs shall follow REST conventions.

## Resource Naming

Use plural resource names.

```http
GET /foods
GET /meals
GET /workout-templates
GET /water-logs
```

Use singular endpoints only for singleton resources.

```http
GET /user
GET /nutrition-goal
GET /water-goal
```

---

# 9. HTTP Method Conventions

| Method | Usage                                          |
| ------ | ---------------------------------------------- |
| GET    | Retrieve resources                             |
| POST   | Create resources or execute commands/workflows |
| PATCH  | Partially update resources                     |
| DELETE | Delete resources                               |

`PATCH` shall be preferred over `PUT` when only part of a resource is being modified.

Example:

```http
PATCH /user
```

```json
{
  "firstName": "Parth"
}
```

---

# 10. Command Endpoints

Some operations are workflows rather than CRUD operations.

These may use `POST`.

Examples:

```http
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/register
POST /auth/forgot-password
POST /auth/reset-password
```

These endpoints represent operations rather than simple CRUD modifications.

---

# 11. Request Validation

All incoming request data shall be validated before reaching business logic.

Validation shall cover:

- Required fields
- Data types
- Allowed enum values
- Numeric ranges
- String constraints
- Date formats
- Resource relationships

Invalid requests shall return:

```http
400 Bad Request
```

Validation logic shall remain separate from business logic.

---

# 12. DTOs

Controllers shall not directly expose database models as API contracts.

Request and response DTOs shall define the API contract.

Example:

```text
CreateMealRequest
UpdateMealRequest
MealResponse
```

This provides separation between:

```text
API Model
    ↓
Domain Model
    ↓
Database Model
```

DTOs may omit internal database fields such as:

- Internal timestamps
- Internal flags
- Database implementation details
- Sensitive authentication information

---

# 13. Database Models

MongoDB/Mongoose models shall represent persistence structures.

Example:

```typescript
const MealSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },

  name: {
    type: String,
    required: true,
  },
});
```

Database-specific concerns such as:

- Indexes
- MongoDB types
- Schema configuration
- TTL indexes

belong in the database layer.

---

# 14. Repository Conventions

Repositories shall expose meaningful operations rather than leaking database implementation details.

Prefer:

```typescript
findByUserId(userId);
findById(id);
create(data);
updateById(id, data);
deleteById(id);
```

over exposing raw Mongoose operations throughout the application.

Controllers and services should not contain queries such as:

```typescript
MealModel.find(...)
```

Database queries belong in repositories.

---

# 15. Service Conventions

Services contain business logic.

Example:

```text
MealService.createMeal()
```

may:

1. Validate referenced foods.
2. Calculate nutritional values.
3. Create nutritional snapshots.
4. Calculate meal totals.
5. Save the Meal.
6. Update DailyNutrition.

The controller should simply call:

```typescript
mealService.createMeal(...)
```

---

# 16. Error Handling

The backend shall use centralized error handling.

Application errors should use consistent error types.

Example:

```typescript
throw new NotFoundError("Meal not found");
```

The global error middleware converts this into an HTTP response.

Example:

```json
{
  "status": 404,
  "message": "Meal not found"
}
```

Controllers should not contain repetitive error formatting.

---

# 17. HTTP Status Codes

| Status Code                 | Usage                                              |
| --------------------------- | -------------------------------------------------- |
| `200 OK`                    | Successful GET or successful update returning data |
| `201 Created`               | Successful resource creation                       |
| `204 No Content`            | Successful operation with no response body         |
| `400 Bad Request`           | Invalid request                                    |
| `401 Unauthorized`          | Authentication required or invalid                 |
| `403 Forbidden`             | Authenticated but not allowed                      |
| `404 Not Found`             | Resource does not exist                            |
| `409 Conflict`              | Resource conflicts with existing state             |
| `500 Internal Server Error` | Unexpected server error                            |

---

# 18. Pagination

List endpoints shall support pagination where the result set may become large.

Standard parameters:

```http
?page=0&size=20
```

Example:

```http
GET /meals?page=0&size=20
```

The backend shall enforce a maximum page size to prevent excessively large queries.

---

# 19. Filtering

Filters shall be represented as query parameters.

Example:

```http
GET /meals?from=2026-08-01&to=2026-08-07
```

Multiple filters may be combined.

Example:

```http
GET /exercises?name=press&muscleGroupId=123&equipmentId=456
```

Dedicated `/filters` endpoints should not be created for ordinary resource filtering.

---

# 20. Sorting

List endpoints may support sorting through query parameters.

Example:

```http
GET /meals?sort=consumedAt:desc
```

The backend shall whitelist sortable fields rather than allowing arbitrary database fields.

---

# 21. Date and Time

All timestamps shall be stored in UTC.

Example:

```text
2026-08-08T15:30:00Z
```

User-specific display and date calculations shall use the user's configured timezone.

The User profile stores the user's timezone.

---

# 22. IDs

MongoDB documents shall use ObjectId internally.

API responses may expose IDs as strings.

Example:

```json
{
  "id": "66b..."
}
```

The database representation remains:

```javascript
_id: ObjectId(...)
```

Internal MongoDB `_id` should not be exposed directly as `_id` in API contracts.

---

# 23. Embedded Documents

Documents shall be embedded when they:

- Have no independent lifecycle
- Are always accessed with the parent
- Are owned by the parent
- Are persisted together with the parent

Examples:

```text
Meal
└── MealItem[]

WorkoutTemplate
└── TemplateExercise[]

WorkoutSession
└── SessionExercise[]
    └── WorkoutSet[]
```

Embedded documents should have their own IDs when they need to be individually referenced during updates.

---

# 24. References

References shall be used when an entity:

- Has an independent lifecycle
- Belongs to another bounded context
- Is shared across multiple entities
- Is independently queried

Examples:

```text
MealItem
└── foodId → Food

TemplateExercise
└── exerciseId → Exercise

AuthAccount
└── userId → User
```

---

# 25. Derived Data

Derived data shall only be persisted when there is a clear performance or architectural reason.

Example:

```text
DailyNutrition
```

is persisted because it is a materialized projection.

However:

```text
remainingCalories
remainingProtein
```

shall be calculated from:

```text
NutritionGoal
+
DailyNutrition
```

and shall not be stored independently.

---

# 26. Historical Snapshots

When historical accuracy is required, data shall be stored as a snapshot rather than dynamically resolved from the current source.

Example:

```text
MealItem
├── foodId
├── calories
├── protein
├── carbohydrates
└── fat
```

The nutritional values are captured when the meal is recorded.

Changes to the Food catalog therefore do not change historical meals.

---

# 27. Transactions

MongoDB transactions shall be used when multiple database operations must succeed or fail together to preserve consistency.

Examples include:

```text
Create User
    +
Create AuthAccount
    +
Create NutritionGoal
    +
Create WaterGoal
```

and operations where multiple collections must remain synchronized.

Transactions should not be used unnecessarily for independent operations.

---

# 28. Idempotency

Operations shall be designed to avoid accidental duplicate resources where practical.

For example:

- Unique indexes shall enforce unique emails.
- Unique `userId` indexes shall enforce singleton resources.
- Business rules shall prevent duplicate records where required.

For external or retry-prone operations, explicit idempotency mechanisms may be introduced when necessary.

---

# 29. Logging

The backend shall use structured logging.

Logs should include relevant contextual information such as:

- Request ID
- User ID when available
- Endpoint
- HTTP method
- Status code
- Execution duration
- Error information

Sensitive information shall never be logged.

Never log:

- Passwords
- Password hashes
- JWTs
- Refresh Tokens
- Password reset tokens

---

# 30. Security Conventions

The backend shall:

- Hash passwords using bcrypt.
- Never store plaintext passwords.
- Never store plaintext Refresh Tokens.
- Never store plaintext password reset tokens.
- Validate JWT signatures.
- Enforce JWT expiration.
- Use HTTPS in production.
- Validate all client input.
- Avoid exposing sensitive internal errors.
- Enforce authorization at the service/resource level.

---

# 31. Sensitive Data

Sensitive authentication information shall never be returned through normal API responses.

For example, `AuthAccount` shall never be returned directly to the frontend.

The following fields shall never appear in API responses:

```text
passwordHash
refreshToken
refreshTokenHash
resetPasswordTokenHash
```

---

# 32. API Response Convention

Successful resource endpoints shall return the resource directly unless a wrapper is required for pagination or metadata.

Example:

```json
{
  "id": "...",
  "name": "Lunch",
  "consumedAt": "2026-08-08T13:00:00Z"
}
```

Paginated responses shall include both data and pagination metadata.

Example:

```json
{
  "data": [],
  "pagination": {
    "page": 0,
    "size": 20,
    "total": 125,
    "totalPages": 7
  }
}
```

---

# 33. Naming Conventions

## TypeScript

Use `camelCase` for variables and functions.

```typescript
const userId = ...
const getMealById = ...
```

Use `PascalCase` for classes, types, interfaces, and schemas.

```typescript
class MealService {}

interface MealResponse {}

const MealSchema = ...
```

---

## Files

Use lowercase kebab-case or consistent module naming.

Example:

```text
meal.controller.ts
meal.service.ts
meal.repository.ts
meal.model.ts
meal.routes.ts
meal.validation.ts
```

---

## Database Fields

Use `camelCase`.

```javascript
userId;
createdAt;
consumedAt;
referenceServingUnit;
```

---

# 34. Async Code

Use `async/await` rather than promise chaining for backend operations.

Prefer:

```typescript
const meal = await mealRepository.findById(mealId);
```

over:

```typescript
mealRepository.findById(mealId)
    .then(...)
    .catch(...);
```

Errors shall be propagated to centralized error handling.

---

# 35. Controllers

Controllers should remain thin.

Preferred:

```typescript
async createMeal(req, res) {
    const meal = await mealService.createMeal(
        req.user.id,
        req.body
    );

    return res.status(201).json(meal);
}
```

Avoid putting business logic directly inside controllers.

---

# 36. Services

Services should be framework-independent where practical.

A service should ideally not depend directly on Express request or response objects.

Prefer:

```typescript
mealService.createMeal(userId, request);
```

rather than:

```typescript
mealService.createMeal(req, res);
```

This makes services easier to test and reuse.

---

# 37. Testing Conventions

Testing shall be divided into:

### Unit Tests

Test business logic in isolation.

Examples:

```text
MealService
Nutrition calculations
Validation logic
```

### Integration Tests

Test interactions with:

```text
MongoDB
Repositories
Authentication
```

### API Tests

Test complete HTTP behavior:

```text
Request
→ Middleware
→ Controller
→ Service
→ Repository
→ Response
```

Critical authentication and data ownership flows should have API/integration coverage.

---

# 38. Environment Configuration

Environment-specific configuration shall not be hardcoded.

Examples:

```text
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN
PORT
```

Configuration shall be loaded through environment variables and centralized configuration management.

Secrets shall never be committed to source control.

---

# 39. Business Logic vs Database Logic

The following distinction shall be maintained:

### Business Logic

Belongs in Services.

```text
Can this meal be created?
Should this goal be updated?
Should this session be revoked?
How should nutrition be calculated?
```

### Database Logic

Belongs in Repositories.

```text
Find document
Insert document
Update document
Delete document
Query by index
```

---

# 40. LLD Consistency

Every module-specific LLD should document:

- Module structure
- Controllers
- Routes
- DTOs
- Validation
- Services
- Repository interfaces
- Database models
- Important business logic
- Error handling
- External dependencies where applicable

Module-specific LLD documents should not redefine project-wide conventions unless the module requires an explicit exception.

---

# 41. Design Principle

The backend should follow this general principle:

```text
HTTP concerns
        ↓
Controllers

Business concerns
        ↓
Services

Persistence concerns
        ↓
Repositories

Storage concerns
        ↓
MongoDB
```

Each layer should have a clear responsibility and should avoid leaking its concerns into other layers.

The goal is to keep modules:

- Cohesive
- Independently testable
- Easy to modify
- Consistent across the application
- Independent from infrastructure details where practical
