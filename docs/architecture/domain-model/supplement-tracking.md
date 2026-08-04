# Supplement Tracking Domain Model

---

# 1. Purpose

The Supplement Tracking domain is responsible for managing supplements, scheduling supplement intake, and recording completed supplement logs.

It enables reminder functionality and adherence tracking.

The domain does not manage nutrition or medication.

---

# 2. Entities

## Supplement

Represents a supplement available for tracking within the application.

### Attributes

| Attribute | Type       | Description       |
| --------- | ---------- | ----------------- |
| id        | Identifier | Unique identifier |
| name      | String     | Supplement name   |

---

## SupplementSchedule

Represents a user's recurring schedule for taking a supplement.

### Attributes

| Attribute    | Type       | Description                                         |
| ------------ | ---------- | --------------------------------------------------- |
| id           | Identifier | Unique identifier                                   |
| supplement   | Supplement | Referenced supplement                               |
| dosage       | String     | Dosage to be taken (e.g., 5000 IU, 5 g, 2 capsules) |
| frequency    | Frequency  | How often the supplement should be taken            |
| reminderTime | Time       | Scheduled reminder time                             |
| isActive     | Boolean    | Indicates whether the schedule is active            |

---

## SupplementLog

Represents a completed supplement intake.

### Attributes

| Attribute  | Type                          | Description                                  |
| ---------- | ----------------------------- | -------------------------------------------- |
| id         | Identifier                    | Unique identifier                            |
| supplement | Supplement                    | Supplement that was taken                    |
| schedule   | SupplementSchedule (Optional) | Schedule from which this intake was recorded |
| dosage     | String                        | Dosage consumed at the time of intake        |
| takenAt    | DateTime                      | Date and time the supplement was taken       |

---

# 3. Supporting Value Objects / Enums

## Frequency

Represents how often a supplement should be taken.

Example values:

- Daily
- Weekly
- Custom

---

# 4. Relationships

```text
Supplement
│
├── referenced by
│       │
│       ▼
│  SupplementSchedule
│
└── referenced by
        │
        ▼
   SupplementLog

SupplementSchedule
        │
        └── optionally referenced by
                    │
                    ▼
              SupplementLog
```

### Relationship Summary

| Source             | Relationship | Target             |
| ------------------ | ------------ | ------------------ |
| SupplementSchedule | references   | Supplement         |
| SupplementLog      | references   | SupplementSchedule |

---

# 5. Ownership

The Supplement Tracking domain owns:

- Supplement
- SupplementSchedule
- SupplementLog

---

# 6. Business Rules

- Every SupplementSchedule shall reference exactly one Supplement.
- Every SupplementSchedule defines its own dosage.
- A Supplement may have multiple schedules.
- Every SupplementLog shall reference exactly one SupplementSchedule.
- A SupplementSchedule may generate reminder notifications.
- SupplementLogs represent historical intake and are immutable once recorded.

---

# 7. Consumers

| Domain            | Usage                                                       |
| ----------------- | ----------------------------------------------------------- |
| Notifications     | Generates supplement reminder notifications                 |
| Dashboard         | Displays today's supplement schedule                        |
| Analytics         | Calculates supplement adherence statistics                  |
| AI Coach (Future) | Evaluates supplement adherence and provides recommendations |

---

# 8. Out of Scope

The following concepts are intentionally excluded from the Supplement Tracking domain.

- Medication management
- Prescription tracking
- Drug interaction analysis

These concerns may be introduced as separate modules in future phases.

---

# 9. Future Enhancements

The current model is intentionally designed to support future expansion.

Potential future enhancements include:

- Multiple reminders per schedule
- Inventory tracking
- Low stock reminders
- Barcode scanning
- Missed-dose tracking
- AI adherence recommendations
- Pharmacy integrations
