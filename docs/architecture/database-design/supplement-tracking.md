# Supplement Tracking Database Design

---

# 1. Purpose

The Supplement Tracking module is responsible for persisting supplements, recurring supplement schedules, and historical supplement intake logs.

SupplementSchedules define recurring intake plans, while SupplementLogs represent immutable historical intake records.

The module also serves as the source of truth for reminder generation and supplement adherence analytics.

---

# 2. Collections

The Supplement Tracking module contains the following MongoDB collections.

- Supplement
- SupplementSchedule
- SupplementLog

No embedded documents are used within this module.

---

# 3. Collection Schemas

## Supplement

```javascript
{
    _id: ObjectId,

    name: String,

    createdAt: Date,

    updatedAt: Date
}
```

---

## SupplementSchedule

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    supplementId: ObjectId,

    dosage: String,

    frequency: Frequency,

    reminderTime: String,

    isActive: Boolean,

    createdAt: Date,

    updatedAt: Date
}
```

---

## SupplementLog

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    supplementId: ObjectId,

    scheduleId: ObjectId,

    dosage: String,

    takenAt: Date,

    createdAt: Date,

    updatedAt: Date
}
```

---

# 4. Embedded Documents

None.

Each entity has an independent lifecycle.

---

# 5. References

```text
SupplementSchedule
│
├── userId ─────────► User
│
└── supplementId ───► Supplement
```

```text
SupplementLog
│
├── userId ─────────► User
├── supplementId ───► Supplement
└── scheduleId ─────► SupplementSchedule (Optional)
```

---

# 6. Supporting Enums

## Frequency

Example values:

- DAILY
- WEEKLY
- CUSTOM

---

# 7. Derived Data

The following values are derived and therefore not persisted.

- Daily supplement completion
- Weekly adherence
- Monthly adherence
- Missed dose statistics
- Supplement streaks

These values are calculated from historical SupplementLogs.

---

# 8. Design Decisions

## Separate Supplement Catalog

Supplements are stored independently so multiple schedules can reference the same supplement.

---

## Historical Supplement Logs

SupplementLogs represent immutable historical intake records.

Once recorded, they are never modified.

---

## Snapshot Dosage

Each SupplementLog stores the dosage used at the time of intake.

This preserves historical accuracy even if the corresponding schedule changes later.

---

## Optional Schedule Reference

A SupplementLog may exist without a SupplementSchedule.

This supports manual supplement logging while still allowing scheduled reminders.

---

## Reminder Source

Reminder notifications are generated from active SupplementSchedules.

Completion of reminders results in SupplementLogs.

---

# 9. Sample Documents

## Supplement

```javascript
{
    _id: ObjectId("..."),

    name: "Creatine Monohydrate",

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

## SupplementSchedule

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    supplementId: ObjectId("..."),

    dosage: "5 g",

    frequency: "DAILY",

    reminderTime: "08:00",

    isActive: true,

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

## SupplementLog

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    supplementId: ObjectId("..."),

    scheduleId: ObjectId("..."),

    dosage: "5 g",

    takenAt: ISODate("2026-08-04T08:10:00Z"),

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

# 10. Future Enhancements

The current design supports future expansion without structural changes.

Potential future enhancements include:

- Multiple reminders per schedule
- Inventory tracking
- Low stock reminders
- Barcode scanning
- Missed-dose tracking
- AI adherence recommendations
- Pharmacy integrations
