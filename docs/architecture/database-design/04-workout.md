# Workout Database Design

---

# 1. Purpose

The Workout module is responsible for persisting workout templates and workout sessions.

Workout Templates define reusable workout structures, while Workout Sessions represent historical workout executions.

Workout Sessions act as immutable snapshots of completed workouts and serve as the source of truth for workout history, analytics, and AI recommendations.

---

# 2. Collections

The Workout module contains the following MongoDB collections.

- WorkoutTemplate
- WorkoutSession

TemplateExercise, SessionExercise, and WorkoutSet are embedded documents because they never exist independently of their parent.

---

## User Ownership

All WorkoutTemplates and WorkoutSessions contain a `userId` reference to the User module.

This establishes ownership while allowing the Workout module to remain an independent bounded context.

# 3. Collection Schemas

## WorkoutTemplate

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    name: String,

    exercises: [
        {
            _id: ObjectId,

            exerciseId: ObjectId,

            order: Number,

            targetSets: Number,

            targetReps: RepScheme,

            restTimer: Number
        }
    ],

    createdAt: Date,

    updatedAt: Date
}
```

---

## WorkoutSession

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    workoutTemplateId: ObjectId,

    status: WorkoutSessionStatus,

    startedAt: Date,

    completedAt: Date,

    duration: Number,

    exercises: [
        {
            _id: ObjectId,

            exerciseId: ObjectId,

            order: Number,

            restTimer: Number,

            workoutSets: [
                {
                    _id: ObjectId,

                    type: WeightType,

                    weight: Number,

                    reps: Number
                }
            ]
        }
    ],

    createdAt: Date,

    updatedAt: Date
}
```

---

# 4. Embedded Documents

The Workout module uses embedded documents to model aggregate ownership.

```text
WorkoutTemplate
│
└── TemplateExercise[]
```

```text
WorkoutSession
│
└── SessionExercise[]
        │
        └── WorkoutSet[]
```

These embedded documents never exist independently of their parent collection.

---

# 5. References

WorkoutTemplate and WorkoutSession reference entities owned by other modules.

```text
WorkoutTemplate
│
└── exerciseId ─────► Exercise
```

```text
WorkoutSession
│
├── workoutTemplateId ─► WorkoutTemplate
│
└── exerciseId ────────► Exercise
```

---

# 6. Derived Data

The following values are derived and therefore not stored.

- Exercise history
- Personal records
- Total training volume
- Weekly workout summaries
- Exercise progression
- Average workout duration

These values are calculated from historical WorkoutSessions.

---

# 7. Design Decisions

## Aggregate Ownership

WorkoutTemplate owns its TemplateExercises.

WorkoutSession owns its SessionExercises and WorkoutSets.

These entities never exist independently and are therefore embedded.

---

## Workout Sessions are Immutable

Completed WorkoutSessions represent historical workout data.

Editing a WorkoutTemplate does not modify previously completed WorkoutSessions.

---

## Exercise References

Exercises are referenced by ObjectId instead of embedded.

This ensures exercise definitions remain centralized within the Exercise module.

---

## Workout Snapshot

WorkoutSessions store all exercise configuration required to reproduce the workout as it was performed, including:

- Exercise order
- Rest timers
- Completed workout sets

Future modifications to a WorkoutTemplate do not affect historical sessions.

---

## Duration Storage

Workout duration is stored rather than calculated.

Duration represents historical workout information and should remain unchanged even if timestamps are corrected later.

---

# 8. Sample Documents

## WorkoutTemplate

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    name: "Push Day",

    exercises: [
        {
            _id: ObjectId(),

            exerciseId: ObjectId(),

            order: 1,

            targetSets: 3,

            targetReps: "8-10",

            restTimer: 120
        },
        {
            _id: ObjectId(),

            exerciseId: ObjectId(),

            order: 2,

            targetSets: 3,

            targetReps: "10-12",

            restTimer: 90
        }
    ],

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

## WorkoutSession

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    workoutTemplateId: ObjectId("..."),

    status: "COMPLETED",

    startedAt: ISODate(...),

    completedAt: ISODate(...),

    duration: 4380,

    exercises: [
        {
            _id: ObjectId(),

            exerciseId: ObjectId(),

            order: 1,

            restTimer: 120,

            workoutSets: [
                {
                    _id: ObjectId(),

                    type: "EXTERNAL_WEIGHT",

                    weight: 80,

                    reps: 8
                },
                {
                    _id: ObjectId(),

                    type: "EXTERNAL_WEIGHT",

                    weight: 80,

                    reps: 8
                },
                {
                    _id: ObjectId(),

                    type: "EXTERNAL_WEIGHT",

                    weight: 75,

                    reps: 10
                }
            ]
        }
    ],

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

# 9. Future Enhancements

The current design supports future expansion without structural changes.

Potential future enhancements include:

- Warm-up sets
- Drop sets
- Supersets
- Circuit workouts
- Tempo tracking
- RPE/RIR tracking
- Exercise notes
- Workout notes
- Workout tags
