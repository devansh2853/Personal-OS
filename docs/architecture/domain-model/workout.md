# Workout Domain Model

---

# 1. Purpose

The Workout domain is responsible for creating reusable workout templates and tracking completed workout sessions.

It references exercises from the Exercise domain while managing workout-specific configuration such as exercise order, target sets, rest timers, and completed set logs.

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

| Attribute  | Type            | Description                       |
| ---------- | --------------- | --------------------------------- |
| id         | Identifier      | Unique identifier                 |
| exercise   | Exercise        | Reference to the Exercise catalog |
| order      | Integer         | Position within the workout       |
| targetSets | Integer         | Planned number of sets            |
| targetReps | Integer / Range | Planned repetitions               |
| restTimer  | Duration        | Rest time after each set          |

---

## WorkoutSession

Represents a single completed or in-progress workout.

### Attributes

| Attribute       | Type                       | Description                            |
| --------------- | -------------------------- | -------------------------------------- |
| id              | Identifier                 | Unique identifier                      |
| workoutTemplate | WorkoutTemplate (Optional) | Template used to create the session    |
| startedAt       | DateTime                   | Session start time                     |
| completedAt     | DateTime (Optional)        | Session completion time                |
| exercises       | List<SessionExercise>      | Exercises performed during the session |

---

## SessionExercise

Represents an exercise performed during a workout session.

### Attributes

| Attribute | Type       | Description                       |
| --------- | ---------- | --------------------------------- |
| id        | Identifier | Unique identifier                 |
| exercise  | Exercise   | Reference to the Exercise catalog |
| order     | Integer    | Position within the workout       |
| restTimer | Duration   | Rest timer used for this session  |
| sets      | List<Set>  | Performed sets                    |

---

## Set

Represents a single performed set.

### Attributes

| Attribute | Type               | Description                                 |
| --------- | ------------------ | ------------------------------------------- |
| id        | Identifier         | Unique identifier                           |
| type      | WeightType         | Bodyweight, External Weight, Assisted, etc. |
| weight    | Decimal (Optional) | Weight used when applicable                 |
| reps      | Integer            | Number of repetitions completed             |

---

# 3. Relationships

```
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
       Set
```

Relationship summary:

| Source           | Relationship | Target           |
| ---------------- | ------------ | ---------------- |
| WorkoutTemplate  | contains     | TemplateExercise |
| TemplateExercise | references   | Exercise         |
| WorkoutSession   | contains     | SessionExercise  |
| SessionExercise  | references   | Exercise         |
| SessionExercise  | contains     | Set              |

---

# 4. Ownership

The Workout domain owns:

- WorkoutTemplate
- TemplateExercise
- WorkoutSession
- SessionExercise
- Set

The Exercise entity is referenced from the Exercise domain and is not owned by the Workout domain.

---

# 5. Business Rules

- Every TemplateExercise shall reference exactly one Exercise.
- Every SessionExercise shall reference exactly one Exercise.
- A WorkoutTemplate shall contain one or more TemplateExercises.
- A WorkoutSession may be created from a WorkoutTemplate or manually.
- Rest timers are configured per TemplateExercise.
- Rest timers may be overridden within a WorkoutSession without modifying the original WorkoutTemplate.
- Every SessionExercise may contain zero or more completed Sets.
- Historical WorkoutSessions are immutable once completed.

---

# 6. Consumers

| Domain            | Usage                                                       |
| ----------------- | ----------------------------------------------------------- |
| Analytics         | Calculates workout statistics, volume, and personal records |
| AI Coach (Future) | Provides workout recommendations and progression guidance   |

---

# 7. Out of Scope

The following concepts are intentionally excluded from the Workout domain.

- Exercise definitions
- Muscle groups
- Equipment catalog
- Nutrition tracking
- Weight tracking

These are managed by their respective domains.
