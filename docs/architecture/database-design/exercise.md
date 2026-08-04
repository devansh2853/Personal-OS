# Exercise Database Design

---

# 1. Purpose

The Exercise module stores the application's exercise catalog.

Exercises are imported from an external exercise database (ExerciseDB) and stored using Personal OS's internal schema.

The catalog is read-only during Phase 1 and serves as the source of exercise information for the Workout domain.

---

# 2. Collections

The Exercise module contains the following MongoDB collections.

- Exercise
- MuscleGroup
- Equipment

MuscleGroup and Equipment are seeded collections containing reference data used throughout the application.

---

# 3. Collection Schemas

## Exercise

```javascript
{
    _id: ObjectId,

    name: String,

    primaryMuscleGroupId: ObjectId,

    secondaryMuscleGroupIds: [
        ObjectId
    ],

    equipmentIds: [
        ObjectId
    ],

    weightType: WeightType,

    imageUrls: [
        String
    ],

    instructionalVideoUrl: String,

    isActive: Boolean,

    createdAt: Date,

    updatedAt: Date
}
```

---

## MuscleGroup

```javascript
{
    _id: ObjectId,

    name: String,

    createdAt: Date,

    updatedAt: Date
}
```

---

## Equipment

```javascript
{
    _id: ObjectId,

    name: String,

    createdAt: Date,

    updatedAt: Date
}
```

---

# 4. Embedded Documents

No embedded documents are used.

Each collection represents an independent catalog entity.

---

# 5. References

Exercise stores references to MuscleGroup and Equipment.

```text
Exercise
│
├── primaryMuscleGroupId ─────► MuscleGroup
│
├── secondaryMuscleGroupIds ──► MuscleGroup
│
└── equipmentIds ─────────────► Equipment
```

---

# 6. Derived Data

None.

The Exercise collection stores only source-of-truth exercise information.

---

# 7. Design Decisions

## Separate Collections for Reference Data

MuscleGroup and Equipment are implemented as dedicated collections because they represent business reference data rather than application logic.

Benefits include:

- Simplifies importing data from external exercise providers.
- Supports future custom exercises.
- Allows additional muscle groups or equipment types without code changes.
- Keeps the application independent of any external provider's naming conventions.

---

## Read-Only Exercise Catalog

Exercise definitions are imported from ExerciseDB and treated as read-only during Phase 1.

Users cannot modify system exercises.

---

## Soft Deactivation

Exercises are never physically deleted.

The `isActive` field allows an exercise to be hidden from future selections while preserving historical workout data.

---

## Media Storage

Only URLs are stored for images and instructional videos.

Actual media files are stored in external object storage.

---

# 8. Sample Documents

## Exercise

```javascript
{
    _id: ObjectId("6890c4..."),

    name: "Barbell Bench Press",

    primaryMuscleGroupId: ObjectId("..."),

    secondaryMuscleGroupIds: [
        ObjectId("..."),
        ObjectId("...")
    ],

    equipmentIds: [
        ObjectId("..."),
        ObjectId("...")
    ],

    weightType: "EXTERNAL_WEIGHT",

    imageUrls: [
        "https://cdn.personalos.com/exercises/bench-1.png",
        "https://cdn.personalos.com/exercises/bench-2.png"
    ],

    instructionalVideoUrl:
        "https://youtube.com/...",

    isActive: true,

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

## MuscleGroup

```javascript
{
    _id: ObjectId("..."),

    name: "Chest",

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

## Equipment

```javascript
{
    _id: ObjectId("..."),

    name: "Barbell",

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

# 9. Future Enhancements

The current design supports future expansion without structural changes.

Potential future enhancements include:

- Custom user-created exercises
- Exercise categories
- Difficulty levels
- Exercise tags
- Alternative exercises
- AI-generated exercise descriptions
- Multiple exercise providers
