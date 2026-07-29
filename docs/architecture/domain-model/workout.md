# Workout Domain Model

---

# 1. Purpose

The Workout domain is responsible for creating reusable workout templates and tracking completed workout sessions.

It references exercises from the Exercise domain while managing workout-specific configuration such as exercise order, target sets, rest timers, and completed workout sets.

The Workout domain does not own exercise definitions.

---

# 2. Entities

## WorkoutTemplate

Represents a reusable workout that can be performed multiple times.

### Attributes

| Attribute | Type                   | Description                        |
| --------- | ---------------------- | ---------------------------------- |
| id        | Identifier             | Unique identifier                  |
| name      | String                 | Workout template name              |
| exercises | List<TemplateExercise> | Exercises included in the template |

---

## TemplateExercise

Represents a configured exercise within a workout template.

### Attributes

| Attribute  | Type       | Description                                      |
| ---------- | ---------- | ------------------------------------------------ |
| id         | Identifier | Unique identifier                                |
| exercise   | Exercise   | Reference to the Exercise catalog                |
| order      | Integer    | Position within the workout                      |
| targetSets | Integer    | Planned number of sets                           |
| targetReps | RepScheme  | Planned repetition scheme (e.g., 8, 8–10, AMRAP) |
| restTimer  | Duration   | Default rest time after each set                 |

---

## WorkoutSession

Represents a single workout performed by the user.

### Attributes

| Attribute       | Type                       | Description                            |
| --------------- | -------------------------- | -------------------------------------- |
| id              | Identifier                 | Unique identifier                      |
| workoutTemplate | WorkoutTemplate (Optional) | Template used to create the session    |
| status          | WorkoutSessionStatus       | Current session status                 |
| startedAt       | DateTime                   | Session start time                     |
| completedAt     | DateTime (Optional)        | Session completion time                |
| exercises       | List<SessionExercise>      | Exercises performed during the session |

---

## SessionExercise

Represents an exercise performed during a workout session.

### Attributes

| Attribute   | Type             | Description                       |
| ----------- | ---------------- | --------------------------------- |
| id          | Identifier       | Unique identifier                 |
| exercise    | Exercise         | Reference to the Exercise catalog |
| order       | Integer          | Position within the workout       |
| restTimer   | Duration         | Rest timer used for this session  |
| workoutSets | List<WorkoutSet> | Performed workout sets            |

---

## WorkoutSet

Represents a single performed set.

### Attributes

| Attribute | Type               | Description                                 |
| --------- | ------------------ | ------------------------------------------- |
| id        | Identifier         | Unique identifier                           |
| type      | WeightType         | Bodyweight, External Weight, Assisted, etc. |
| weight    | Decimal (Optional) | Weight used when applicable                 |
| reps      | Integer            | Number of repetitions completed             |

---

# 3. Supporting Value Objects / Enums

## WeightType

Defines how an exercise is performed.

Example values:

- Bodyweight
- External Weight
- Assisted

---

## RepScheme

Represents the planned repetition scheme for a TemplateExercise.

Example values:

- 8
- 8–10
- AMRAP
- Until Failure

---

## WorkoutSessionStatus

Represents the lifecycle of a workout session.

Example values:

- Planned
- In Progress
- Completed
- Cancelled

---

# 4. Relationships

```text
WorkoutTemplate
│
└── contains (1..*)
    │
    ▼
TemplateExercise
│
└── references (1)
    │
    ▼
Exercise


WorkoutSession
│
└── contains (1..*)
    │
    ▼
SessionExercise
│
├── references (1)
│       │
│       ▼
│    Exercise
│
└── contains (0..*)
        │
        ▼
    WorkoutSet
```

### Relationship Summary

| Source           | Relationship | Target           |
| ---------------- | ------------ | ---------------- |
| WorkoutTemplate  | contains     | TemplateExercise |
| TemplateExercise | references   | Exercise         |
| WorkoutSession   | contains     | SessionExercise  |
| SessionExercise  | references   | Exercise         |
| SessionExercise  | contains     | WorkoutSet       |

---

# 5. Ownership

The Workout domain owns:

- WorkoutTemplate
- TemplateExercise
- WorkoutSession
- SessionExercise
- WorkoutSet

The Exercise entity is referenced from the Exercise domain and is not owned by the Workout domain.

---

# 6. Business Rules

- Every TemplateExercise shall reference exactly one Exercise.
- Every SessionExercise shall reference exactly one Exercise.
- A WorkoutTemplate shall contain one or more TemplateExercises.
- A WorkoutSession may be created from a WorkoutTemplate or manually.
- Each TemplateExercise maintains its own default rest timer.
- A SessionExercise may override the default rest timer without modifying the original WorkoutTemplate.
- Every SessionExercise may contain zero or more WorkoutSets.
- A WorkoutSession captures a snapshot of the WorkoutTemplate at the time the session is created.
- Historical WorkoutSessions are immutable once completed.

---

# 7. Consumers

| Domain            | Usage                                                                |
| ----------------- | -------------------------------------------------------------------- |
| Analytics         | Calculates workout statistics, training volume, and personal records |
| AI Coach (Future) | Provides workout recommendations and progression guidance            |

---

# 8. Out of Scope

The following concepts are intentionally excluded from the Workout domain.

- Exercise definitions
- Muscle groups
- Equipment catalog
- Nutrition tracking
- Weight tracking

These are managed by their respective domains.

---

# 9. Future Enhancements

The current model is intentionally designed to support future expansion without major structural changes.

Potential future enhancements include:

- Warm-up sets
- Drop sets
- Supersets
- Circuit workouts
- Tempo tracking
- RPE/RIR tracking
- Exercise notes
