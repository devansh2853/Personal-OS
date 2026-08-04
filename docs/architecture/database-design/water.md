# Water Tracking Database Design

---

# 1. Purpose

The Water Tracking module is responsible for persisting the user's daily hydration goal and individual water intake records.

WaterGoals define the user's hydration target, while WaterLogs represent individual water intake events recorded throughout the day.

The module serves as the source of truth for hydration data used by dashboards, analytics, and AI features.

---

# 2. Collections

The Water Tracking module contains the following MongoDB collections.

- WaterGoal
- WaterLog

No embedded documents are used within this module.

---

## User Ownership

All WorkoutTemplates and WorkoutSessions contain a `userId` reference to the User module.

This establishes ownership while allowing the Workout module to remain an independent bounded context.

# 3. Collection Schemas

## WaterGoal

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    dailyTarget: Number,

    unit: WaterUnit,

    createdAt: Date,

    updatedAt: Date
}
```

---

## WaterLog

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    amount: Number,

    unit: WaterUnit,

    recordedAt: Date,

    createdAt: Date,

    updatedAt: Date
}
```

---

# 4. Embedded Documents

None.

WaterGoal and WaterLog are independent aggregate roots.

---

# 5. References

Both collections reference the owning user.

```text
WaterGoal
│
└── userId ─────► User
```

```text
WaterLog
│
└── userId ─────► User
```

---

# 6. Supporting Enums

## WaterUnit

Example values:

- MILLILITER
- LITER
- FLUID_OUNCE

---

# 7. Derived Data

The following values are derived and therefore not persisted.

- Total water consumed for a day
- Remaining daily water intake
- Goal completion percentage
- Weekly hydration summaries
- Monthly hydration summaries
- Hydration streaks

These values are calculated from WaterGoal and WaterLogs when required.

---

# 8. Design Decisions

## Separate WaterGoal Collection

Although each user has only one active WaterGoal, it is stored in its own collection.

This preserves clear ownership within the Water Tracking bounded context and allows future support for goal history without restructuring the database.

---

## Individual Water Intake Events

Each WaterLog represents a single hydration event.

This preserves the complete history of water consumption and allows future analytics such as hydration patterns and intake frequency.

---

## No Daily Projection

Unlike Nutrition, the Water Tracking module does not maintain a materialized daily summary.

Daily hydration is calculated directly from WaterLogs because the number of daily records is typically small and aggregation is inexpensive.

---

## Source of Truth

WaterLogs are the source of truth for hydration history.

All dashboard metrics and future analytics are derived from these historical records.

---

# 9. Sample Documents

## WaterGoal

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    dailyTarget: 3500,

    unit: "MILLILITER",

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

## WaterLog

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    amount: 500,

    unit: "MILLILITER",

    recordedAt: ISODate("2026-08-04T10:15:00Z"),

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

# 10. Future Enhancements

The current design supports future expansion without structural changes.

Potential future enhancements include:

- Smart bottle integrations
- Hydration reminders
- Daily hydration streaks
- AI hydration recommendations
- Goal history
- Weather-based hydration adjustments
