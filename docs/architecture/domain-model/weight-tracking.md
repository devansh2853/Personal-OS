# Weight Tracking Domain Model

---

# 1. Purpose

The Weight Tracking domain is responsible for recording and maintaining a user's body weight history.

It provides historical weight data for tracking progress and generating analytics.

The domain does not perform trend analysis or progress calculations; those are handled by the Analytics domain.

---

# 2. Entities

## WeightLog

Represents a single body weight measurement recorded by the user.

### Attributes

| Attribute  | Type              | Description                                      |
| ---------- | ----------------- | ------------------------------------------------ |
| id         | Identifier        | Unique identifier                                |
| weight     | Decimal           | Recorded body weight                             |
| unit       | WeightUnit        | Unit of measurement                              |
| recordedAt | DateTime          | Date and time the weight was recorded            |
| notes      | String (Optional) | Additional notes associated with the measurement |

---

# 3. Supporting Value Objects / Enums

## WeightUnit

Represents the unit used for recording body weight.

Example values:

- Kilogram
- Pound

---

# 4. Relationships

The Weight Tracking domain contains a single entity and does not maintain relationships with other domain entities.

---

# 5. Ownership

The Weight Tracking domain owns:

- WeightLog

---

# 6. Business Rules

- Every WeightLog shall record exactly one body weight measurement.
- Every WeightLog shall have exactly one measurement unit.
- Every WeightLog shall have a recorded timestamp.
- Historical WeightLogs are immutable once created.

---

# 7. Consumers

| Domain            | Usage                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| Analytics         | Calculates weight trends, progress, averages, and historical insights |
| AI Coach (Future) | Generates personalized recommendations based on weight history        |

---

# 8. Out of Scope

The following concepts are intentionally excluded from the Weight Tracking domain.

- Weight trend analysis
- BMI calculation
- Body fat percentage tracking
- Progress visualization

These concerns belong to the Analytics domain.

---

# 9. Future Enhancements

The current model is intentionally designed to support future expansion.

Potential future enhancements include:

- Body fat percentage
- Lean body mass
- Waist, chest, arm, and thigh measurements
- Progress photos
- Smart scale integration
- Multiple daily weight entries with averaging
