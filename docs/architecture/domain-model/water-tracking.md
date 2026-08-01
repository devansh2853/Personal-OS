# Water Tracking Domain Model

---

# 1. Purpose

The Water Tracking domain is responsible for recording water intake and managing the user's daily hydration goal.

It provides hydration data for dashboards, analytics, and AI-driven recommendations.

The domain does not perform hydration analytics; those are handled by the Analytics domain.

---

# 2. Entities

## WaterLog

Represents a single water intake recorded by the user.

### Attributes

| Attribute  | Type       | Description                                 |
| ---------- | ---------- | ------------------------------------------- |
| id         | Identifier | Unique identifier                           |
| amount     | Decimal    | Quantity of water consumed                  |
| unit       | WaterUnit  | Unit of measurement                         |
| recordedAt | DateTime   | Date and time the water intake was recorded |

---

## WaterGoal

Represents the user's daily hydration target.

### Attributes

| Attribute   | Type       | Description             |
| ----------- | ---------- | ----------------------- |
| id          | Identifier | Unique identifier       |
| dailyTarget | Decimal    | Daily water intake goal |
| unit        | WaterUnit  | Unit used for the goal  |

---

# 3. Supporting Value Objects / Enums

## WaterUnit

Represents the unit used for recording water intake.

Example values:

- Milliliter
- Liter
- Fluid Ounce

---

# 4. Relationships

The Water Tracking domain contains two independent entities.

```text
WaterGoal

WaterLog
```

---

# 5. Ownership

The Water Tracking domain owns:

- WaterLog
- WaterGoal

---

# 6. Business Rules

- Every WaterLog shall record exactly one water intake.
- Every WaterLog shall have a recorded timestamp.
- Every user shall have one active WaterGoal.
- Water consumed for a day is derived from WaterLogs.
- Remaining daily water intake is derived from WaterGoal and WaterLogs.

---

# 7. Consumers

| Domain            | Usage                              |
| ----------------- | ---------------------------------- |
| Dashboard         | Displays daily hydration progress  |
| Analytics         | Calculates hydration trends        |
| AI Coach (Future) | Provides hydration recommendations |

---

# 8. Out of Scope

The following concepts are intentionally excluded from the Water Tracking domain.

- Smart bottle integration
- Hydration reminders
- Weather-based hydration adjustments

---

# 9. Future Enhancements

Potential future enhancements include:

- Smart bottle integrations
- Hydration reminders
- Daily hydration streaks
- AI hydration recommendations
