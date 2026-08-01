# Authentication Domain Model

---

# 1. Purpose

The Authentication domain is responsible for user authentication, session management, and account security.

It manages login credentials, refresh tokens, and authentication sessions while remaining independent of the User profile and all business domains.

The Authentication domain does not manage user profile information.

---

# 2. Entities

## AuthAccount

Represents a user's authentication credentials.

### Attributes

| Attribute    | Type          | Description                                   |
| ------------ | ------------- | --------------------------------------------- |
| id           | Identifier    | Unique identifier                             |
| user         | User          | Referenced user profile                       |
| email        | String        | Unique email address                          |
| passwordHash | String        | Securely hashed password                      |
| isVerified   | Boolean       | Indicates whether the email has been verified |
| status       | AccountStatus | Current account status                        |
| createdAt    | DateTime      | Account creation timestamp                    |

---

## RefreshToken

Represents an authenticated device session.

### Attributes

| Attribute   | Type                | Description                         |
| ----------- | ------------------- | ----------------------------------- |
| id          | Identifier          | Unique identifier                   |
| authAccount | AuthAccount         | Referenced authentication account   |
| tokenHash   | String              | Secure hash of the refresh token    |
| createdAt   | DateTime            | Token creation timestamp            |
| expiresAt   | DateTime            | Token expiration timestamp          |
| lastUsedAt  | DateTime            | Last successful refresh             |
| revokedAt   | DateTime (Optional) | Time at which the token was revoked |
| deviceName  | String (Optional)   | Device associated with the session  |

---

# 3. Supporting Value Objects / Enums

## AccountStatus

Represents the current state of an authentication account.

Example values:

- Pending Verification
- Active
- Suspended
- Disabled

---

# 4. Relationships

```text
User
│
└── has one
      │
      ▼
AuthAccount
      │
      └── owns (0..*)
              │
              ▼
        RefreshToken
```

### Relationship Summary

| Source      | Relationship | Target       |
| ----------- | ------------ | ------------ |
| AuthAccount | references   | User         |
| AuthAccount | owns         | RefreshToken |

---

# 5. Ownership

The Authentication domain owns:

- AuthAccount
- RefreshToken

The User entity is referenced from the User domain and is not owned by the Authentication domain.

---

# 6. Business Rules

- Every AuthAccount shall reference exactly one User.
- Every email address shall be unique.
- Passwords shall never be stored in plain text.
- Refresh tokens shall never be stored in plain text.
- A user may have multiple active RefreshTokens, representing multiple logged-in devices.
- Every successful token refresh shall invalidate the previous RefreshToken and issue a new one (Refresh Token Rotation).
- Revoked or expired RefreshTokens shall not be accepted.
- Authentication credentials shall remain independent of the User profile.

---

# 7. Consumers

| Domain                   | Usage                                    |
| ------------------------ | ---------------------------------------- |
| API Gateway / Middleware | Authenticates incoming requests          |
| User                     | Provides authenticated user identity     |
| Dashboard                | Determines current authenticated session |

---

# 8. Out of Scope

The following concepts are intentionally excluded from the Authentication domain.

- User profile management
- Workout ownership
- Nutrition goals
- Authorization roles and permissions
- OAuth providers (Google, Apple, etc.)
- Multi-factor authentication (MFA)

These concerns belong to other domains or future phases.

---

# 9. Future Enhancements

The current model is intentionally designed to support future expansion.

Potential future enhancements include:

- Google Sign-In
- Apple Sign-In
- Multi-factor authentication (MFA)
- Passkeys (WebAuthn)
- Login history
- Device management
- Session management dashboard
- Account recovery
