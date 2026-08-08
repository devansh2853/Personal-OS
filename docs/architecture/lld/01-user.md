# User Low-Level Design

---

# 1. Purpose

The User module manages the user's application profile and provides access to the authenticated user's profile data.

The module owns only the `User` entity.

Authentication is handled by the Authentication module, while module-specific user data is owned by its respective business domain.

---

# 2. Module Structure

```text
src/modules/user/

├── user.controller.ts
├── user.service.ts
├── user.repository.ts
├── user.model.ts
├── user.routes.ts
├── user.validation.ts
├── user.dto.ts
└── user.mapper.ts
```

Account deletion orchestration is handled outside the User module because it coordinates deletion across multiple domains.

```text
src/application/

└── account-deletion/
    └── account-deletion.service.ts
```

---

# 3. Routes

| Method | Endpoint | Authentication | Purpose                                                     |
| ------ | -------- | -------------- | ----------------------------------------------------------- |
| GET    | `/user`  | Required       | Retrieve the authenticated user's profile                   |
| PATCH  | `/user`  | Required       | Partially update the authenticated user's profile           |
| DELETE | `/user`  | Required       | Delete the authenticated user's account and associated data |

The user ID is not included in the URL.

The authenticated user's ID is extracted from the JWT by the authentication middleware.

---

# 4. Authentication Context

All User endpoints require authentication.

The Authentication Middleware:

1. Extracts the JWT from the `Authorization` header.
2. Verifies the JWT signature.
3. Verifies token expiration.
4. Extracts the user ID from the JWT.
5. Attaches the authenticated identity to the request.

Example:

```typescript
req.user = {
  id: userId,
};
```

Controllers use `req.user.id` to identify the current user.

The client does not provide the `userId` for User endpoints.

---

# 5. Controller

The User Controller is responsible for HTTP-level concerns only.

It shall:

- Extract the authenticated user ID.
- Extract request data.
- Invoke the appropriate service.
- Return the HTTP response.

It shall not:

- Perform database queries directly.
- Contain business logic.
- Coordinate deletion across domains.
- Perform manual database deletion.

---

# 6. GET /user

Retrieves the authenticated user's profile.

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

## Controller Responsibility

The controller:

1. Extracts `req.user.id`.
2. Calls `UserService.getUserById(userId)`.
3. Returns the mapped `UserResponse`.

## Possible Errors

| Status | Condition                         |
| ------ | --------------------------------- |
| `401`  | Missing or invalid JWT            |
| `404`  | Authenticated User does not exist |
| `500`  | Unexpected server error           |

A valid JWT does not guarantee that the corresponding User document still exists. For example, the User may have been deleted while an existing JWT has not yet expired.

---

# 7. PATCH /user

Partially updates the authenticated user's profile.

## Request Body

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
Request Validation
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

Example:

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

## Validation

The update request shall be validated before reaching the service.

Validation includes:

- Data types
- Valid enum values
- Numeric constraints
- Date format
- String constraints
- Allowed fields

Invalid requests return:

```text
400 Bad Request
```

## Possible Errors

| Status | Condition               |
| ------ | ----------------------- |
| `400`  | Invalid request data    |
| `401`  | Missing or invalid JWT  |
| `404`  | User does not exist     |
| `500`  | Unexpected server error |

---

# 8. DELETE /user

Deletes the authenticated user's account and all user-owned data across the application.

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

# 9. Account Deletion Orchestration

Account deletion is an application-level workflow because it spans multiple bounded contexts.

The `AccountDeletionService` coordinates deletion but does not directly access domain repositories.

It calls each domain's deletion operation.

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

---

# 10. Domain Deletion Responsibilities

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

The Food catalog is **not deleted** because it is application-level catalog data and is not owned by an individual user.

---

# 11. User Service

The User Service contains User-domain business operations.

### Methods

```text
getUserById(userId)

updateUserById(userId, updateRequest)

deleteUser(userId)
```

## `getUserById()`

Responsibilities:

1. Request User from repository.
2. Throw `NotFoundError` if User does not exist.
3. Return the User entity/document to the controller layer.

---

## `updateUserById()`

Responsibilities:

1. Validate business-level update rules.
2. Update the User through the repository.
3. Return the updated User.

The service does not perform HTTP-specific operations.

---

## `deleteUser()`

Deletes only the User entity owned by the User domain.

It does **not** delete:

- AuthAccount
- Workout data
- Meal data
- Water data
- Weight data
- Supplement data
- Nutrition data

Those are handled by the respective domains through `AccountDeletionService`.

---

# 12. User Repository

The User Repository is responsible only for persistence operations against the User collection.

### Methods

```text
findById(userId)

updateById(userId, updateData)

deleteById(userId)

create(userData)
```

`create()` exists because other application workflows, particularly user registration, need to create a User document.

The User API does not expose a public `POST /user` endpoint.

User creation is initiated through:

```text
POST /auth/register
```

---

# 13. User Model

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

- Required fields
- Data types
- Enum constraints
- Indexes
- Timestamps

---

# 14. DTOs

The User module uses DTOs to define API contracts independently of the MongoDB model.

### UserResponse

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

### UpdateUserRequest

Contains optional fields that may be updated through PATCH.

Database-specific fields such as MongoDB `_id`, internal timestamps, and other persistence details are not exposed through the API DTO.

---

# 15. Mapper

The User Mapper converts database/domain representations into API responses.

Conceptually:

```text
UserDocument
     │
     ▼
UserMapper.toResponse()
     │
     ▼
UserResponse
```

The mapper prevents database-specific fields from being accidentally exposed through the API.

---

# 16. Validation

Validation is performed before business logic.

For example:

```text
PATCH /user

{
    "height": -50
}
```

fails validation because height cannot be negative.

Similarly:

```text
{
    "heightUnit": "BANANA"
}
```

fails because `BANANA` is not a valid `HeightUnit`.

Validation errors return:

```http
400 Bad Request
```

Validation is separate from business logic.

---

# 17. Error Handling

The User module uses centralized application error handling.

Services should throw application-specific errors such as:

```typescript
throw new NotFoundError("User not found");
```

The global error middleware converts the error into the appropriate HTTP response.

Controllers should not manually format every error.

---

# 18. Layer Responsibilities

```text
HTTP Request
      │
      ▼
Authentication Middleware
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

For account deletion:

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

The orchestration layer coordinates the workflow while each domain remains responsible for its own persistence and business logic.

---

# 19. Important Design Decisions

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

## Account Deletion

Account deletion is coordinated outside the User Service because the User domain does not own other domains' data.

Each domain deletes its own user-owned data.

---

## User Deletion Order

User data is deleted from dependent domains before the User document itself is deleted.

This ensures the authenticated User identity remains available during the deletion workflow.

---

# 20. Future Evolution

The Phase 1 implementation uses synchronous application-level orchestration.

In a larger future architecture, account deletion may evolve into an asynchronous workflow:

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

This is intentionally not required for Phase 1.
