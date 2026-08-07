# Food & Meal Tracking Database Design

---

# 1. Purpose

The Food & Meal Tracking module is responsible for storing the application's food catalog, reusable meal templates, and historical meals consumed by users.

The Food collection serves as a reusable catalog of nutritional information.

MealTemplates allow users to create reusable meals that can be logged repeatedly.

Meals represent immutable historical records of food consumed, while MealItems store nutritional snapshots to preserve historical accuracy even if the Food catalog changes.

---

# 2. Collections

The module contains the following MongoDB collections.

- Food
- MealTemplate
- Meal

The following embedded documents are used:

- MealTemplateItem
- MealItem

---

## User Ownership

All MealTemplates and Meals contain a `userId` reference to the User module.

This establishes ownership while allowing the Food & Meal Tracking module to remain an independent bounded context.

---

# 3. Collection Schemas

## Food

```javascript
{
    _id: ObjectId,

    externalId: String,

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

## MealTemplate

```javascript
{
    _id: ObjectId,

    userId: ObjectId,

    name: String,

    mealItems: [
        {
            _id: ObjectId,

            foodId: ObjectId,

            quantity: Number,

            servingUnit: ServingUnit
        }
    ],

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

    mealTemplateId: ObjectId,

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

The MealTemplate aggregate owns its MealTemplateItems.

```text
MealTemplate
│
└── MealTemplateItem[]
```

The Meal aggregate owns its MealItems.

```text
Meal
│
└── MealItem[]
```

Both embedded document types exist only within their parent aggregate and are always created, updated, and retrieved together.

---

# 5. References

MealTemplates and Meals reference the Food catalog.

```text
MealTemplate
│
└── MealTemplateItem
        │
        └── foodId ─────► Food
```

```text
Meal
│
├── mealTemplateId ─────► MealTemplate (Optional)
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

## Reusable Meal Templates

MealTemplates represent reusable meals that users can log repeatedly.

They store only food references and quantities.

Nutritional values are intentionally not stored because they are recalculated whenever a Meal is created.

---

## Immutable Meal History

Meals represent historical events.

Once recorded, nutritional values within MealItems remain unchanged even if the Food catalog is updated.

---

## Nutritional Snapshots

Each MealItem stores the nutritional values calculated at the time the meal was recorded.

This preserves historical accuracy and prevents changes in the Food catalog from affecting historical meals.

---

## Food Catalog

The Food collection stores reusable food definitions imported from external food providers.

Users reference foods when creating MealTemplates and logging Meals but do not modify the system catalog during Phase 1.

---

## Embedded MealTemplateItems

MealTemplateItems are embedded because they:

- Never exist independently
- Are always retrieved with their MealTemplate
- Are always persisted together with their MealTemplate

---

## Embedded MealItems

MealItems are embedded because they:

- Never exist independently
- Are always retrieved with their Meal
- Are always persisted together with their Meal

---

## Food References

MealTemplateItems and MealItems reference Foods by ObjectId to maintain traceability to the original food catalog entry.

---

## Soft Deactivation

Foods are never physically deleted.

The `isActive` field allows foods to be hidden from future searches while preserving historical references.

---

# 9. Sample Documents

## Food

```javascript
{
    _id: ObjectId("..."),

    externalId: "168462",

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

## MealTemplate

```javascript
{
    _id: ObjectId("..."),

    userId: ObjectId("..."),

    name: "Chicken & Rice",

    mealItems: [
        {
            _id: ObjectId(),

            foodId: ObjectId(),

            quantity: 200,

            servingUnit: "GRAM"
        },
        {
            _id: ObjectId(),

            foodId: ObjectId(),

            quantity: 150,

            servingUnit: "GRAM"
        }
    ],

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

    mealTemplateId: ObjectId("..."),

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
- Favorite meals
- AI meal parsing
