# Authentication API Design

---

# 1. Purpose

The Authentication API is responsible for user registration, authentication, session management, password management, and account security.

It manages authentication credentials independently of the User profile and issues JWT access tokens for authenticated requests.

---

# 2. Endpoints

| Method | Endpoint                | Purpose                                      |
| ------ | ----------------------- | -------------------------------------------- |
| POST   | `/auth/register`        | Register a new user account                  |
| POST   | `/auth/login`           | Authenticate a user and create a new session |
| POST   | `/auth/refresh`         | Refresh an expired access token              |
| POST   | `/auth/logout`          | Logout the current session                   |
| PATCH  | `/auth/password`        | Change the authenticated user's password     |
| POST   | `/auth/forgot-password` | Request a password reset                     |
| POST   | `/auth/reset-password`  | Reset a password using a reset token         |

---

# 3. Endpoint Details

## POST /auth/register

Registers a new user account.

Registration creates all resources required for a new user to begin using the application.

### Request Body

```json
{
  "email": "parth@gmail.com",
  "password": "StrongPassword123",

  "firstName": "Parth",
  "lastName": "Gupta",

  "dateOfBirth": "2000-01-01",

  "gender": "MALE",

  "height": 180,
  "heightUnit": "CENTIMETER",

  "preferredWeightUnit": "KILOGRAM",
  "preferredWaterUnit": "MILLILITER",

  "activityLevel": "MODERATELY_ACTIVE",
  "fitnessGoal": "BUILD_MUSCLE"
}
```

### Processing

The server shall:

- Validate the request.
- Ensure the email is unique.
- Hash the password using a secure hashing algorithm.
- Create the User profile.
- Create the AuthAccount.
- Create default NutritionGoal.
- Create default WaterGoal.
- Generate an Access Token.
- Generate a Refresh Token.
- Persist the hashed Refresh Token.
- Return the generated tokens.

### Success Response

- `201 Created`

---

## POST /auth/login

Authenticates a user using email and password.

### Request Body

```json
{
  "email": "parth@gmail.com",
  "password": "StrongPassword123"
}
```

### Processing

The server shall:

- Locate the AuthAccount by email.
- Verify the password.
- Generate a new Access Token.
- Generate a new Refresh Token.
- Store the hashed Refresh Token.
- Return both tokens.

### Success Response

- `200 OK`

---

## POST /auth/refresh

Refreshes an expired Access Token.

### Request Body

```json
{
  "refreshToken": "..."
}
```

### Processing

The server shall:

- Validate the Refresh Token.
- Verify that it exists and has not expired or been revoked.
- Invalidate the existing Refresh Token.
- Generate a new Access Token.
- Generate a new Refresh Token.
- Persist the new hashed Refresh Token.
- Return both tokens.

### Success Response

- `200 OK`

---

## POST /auth/logout

Logs out the current authenticated session.

### Request Body

```json
{
  "refreshToken": "..."
}
```

### Processing

The server shall:

- Validate the Refresh Token.
- Delete or revoke the corresponding Refresh Token.
- Invalidate the current session.

### Success Response

- `204 No Content`

---

## PATCH /auth/password

Changes the authenticated user's password.

Authentication is performed using the JWT Access Token.

### Request Body

```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

### Processing

The server shall:

- Verify the current password.
- Hash the new password.
- Update the AuthAccount.
- Revoke all active Refresh Tokens for the account.

### Success Response

- `204 No Content`

---

## POST /auth/forgot-password

Requests a password reset.

### Request Body

```json
{
  "email": "parth@gmail.com"
}
```

### Processing

The server shall:

- Verify that the account exists.
- Generate a password reset token.
- Persist the hashed reset token.
- Send the reset link to the user's email.

### Success Response

- `204 No Content`

---

## POST /auth/reset-password

Resets a user's password using a valid reset token.

### Request Body

```json
{
  "token": "...",
  "newPassword": "NewPassword123"
}
```

### Processing

The server shall:

- Validate the reset token.
- Hash the new password.
- Update the AuthAccount.
- Delete the reset token.
- Revoke all active Refresh Tokens.

### Success Response

- `204 No Content`

---

# 4. Validation Rules

- Email addresses shall be unique.
- Passwords shall satisfy the application's password policy.
- Passwords shall never be stored in plain text.
- Refresh Tokens shall never be stored in plain text.
- Password reset tokens shall never be stored in plain text.
- Revoked or expired Refresh Tokens shall not be accepted.
- Invalid request payloads shall return `400 Bad Request`.

---

# 5. Authorization

| Endpoint                     | Authentication Required     |
| ---------------------------- | --------------------------- |
| `POST /auth/register`        | No                          |
| `POST /auth/login`           | No                          |
| `POST /auth/refresh`         | No (Refresh Token required) |
| `POST /auth/logout`          | No (Refresh Token required) |
| `PATCH /auth/password`       | Yes                         |
| `POST /auth/forgot-password` | No                          |
| `POST /auth/reset-password`  | No                          |

---

# 6. Business Rules

- Every email address shall map to exactly one AuthAccount.
- Every AuthAccount shall reference exactly one User.
- Every successful login creates a new authenticated session.
- A user may have multiple active sessions across different devices.
- Every successful token refresh shall invalidate the previous Refresh Token and issue a new one (Refresh Token Rotation).
- Changing a password shall revoke all active Refresh Tokens.
- Resetting a password shall revoke all active Refresh Tokens.
- JWT Access Tokens are stateless and are never persisted.

---

# 7. Error Responses

| Status Code                 | Description                           |
| --------------------------- | ------------------------------------- |
| `400 Bad Request`           | Invalid request payload or parameters |
| `401 Unauthorized`          | Invalid credentials or token          |
| `403 Forbidden`             | Account is suspended or disabled      |
| `404 Not Found`             | Requested resource does not exist     |
| `409 Conflict`              | Email already registered              |
| `500 Internal Server Error` | Unexpected server error               |

---

# 8. Future Enhancements

Potential future API additions include:

- Email verification
- Google Sign-In
- Apple Sign-In
- Multi-factor authentication (MFA)
- Passkeys (WebAuthn)
- Session management dashboard
- Device management
- Login history
- Account recovery
