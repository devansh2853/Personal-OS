# User Low-Level Design

---

# 1. Purpose

The User module manages the user's application profile and provides access to the authenticated user's profile data.

The User module owns only the `User` entity.

Authentication is handled by the Authentication module, while module-specific user data is owned by its respective business domain.

---

# 2. Module Structure

The User module follows the standard layered backend architecture.

```text
src/
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   └── error.middleware.ts
│
└── modules/
    └── user/
        ├── user.controller.ts
        ├── user.service.ts
        ├── user.repository.ts
        ├── user.model.ts
        ├── user.routes.ts
        ├── user.validation.ts
        ├── user.dto.ts
        └── user.mapper.ts
```

Account deletion is an application-level workflow because it coordinates multiple domains.

```text
src/
│
└── application/
    └── account-deletion/
        └── account-deletion.service.ts
```

---

# 3. Architecture

The User module follows this layered flow:

```text
HTTP Request
      │
      ▼
Authentication Middleware
      │
      ▼
Validation Middleware
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
Mongoose Model
      │
      ▼
MongoDB
```

For account deletion, the flow additionally includes the application-level deletion orchestrator.

```text
Controller
      │
      ▼
AccountDeletionService
      │
      ├── AuthenticationService
      ├── WorkoutService
      ├── FoodMealService
      ├── NutritionService
      ├── WaterService
      ├── WeightService
      ├── SupplementService
      └── UserService
```

---

# 4. Routes

| Method | Endpoint | Authentication | Purpose                                                     |
| ------ | -------- | -------------- | ----------------------------------------------------------- |
| GET    | `/user`  | Required       | Retrieve the authenticated user's profile                   |
| PATCH  | `/user`  | Required       | Partially update the authenticated user's profile           |
| DELETE | `/user`  | Required       | Delete the authenticated user's account and associated data |

The user ID is intentionally not included in the URL.

The authenticated user's ID is obtained from the JWT.

---

# 5. Authentication Middleware

All User endpoints require authentication.

The shared `auth.middleware.ts` is responsible for:

1. Extracting the JWT from the `Authorization` header.
2. Verifying the JWT signature.
3. Verifying token expiration.
4. Extracting the authenticated user ID.
5. Attaching the authenticated identity to the request.

Example:

```typescript
req.user = {
  id: userId,
};
```

If the JWT is missing or invalid:

```text
401 Unauthorized
```

The request does not reach the User Controller.

The User Controller does not perform JWT verification itself.

---

# 6. Validation Middleware

Request validation is handled by the shared `validation.middleware.ts`.

The middleware receives a module-specific validation schema.

Example:

```typescript
validate(UpdateUserSchema);
```

The validation middleware is responsible for structural request validation.

It validates:

- Data types
- Enum values
- Numeric constraints
- Date formats
- String constraints
- Allowed request fields
- Required fields where applicable

Invalid requests return:

```text
400 Bad Request
```

## Validation vs Business Logic

Validation checks whether the request is structurally valid.

For example:

```text
height = -50
```

is rejected by validation.

Similarly:

```text
heightUnit = "BANANA"
```

is rejected because it is not a valid enum value.

Business rules are handled by the User Service.

For example:

```text
"Is the user allowed to perform this update?"
```

belongs to the service layer.

Mongoose schema validation provides an additional database-level integrity layer but is not the primary API validation mechanism.

---

# 7. GET /user

Retrieves the authenticated user's profile.

## Request

```http
GET /user
Authorization: Bearer <JWT>
```

No user ID is required in the request.

## Flow

```text
GET /user
    │
    ▼
Authentication Middleware
    │
    ▼
UserController.getUser()
    │
    ▼
UserService.getUserById(userId)
    │
    ▼
UserRepository.findById(userId)
    │
    ▼
UserMapper.toResponse()
    │
    ▼
200 OK
```

## Controller Responsibilities

The controller:

1. Extracts `req.user.id`.
2. Calls `UserService.getUserById(userId)`.
3. Returns the `UserResponse`.

The controller does not directly query MongoDB.

## Possible Errors

| Status | Condition                         |
| ------ | --------------------------------- |
| `401`  | Missing or invalid JWT            |
| `404`  | Authenticated User does not exist |
| `500`  | Unexpected server error           |

A valid JWT does not guarantee that the User document exists.

For example, a User may have been deleted while an existing JWT has not yet expired.

---

# 8. PATCH /user

Partially updates the authenticated user's profile.

## Request

```http
PATCH /user
Authorization: Bearer <JWT>
```

The request body contains only the fields that need to be updated.

Example:

```json
{
  "height": 182
}
```

Another example:

```json
{
  "firstName": "Parth",
  "fitnessGoal": "BUILD_MUSCLE",
  "preferredWeightUnit": "KILOGRAM"
}
```

## Flow

```text
PATCH /user
    │
    ▼
Authentication Middleware
    │
    ▼
Validation Middleware
    │
    ▼
UserController.updateUser()
    │
    ▼
UserService.updateUserById(userId, updateRequest)
    │
    ▼
UserRepository.updateById(userId, updateData)
    │
    ▼
UserMapper.toResponse()
    │
    ▼
200 OK
```

## Request DTO

A single `UpdateUserRequest` DTO is used.

All fields are optional because PATCH supports partial updates.

```typescript
interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  height?: number;
  heightUnit?: HeightUnit;
  preferredWeightUnit?: WeightUnit;
  preferredWaterUnit?: WaterUnit;
  timeZone?: string;
  activityLevel?: ActivityLevel;
  fitnessGoal?: FitnessGoal;
}
```

The frontend can send any subset of these fields.

## Response

The updated User is returned as a `UserResponse`.

## Possible Errors

| Status | Condition               |
| ------ | ----------------------- |
| `400`  | Invalid request data    |
| `401`  | Missing or invalid JWT  |
| `404`  | User does not exist     |
| `500`  | Unexpected server error |

---

# 9. DELETE /user

Deletes the authenticated user's account and all user-owned data across the application.

## Request

```http
DELETE /user
Authorization: Bearer <JWT>
```

No user ID is included in the URL or request body.

## Flow

```text
DELETE /user
    │
    ▼
Authentication Middleware
    │
    ▼
UserController.deleteUser()
    │
    ▼
AccountDeletionService.deleteAccount(userId)
    │
    ├── AuthenticationService.deleteUserData()
    ├── WorkoutService.deleteUserData()
    ├── FoodMealService.deleteUserData()
    ├── NutritionService.deleteUserData()
    ├── WaterService.deleteUserData()
    ├── WeightService.deleteUserData()
    ├── SupplementService.deleteUserData()
    │
    └── UserService.deleteUser()
              │
              ▼
        UserRepository.deleteById()
```

After successful deletion:

```http
204 No Content
```

---

# 10. Account Deletion Orchestration

Account deletion is an application-level workflow because it spans multiple bounded contexts.

The `AccountDeletionService` coordinates deletion but does not directly access the repositories of other domains.

Conceptually:

```typescript
async deleteAccount(userId: string) {

    await authenticationService.deleteUserData(userId);

    await workoutService.deleteUserData(userId);

    await foodMealService.deleteUserData(userId);

    await nutritionService.deleteUserData(userId);

    await waterService.deleteUserData(userId);

    await weightService.deleteUserData(userId);

    await supplementService.deleteUserData(userId);

    await userService.deleteUser(userId);
}
```

Each domain remains responsible for deleting its own data.

The orchestrator knows **which domains must participate**, but does not know how their data is stored.

---

# 11. Domain Deletion Responsibilities

| Domain         | Data Deleted                                     |
| -------------- | ------------------------------------------------ |
| Authentication | AuthAccount, RefreshTokens                       |
| Workout        | WorkoutTemplates, WorkoutSessions                |
| Food & Meal    | MealTemplates, Meals                             |
| Nutrition      | NutritionGoal, DailyNutrition                    |
| Water          | WaterGoal, WaterLogs                             |
| Weight         | WeightLogs                                       |
| Supplement     | Supplements, SupplementSchedules, SupplementLogs |
| User           | User                                             |

The Food catalog is not deleted because it is application-level catalog data and is not owned by an individual user.

---

# 12. User Service

The User Service contains business operations belonging to the User domain.

## Methods

```text
getUserById(userId)

updateUserById(userId, updateRequest)

deleteUser(userId)
```

---

## `getUserById()`

Responsibilities:

1. Request the User from the repository.
2. Throw `NotFoundError` if the User does not exist.
3. Return the User to the controller/application layer.

---

## `updateUserById()`

Responsibilities:

1. Receive the authenticated user's ID and validated update request.
2. Apply User-domain business rules.
3. Update the User through the repository.
4. Return the updated User.

The service does not perform HTTP-specific operations.

---

## `deleteUser()`

Deletes only the User entity owned by the User domain.

It does not delete:

- AuthAccount
- Workout data
- Meal data
- Water data
- Weight data
- Supplement data
- Nutrition data

Those are handled by the respective domains through `AccountDeletionService`.

---

# 13. User Repository

The User Repository is responsible only for persistence operations against the User collection.

## Methods

```text
findById(userId)

updateById(userId, updateData)

deleteById(userId)

create(userData)
```

### `findById()`

Retrieves a User by its ID.

### `updateById()`

Updates the specified User document.

### `deleteById()`

Deletes the User document.

### `create()`

Creates a User document.

The `create()` repository method exists because user registration requires creation of a User.

However, the User API does not expose:

```http
POST /user
```

User creation is initiated through:

```http
POST /auth/register
```

---

# 14. User Model

The Mongoose model represents the MongoDB persistence schema defined in the User Database Design.

Conceptually:

```text
UserModel
│
├── firstName
├── lastName
├── dateOfBirth
├── gender
├── height
├── heightUnit
├── preferredWeightUnit
├── preferredWaterUnit
├── timeZone
├── activityLevel
├── fitnessGoal
├── createdAt
└── updatedAt
```

The model contains database-specific configuration such as:

- Data types
- Required fields
- Enum constraints
- Schema validation
- Timestamps
- Indexes where required

---

# 15. DTOs

DTOs define the API contract independently of the MongoDB document structure.

## UserResponse

The User response contains:

```text
id
firstName
lastName
dateOfBirth
gender
height
heightUnit
preferredWeightUnit
preferredWaterUnit
timeZone
activityLevel
fitnessGoal
```

The MongoDB `_id` field is exposed as `id` in the API response.

Internal database fields are not exposed.

---

## UpdateUserRequest

Contains the optional fields that may be modified through PATCH.

```typescript
interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  height?: number;
  heightUnit?: HeightUnit;
  preferredWeightUnit?: WeightUnit;
  preferredWaterUnit?: WaterUnit;
  timeZone?: string;
  activityLevel?: ActivityLevel;
  fitnessGoal?: FitnessGoal;
}
```

---

# 16. Mapper

The User Mapper converts the persistence representation into the API representation.

```text
UserDocument
     │
     ▼
UserMapper.toResponse()
     │
     ▼
UserResponse
```

The mapper is responsible for:

- Converting MongoDB `_id` to API `id`.
- Selecting fields exposed through the API.
- Preventing database-specific fields from being accidentally exposed.

---

# 17. Validation Schemas

User-specific validation schemas are defined in:

```text
user.validation.ts
```

Examples include:

```text
UpdateUserSchema
```

The schemas are passed to the shared validation middleware.

Example:

```typescript
validate(UpdateUserSchema);
```

The validation middleware itself is shared across the entire application.

The User module owns the User-specific validation rules.

---

# 18. Error Handling

The User module uses the application's centralized error-handling middleware.

Services may throw application-specific errors.

Example:

```typescript
throw new NotFoundError("User not found");
```

The global error middleware converts the error into the appropriate HTTP response.

Controllers should not manually format every error.

---

# 19. Complete Request Flow

## GET

```text
GET /user
     │
     ▼
Auth Middleware
     │
     ▼
User Controller
     │
     ▼
User Service
     │
     ▼
User Repository
     │
     ▼
MongoDB
     │
     ▼
Mapper
     │
     ▼
200 OK
```

## PATCH

```text
PATCH /user
     │
     ▼
Auth Middleware
     │
     ▼
Validation Middleware
     │
     ▼
User Controller
     │
     ▼
User Service
     │
     ▼
User Repository
     │
     ▼
MongoDB
     │
     ▼
Mapper
     │
     ▼
200 OK
```

## DELETE

```text
DELETE /user
     │
     ▼
Auth Middleware
     │
     ▼
User Controller
     │
     ▼
AccountDeletionService
     │
     ├── Authentication
     ├── Workout
     ├── Food & Meal
     ├── Nutrition
     ├── Water
     ├── Weight
     ├── Supplement
     │
     ▼
UserService
     │
     ▼
UserRepository
     │
     ▼
MongoDB
     │
     ▼
204 No Content
```

---

# 20. Important Design Decisions

## Authenticated User Context

The User API does not accept a user ID from the client.

The user ID is obtained from the verified JWT.

This prevents clients from attempting to access another user's profile by changing a URL parameter.

---

## User Creation

User creation is part of the Authentication registration workflow rather than the User API.

```text
POST /auth/register
        │
        ├── Create User
        ├── Create AuthAccount
        ├── Create NutritionGoal
        └── Create WaterGoal
```

---

## PATCH Instead of PUT

The User API uses PATCH because profile updates are generally partial.

The client only sends fields that need to change.

---

## Account Deletion

Account deletion is coordinated outside the User Service because the User domain does not own other domains' data.

Each domain deletes its own user-owned data.

---

## User Deletion Order

User-owned data in dependent domains is deleted before the User document itself.

This allows the authenticated User identity to remain available during the deletion workflow.

---

## Layer Separation

Each layer has a single primary responsibility:

| Layer                     | Responsibility                           |
| ------------------------- | ---------------------------------------- |
| Authentication Middleware | Authenticate request                     |
| Validation Middleware     | Validate request structure               |
| Controller                | Handle HTTP concerns                     |
| Service                   | Apply business logic                     |
| Repository                | Perform database operations              |
| Model                     | Define persistence schema                |
| Mapper                    | Convert persistence data to API DTO      |
| AccountDeletionService    | Coordinate cross-domain account deletion |

---

# 21. Future Evolution

The Phase 1 implementation uses synchronous application-level account deletion orchestration.

A future implementation may evolve toward an asynchronous deletion workflow:

```text
DELETE /user
      │
      ▼
AccountDeletionRequested
      │
      ├── Authentication
      ├── Workout
      ├── Food & Meal
      ├── Nutrition
      ├── Water
      ├── Weight
      └── Supplement
```

Each domain could independently process the deletion event and report completion.

This is intentionally not required for Phase 1.
