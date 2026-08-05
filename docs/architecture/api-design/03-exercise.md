# Exercise API Design

---

# 1. Purpose

The Exercise API provides read-only access to the application's exercise catalog.

Clients can browse exercises, retrieve exercise details, and obtain supporting reference data such as muscle groups and equipment.

Exercise definitions are read-only during Phase 1 and cannot be created, updated, or deleted through the API.

---

# 2. Endpoints

| Method | Endpoint                  | Purpose                                                                     |
| ------ | ------------------------- | --------------------------------------------------------------------------- |
| GET    | `/exercises`              | Retrieve exercises with optional search, filtering, sorting, and pagination |
| GET    | `/exercises/{exerciseId}` | Retrieve details of a specific exercise                                     |
| GET    | `/muscle-groups`          | Retrieve all available muscle groups                                        |
| GET    | `/equipment`              | Retrieve all available equipment                                            |

---

# 3. Endpoint Details

## GET /exercises

Retrieves exercises from the exercise catalog.

### Query Parameters

| Parameter              | Required | Description                    |
| ---------------------- | -------- | ------------------------------ |
| `name`                 | No       | Search exercises by name       |
| `primaryMuscleGroupId` | No       | Filter by primary muscle group |
| `equipmentId`          | No       | Filter by equipment            |
| `page`                 | No       | Page number (default: 0)       |
| `size`                 | No       | Number of results per page     |
| `sort`                 | No       | Sort field and direction       |

### Example Request

```http
GET /exercises?primaryMuscleGroupId=chest&page=0&size=20
```

### Response

```json
[
  {
    "id": "...",
    "name": "Barbell Bench Press",
    "primaryMuscleGroup": "Chest",
    "equipment": [
      "Barbell"
    ]
  }
]
```

### Success Response

* `200 OK`

---

## GET /exercises/{exerciseId}

Retrieves the complete details of a specific exercise.

### Path Parameters

| Parameter    | Description                       |
| ------------ | --------------------------------- |
| `exerciseId` | Unique identifier of the exercise |

### Example Request

```http
GET /exercises/64f12ab...
```

### Response

```json
{
  "id": "...",
  "name": "Barbell Bench Press",
  "primaryMuscleGroup": "Chest",
  "secondaryMuscleGroups": [
    "Shoulders",
    "Triceps"
  ],
  "equipment": [
    "Barbell"
  ],
  "weightType": "EXTERNAL_WEIGHT",
  "images": [
    "...",
    "..."
  ],
  "instructionalVideo": "..."
}
```

### Success Response

* `200 OK`

### Error Responses

* `404 Not Found`

---

## GET /muscle-groups

Retrieves all supported muscle groups.

### Example Request

```http
GET /muscle-groups
```

### Response

```json
[
  {
    "id": "...",
    "name": "Chest"
  },
  {
    "id": "...",
    "name": "Back"
  }
]
```

### Success Response

* `200 OK`

---

## GET /equipment

Retrieves all supported equipment.

### Example Request

```http
GET /equipment
```

### Response

```json
[
  {
    "id": "...",
    "name": "Barbell"
  },
  {
    "id": "...",
    "name": "Dumbbell"
  }
]
```

### Success Response

* `200 OK`

---

# 4. Validation Rules

* `exerciseId` shall reference an existing Exercise.
* `primaryMuscleGroupId` shall reference an existing MuscleGroup.
* `equipmentId` shall reference existing Equipment.
* Pagination parameters shall be non-negative.
* Invalid query parameters shall return `400 Bad Request`.

---

# 5. Authorization

All Exercise endpoints require an authenticated user.

No Exercise endpoint permits modification of the exercise catalog during Phase 1.

---

# 6. Error Responses

| Status Code                 | Description                       |
| --------------------------- | --------------------------------- |
| `400 Bad Request`           | Invalid request parameters        |
| `401 Unauthorized`          | User is not authenticated         |
| `404 Not Found`             | Requested resource does not exist |
| `500 Internal Server Error` | Unexpected server error           |

---

# 7. Future Enhancements

Potential future API additions include:

* User-created exercises
* Favorite exercises
* Exercise recommendations
* Exercise history
* Exercise analytics
* Recently viewed exercises
