# Authentication Database Design

---

# 1. Purpose

The Authentication module is responsible for persisting authentication credentials and authenticated device sessions.

AuthAccounts manage login credentials, while RefreshTokens represent authenticated device sessions used for issuing new access tokens.

The module remains independent of the User profile and all business domains.

---

# 2. Collections

The Authentication module contains the following MongoDB collections.

- AuthAccount
- RefreshToken

No embedded documents are used within this module.

---

# 3. Collection Schemas

## AuthAccount

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    email: String,

    passwordHash: String,

    isVerified: Boolean,

    status: AccountStatus,

    lastLoginAt: Date,

    createdAt: Date,

    updatedAt: Date
}
```

---

## RefreshToken

```javascript
{
    _id: ObjectId,

    authAccountId: ObjectId,

    tokenHash: String,

    createdAt: Date,

    expiresAt: Date,

    lastUsedAt: Date,

    revokedAt: Date,

    deviceName: String
}
```

---

# 4. Embedded Documents

None.

AuthAccount and RefreshToken are independent aggregate roots.

---

# 5. References

Authentication entities reference one another and the User module.

```text
AuthAccount
│
└── userId ─────────► User
```

```text
RefreshToken
│
└── authAccountId ─► AuthAccount
```

---

# 6. Supporting Enums

## AccountStatus

Example values:

- PENDING_VERIFICATION
- ACTIVE
- SUSPENDED
- DISABLED

---

# 7. Derived Data

The following values are derived and therefore not persisted.

- Authentication state
- Current logged-in user
- JWT access token validity
- Active device count
- Session duration

These values are calculated from AuthAccounts, RefreshTokens, and validated JWTs.

---

# 8. Design Decisions

## Separation from User Profile

Authentication data is stored independently of the User module.

The User module owns profile information, while the Authentication module owns credentials and authenticated sessions.

---

## Password Security

Passwords are never stored in plain text.

Only securely hashed passwords are persisted.

---

## Refresh Token Security

Refresh tokens are never stored in plain text.

Only secure hashes of refresh tokens are persisted.

---

## JWT Access Tokens

JWT access tokens are stateless and are **not persisted**.

They are generated during authentication, returned to the client, and validated cryptographically on each request.

Only RefreshTokens are stored in the database.

---

## Refresh Token Rotation

Every successful refresh operation invalidates the previous RefreshToken and creates a new one.

This limits the impact of a compromised refresh token and follows modern authentication best practices.

---

## Multiple Device Sessions

A single AuthAccount may own multiple active RefreshTokens.

Each RefreshToken represents an independently authenticated device session.

---

# 9. Sample Documents

## AuthAccount

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    email: "parth@example.com",

    passwordHash: "$argon2id$...",

    isVerified: true,

    status: "ACTIVE",

    lastLoginAt: ISODate(...),

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

## RefreshToken

```javascript
{
    _id: ObjectId("..."),

    authAccountId: ObjectId("..."),

    tokenHash: "$argon2id$...",

    createdAt: ISODate(...),

    expiresAt: ISODate(...),

    lastUsedAt: ISODate(...),

    revokedAt: null,

    deviceName: "Pixel 9 Pro"
}
```

---

# 10. Future Enhancements

The current design supports future expansion without structural changes.

Potential future enhancements include:

- Google Sign-In
- Apple Sign-In
- Multi-factor authentication (MFA)
- Passkeys (WebAuthn)
- Login history
- Device management
- Session management dashboard
- Account recovery
