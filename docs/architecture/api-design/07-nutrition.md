# Nutrition API Design

---

# 1. Purpose

The Nutrition API is responsible for managing the user's nutritional goals and providing daily nutritional summaries.

Nutrition Goals represent the user's current daily nutritional targets.

Daily Nutrition is a read-only materialized projection generated from Meal data and maintained automatically by the system.

---

# 2. Endpoints

## Nutrition Goal

| Method | Endpoint          | Purpose                                                  |
| ------ | ----------------- | -------------------------------------------------------- |
| GET    | `/nutrition-goal` | Retrieve the authenticated user's nutrition goal         |
| PATCH  | `/nutrition-goal` | Partially update the authenticated user's nutrition goal |

---

## Daily Nutrition

| Method | Endpoint           | Purpose                            |
| ------ | ------------------ | ---------------------------------- |
| GET    | `/daily-nutrition` | Retrieve daily nutrition summaries |

---

# 3. Endpoint Details

## Nutrition Goal

### GET /nutrition-goal

Retrieves the authenticated user's current nutrition goal.

The goal is identified using the authenticated user rather than a path parameter, since every user owns exactly one NutritionGoal.

### Success Response

- `200 OK`

---

### PATCH /nutrition-goal

Partially updates the authenticated user's nutrition goal.

Only the fields included in the request are modified.

### Example Request

```json
{
  "calorieTarget": 2500,
  "proteinTarget": 180,
  "carbohydrateTarget": 250,
  "fatTarget": 70
}
```

### Success Response

- `200 OK`

---

## Daily Nutrition

### GET /daily-nutrition

Retrieves daily nutrition summaries for the authenticated user.

DailyNutrition is a read-only resource maintained automatically by the application whenever Meals are created, updated, or deleted.

### Query Parameters

| Parameter | Required | Description                              |
| --------- | -------- | ---------------------------------------- |
| `date`    | No       | Retrieve the summary for a specific date |
| `from`    | No       | Start date for a date range              |
| `to`      | No       | End date for a date range                |
| `page`    | No       | Page number (default: 0)                 |
| `size`    | No       | Number of results per page               |
| `sort`    | No       | Sort field and direction                 |

### Example Requests

Retrieve today's summary:

```http
GET /daily-nutrition?date=2026-08-07
```

Retrieve a date range:

```http
GET /daily-nutrition?from=2026-08-01&to=2026-08-07
```

### Success Response

- `200 OK`

---

# 4. Validation Rules

- Every authenticated user shall have exactly one NutritionGoal.
- Daily nutritional targets shall be greater than or equal to zero.
- `from` shall not be later than `to`.
- Invalid request payloads shall return `400 Bad Request`.

---

# 5. Authorization

All Nutrition endpoints require an authenticated user.

Users may only access and modify their own NutritionGoal.

DailyNutrition is read-only and may only be retrieved by its owner.

---

# 6. Business Rules

- NutritionGoal is a singleton resource owned by the authenticated user.
- DailyNutrition is a materialized projection and is **not** the source of truth.
- DailyNutrition shall be automatically updated whenever a Meal is created, updated, or deleted.
- DailyNutrition cannot be created, modified, or deleted directly through the API.

---

# 7. Error Responses

| Status Code                 | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `400 Bad Request`           | Invalid request payload or parameters              |
| `401 Unauthorized`          | User is not authenticated                          |
| `403 Forbidden`             | Resource does not belong to the authenticated user |
| `404 Not Found`             | Requested resource does not exist                  |
| `500 Internal Server Error` | Unexpected server error                            |

---

# 8. Future Enhancements

Potential future API additions include:

- Nutrition goal history
- Nutrition phases (Cut, Bulk, Maintenance)
- Weekly nutrition summaries
- Monthly nutrition summaries
- Micronutrient summaries
- Goal adherence statistics
- AI-generated nutrition recommendations
