# Hide/Show Tests Feature - Implementation Summary

## Overview
Added functionality for admins to hide or show tests from students. Hidden tests remain in the database but are not visible to students in their test list.

## Backend Changes

### 1. **Test Model** (`backend/models/Test.js`)
- Added `isHidden` field to the test schema
  - Type: Boolean
  - Default: false
  - Purpose: Controls whether a test is visible to students

### 2. **Test Controller** (`backend/controllers/testController.js`)
- **Modified `getAllTestsWithStatus`**: Now filters out hidden tests for students
  - Only returns tests where `isHidden: false`
  - Students cannot see or access hidden tests
  
- **Added `toggleTestVisibility`**: New function for admins to toggle test visibility
  - Toggles the `isHidden` field between true/false
  - Returns updated test with visibility status
  - Admin-only endpoint

### 3. **Routes** (`backend/routes/test.js`)
- Added new route: `PATCH /api/v1/test/:id/toggle-visibility`
  - Protected route (requires authentication)
  - Admin-only access
  - Toggles test visibility

## Frontend Changes

### **AdminTestList Component** (`frontend/src/components/AdminTestList.jsx`)

#### New Features:
1. **Visibility Status Badge**
   - Shows "Visible" (green) or "Hidden" (gray) badge next to each test name
   - Provides quick visual feedback on test visibility status

2. **Toggle Visibility Button**
   - Eye icon (👁️) for visible tests
   - EyeOff icon (👁️‍🗨️) for hidden tests
   - Click to toggle between hidden/visible states
   - Positioned before the Preview button

3. **New Handler Function**
   - `handleToggleVisibility(id)`: Calls the API to toggle visibility
   - Updates local state optimistically for instant UI feedback
   - Shows success/error messages

#### UI Layout:
```
[Test Name] [Visible/Hidden Badge] | [👁️ Toggle] [▶️ Preview] [✏️ Edit] [🗑️ Delete]
```

## How It Works

### For Admins:
1. Navigate to Test Management page
2. See all tests with their visibility status
3. Click the Eye/EyeOff icon to toggle visibility
4. Hidden tests show a gray "Hidden" badge
5. Visible tests show a green "Visible" badge

### For Students:
1. Only see tests that are NOT hidden (`isHidden: false`)
2. Cannot access hidden tests even with direct URL
3. Hidden tests are completely invisible to students

## API Endpoints

### Toggle Visibility
```
PATCH /api/v1/test/:id/toggle-visibility
Headers: Authorization: Bearer <token>
Response: {
  message: "Test hidden successfully" | "Test shown successfully",
  test: {
    _id: string,
    testname: string,
    isHidden: boolean
  }
}
```

## Database Schema Update
```javascript
{
  testname: String,
  sections: [SectionSchema],
  isHidden: Boolean (default: false)  // NEW FIELD
}
```

## Benefits
- ✅ Admins can prepare tests in advance without students seeing them
- ✅ Easy to hide/show tests without deleting them
- ✅ Tests remain in database with all submissions intact
- ✅ Simple toggle interface - one click to change visibility
- ✅ Clear visual indicators of test status
- ✅ No data loss - hiding is reversible

## Testing Checklist
- [ ] Admin can see all tests (hidden and visible)
- [ ] Admin can toggle test visibility
- [ ] Students only see visible tests
- [ ] Hidden tests don't appear in student test list
- [ ] Visibility badge updates correctly
- [ ] Success messages appear on toggle
- [ ] Existing test submissions are not affected
