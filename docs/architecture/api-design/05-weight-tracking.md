# Weight Tracking API Design

---

# 1. Purpose

The Weight Tracking API is responsible for managing a user's body weight history.

It allows users to record, retrieve, update, and delete weight measurements that are later consumed by the Analytics module for progress tracking and insights.

---

# 2. Endpoints

| Method | Endpoint                     | Purpose                                   |
| ------ | ---------------------------- | ----------------------------------------- |
| GET    | `/weight-logs`               | Retrieve all weight logs                  |
| GET    | `/weight-logs/{weightLogId}` | Retrieve details of a specific weight log |
| POST   | `/weight-logs`               | Create a new weight log                   |
| PATCH  | `/weight-logs/{weightLogId}` | Partially update a weight log             |
| DELETE | `/weight-logs/{weightLogId}` | Delete a weight log                       |

---

# 3. Endpoint Details

## GET /weight-logs

Retrieves the authenticated user's weight history.

### Query Parameters

| Parameter | Required | Description                   |
| --------- | -------- | ----------------------------- |
| `from`    | No       | Start date for filtering logs |
| `to`      | No       | End date for filtering logs   |
| `page`    | No       | Page number (default: 0)      |
| `size`    | No       | Number of results per page    |
| `sort`    | No       | Sort field and direction      |

### Example Request

```http
GET /weight-logs?from=2026-08-01&to=2026-08-31&page=0&size=20
```

### Success Response

- `200 OK`

---

## GET /weight-logs/{weightLogId}

Retrieves a specific weight log.

### Path Parameters

| Parameter     | Description                         |
| ------------- | ----------------------------------- |
| `weightLogId` | Unique identifier of the weight log |

### Success Response

- `200 OK`

### Error Responses

- `404 Not Found`

---

## POST /weight-logs

Creates a new weight measurement.

### Request Body

```json
{
  "weight": 72.5,
  "unit": "KILOGRAM",
  "recordedAt": "2026-08-06T08:30:00Z",
  "notes": "Morning, fasted"
}
```

### Success Response

- `201 Created`

---

## PATCH /weight-logs/{weightLogId}

Partially updates an existing weight log.

Only the fields included in the request are modified.

### Example Request

```json
{
  "weight": 72.2,
  "notes": "Corrected measurement"
}
```

### Success Response

- `200 OK`

### Error Responses

- `404 Not Found`

---

## DELETE /weight-logs/{weightLogId}

Deletes a weight log.

### Success Response

- `204 No Content`

### Error Responses

- `404 Not Found`

---

# 4. Validation Rules

- Every referenced `weightLogId` shall belong to the authenticated user.
- Weight shall be greater than zero.
- Unit shall be a supported `WeightUnit`.
- `recordedAt` shall not be null.
- Invalid request payloads shall return `400 Bad Request`.

---

# 5. Authorization

All Weight Tracking endpoints require an authenticated user.

Users may only access and modify their own weight logs.

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

- Bulk import of weight logs
- Progress photo uploads
- Body fat percentage logging
- Body measurements (waist, chest, arms, thighs, etc.)
- Smart scale integrations
- Weight trend summaries
- AI-generated progress insights
