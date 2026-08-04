# Weight Tracking Database Design

---

# 1. Purpose

The Weight Tracking module is responsible for persisting the user's body weight history.

Each WeightLog represents a single body weight measurement and serves as the source of truth for weight tracking throughout the application.

Historical WeightLogs are immutable and provide data for dashboards, analytics, and AI recommendations.

---

# 2. Collections

The Weight Tracking module contains a single MongoDB collection.

- WeightLog

No embedded documents are used within this module.

---

# 3. Collection Schema

## WeightLog

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    weight: Number,

    unit: WeightUnit,

    measuredAt: Date,

    notes: String,

    createdAt: Date,

    updatedAt: Date
}
```

---

# 4. Embedded Documents

None.

WeightLog is an independent aggregate root.

---

# 5. References

WeightLog references the owning user.

```text
WeightLog
│
└── userId ─────► User
```

---

# 6. Supporting Enums

## WeightUnit

Example values:

- KILOGRAM
- POUND

---

# 7. Derived Data

The following values are derived and therefore not persisted.

- Current body weight
- Weight trends
- Average body weight
- Weekly weight change
- Monthly weight change
- BMI
- Goal progress

These values are calculated from historical WeightLogs.

---

# 8. Design Decisions

## Immutable Weight History

Each WeightLog represents a historical body weight measurement.

Once created, historical measurements are never modified.

---

## Historical Source of Truth

WeightLogs serve as the authoritative source for body weight history.

The user's current weight is always derived from the latest WeightLog rather than being duplicated elsewhere.

---

## Independent Measurements

Each WeightLog represents a single measurement event and does not depend on any other entity within the system.

---

# 9. Sample Document

## WeightLog

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    weight: 78.4,

    unit: "KILOGRAM",

    measuredAt: ISODate("2026-08-04T07:15:00Z"),

    notes: "Morning, fasted",

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

# 10. Future Enhancements

The current design supports future expansion without structural changes.

Potential future enhancements include:

- Body fat percentage
- Lean body mass
- Body measurements
- Progress photos
- Smart scale integration
- Multiple daily weight entries
- Automatic daily averaging
