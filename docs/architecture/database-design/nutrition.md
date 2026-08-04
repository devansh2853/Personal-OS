# Nutrition Database Design

---

# 1. Purpose

The Nutrition module is responsible for persisting user nutrition goals and maintaining daily nutritional summaries.

NutritionGoals represent the user's daily macro and calorie targets, while DailyNutrition stores materialized daily summaries generated from recorded meals.

The module consumes meal data from the Food & Meal Tracking module but does not own meal history.

---

# 2. Collections

The Nutrition module contains the following MongoDB collections.

- NutritionGoal
- DailyNutrition

No embedded documents are used within this module.

---

# 3. Collection Schemas

## NutritionGoal

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    calorieTarget: Number,

    proteinTarget: Number,

    carbohydrateTarget: Number,

    fatTarget: Number,

    createdAt: Date,

    updatedAt: Date
}
```

---

## DailyNutrition

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    date: Date,

    totalCalories: Number,

    totalProtein: Number,

    totalCarbohydrates: Number,

    totalFat: Number,

    createdAt: Date,

    updatedAt: Date
}
```

---

# 4. Embedded Documents

None.

NutritionGoal and DailyNutrition are independent aggregate roots.

---

# 5. References

Both collections reference the owning user.

```text
NutritionGoal
│
└── userId ─────► User
```

```text
DailyNutrition
│
└── userId ─────► User
```

DailyNutrition is generated from Meal data but does not maintain references to individual Meals.

---

# 6. Derived Data

The following values are derived and therefore not persisted.

- Remaining calories
- Remaining protein
- Remaining carbohydrates
- Remaining fat
- Goal completion percentages
- Weekly nutrition summaries
- Monthly nutrition summaries

These values are calculated from NutritionGoal and DailyNutrition when required.

---

# 7. Design Decisions

## Separate NutritionGoal Collection

Although each user has only one active NutritionGoal, it is stored in its own collection.

This preserves clear ownership within the Nutrition bounded context and allows future support for goal history and nutrition phases without restructuring the database.

---

## Materialized Daily Summaries

DailyNutrition is a materialized projection rather than the source of truth.

It exists to provide efficient reads for dashboards, analytics, and AI features without recalculating meal totals for every request.

---

## Automatic Synchronization

DailyNutrition is maintained exclusively by the application.

Whenever a Meal is created, updated, or deleted, the corresponding DailyNutrition document is recalculated automatically.

Clients never modify DailyNutrition directly.

---

## One Document Per User Per Day

Each user has at most one DailyNutrition document for a given calendar date.

This document represents the complete nutritional summary for that day.

---

# 8. Sample Documents

## NutritionGoal

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    calorieTarget: 2500,

    proteinTarget: 180,

    carbohydrateTarget: 250,

    fatTarget: 70,

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

## DailyNutrition

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    date: ISODate("2026-08-04"),

    totalCalories: 2145,

    totalProtein: 162,

    totalCarbohydrates: 201,

    totalFat: 58,

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

# 9. Future Enhancements

The current design supports future expansion without structural changes.

Potential future enhancements include:

- Weekly nutrition summaries
- Monthly nutrition summaries
- Nutrition phases (Cut, Bulk, Maintenance)
- Goal history
- Dynamic calorie targets
- Micronutrient goals
- AI-generated nutrition plans
