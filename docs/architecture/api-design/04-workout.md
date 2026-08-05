# Workout API Design

---

# 1. Purpose

The Workout API is responsible for managing workout templates and workout sessions.

Workout Templates allow users to create reusable workout plans, while Workout Sessions record historical workouts performed by the user.

The API supports creating, partially updating, retrieving, and managing workout data throughout its lifecycle.

---

# 2. Endpoints

| Method | Endpoint                                 | Purpose                                         |
| ------ | ---------------------------------------- | ----------------------------------------------- |
| GET    | `/workout-templates`                     | Retrieve all workout templates                  |
| GET    | `/workout-templates/{workoutTemplateId}` | Retrieve details of a specific workout template |
| POST   | `/workout-templates`                     | Create a new workout template                   |
| PATCH  | `/workout-templates/{workoutTemplateId}` | Partially update a workout template             |
| DELETE | `/workout-templates/{workoutTemplateId}` | Delete a workout template                       |
| GET    | `/workout-sessions`                      | Retrieve workout history                        |
| GET    | `/workout-sessions/{workoutSessionId}`   | Retrieve details of a specific workout session  |
| POST   | `/workout-sessions`                      | Create a new workout session                    |
| PATCH  | `/workout-sessions/{workoutSessionId}`   | Partially update an in-progress workout session |

---

# 3. Endpoint Details

## GET /workout-templates

Retrieves all workout templates belonging to the authenticated user.

### Query Parameters

| Parameter | Required | Description                |
| --------- | -------- | -------------------------- |
| `page`    | No       | Page number (default: 0)   |
| `size`    | No       | Number of results per page |
| `sort`    | No       | Sort field and direction   |

### Success Response

* `200 OK`

---

## GET /workout-templates/{workoutTemplateId}

Retrieves the details of a specific workout template.

### Path Parameters

| Parameter           | Description                               |
| ------------------- | ----------------------------------------- |
| `workoutTemplateId` | Unique identifier of the workout template |

### Success Response

* `200 OK`

### Error Responses

* `404 Not Found`

---

## POST /workout-templates

Creates a new workout template.

### Request Body

```json
{
  "name": "Push Day",
  "exercises": [
    {
      "exerciseId": "...",
      "order": 1,
      "targetSets": 4,
      "targetReps": "8-10",
      "restTimer": 90
    }
  ]
}
```

### Success Response

* `201 Created`

---

## PATCH /workout-templates/{workoutTemplateId}

Partially updates an existing workout template.

Only the fields included in the request are modified.

### Example Request

```json
{
  "name": "Updated Push Day"
}
```

or

```json
{
  "exercises": [
    {
      "exerciseId": "...",
      "order": 1,
      "targetSets": 5,
      "targetReps": "6-8",
      "restTimer": 120
    }
  ]
}
```

### Success Response

* `200 OK`

### Error Responses

* `404 Not Found`

---

## DELETE /workout-templates/{workoutTemplateId}

Deletes a workout template.

### Success Response

* `204 No Content`

### Error Responses

* `404 Not Found`

---

## GET /workout-sessions

Retrieves the authenticated user's workout history.

### Query Parameters

| Parameter | Required | Description                      |
| --------- | -------- | -------------------------------- |
| `page`    | No       | Page number (default: 0)         |
| `size`    | No       | Number of results per page       |
| `sort`    | No       | Sort field and direction         |
| `status`  | No       | Filter by workout session status |

### Success Response

* `200 OK`

---

## GET /workout-sessions/{workoutSessionId}

Retrieves the details of a specific workout session.

### Path Parameters

| Parameter          | Description                              |
| ------------------ | ---------------------------------------- |
| `workoutSessionId` | Unique identifier of the workout session |

### Success Response

* `200 OK`

### Error Responses

* `404 Not Found`

---

## POST /workout-sessions

Creates a new workout session.

A session may be created from an existing workout template or as a completely custom workout.

### Request Body

```json
{
  "workoutTemplateId": "...",
  "status": "IN_PROGRESS"
}
```

### Success Response

* `201 Created`

---

## PATCH /workout-sessions/{workoutSessionId}

Partially updates an in-progress workout session.

Only the fields included in the request are modified.

Typical updates include:

* Logging completed sets
* Updating repetitions
* Updating weight
* Updating rest timers
* Marking the workout as completed
* Marking the workout as cancelled

### Example Request

```json
{
  "status": "COMPLETED"
}
```

or

```json
{
  "exercises": [
    {
      "id": "...",
      "workoutSets": [
        {
          "id": "...",
          "weight": 80,
          "reps": 8
        }
      ]
    }
  ]
}
```

### Success Response

* `200 OK`

### Error Responses

* `404 Not Found`
* `409 Conflict` (Workout session has already been completed or cancelled)

---

# 4. Validation Rules

* Every referenced `exerciseId` shall exist.
* Every referenced `workoutTemplateId` shall belong to the authenticated user.
* Every referenced `workoutSessionId` shall belong to the authenticated user.
* Exercise order shall be unique within a workout template.
* Target sets shall be greater than zero.
* Rest timers shall be non-negative.
* Completed or cancelled workout sessions shall not be modified.
* Invalid request payloads shall return `400 Bad Request`.

---

# 5. Authorization

All Workout endpoints require an authenticated user.

Users may only access and modify their own workout templates and workout sessions.

---

# 6. Error Responses

| Status Code                 | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| `400 Bad Request`           | Invalid request payload or parameters                   |
| `401 Unauthorized`          | User is not authenticated                               |
| `403 Forbidden`             | Resource does not belong to the authenticated user      |
| `404 Not Found`             | Requested resource does not exist                       |
| `409 Conflict`              | Workout session cannot be modified in its current state |
| `500 Internal Server Error` | Unexpected server error                                 |

---

# 7. Future Enhancements

Potential future API additions include:

* Duplicate workout template
* Archive workout template
* Exercise notes
* Personal records
* Workout sharing
* Live workout synchronization
* AI-generated workout templates
