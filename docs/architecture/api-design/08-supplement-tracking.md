# Supplement Tracking API Design

---

# 1. Purpose

The Supplement Tracking API is responsible for managing user-defined supplements, supplement schedules, and supplement intake logs.

Users can create their own supplement catalog, schedule recurring supplement intake, and record historical supplement consumption.

---

# 2. Endpoints

## Supplements

| Method | Endpoint                      | Purpose                                   |
| ------ | ----------------------------- | ----------------------------------------- |
| GET    | `/supplements`                | Retrieve all supplements                  |
| GET    | `/supplements/{supplementId}` | Retrieve details of a specific supplement |
| POST   | `/supplements`                | Create a new supplement                   |
| PATCH  | `/supplements/{supplementId}` | Partially update a supplement             |
| DELETE | `/supplements/{supplementId}` | Delete a supplement                       |

---

## Supplement Schedules

| Method | Endpoint                             | Purpose                                            |
| ------ | ------------------------------------ | -------------------------------------------------- |
| GET    | `/supplement-schedules`              | Retrieve supplement schedules                      |
| GET    | `/supplement-schedules/{scheduleId}` | Retrieve details of a specific supplement schedule |
| POST   | `/supplement-schedules`              | Create a new supplement schedule                   |
| PATCH  | `/supplement-schedules/{scheduleId}` | Partially update a supplement schedule             |
| DELETE | `/supplement-schedules/{scheduleId}` | Delete a supplement schedule                       |

---

## Supplement Logs

| Method | Endpoint                             | Purpose                                       |
| ------ | ------------------------------------ | --------------------------------------------- |
| GET    | `/supplement-logs`                   | Retrieve supplement intake history            |
| GET    | `/supplement-logs/{supplementLogId}` | Retrieve details of a specific supplement log |
| POST   | `/supplement-logs`                   | Create a new supplement log                   |
| PATCH  | `/supplement-logs/{supplementLogId}` | Partially update a supplement log             |
| DELETE | `/supplement-logs/{supplementLogId}` | Delete a supplement log                       |

---

# 3. Endpoint Details

## Supplements

### GET /supplements

Retrieves all supplements created by the authenticated user.

### Query Parameters

| Parameter | Required | Description                |
| --------- | -------- | -------------------------- |
| `page`    | No       | Page number (default: 0)   |
| `size`    | No       | Number of results per page |
| `sort`    | No       | Sort field and direction   |
| `name`    | No       | Search supplements by name |

### Success Response

- `200 OK`

---

### GET /supplements/{supplementId}

Retrieves a specific supplement.

#### Success Response

- `200 OK`

#### Error Responses

- `404 Not Found`

---

### POST /supplements

Creates a new supplement.

### Request Body

```json
{
  "name": "Creatine Monohydrate"
}
```

### Success Response

- `201 Created`

---

### PATCH /supplements/{supplementId}

Partially updates a supplement.

Only the fields included in the request are modified.

### Example Request

```json
{
  "name": "Creatine"
}
```

### Success Response

- `200 OK`

---

### DELETE /supplements/{supplementId}

Deletes a supplement.

Deletion shall not remove historical SupplementLogs.

### Success Response

- `204 No Content`

---

## Supplement Schedules

### GET /supplement-schedules

Retrieves supplement schedules belonging to the authenticated user.

### Query Parameters

| Parameter   | Required | Description                  |
| ----------- | -------- | ---------------------------- |
| `isActive`  | No       | Filter active schedules      |
| `frequency` | No       | Filter by schedule frequency |
| `page`      | No       | Page number                  |
| `size`      | No       | Number of results per page   |

### Success Response

- `200 OK`

---

### GET /supplement-schedules/{scheduleId}

Retrieves a specific supplement schedule.

### Success Response

- `200 OK`

### Error Responses

- `404 Not Found`

---

### POST /supplement-schedules

Creates a supplement schedule.

### Request Body

```json
{
  "supplementId": "...",
  "dosage": "5 g",
  "frequency": "DAILY",
  "reminderTime": "08:00",
  "isActive": true
}
```

### Success Response

- `201 Created`

---

### PATCH /supplement-schedules/{scheduleId}

Partially updates a supplement schedule.

Only the fields included in the request are modified.

### Success Response

- `200 OK`

---

### DELETE /supplement-schedules/{scheduleId}

Deletes a supplement schedule.

Historical SupplementLogs remain unchanged.

### Success Response

- `204 No Content`

---

## Supplement Logs

### GET /supplement-logs

Retrieves the authenticated user's supplement intake history.

### Query Parameters

| Parameter      | Required | Description                |
| -------------- | -------- | -------------------------- |
| `from`         | No       | Start date                 |
| `to`           | No       | End date                   |
| `supplementId` | No       | Filter by supplement       |
| `scheduleId`   | No       | Filter by schedule         |
| `page`         | No       | Page number                |
| `size`         | No       | Number of results per page |

### Success Response

- `200 OK`

---

### GET /supplement-logs/{supplementLogId}

Retrieves a specific supplement log.

### Success Response

- `200 OK`

### Error Responses

- `404 Not Found`

---

### POST /supplement-logs

Creates a supplement intake log.

A log may be created from an existing schedule or manually.

### Request Body (From Schedule)

```json
{
  "scheduleId": "..."
}
```

### Request Body (Manual)

```json
{
  "supplementId": "...",
  "dosage": "5 g",
  "takenAt": "2026-08-06T08:15:00Z"
}
```

### Success Response

- `201 Created`

---

### PATCH /supplement-logs/{supplementLogId}

Partially updates a supplement log.

Only the fields included in the request are modified.

### Success Response

- `200 OK`

---

### DELETE /supplement-logs/{supplementLogId}

Deletes a supplement log.

### Success Response

- `204 No Content`

---

# 4. Validation Rules

- Every referenced `supplementId`, `scheduleId`, and `supplementLogId` shall belong to the authenticated user.
- Every SupplementSchedule shall reference an existing Supplement.
- Every SupplementLog shall reference **either** a `scheduleId` **or** a `supplementId`.
- If a `scheduleId` is provided, the supplement and dosage shall be derived from the referenced schedule.
- Frequency shall be a supported `Frequency`.
- Invalid request payloads shall return `400 Bad Request`.

---

# 5. Authorization

All Supplement Tracking endpoints require an authenticated user.

Users may only access and modify their own supplements, supplement schedules, and supplement logs.

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

- System supplement catalog
- Barcode scanning
- Supplement inventory tracking
- Low stock reminders
- Multiple reminders per schedule
- Missed-dose tracking
- AI adherence recommendations
- Pharmacy integrations
