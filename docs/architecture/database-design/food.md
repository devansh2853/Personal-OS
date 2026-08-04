# Food & Meal Tracking Database Design

---

# 1. Purpose

The Food & Meal Tracking module is responsible for storing the application's food catalog and recording meals consumed by users.

The Food collection serves as a reusable catalog of nutritional information, while Meal documents represent immutable historical records of food consumed.

MealItems store nutritional snapshots to preserve historical accuracy even if the Food catalog changes.

---

# 2. Collections

The module contains the following MongoDB collections.

- Food
- Meal

MealItem is an embedded document because it only exists within a Meal.

---

## User Ownership

All WorkoutTemplates and WorkoutSessions contain a `userId` reference to the User module.

This establishes ownership while allowing the Workout module to remain an independent bounded context.

# 3. Collection Schemas

## Food

```javascript
{
    _id: ObjectId,

    name: String,

    referenceQuantity: Number,

    referenceServingUnit: ServingUnit,

    calories: Number,

    protein: Number,

    carbohydrates: Number,

    fat: Number,

    isActive: Boolean,

    createdAt: Date,

    updatedAt: Date
}
```

---

## Meal

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    name: String,

    consumedAt: Date,

    mealItems: [
        {
            _id: ObjectId,

            foodId: ObjectId,

            quantity: Number,

            servingUnit: ServingUnit,

            calories: Number,

            protein: Number,

            carbohydrates: Number,

            fat: Number
        }
    ],

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

The Meal aggregate owns its MealItems.

```text
Meal
│
└── MealItem[]
```

MealItems never exist independently and are always created, updated, and retrieved with their parent Meal.

---

# 5. References

Meals reference the Food catalog.

```text
Meal
│
└── MealItem
        │
        └── foodId ─────► Food
```

The Food catalog remains the canonical source of food definitions.

---

# 6. Supporting Enums

## ServingUnit

Example values:

- GRAM
- MILLILITER
- SERVING
- PIECE
- SCOOP
- TABLESPOON
- TEASPOON

---

# 7. Derived Data

The following values are derived and therefore not stored separately.

- Daily nutrition totals
- Weekly nutrition summaries
- Monthly nutrition summaries
- Nutritional trends

These values are calculated from historical Meal documents or materialized by the Nutrition module.

---

# 8. Design Decisions

## Immutable Meal History

Meals represent historical events.

Once recorded, nutritional values within MealItems remain unchanged even if the Food catalog is updated.

---

## Nutritional Snapshots

Each MealItem stores the nutritional values calculated at the time the meal was recorded.

This preserves historical accuracy and prevents changes in external food databases from affecting previously logged meals.

---

## Food Catalog

The Food collection stores reusable food definitions imported from external food providers.

Users reference foods when logging meals but do not modify the system catalog during Phase 1.

---

## Embedded MealItems

MealItems are embedded because they:

- Never exist independently
- Are always retrieved with a Meal
- Are always persisted together with a Meal

---

## Food References

MealItems reference Foods by ObjectId to maintain traceability to the original food catalog entry.

---

## Soft Deactivation

Foods are never physically deleted.

The `isActive` field allows foods to be hidden from future searches while preserving historical meal references.

---

# 9. Sample Documents

## Food

```javascript
{
    _id: ObjectId("..."),

    name: "Cooked White Rice",

    referenceQuantity: 100,

    referenceServingUnit: "GRAM",

    calories: 130,

    protein: 2.7,

    carbohydrates: 28.2,

    fat: 0.3,

    isActive: true,

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

## Meal

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    name: "Lunch",

    consumedAt: ISODate(...),

    mealItems: [
        {
            _id: ObjectId(),

            foodId: ObjectId(),

            quantity: 200,

            servingUnit: "GRAM",

            calories: 260,

            protein: 5.4,

            carbohydrates: 56.4,

            fat: 0.6
        },
        {
            _id: ObjectId(),

            foodId: ObjectId(),

            quantity: 150,

            servingUnit: "GRAM",

            calories: 248,

            protein: 46.5,

            carbohydrates: 0,

            fat: 5.4
        }
    ],

    totalCalories: 508,

    totalProtein: 51.9,

    totalCarbohydrates: 56.4,

    totalFat: 6.0,

    createdAt: ISODate(...),

    updatedAt: ISODate(...)
}
```

---

# 10. Future Enhancements

The current design supports future expansion without structural changes.

Potential future enhancements include:

- Custom foods
- Recipes
- Barcode scanning
- Micronutrient tracking
- Fiber, sugar, and sodium tracking
- Meal templates
- Favorite meals
- AI meal parsing
