# Indexing Strategy

---

# 1. Purpose

This document defines the indexing strategy for the Personal OS database.

Indexes are created only for queries that are expected to occur frequently or enforce important business constraints. Unnecessary indexes are avoided to reduce storage overhead and write latency.

As application usage evolves, indexes should be reviewed and optimized based on actual query performance.

---

# 2. General Principles

The following principles apply to all collections.

- Index only frequently executed queries.
- Prefer compound indexes when queries commonly filter by multiple fields.
- Every unique business constraint should be enforced using a unique index.
- Avoid indexing embedded documents unless a clear query requirement exists.
- Revisit indexing strategy as application usage grows.

---

# 3. Collection Indexes

| Collection         | Index                   | Type            | Purpose                               |
| ------------------ | ----------------------- | --------------- | ------------------------------------- |
| User               | `_id`                   | Primary         | User lookup                           |
| AuthAccount        | `_id`                   | Primary         | Authentication account lookup         |
| AuthAccount        | `email`                 | Unique          | Fast login and uniqueness enforcement |
| AuthAccount        | `userId`                | Unique          | One authentication account per user   |
| RefreshToken       | `_id`                   | Primary         | Refresh token lookup                  |
| RefreshToken       | `authAccountId`         | Standard        | Retrieve active sessions              |
| RefreshToken       | `tokenHash`             | Unique          | Validate refresh tokens securely      |
| Exercise           | `_id`                   | Primary         | Exercise lookup                       |
| Exercise           | `name`                  | Standard        | Exercise search                       |
| MuscleGroup        | `_id`                   | Primary         | Muscle group lookup                   |
| MuscleGroup        | `name`                  | Unique          | Prevent duplicate muscle groups       |
| Equipment          | `_id`                   | Primary         | Equipment lookup                      |
| Equipment          | `name`                  | Unique          | Prevent duplicate equipment           |
| WorkoutTemplate    | `_id`                   | Primary         | Template lookup                       |
| WorkoutTemplate    | `userId`                | Standard        | Retrieve templates for a user         |
| WorkoutSession     | `_id`                   | Primary         | Session lookup                        |
| WorkoutSession     | `(userId, completedAt)` | Compound        | Workout history                       |
| WeightLog          | `_id`                   | Primary         | Weight log lookup                     |
| WeightLog          | `(userId, measuredAt)`  | Compound        | Weight history                        |
| Food               | `_id`                   | Primary         | Food lookup                           |
| Food               | `name`                  | Standard        | Food search                           |
| Meal               | `_id`                   | Primary         | Meal lookup                           |
| Meal               | `(userId, consumedAt)`  | Compound        | Meal history                          |
| NutritionGoal      | `_id`                   | Primary         | Goal lookup                           |
| NutritionGoal      | `userId`                | Unique          | One nutrition goal per user           |
| DailyNutrition     | `_id`                   | Primary         | Daily summary lookup                  |
| DailyNutrition     | `(userId, date)`        | Unique Compound | One summary per user per day          |
| WaterGoal          | `_id`                   | Primary         | Goal lookup                           |
| WaterGoal          | `userId`                | Unique          | One water goal per user               |
| WaterLog           | `_id`                   | Primary         | Water log lookup                      |
| WaterLog           | `(userId, consumedAt)`  | Compound        | Hydration history                     |
| Supplement         | `_id`                   | Primary         | Supplement lookup                     |
| Supplement         | `name`                  | Standard        | Supplement search                     |
| SupplementSchedule | `_id`                   | Primary         | Schedule lookup                       |
| SupplementSchedule | `userId`                | Standard        | Retrieve schedules for a user         |
| SupplementLog      | `_id`                   | Primary         | Supplement log lookup                 |
| SupplementLog      | `(userId, takenAt)`     | Compound        | Supplement history                    |
