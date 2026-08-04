# User Database Design

---

# 1. Purpose

The User module is responsible for persisting user profile information and high-level fitness preferences.

It acts as the central identity for all business domains while remaining independent of authentication, activity logs, and user-specific module data.

All other business modules reference the User but own and manage their own persistence.

---

# 2. Collections

The User module contains the following MongoDB collection.

- User

No embedded documents are used within this module.

---

# 3. Collection Schema

## User

```javascript
{
    _id: ObjectId,

    firstName: String,

    lastName: String,

    dateOfBirth: Date,

    gender: Gender,

    height: Number,

    heightUnit: HeightUnit,

    preferredWeightUnit: WeightUnit,

    preferredWaterUnit: WaterUnit,

    timeZone: String,

    activityLevel: ActivityLevel,

    fitnessGoal: FitnessGoal,

    isActive: Boolean,

    createdAt: Date,

    updatedAt: Date
}
```

---

# 4. Embedded Documents

None.

The User entity is an independent aggregate root.

---

# 5. References

The User module does not reference any other business entities.

Instead, all user-owned business domains reference the User.

```text
WorkoutTemplate
        │
        ▼
       User

WorkoutSession
        │
        ▼
       User

WeightLog
        │
        ▼
       User

Meal
        │
        ▼
       User

NutritionGoal
        │
        ▼
       User

DailyNutrition
        │
        ▼
       User

WaterGoal
        │
        ▼
       User

WaterLog
        │
        ▼
       User

SupplementSchedule
        │
        ▼
       User

SupplementLog
        │
        ▼
       User
```

---

# 6. Supporting Enums

## Gender

Example values:

- MALE
- FEMALE
- OTHER
- PREFER_NOT_TO_SAY

---

## HeightUnit

Example values:

- CENTIMETER
- FOOT

---

## ActivityLevel

Example values:

- SEDENTARY
- LIGHTLY_ACTIVE
- MODERATELY_ACTIVE
- VERY_ACTIVE
- EXTREMELY_ACTIVE

---

## FitnessGoal

Example values:

- LOSE_FAT
- BUILD_MUSCLE
- MAINTAIN_WEIGHT
- IMPROVE_STRENGTH
- IMPROVE_ENDURANCE

---

# 7. Derived Data

The following values are derived and therefore not persisted.

- Age
- Current body weight
- BMI
- Daily calorie requirement
- User statistics
- Workout summaries
- Nutrition summaries

These values are calculated from the User profile together with data owned by other modules.

---

# 8. Design Decisions

## Central User Identity

The User collection acts as the root identity for the application.

All user-owned business entities reference the User through `userId`.

---

## Separation from Authentication

Authentication credentials are intentionally excluded from the User collection.

Authentication is managed by the Authentication module.

---

## Profile Ownership

The User collection stores only profile information and application preferences.

Workout history, nutrition goals, water goals, supplement schedules, and other module-specific data remain within their respective bounded contexts.

---

## Date of Birth

The user's date of birth is stored instead of age.

Age is derived whenever required.

---

## Soft Deactivation

Users are never physically deleted.

The `isActive` field allows accounts to be deactivated while preserving historical data referenced throughout the application.

---

# 9. Sample Document

## User

```javascript
{
    _id: ObjectId("..."),

    firstName: "Parth",

    lastName: "Gupta",

    dateOfBirth: ISODate("2003-08-15"),

    gender: "MALE",

    height: 178,

    heightUnit: "CENTIMETER",

    preferredWeightUnit: "KILOGRAM",

    preferredWaterUnit: "MILLILITER",

    timeZone: "Asia/Kolkata",

    activityLevel: "MODERATELY_ACTIVE",

    fitnessGoal: "BUILD_MUSCLE",

    isActive: true,

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

# 10. Future Enhancements

The current design supports future expansion without structural changes.

Potential future enhancements include:

- Profile photo
- Language preference
- Theme preference
- Notification preferences
- Privacy settings
- Family accounts
- Emergency contact information
