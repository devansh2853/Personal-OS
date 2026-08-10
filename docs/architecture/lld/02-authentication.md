# Authentication Low-Level Design

---

# 1. Purpose

The Authentication module is responsible for:

- User registration
- Email verification
- Login
- JWT access-token management
- Refresh-token session management
- Logout
- Password change
- Password reset
- Authentication account status management

The Authentication module owns:

- `AuthAccount`
- `RefreshToken`

The `User` entity is owned by the User module.

Authentication references the User but does not manage the user's profile.

---

# 2. Module Structure

```text
src/
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── rate-limit.middleware.ts
│   └── error.middleware.ts
│
└── modules/
    └── authentication/
        ├── auth.controller.ts
        ├── auth.service.ts
        ├── auth.repository.ts
        ├── refresh-token.repository.ts
        ├── auth.model.ts
        ├── refresh-token.model.ts
        ├── auth.routes.ts
        ├── auth.validation.ts
        ├── auth.dto.ts
        └── auth.mapper.ts
```

Email delivery should be accessed through an application/service abstraction rather than directly from the controller.

```text
src/
│
└── services/
    └── email/
        └── email.service.ts
```

---

# 3. Authentication Architecture

The authentication request flow is:

```text
HTTP Request
      │
      ▼
Rate Limit Middleware
      │
      ▼
Authentication Middleware
      │
      ▼
Validation Middleware
      │
      ▼
Auth Controller
      │
      ▼
Auth Service
      │
      ▼
Repository
      │
      ▼
MongoDB
```

Not every endpoint requires every middleware.

For example:

```text
POST /auth/login
    ↓
Rate Limit
    ↓
Validation
    ↓
Controller
    ↓
Service
```

While:

```text
POST /auth/logout
    ↓
Rate Limit
    ↓
Authentication Middleware
    ↓
Validation
    ↓
Controller
    ↓
Service
```

---

# 4. Authentication Endpoints

| Method | Endpoint                    | Authentication | Purpose                                    |
| ------ | --------------------------- | -------------- | ------------------------------------------ |
| POST   | `/auth/register`            | No             | Create a new pending account               |
| POST   | `/auth/verify-email`        | No             | Verify an email using a verification token |
| POST   | `/auth/resend-verification` | No             | Generate and send a new verification token |
| POST   | `/auth/login`               | No             | Authenticate an active account             |
| POST   | `/auth/refresh`             | No             | Refresh an authenticated session           |
| POST   | `/auth/logout`              | Required       | End the current authenticated session      |
| PATCH  | `/auth/password`            | Required       | Change the authenticated user's password   |
| POST   | `/auth/reset-password`      | No             | Reset a password using a valid reset token |

---

# 5. Token Architecture

The application uses two authentication credentials.

## Access Token

The access token is a JWT.

```text
Lifetime: 30 minutes
Storage: HttpOnly Secure Cookie
```

The JWT contains the authenticated User identity.

Conceptually:

```json
{
  "sub": "userId",
  "iat": "...",
  "exp": "..."
}
```

The JWT is signed by the backend.

The backend does not need to query MongoDB simply to verify the JWT signature and expiration.

---

## Refresh Token

The refresh token represents a persistent authenticated session/device.

```text
Lifetime: 30 days
Storage: HttpOnly Secure Cookie
Database: RefreshToken collection
```

The plaintext refresh token is never stored in MongoDB.

Only its hash is stored.

```text
Browser
   │
   │ refreshToken cookie
   ▼
Backend
   │
   │ hash(token)
   ▼
RefreshToken.tokenHash
```

---

# 6. Cookie Configuration

Access and refresh tokens are stored as browser cookies.

Production cookies should use:

```text
HttpOnly
Secure
appropriate SameSite configuration
```

`HttpOnly` prevents JavaScript from directly reading the tokens.

`Secure` ensures cookies are sent only over HTTPS in production.

Because authentication uses cookies, the application must also implement appropriate CSRF protections.

---

# 7. Registration

## Endpoint

```http
POST /auth/register
```

## Purpose

Creates a new User and associated AuthAccount.

Registration does not create NutritionGoal or WaterGoal.

Those are optional and are configured later during onboarding or through their respective APIs.

## Request

Conceptually:

```json
{
  "firstName": "Parth",
  "lastName": "Gupta",
  "email": "user@example.com",
  "password": "..."
}
```

Additional User profile fields may be collected depending on the registration/onboarding UX.

## Flow

```text
POST /auth/register
        │
        ▼
Validation Middleware
        │
        ▼
AuthController.register()
        │
        ▼
AuthService.register()
        │
        ├── Validate email/account state
        │
        ├── Hash password
        │
        ├── Create User
        │
        ├── Create AuthAccount
        │
        ├── Generate verification token
        │
        ├── Store verification token hash
        │
        └── Send verification email
```

The AuthAccount is created with:

```text
status = PENDING_VERIFICATION
isVerified = false
```

---

# 8. Password Storage

Passwords are never stored in plain text.

During registration:

```text
Plain Password
      │
      ▼
Password Hashing
      │
      ▼
passwordHash
      │
      ▼
AuthAccount
```

The password hash is stored in MongoDB.

The original password is discarded after hashing.

A suitable password hashing algorithm such as Argon2id or bcrypt should be used.

---

# 9. Email Verification

## Endpoint

```http
POST /auth/verify-email
```

## Request

```json
{
  "token": "verification-token"
}
```

## Flow

```text
POST /auth/verify-email
        │
        ▼
Validation Middleware
        │
        ▼
AuthController.verifyEmail()
        │
        ▼
AuthService.verifyEmail(token)
        │
        ├── Hash supplied token
        │
        ├── Find matching AuthAccount
        │
        ├── Check token expiration
        │
        ├── Check account status
        │
        ├── isVerified = true
        │
        ├── status = ACTIVE
        │
        └── Clear verification token fields
```

A successful verification activates the account.

```text
PENDING_VERIFICATION
        ↓
ACTIVE
```

The verification token cannot be reused after successful verification.

---

# 10. Verification Token Lifetime

Verification tokens have a lifetime of:

```text
24 hours
```

The pending account itself has a lifetime of:

```text
7 days
```

These are separate concepts.

Example:

```text
Account created
    ↓
PENDING_VERIFICATION
    ↓
Verification token valid for 24 hours
    ↓
Token expires
    ↓
Account can still remain pending
    ↓
New token can be generated
    ↓
Account reaches 7-day cutoff
    ↓
Eligible for cleanup
```

---

# 11. Expired Verification Token

If a user clicks an expired verification link:

```text
POST /auth/verify-email
```

the backend:

1. Hashes the supplied token.
2. Finds the AuthAccount.
3. Checks the token expiration.
4. Rejects the expired token.
5. Does not send another email automatically.

The response contains a structured error such as:

```json
{
  "code": "VERIFICATION_TOKEN_EXPIRED",
  "message": "Verification link has expired."
}
```

The frontend can then offer:

> Resend verification email

---

# 12. Resend Verification

## Endpoint

```http
POST /auth/resend-verification
```

## Purpose

Generates a new verification token for an existing pending account.

## Request

```json
{
  "email": "user@example.com"
}
```

## Flow

```text
POST /auth/resend-verification
        │
        ▼
Validation
        │
        ▼
AuthService.resendVerification()
        │
        ├── Find pending AuthAccount
        ├── Generate new token
        ├── Hash token
        ├── Replace previous token hash
        ├── Set new 24-hour expiry
        └── Send verification email
```

Only the newest verification token is valid.

The previous token becomes invalid immediately.

The response should be generic to avoid account enumeration.

---

# 13. Pending Account Cleanup

A `PENDING_VERIFICATION` account that remains unverified for more than 7 days is eligible for deletion.

The cleanup removes:

```text
User
AuthAccount
```

belonging to that incomplete registration.

The account is not changed to `DISABLED`.

`DISABLED` represents an account that was previously activated and subsequently disabled.

The cleanup can be implemented as a scheduled background job.

The job does not need to run exactly at the 7-day boundary.

It simply identifies pending accounts older than the allowed lifetime.

---

# 14. Onboarding After Verification

Email verification only activates the authentication account.

It does not populate the user's business data.

After successful verification:

```text
AuthAccount
    status = ACTIVE
```

The frontend begins the initial onboarding flow.

```text
Email Verified
      │
      ▼
Frontend shows onboarding
      │
      ├── User profile
      ├── Initial weight (optional)
      ├── Water goal (optional)
      └── Nutrition goal (optional)
```

The frontend calls the appropriate module APIs.

For example:

```text
PATCH /user
POST /weight-logs
PATCH /water-goal
PATCH /nutrition-goal
```

Only the APIs corresponding to information the user provides are called.

Authentication does not directly create these business-domain records.

---

# 15. Profile Setup State

The User entity contains:

```text
profileSetupCompleted: Boolean
```

Default:

```text
false
```

After the required initial User profile information has been completed:

```text
profileSetupCompleted = true
```

This field does not depend on WaterGoal or NutritionGoal.

Those goals are optional.

Therefore:

```text
profileSetupCompleted = true
NutritionGoal = absent
WaterGoal = absent
```

is a valid state.

The frontend can determine whether onboarding is required using:

```text
GET /user
        ↓
profileSetupCompleted?
```

---

# 16. Login

## Endpoint

```http
POST /auth/login
```

## Request

```json
{
  "email": "user@example.com",
  "password": "..."
}
```

## Flow

```text
POST /auth/login
        │
        ▼
Rate Limit Middleware
        │
        ▼
Validation Middleware
        │
        ▼
AuthController.login()
        │
        ▼
AuthService.login()
        │
        ├── Find AuthAccount
        ├── Verify password
        ├── Check account status
        ├── Generate access JWT
        ├── Generate refresh token
        ├── Store refresh token hash
        └── Set cookies
```

---

# 17. Login Account Status Rules

| Account Status       | Login       |
| -------------------- | ----------- |
| Pending Verification | Not allowed |
| Active               | Allowed     |
| Suspended            | Not allowed |
| Disabled             | Not allowed |

If the credentials are valid but the account is still pending verification:

```text
403 Forbidden
```

with a structured error:

```json
{
  "code": "EMAIL_NOT_VERIFIED",
  "message": "Please verify your email before logging in."
}
```

---

# 18. Invalid Login Credentials

If the email does not exist or the password is incorrect, the backend returns the same generic response.

```text
401 Unauthorized
```

Example:

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password."
}
```

The backend does not reveal whether the email exists.

This prevents basic account/email enumeration.

---

# 19. Login Token Creation

After successful authentication:

```text
                    Login
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    Access Token             Refresh Token
     JWT, 30 min              30 days
          │                       │
          ▼                       ▼
   HttpOnly Cookie         HttpOnly Cookie
                                  │
                                  ▼
                           SHA-256/hash
                                  │
                                  ▼
                         RefreshToken.tokenHash
```

The refresh token is associated with the authenticated user's `AuthAccount`.

---

# 20. Multiple Device Sessions

A user may have multiple simultaneous sessions.

Example:

```text
User
 │
 ├── RefreshToken A → Laptop
 ├── RefreshToken B → Phone
 └── RefreshToken C → Tablet
```

Each RefreshToken represents an independent device/session.

Refreshing one session does not invalidate other sessions.

---

# 21. Refresh Token

## Endpoint

```http
POST /auth/refresh
```

Authentication through the access JWT is not required.

The refresh token is automatically supplied by the browser through the HttpOnly cookie.

## Flow

```text
POST /auth/refresh
        │
        ▼
Read refresh-token cookie
        │
        ▼
Hash supplied refresh token
        │
        ▼
Find RefreshToken
        │
        ▼
Validate:
    - token exists
    - not expired
    - not revoked
    - associated AuthAccount is ACTIVE
        │
        ▼
Rotate refresh token
        │
        ├── Revoke old RefreshToken
        ├── Generate new RefreshToken
        ├── Store new token hash
        └── Set new cookies
```

A new access JWT is issued with a 30-minute lifetime.

---

# 22. Refresh Token Rotation

Refresh-token rotation occurs **per session/device**.

Example:

```text
User
 │
 ├── RefreshToken A → Laptop
 └── RefreshToken B → Phone
```

Laptop refreshes:

```text
RefreshToken A
      ↓
Revoke A
      ↓
Create A'
```

Phone remains:

```text
RefreshToken B → Active
```

Therefore, refreshing one device does not log out another device.

---

# 23. Refresh Token Reuse

If a previously revoked refresh token is used again:

```text
Old RefreshToken
      ↓
Already revoked
      ↓
Reject request
      ↓
Revoke the associated device/session
```

Only the affected session is revoked.

Other sessions remain active.

Example:

```text
Laptop → session revoked
Phone  → remains active
Tablet → remains active
```

The refresh token reuse attempt does not automatically log the user out everywhere.

---

# 24. Refresh Token Expiration

Refresh tokens have a lifetime of:

```text
30 days
```

Expired refresh tokens are rejected.

They are no longer accepted for obtaining new access tokens.

A user with no valid refresh session must authenticate again.

---

# 25. Logout

## Endpoint

```http
POST /auth/logout
```

Authentication is required.

The request identifies the current session through the refresh token cookie.

## Flow

```text
POST /auth/logout
        │
        ▼
Authentication Middleware
        │
        ▼
AuthController.logout()
        │
        ▼
AuthService.logout()
        │
        ├── Identify current refresh token
        ├── Revoke current RefreshToken
        ├── Clear access-token cookie
        └── Clear refresh-token cookie
```

Only the current session is logged out.

Other devices remain authenticated.

Example:

```text
Laptop → Logged out
Phone  → Still logged in
Tablet → Still logged in
```

---

# 26. Access Token After Logout

The access JWT itself is stateless.

Therefore, logout does not need to immediately delete it from the database.

The access token will remain cryptographically valid until its expiration.

Because the lifetime is only 30 minutes, this exposure window is limited.

The refresh token is revoked immediately, preventing creation of new access tokens for that session.

---

# 27. Change Password

## Endpoint

```http
PATCH /auth/password
```

Authentication is required.

## Request

```json
{
  "currentPassword": "...",
  "newPassword": "..."
}
```

## Flow

```text
PATCH /auth/password
        │
        ▼
Authentication Middleware
        │
        ▼
Validation Middleware
        │
        ▼
AuthController.changePassword()
        │
        ▼
AuthService.changePassword()
        │
        ├── Find AuthAccount
        ├── Verify current password
        ├── Validate new password
        ├── Hash new password
        └── Update passwordHash
```

If the current password is incorrect:

```text
401 Unauthorized
```

---

# 28. Password Reset

## Endpoint

```http
POST /auth/reset-password
```

This endpoint is used when the user does not know their current password.

A password-reset token is generated and delivered through the password recovery flow.

The token is stored only as a hash.

```text
Reset Token
      │
      ▼
Hash
      │
      ▼
resetPasswordTokenHash
```

The token has an expiration time:

```text
resetPasswordExpiresAt
```

The reset flow validates:

- Token existence
- Token hash
- Token expiration
- Account status

After a successful reset:

```text
passwordHash = newPasswordHash
resetPasswordTokenHash = null
resetPasswordExpiresAt = null
```

The reset token cannot be reused.

---

# 29. Password Reset vs Password Change

| Operation       | Endpoint                    | Authentication | Existing Password |
| --------------- | --------------------------- | -------------- | ----------------- |
| Change Password | `PATCH /auth/password`      | Required       | Required          |
| Reset Password  | `POST /auth/reset-password` | Not required   | Not required      |

Password change is an authenticated account operation.

Password reset is an account-recovery operation.

---

# 30. Auth Service

The Authentication Service contains authentication business logic.

Core methods include:

```text
register()

verifyEmail()

resendVerification()

login()

refresh()

logout()

changePassword()

resetPassword()
```

The service is responsible for:

- Password verification
- Password hashing
- Account status checks
- Token generation
- Refresh-token rotation
- Refresh-token reuse handling
- Verification token handling
- Password-reset token handling
- Authentication-specific business rules

The service does not directly handle HTTP requests or responses.

---

# 31. Auth Repository

The Auth Repository manages persistence for `AuthAccount`.

Core methods include:

```text
findByEmail(email)

findByUserId(userId)

findByVerificationTokenHash(hash)

findByResetPasswordTokenHash(hash)

create(authAccount)

updateById(authAccountId, updateData)

deleteByUserId(userId)
```

---

# 32. Refresh Token Repository

The Refresh Token Repository manages persistence for RefreshToken documents.

Core methods include:

```text
findByTokenHash(tokenHash)

create(refreshToken)

revokeById(refreshTokenId)

deleteByAuthAccountId(authAccountId)

deleteByUserId(userId)
```

Repository methods are responsible for database access only.

---

# 33. Auth Models

## AuthAccount

Conceptually:

```text
AuthAccount
│
├── _id
├── user
├── email
├── passwordHash
├── isVerified
├── status
├── verificationTokenHash
├── verificationTokenExpiresAt
├── resetPasswordTokenHash
├── resetPasswordExpiresAt
├── createdAt
└── updatedAt
```

---

## RefreshToken

Conceptually:

```text
RefreshToken
│
├── _id
├── authAccount
├── tokenHash
├── createdAt
├── expiresAt
├── lastUsedAt
├── revokedAt
├── deviceName
└── updatedAt
```

---

# 34. DTOs

Authentication DTOs define the external API contract.

Examples:

```text
RegisterRequest
LoginRequest
VerifyEmailRequest
ResendVerificationRequest
ChangePasswordRequest
ResetPasswordRequest
```

Responses should expose only information necessary for the frontend.

Authentication database fields such as:

```text
passwordHash
verificationTokenHash
resetPasswordTokenHash
```

must never be exposed through API responses.

---

# 35. Validation

Authentication-specific validation schemas are defined in:

```text
auth.validation.ts
```

Examples:

```text
RegisterSchema
LoginSchema
VerifyEmailSchema
ResendVerificationSchema
ChangePasswordSchema
ResetPasswordSchema
```

The shared validation middleware executes these schemas before the controller.

Examples of validation:

```text
Email must be correctly formatted
Password must satisfy password policy
Token must be a valid string
Required fields must exist
```

Business-level checks remain in `AuthService`.

---

# 36. Authentication Middleware

The shared authentication middleware is used on protected endpoints.

It:

1. Reads the access-token cookie.
2. Verifies the JWT signature.
3. Checks expiration.
4. Extracts the User ID from the JWT.
5. Attaches the identity to `req.user`.

Example:

```typescript
req.user = {
  id: userId,
};
```

Invalid or missing access tokens result in:

```text
401 Unauthorized
```

The middleware does not perform business-level authorization.

---

# 37. Rate Limiting

Authentication endpoints are sensitive to brute-force and abuse attacks.

Rate limiting should be applied particularly to:

```text
POST /auth/register
POST /auth/login
POST /auth/verify-email
POST /auth/resend-verification
POST /auth/refresh
POST /auth/reset-password
```

The exact limits can be configured independently of the Authentication Service.

---

# 38. Error Handling

Authentication uses centralized application error handling.

Examples:

```text
INVALID_CREDENTIALS
EMAIL_NOT_VERIFIED
VERIFICATION_TOKEN_EXPIRED
INVALID_VERIFICATION_TOKEN
REFRESH_TOKEN_INVALID
REFRESH_TOKEN_REUSED
PASSWORD_INCORRECT
PASSWORD_RESET_TOKEN_EXPIRED
ACCOUNT_SUSPENDED
ACCOUNT_DISABLED
```

The error middleware converts application errors into consistent HTTP responses.

---

# 39. Complete Registration Flow

```text
User
 │
 ▼
POST /auth/register
 │
 ▼
Validation
 │
 ▼
AuthController
 │
 ▼
AuthService
 │
 ├── Create User
 ├── Hash password
 ├── Create AuthAccount
 ├── status = PENDING_VERIFICATION
 ├── Generate verification token
 ├── Store token hash + expiry
 └── Send verification email
 │
 ▼
Registration complete
```

---

# 40. Complete Verification Flow

```text
User clicks email
        │
        ▼
Frontend receives token
        │
        ▼
POST /auth/verify-email
        │
        ▼
Validate token
        │
        ▼
AuthService
        │
        ├── Hash token
        ├── Find AuthAccount
        ├── Check expiry
        ├── isVerified = true
        ├── status = ACTIVE
        └── Clear verification token
        │
        ▼
Frontend starts onboarding
```

---

# 41. Complete Login Flow

```text
POST /auth/login
        │
        ▼
Rate Limit
        │
        ▼
Validation
        │
        ▼
AuthController
        │
        ▼
AuthService
        │
        ├── Find account
        ├── Verify password
        ├── Check ACTIVE status
        ├── Generate access JWT
        ├── Generate refresh token
        ├── Store refresh token hash
        └── Set HttpOnly cookies
        │
        ▼
Authenticated
```

---

# 42. Complete Refresh Flow

```text
POST /auth/refresh
        │
        ▼
Read refresh-token cookie
        │
        ▼
Hash token
        │
        ▼
Find RefreshToken
        │
        ▼
Validate session
        │
        ▼
Revoke old RefreshToken
        │
        ▼
Create new RefreshToken
        │
        ▼
Create new access JWT
        │
        ▼
Set new cookies
```

---

# 43. Complete Logout Flow

```text
POST /auth/logout
        │
        ▼
Authentication Middleware
        │
        ▼
AuthController
        │
        ▼
AuthService
        │
        ├── Identify current session
        ├── Revoke RefreshToken
        ├── Clear access cookie
        └── Clear refresh cookie
        │
        ▼
204 No Content
```

---

# 44. Complete Account Deletion Interaction

Authentication participates in User account deletion.

The User-level account deletion orchestrator calls:

```text
AuthenticationService.deleteUserData(userId)
```

The Authentication module then deletes:

```text
AuthAccount
RefreshTokens
```

This ensures that deleted users cannot continue creating new sessions.

Existing access tokens are short-lived and will naturally expire.

---

# 45. Security Rules

The following rules are mandatory:

1. Passwords are never stored in plain text.
2. Refresh tokens are never stored in plain text.
3. Verification tokens are never stored in plain text.
4. Password-reset tokens are never stored in plain text.
5. Access and refresh tokens are stored in HttpOnly cookies.
6. Production cookies use Secure.
7. Appropriate SameSite and CSRF protections are implemented.
8. Access tokens expire after 30 minutes.
9. Refresh tokens expire after 30 days.
10. Refresh tokens are rotated on successful refresh.
11. Refresh-token reuse revokes only the affected session.
12. Invalid login attempts use generic error responses.
13. Authentication endpoints are rate limited.
14. Sensitive authentication fields are never returned in API responses.
15. Verification tokens become invalid after successful verification or replacement.
16. Password-reset tokens become invalid after successful password reset.

---

# 46. Important Design Decisions

## Authentication Is Independent of User Profile

`AuthAccount` references `User`, but Authentication does not own User profile information.

---

## Registration Does Not Create Optional Goals

Registration creates:

```text
User
AuthAccount
```

It does not create:

```text
NutritionGoal
WaterGoal
```

These are configured independently during onboarding or later.

---

## Email Verification Is Required

New accounts start as:

```text
PENDING_VERIFICATION
```

They become:

```text
ACTIVE
```

only after successful email verification.

---

## Access and Refresh Tokens Use Cookies

Both tokens are stored as HttpOnly cookies.

The frontend does not directly read or manage the tokens.

---

## Access Token Lifetime

```text
30 minutes
```

---

## Refresh Token Lifetime

```text
30 days
```

---

## Refresh Rotation Is Per Session

Refreshing one device does not affect another device's session.

---

## Refresh Token Reuse

Reuse of a revoked refresh token invalidates only the affected session.

Other device sessions remain active.

---

## Pending Account Cleanup

Unverified accounts older than 7 days are eligible for deletion.

They are not changed to `DISABLED`.

---

## Onboarding Is Separate From Authentication

Email verification activates the account.

The frontend then starts onboarding.

The User domain and other business domains are responsible for storing onboarding data.

---

# 47. Future Enhancements

Potential future authentication enhancements include:

- Google Sign-In
- Apple Sign-In
- Multi-factor authentication
- Passkeys / WebAuthn
- Login history
- Device/session management
- Account recovery improvements
- Suspicious-login detection
- Global logout
- Session revocation dashboard
- Advanced refresh-token reuse detection
- Asynchronous account-deletion workflows
