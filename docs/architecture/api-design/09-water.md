# Water Tracking API Design

---

# 1. Purpose

The Water Tracking API is responsible for managing a user's water intake history and daily hydration goal.

It allows users to log water consumption, manage existing water logs, and configure their daily hydration target.

---

# 2. Endpoints

| Method | Endpoint                   | Purpose                                      |
| ------ | -------------------------- | -------------------------------------------- |
| GET    | `/water-logs`              | Retrieve all water logs                      |
| GET    | `/water-logs/{waterLogId}` | Retrieve details of a specific water log     |
| POST   | `/water-logs`              | Create a new water log                       |
| PATCH  | `/water-logs/{waterLogId}` | Partially update a water log                 |
| DELETE | `/water-logs/{waterLogId}` | Delete a water log                           |
| GET    | `/water-goal`              | Retrieve the authenticated user's water goal |
| PATCH  | `/water-goal`              | Update the authenticated user's water goal   |

---

# 3. Endpoint Details

## GET /water-logs

Retrieves the authenticated user's water intake history.

### Query Parameters

| Parameter | Required | Description                   |
| --------- | -------- | ----------------------------- |
| `from`    | No       | Start date for filtering logs |
| `to`      | No       | End date for filtering logs   |
| `page`    | No       | Page number (default: 0)      |
| `size`    | No       | Number of results per page    |
| `sort`    | No       | Sort field and direction      |

### Success Response

- `200 OK`

---

## GET /water-logs/{waterLogId}

Retrieves a specific water log.

### Path Parameters

| Parameter    | Description                        |
| ------------ | ---------------------------------- |
| `waterLogId` | Unique identifier of the water log |

### Success Response

- `200 OK`

### Error Responses

- `404 Not Found`

---

## POST /water-logs

Creates a new water intake record.

### Request Body

```json
{
  "amount": 500,
  "unit": "MILLILITER",
  "consumedAt": "2026-08-06T10:30:00Z"
}
```

### Success Response

- `201 Created`

---

## PATCH /water-logs/{waterLogId}

Partially updates an existing water log.

Only the fields included in the request are modified.

### Example Request

```json
{
  "amount": 750
}
```

### Success Response

- `200 OK`

### Error Responses

- `404 Not Found`

---

## DELETE /water-logs/{waterLogId}

Deletes a water log.

### Success Response

- `204 No Content`

### Error Responses

- `404 Not Found`

---

## GET /water-goal

Retrieves the authenticated user's daily hydration goal.

The goal is identified using the authenticated user rather than a path parameter, since every user owns exactly one WaterGoal.

### Success Response

- `200 OK`

---

## PATCH /water-goal

Updates the authenticated user's daily hydration goal.

Only the fields included in the request are modified.

### Example Request

```json
{
  "dailyTarget": 3500
}
```

### Success Response

- `200 OK`

---

# 4. Validation Rules

- Every referenced `waterLogId` shall belong to the authenticated user.
- Water amount shall be greater than zero.
- Water unit shall be a supported `WaterUnit`.
- Daily target shall be greater than zero.
- Invalid request payloads shall return `400 Bad Request`.

---

# 5. Authorization

All Water Tracking endpoints require an authenticated user.

Users may only access and modify their own water logs and water goal.

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

- Daily water summary
- Water intake statistics
- Hydration reminders
- Bulk water log operations
- Smart bottle integrations
- AI hydration recommendations
