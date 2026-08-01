# Supplement Tracking Domain Model

---

# 1. Purpose

The Supplement Tracking domain is responsible for managing supplements, scheduling supplement intake, and recording completed supplement logs.

It enables reminder functionality and adherence tracking.

The domain does not manage nutrition or medication.

---

# 2. Entities

## Supplement

Represents a supplement that can be scheduled by the user.

### Attributes

| Attribute | Type       | Description                                         |
| --------- | ---------- | --------------------------------------------------- |
| id        | Identifier | Unique identifier                                   |
| name      | String     | Supplement name                                     |
| dosage    | String     | Recommended dosage (e.g., 5000 IU, 5 g, 2 capsules) |

---

## SupplementSchedule

Represents a recurring schedule for taking a supplement.

### Attributes

| Attribute    | Type       | Description                              |
| ------------ | ---------- | ---------------------------------------- |
| id           | Identifier | Unique identifier                        |
| supplement   | Supplement | Referenced supplement                    |
| frequency    | Frequency  | How often the supplement should be taken |
| reminderTime | Time       | Scheduled reminder time                  |
| isActive     | Boolean    | Indicates whether the schedule is active |

---

## SupplementLog

Represents a completed supplement intake.

### Attributes

| Attribute  | Type       | Description                            |
| ---------- | ---------- | -------------------------------------- |
| id         | Identifier | Unique identifier                      |
| supplement | Supplement | Supplement taken                       |
| takenAt    | DateTime   | Date and time the supplement was taken |

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
│
├── SupplementSchedule
│
└── SupplementLog
```

### Relationship Summary

| Source             | Relationship | Target     |
| ------------------ | ------------ | ---------- |
| SupplementSchedule | references   | Supplement |
| SupplementLog      | references   | Supplement |

---

# 5. Ownership

The Supplement Tracking domain owns:

- Supplement
- SupplementSchedule
- SupplementLog

---

# 6. Business Rules

- Every SupplementSchedule shall reference exactly one Supplement.
- Every SupplementLog shall reference exactly one Supplement.
- A Supplement may have multiple schedules.
- A SupplementSchedule may generate reminder notifications.
- SupplementLogs represent historical intake and are immutable once recorded.

---

# 7. Consumers

| Domain            | Usage                                |
| ----------------- | ------------------------------------ |
| Notifications     | Generates reminder notifications     |
| Dashboard         | Displays today's supplement schedule |
| Analytics         | Calculates adherence statistics      |
| AI Coach (Future) | Evaluates supplement adherence       |

---

# 8. Out of Scope

The following concepts are intentionally excluded from the Supplement Tracking domain.

- Medication management
- Prescription tracking
- Drug interaction analysis

---

# 9. Future Enhancements

Potential future enhancements include:

- Multiple daily doses
- Inventory tracking
- Low stock reminders
- Barcode scanning
- AI adherence recommendations
- Pharmacy integrations
