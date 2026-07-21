# 6. Use Cases

---

# 6.1 Purpose

This document defines the primary use cases for the Personal OS platform.

Use cases describe how users interact with the system to accomplish specific goals. They identify the actors involved, preconditions, normal flow, alternative flows, and postconditions for each major business process.

---

# 6.2 Primary Actor

**User**

The primary actor is an authenticated user of the Personal OS platform.

---

# 6.3 Authentication

## UC-AUTH-001 — Register Account

**Primary Actor:** User

**Preconditions:**

- User is not registered.

**Main Flow:**

1. User opens the registration screen.
2. User enters the required information.
3. User submits the registration form.
4. System validates the input.
5. System creates the account.
6. System confirms successful registration.

**Alternative Flows:**

- Email already exists.
- Validation fails.

**Postconditions:**

- User account is created.

---

## UC-AUTH-002 — Sign In

**Primary Actor:** User

**Preconditions:**

- User account exists.

**Main Flow:**

1. User enters credentials.
2. System validates credentials.
3. System authenticates the user.
4. System issues authentication tokens.
5. User is redirected to the application.

**Alternative Flows:**

- Invalid credentials.
- Account disabled.

**Postconditions:**

- User is authenticated.

---

# 6.4 User Profile

## UC-PROFILE-001 — Update Profile

**Primary Actor:** User

**Preconditions:**

- User is authenticated.

**Main Flow:**

1. User opens profile settings.
2. User edits profile information.
3. User saves changes.
4. System validates the data.
5. System updates the profile.

**Alternative Flows:**

- Validation fails.

**Postconditions:**

- Profile information is updated.

---

# 6.5 Exercise Library

## UC-EX-001 — Search Exercise

**Primary Actor:** User

**Preconditions:**

- User is authenticated.

**Main Flow:**

1. User opens the exercise library.
2. User enters search criteria or filters.
3. System retrieves matching exercises.
4. System displays the results.

**Alternative Flows:**

- No matching exercises found.

**Postconditions:**

- Matching exercises are displayed.

---

# 6.6 Workout Tracking

## UC-WORKOUT-001 — Create Workout Template

**Primary Actor:** User

**Preconditions:**

- User is authenticated.

**Main Flow:**

1. User creates a new workout template.
2. User adds exercises.
3. User configures sets and exercise order.
4. User saves the template.

**Alternative Flows:**

- Required information is missing.

**Postconditions:**

- Workout template is stored.

---

## UC-WORKOUT-002 — Start Workout Session

**Primary Actor:** User

**Preconditions:**

- Workout template exists.

**Main Flow:**

1. User selects a workout template.
2. User starts the workout.
3. System creates a workout session.
4. User performs exercises.
5. User logs completed sets.
6. User completes the workout.
7. System saves the workout history.

**Alternative Flows:**

- User pauses the workout.
- User modifies exercises during the workout.
- User cancels the workout.

**Postconditions:**

- Workout session is recorded.

---

## UC-WORKOUT-003 — View Workout History

**Primary Actor:** User

**Preconditions:**

- Previous workout sessions exist.

**Main Flow:**

1. User opens workout history.
2. System displays completed workouts.
3. User selects a workout.
4. System displays workout details.

**Alternative Flows:**

- No workout history available.

**Postconditions:**

- Workout details are displayed.

---

# 6.7 Weight Tracking

## UC-WEIGHT-001 — Log Weight

**Primary Actor:** User

**Preconditions:**

- User is authenticated.

**Main Flow:**

1. User enters body weight.
2. User saves the entry.
3. System validates the value.
4. System stores the record.

**Alternative Flows:**

- Invalid weight entered.

**Postconditions:**

- Weight record is stored.

---

# 6.8 Nutrition

## UC-NUTRITION-001 — Log Meal

**Primary Actor:** User

**Preconditions:**

- Food database is available.

**Main Flow:**

1. User creates a meal.
2. User searches for foods.
3. User selects food items.
4. User enters serving quantities.
5. System calculates nutritional values.
6. System saves the meal.

**Alternative Flows:**

- Food not found.
- User creates a custom food.

**Postconditions:**

- Meal is recorded.

---

## UC-NUTRITION-002 — View Daily Nutrition

**Primary Actor:** User

**Preconditions:**

- Meals have been logged.

**Main Flow:**

1. User opens the nutrition dashboard.
2. System calculates daily totals.
3. System displays calories and macronutrients.
4. User compares progress with nutrition goals.

**Alternative Flows:**

- No meals logged.

**Postconditions:**

- Daily nutrition summary is displayed.

---

# 6.9 Water Tracking

## UC-WATER-001 — Log Water Intake

**Primary Actor:** User

**Preconditions:**

- User is authenticated.

**Main Flow:**

1. User selects a predefined container or enters a custom amount.
2. User confirms the intake.
3. System records the event.
4. System recalculates the daily total.
5. System updates hydration progress.

**Alternative Flows:**

- Invalid intake amount.

**Postconditions:**

- Water intake is recorded.

---

# 6.10 Supplement Tracking

## UC-SUP-001 — Record Supplement Intake

**Primary Actor:** User

**Preconditions:**

- Supplement exists.

**Main Flow:**

1. User selects a supplement.
2. User records intake.
3. User optionally edits dosage or notes.
4. System stores the intake record.
5. System updates adherence statistics.

**Alternative Flows:**

- Supplement not found.

**Postconditions:**

- Supplement intake is recorded.

---

# 6.11 General System

## UC-SYS-001 — View Dashboard

**Primary Actor:** User

**Preconditions:**

- User is authenticated.

**Main Flow:**

1. User opens the application.
2. System retrieves today's data.
3. System displays workout, nutrition, water, supplement, and weight summaries.
4. User navigates to the desired module.

**Alternative Flows:**

- No data exists for the current day.

**Postconditions:**

- Dashboard is displayed.

---

# 6.12 Use Case Relationships

| Use Case         | Related Functional Module      |
| ---------------- | ------------------------------ |
| UC-AUTH-001      | Authentication                 |
| UC-AUTH-002      | Authentication                 |
| UC-PROFILE-001   | User Profile                   |
| UC-EX-001        | Exercise Library               |
| UC-WORKOUT-001   | Workout Templates              |
| UC-WORKOUT-002   | Workout Sessions & Set Logging |
| UC-WORKOUT-003   | Workout History                |
| UC-WEIGHT-001    | Weight Tracking                |
| UC-NUTRITION-001 | Food & Meal Management         |
| UC-NUTRITION-002 | Nutrition Tracking             |
| UC-WATER-001     | Water Tracking                 |
| UC-SUP-001       | Supplement Tracking            |
| UC-SYS-001       | Dashboard                      |

---

# 6.13 Acceptance Criteria

The Use Cases document shall be considered complete when:

- Every Phase 1 module is represented by at least one primary use case.
- Each use case identifies the primary actor.
- Each use case defines preconditions, normal flow, alternative flows, and postconditions.
- The documented use cases are consistent with the Functional Requirements and User Stories.
- The use cases provide sufficient detail to support UI design, API design, and test case development.
