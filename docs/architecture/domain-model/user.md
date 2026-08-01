# User Domain Model

---

# 1. Purpose

The User domain is responsible for managing a user's profile, physical information, application preferences, and high-level fitness profile.

It serves as the central identity for all business domains while remaining independent of authentication, activity logs, and user goals.

The User domain does not manage authentication, workout history, nutrition goals, or other module-specific data.

---

# 2. Entities

## User

Represents a single user of the Personal OS platform.

### Attributes

| Attribute           | Type          | Description                       |
| ------------------- | ------------- | --------------------------------- |
| id                  | Identifier    | Unique identifier                 |
| firstName           | String        | User's first name                 |
| lastName            | String        | User's last name                  |
| dateOfBirth         | Date          | User's date of birth              |
| gender              | Gender        | User's gender                     |
| height              | Decimal       | User's height                     |
| heightUnit          | HeightUnit    | Unit used for height              |
| preferredWeightUnit | WeightUnit    | Preferred weight measurement unit |
| preferredWaterUnit  | WaterUnit     | Preferred water measurement unit  |
| timeZone            | TimeZone      | User's local timezone             |
| activityLevel       | ActivityLevel | General activity level            |
| fitnessGoal         | FitnessGoal   | Primary fitness objective         |

---

# 3. Supporting Value Objects / Enums

## Gender

Example values:

- Male
- Female
- Other
- Prefer Not To Say

---

## HeightUnit

Example values:

- Centimeter
- Foot

---

## ActivityLevel

Represents the user's general daily activity level.

Example values:

- Sedentary
- Lightly Active
- Moderately Active
- Very Active
- Extremely Active

---

## FitnessGoal

Represents the user's primary fitness objective.

Example values:

- Lose Fat
- Build Muscle
- Maintain Weight
- Improve Strength
- Improve Endurance

---

# 4. Relationships

The User domain acts as the owner of all user-specific data throughout the application.

```text
User
│
├── owns → Weight Tracking
├── owns → Workout
├── owns → Food & Meal Tracking
├── owns → Nutrition
├── owns → Water Tracking
└── owns → Supplement Tracking
```

> The relationships above represent ownership at the application level. Each business domain remains responsible for managing its own entities.

---

# 5. Ownership

The User domain owns:

- User

All other modules reference the User but remain independent bounded contexts.

---

# 6. Business Rules

- Every User shall have exactly one profile.
- Date of birth shall be stored instead of age.
- Current body weight shall not be stored in the User entity; it is derived from the latest WeightLog.
- Height is considered part of the user's profile and may be updated over time.
- Preferred measurement units shall be used throughout the application unless explicitly overridden.
- The User profile shall remain independent of authentication credentials.

---

# 7. Consumers

| Domain               | Usage                                        |
| -------------------- | -------------------------------------------- |
| Workout              | User-specific workout templates and sessions |
| Weight Tracking      | Weight history                               |
| Food & Meal Tracking | Meal ownership                               |
| Nutrition            | Nutrition goals and daily summaries          |
| Water Tracking       | Water goals and intake logs                  |
| Supplement Tracking  | Supplement schedules and logs                |
| AI Coach (Future)    | Personalized recommendations                 |
| Dashboard            | User profile and personalization             |

---

# 8. Out of Scope

The following concepts are intentionally excluded from the User domain.

- Authentication credentials
- Email verification
- Password management
- Refresh tokens
- Workout history
- Nutrition goals
- Water goals
- Supplement schedules
- Activity logs

These concerns belong to their respective domains.

---

# 9. Future Enhancements

The current model is intentionally designed to support future expansion.

Potential future enhancements include:

- Profile photo
- Language preference
- Theme preference
- Notification preferences
- Privacy settings
- Family accounts
- Emergency contact information
