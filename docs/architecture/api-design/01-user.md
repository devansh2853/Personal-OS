# User API Design

---

# 1. Purpose

The User API is responsible for managing the authenticated user's profile information and application preferences.

User creation is handled by the Authentication module during registration. This API only manages an existing user profile.

---

# 2. Endpoints

| Method | Endpoint | Purpose                                           |
| ------ | -------- | ------------------------------------------------- |
| GET    | `/user`  | Retrieve the authenticated user's profile         |
| PATCH  | `/user`  | Partially update the authenticated user's profile |
| DELETE | `/user`  | Delete the authenticated user's account           |

---

# 3. Endpoint Details

## GET /user

Retrieves the authenticated user's profile.

The user is identified using the authenticated JWT. No path parameter is required.

### Success Response

- `200 OK`

---

## PATCH /user

Partially updates the authenticated user's profile.

Only the fields included in the request are modified.

### Example Request

```json
{
  "firstName": "Parth",
  "height": 180,
  "heightUnit": "CENTIMETER",
  "preferredWeightUnit": "KILOGRAM",
  "preferredWaterUnit": "MILLILITER",
  "activityLevel": "MODERATELY_ACTIVE",
  "fitnessGoal": "BUILD_MUSCLE"
}
```

### Success Response

- `200 OK`

---

## DELETE /user

Deletes the authenticated user's account.

The user is identified using the authenticated JWT.

The exact deletion behavior (hard delete, soft delete, or anonymization) is an implementation detail and may evolve over time.

### Success Response

- `204 No Content`

---

# 4. Validation Rules

- Every authenticated user shall have exactly one User profile.
- Height shall be greater than zero.
- Date of birth shall not be a future date.
- HeightUnit shall be a supported `HeightUnit`.
- PreferredWeightUnit shall be a supported `WeightUnit`.
- PreferredWaterUnit shall be a supported `WaterUnit`.
- ActivityLevel shall be a supported `ActivityLevel`.
- FitnessGoal shall be a supported `FitnessGoal`.
- Invalid request payloads shall return `400 Bad Request`.

---

# 5. Authorization

All User endpoints require an authenticated user.

Users may only access and modify their own profile.

---

# 6. Business Rules

- User creation is handled by the Authentication module during registration.
- The User API does not manage authentication credentials.
- Current body weight is not stored in the User profile and is derived from the latest WeightLog.
- Updating the User profile shall not affect Authentication data.
- Deleting a user account shall also invalidate all active authentication sessions.

---

# 7. Error Responses

| Status Code                 | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `400 Bad Request`           | Invalid request payload or parameters              |
| `401 Unauthorized`          | User is not authenticated                          |
| `403 Forbidden`             | Resource does not belong to the authenticated user |
| `404 Not Found`             | User profile does not exist                        |
| `500 Internal Server Error` | Unexpected server error                            |

---

# 8. Future Enhancements

Potential future API additions include:

- Profile photo upload
- Language preferences
- Theme preferences
- Notification preferences
- Privacy settings
- Data export
- Account deactivation
- Family accounts
