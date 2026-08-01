# Exercise Domain Model

---

# 1. Purpose

The Exercise domain is responsible for managing the master exercise library used throughout the Personal OS platform.

It defines exercises and their associated metadata. The Exercise domain acts as a reference catalog that is consumed by other domains, particularly the Workout domain.

The Exercise domain does not manage workout sessions, workout templates, or user-specific exercise data.

---

# 2. Entities

## Exercise

Represents a single exercise available within the application.

### Attributes

| Attribute             | Type              | Description                                                                       |
| --------------------- | ----------------- | --------------------------------------------------------------------------------- |
| id                    | UUID              | Unique identifier                                                                 |
| name                  | String            | Exercise name                                                                     |
| primaryMuscleGroup    | MuscleGroup       | Primary target muscle group                                                       |
| secondaryMuscleGroups | List<MuscleGroup> | Secondary muscle groups engaged                                                   |
| equipment             | List<Equipment>   | Equipment required to perform the exercise                                        |
| weightType            | WeightType        | Defines how the exercise is tracked (Bodyweight, External Weight, Assisted, etc.) |
| images                | List<Image>       | Reference images demonstrating the exercise                                       |
| instructionalVideo    | URL (Optional)    | Instructional video demonstrating proper technique                                |

---

## MuscleGroup

Represents a high-level muscle group targeted by one or more exercises.

### Attributes

| Attribute | Type   | Description              |
| --------- | ------ | ------------------------ |
| id        | UUID   | Unique identifier        |
| name      | String | Name of the muscle group |

Example values:

- Chest
- Back
- Shoulders
- Biceps
- Triceps
- Forearms
- Abs
- Glutes
- Quads
- Hamstrings
- Calves

---

## Equipment

Represents equipment required to perform one or more exercises.

### Attributes

| Attribute | Type   | Description       |
| --------- | ------ | ----------------- |
| id        | UUID   | Unique identifier |
| name      | String | Equipment name    |

Example values:

- Barbell
- Dumbbell
- Cable
- Smith Machine
- Resistance Band
- Kettlebell

---

# 3. Relationships

The Exercise domain contains the following relationships.

```
Exercise
│
├── primaryMuscleGroup ─────► MuscleGroup (1)
│
├── secondaryMuscleGroups ──► MuscleGroup (0..*)
│
└── equipment ──────────────► Equipment (0..*)
```

Relationship summary:

| Source   | Relationship          | Target                  |
| -------- | --------------------- | ----------------------- |
| Exercise | has one               | Primary Muscle Group    |
| Exercise | has many              | Secondary Muscle Groups |
| Exercise | requires zero or more | Equipment               |

---

# 4. Ownership

The Exercise domain owns:

- Exercise
- MuscleGroup
- Equipment

These entities are maintained exclusively by the Exercise domain.

Other domains may reference these entities but must not modify them.

---

# 5. Consumers

The following domains consume Exercise data.

| Domain             | Usage                                                                      |
| ------------------ | -------------------------------------------------------------------------- |
| Workout            | References exercises while creating workout templates and workout sessions |
| Analytics (Future) | Generates muscle group insights                                            |
| AI Coach (Future)  | Generates exercise recommendations                                         |

---

# 6. Business Rules

- Every Exercise shall have exactly one primary muscle group.
- An Exercise may have zero or more secondary muscle groups.
- An Exercise may require zero or more pieces of equipment.
- Exercise definitions are read-only during Phase 1.
- Workout and other domains may reference Exercises but shall not modify them.

---

# 7. Out of Scope

The following concepts are intentionally excluded from the Exercise domain.

- Workout Templates
- Workout Sessions
- Set Logging
- Personal Records
- User-specific exercise customization

These concepts belong to the Workout domain.
