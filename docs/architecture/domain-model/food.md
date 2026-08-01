# Nutrition Domain Model

---

# 1. Purpose

The Nutrition domain is responsible for managing the food catalog and recording meals consumed by users.

It references foods from the Food catalog while managing meal-specific information such as quantity, serving units, and nutritional snapshots.

The Nutrition domain does not own food definitions.

---

# 2. Entities

## Food

Represents a food item available within the application.

### Attributes

| Attribute     | Type       | Description                             |
| ------------- | ---------- | --------------------------------------- |
| id            | Identifier | Unique identifier                       |
| name          | String     | Food name                               |
| calories      | Decimal    | Calories for the reference serving      |
| protein       | Decimal    | Protein for the reference serving       |
| carbohydrates | Decimal    | Carbohydrates for the reference serving |
| fat           | Decimal    | Fat for the reference serving           |

---

## Meal

Represents a meal consumed by the user.

### Attributes

| Attribute          | Type           | Description                                       |
| ------------------ | -------------- | ------------------------------------------------- |
| id                 | Identifier     | Unique identifier                                 |
| name               | String         | Meal name (Breakfast, Lunch, Dinner, Snack, etc.) |
| consumedAt         | DateTime       | Date and time the meal was consumed               |
| mealItems          | List<MealItem> | Foods included in the meal                        |
| totalCalories      | Decimal        | Total calories for the meal                       |
| totalProtein       | Decimal        | Total protein for the meal                        |
| totalCarbohydrates | Decimal        | Total carbohydrates for the meal                  |
| totalFat           | Decimal        | Total fat for the meal                            |

---

## MealItem

Represents a food entry within a meal.

### Attributes

| Attribute     | Type        | Description                            |
| ------------- | ----------- | -------------------------------------- |
| id            | Identifier  | Unique identifier                      |
| food          | Food        | Reference to the Food catalog          |
| quantity      | Decimal     | Quantity consumed                      |
| servingUnit   | ServingUnit | Unit of measurement used               |
| calories      | Decimal     | Calories contributed by this food      |
| protein       | Decimal     | Protein contributed by this food       |
| carbohydrates | Decimal     | Carbohydrates contributed by this food |
| fat           | Decimal     | Fat contributed by this food           |

---

# 3. Supporting Value Objects / Enums

## ServingUnit

Represents the unit used to record a food quantity.

Example values:

- Gram
- Milliliter
- Serving
- Piece
- Scoop
- Tablespoon
- Teaspoon

---

# 4. Relationships

```text
Meal
│
└── contains (1..*)
    │
    ▼
MealItem
│
└── references (1)
    │
    ▼
Food
```

### Relationship Summary

| Source   | Relationship | Target   |
| -------- | ------------ | -------- |
| Meal     | contains     | MealItem |
| MealItem | references   | Food     |

---

# 5. Ownership

The Nutrition domain owns:

- Meal
- MealItem

The Food entity is referenced from the Nutrition domain but is not owned by it.

---

# 6. Business Rules

- Every Meal shall contain one or more MealItems.
- Every MealItem shall reference exactly one Food.
- A Meal shall not contain duplicate Food entries.
- Quantity shall be recorded using an appropriate ServingUnit.
- Meal nutrition values shall be stored as a snapshot at the time the meal is recorded.
- Changes to the Food catalog shall not modify previously recorded meals.
- Historical Meals are immutable once recorded.

---

# 7. Consumers

| Domain            | Usage                                                      |
| ----------------- | ---------------------------------------------------------- |
| Analytics         | Calculates calorie, protein, carbohydrate, and fat trends  |
| AI Coach (Future) | Generates dietary recommendations and nutritional insights |

---

# 8. Out of Scope

The following concepts are intentionally excluded from the Nutrition domain.

- Custom foods
- Recipes
- Daily nutrition summaries
- Micronutrient tracking
- Meal planning

These concepts may be introduced in future phases.

---

# 9. Future Enhancements

The current model is intentionally designed to support future expansion.

Potential future enhancements include:

- Custom foods
- Recipes
- Barcode scanning
- Micronutrient tracking
- Fiber, sugar, and sodium tracking
- Meal templates
- Favorite meals
- AI meal parsing
- Daily nutrition aggregation
