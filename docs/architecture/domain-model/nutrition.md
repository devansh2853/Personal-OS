# Nutrition Domain Model

---

# 1. Purpose

The Nutrition domain is responsible for managing nutritional goals and providing daily nutritional summaries.

It consumes meal data from the Food & Meal Tracking domain to generate daily nutrition statistics used by dashboards, analytics, and AI features.

The Nutrition domain does not own meal history or food definitions.

---

# 2. Entities

## NutritionGoal

Represents the user's daily nutritional targets.

### Attributes

| Attribute          | Type       | Description               |
| ------------------ | ---------- | ------------------------- |
| id                 | Identifier | Unique identifier         |
| calorieTarget      | Decimal    | Daily calorie target      |
| proteinTarget      | Decimal    | Daily protein target      |
| carbohydrateTarget | Decimal    | Daily carbohydrate target |
| fatTarget          | Decimal    | Daily fat target          |

---

## DailyNutrition

Represents the nutritional summary for a single day.

> **Note:** DailyNutrition is a materialized projection generated from Meal data. It is not the source of truth.

### Attributes

| Attribute          | Type       | Description                      |
| ------------------ | ---------- | -------------------------------- |
| id                 | Identifier | Unique identifier                |
| date               | Date       | Date represented by this summary |
| totalCalories      | Decimal    | Total calories consumed          |
| totalProtein       | Decimal    | Total protein consumed           |
| totalCarbohydrates | Decimal    | Total carbohydrates consumed     |
| totalFat           | Decimal    | Total fat consumed               |

---

# 3. Relationships

```text
NutritionGoal

DailyNutrition

        ▲
        │
Generated From
        │
        ▼
Meal
```

### Relationship Summary

| Source | Relationship | Target         |
| ------ | ------------ | -------------- |
| Meal   | generates    | DailyNutrition |

---

# 4. Ownership

The Nutrition domain owns:

- NutritionGoal
- DailyNutrition

Meal data is consumed from the Food & Meal Tracking domain.

---

# 5. Business Rules

- Every user shall have one active NutritionGoal.
- DailyNutrition shall represent the nutritional totals for a single calendar day.
- DailyNutrition shall be generated from recorded Meals.
- DailyNutrition shall never be edited directly.
- Whenever a Meal is created, updated, or deleted, the corresponding DailyNutrition shall be recalculated.
- Remaining calories and remaining macronutrients are derived from DailyNutrition and NutritionGoal and shall not be persisted.

---

# 6. Consumers

| Domain            | Usage                                            |
| ----------------- | ------------------------------------------------ |
| Dashboard         | Displays daily calorie and macro progress        |
| Analytics         | Calculates nutritional trends and goal adherence |
| AI Coach (Future) | Generates personalized dietary recommendations   |

---

# 7. Out of Scope

The following concepts are intentionally excluded from the Nutrition domain.

- Meal logging
- Food catalog management
- Recipes
- Custom foods
- Micronutrient tracking

These concerns belong to the Food & Meal Tracking domain or future modules.

---

# 8. Future Enhancements

The current model is intentionally designed to support future expansion.

Potential future enhancements include:

- Weekly nutrition summaries
- Monthly nutrition summaries
- Nutrition phases (Cut, Bulk, Maintenance)
- Goal history
- Dynamic calorie targets
- Micronutrient goals
- AI-generated nutrition plans
