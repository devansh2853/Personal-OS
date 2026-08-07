# Food & Meal Tracking API Design

---

# 1. Purpose

The Food & Meal Tracking API is responsible for providing access to the food catalog, managing reusable meal templates, and recording historical meals consumed by users.

The Food catalog is read-only. Meal Templates and Meals are user-owned resources that support full CRUD operations.

---

# 2. Endpoints

## Foods

| Method | Endpoint          | Purpose                                            |
| ------ | ----------------- | -------------------------------------------------- |
| GET    | `/foods`          | Retrieve foods with optional search and pagination |
| GET    | `/foods/{foodId}` | Retrieve details of a specific food                |

---

## Meal Templates

| Method | Endpoint                           | Purpose                                      |
| ------ | ---------------------------------- | -------------------------------------------- |
| GET    | `/meal-templates`                  | Retrieve meal templates                      |
| GET    | `/meal-templates/{mealTemplateId}` | Retrieve details of a specific meal template |
| POST   | `/meal-templates`                  | Create a new meal template                   |
| PATCH  | `/meal-templates/{mealTemplateId}` | Partially update a meal template             |
| DELETE | `/meal-templates/{mealTemplateId}` | Delete a meal template                       |

---

## Meals

| Method | Endpoint          | Purpose                             |
| ------ | ----------------- | ----------------------------------- |
| GET    | `/meals`          | Retrieve meal history               |
| GET    | `/meals/{mealId}` | Retrieve details of a specific meal |
| POST   | `/meals`          | Create a new meal                   |
| PATCH  | `/meals/{mealId}` | Partially update a meal             |
| DELETE | `/meals/{mealId}` | Delete a meal                       |

---

# 3. Endpoint Details

## Foods

### GET /foods

Retrieves foods from the food catalog.

### Query Parameters

| Parameter | Required | Description                |
| --------- | -------- | -------------------------- |
| `name`    | No       | Search foods by name       |
| `page`    | No       | Page number (default: 0)   |
| `size`    | No       | Number of results per page |
| `sort`    | No       | Sort field and direction   |

### Example Request

```http
GET /foods?name=rice&page=0&size=20
```

### Success Response

- `200 OK`

---

### GET /foods/{foodId}

Retrieves details of a specific food.

### Path Parameters

| Parameter | Description                   |
| --------- | ----------------------------- |
| `foodId`  | Unique identifier of the food |

### Success Response

- `200 OK`

### Error Responses

- `404 Not Found`

---

## Meal Templates

### GET /meal-templates

Retrieves all meal templates belonging to the authenticated user.

### Query Parameters

| Parameter | Required | Description                |
| --------- | -------- | -------------------------- |
| `page`    | No       | Page number                |
| `size`    | No       | Number of results per page |
| `sort`    | No       | Sort field and direction   |

### Success Response

- `200 OK`

---

### GET /meal-templates/{mealTemplateId}

Retrieves a specific meal template.

### Success Response

- `200 OK`

### Error Responses

- `404 Not Found`

---

### POST /meal-templates

Creates a new meal template.

### Request Body

```json
{
  "name": "Chicken & Rice",

  "mealItems": [
    {
      "foodId": "...",
      "quantity": 200,
      "servingUnit": "GRAM"
    },
    {
      "foodId": "...",
      "quantity": 150,
      "servingUnit": "GRAM"
    }
  ]
}
```

### Success Response

- `201 Created`

---

### PATCH /meal-templates/{mealTemplateId}

Partially updates a meal template.

Only the fields included in the request are modified.

### Success Response

- `200 OK`

---

### DELETE /meal-templates/{mealTemplateId}

Deletes a meal template.

### Success Response

- `204 No Content`

---

## Meals

### GET /meals

Retrieves the authenticated user's meal history.

### Query Parameters

| Parameter | Required | Description                |
| --------- | -------- | -------------------------- |
| `from`    | No       | Start date                 |
| `to`      | No       | End date                   |
| `page`    | No       | Page number                |
| `size`    | No       | Number of results per page |
| `sort`    | No       | Sort field and direction   |

### Success Response

- `200 OK`

---

### GET /meals/{mealId}

Retrieves a specific meal.

### Success Response

- `200 OK`

### Error Responses

- `404 Not Found`

---

### POST /meals

Creates a new meal.

A meal may optionally reference the MealTemplate from which it originated. The frontend is responsible for loading and editing the MealTemplate before submitting the final Meal.

The server calculates and stores nutritional snapshots for each MealItem and updates the corresponding DailyNutrition summary.

### Request Body

```json
{
  "mealTemplateId": "...",

  "name": "Lunch",

  "consumedAt": "2026-08-06T13:00:00Z",

  "mealItems": [
    {
      "foodId": "...",
      "quantity": 200,
      "servingUnit": "GRAM"
    },
    {
      "foodId": "...",
      "quantity": 150,
      "servingUnit": "GRAM"
    }
  ]
}
```

### Success Response

- `201 Created`

---

### PATCH /meals/{mealId}

Partially updates an existing meal.

Whenever a meal is updated, nutritional snapshots shall be recalculated and the corresponding DailyNutrition summary shall be updated.

### Success Response

- `200 OK`

---

### DELETE /meals/{mealId}

Deletes a meal.

Deleting a meal shall update the corresponding DailyNutrition summary.

### Success Response

- `204 No Content`

---

# 4. Validation Rules

- Every referenced `foodId` shall exist.
- Every referenced `mealTemplateId` shall belong to the authenticated user.
- Every referenced `mealId` shall belong to the authenticated user.
- Every Meal and MealTemplate shall contain at least one MealItem.
- Quantity shall be greater than zero.
- ServingUnit shall be a supported `ServingUnit`.
- Invalid request payloads shall return `400 Bad Request`.

---

# 5. Authorization

All Food & Meal Tracking endpoints require an authenticated user.

Users may only access and modify their own Meal Templates and Meals.

The Food catalog is read-only.

---

# 6. Error Responses

| Status Code                 | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `400 Bad Request`           | Invalid request payload or parameters              |
| `401 Unauthorized`          | User is not authenticated                          |
| `403 Forbidden`             | Resource does not belong to the authenticated user |
| `404 Not Found`             | Requested resource does not exist                  |
| `500 Internal Server Error` | Unexpected server error                            |

---

# 7. Future Enhancements

Potential future API additions include:

- Custom foods
- Barcode scanning
- Favorite meals
- AI meal generation
- Meal recommendations
- Recently consumed meals
- Bulk meal import
