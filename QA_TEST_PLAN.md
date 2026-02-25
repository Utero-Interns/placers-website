# PLACERS WEBSITE - COMPREHENSIVE QA TEST PLAN

**Version:** 1.0  
**Date:** February 16, 2026  
**Author:** QA Team  
**Project:** Placers Billboard Advertising Marketplace  
**Environment:** Development/Staging

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Test Environment Setup](#2-test-environment-setup)
3. [Test Data & Credentials](#3-test-data--credentials)
4. [Public Features Testing](#4-public-features-testing)
5. [Buyer Features Testing](#5-buyer-features-testing)
6. [Seller Features Testing](#6-seller-features-testing)
7. [Admin Features Testing](#7-admin-features-testing)
8. [Integration Testing](#8-integration-testing)
9. [Cross-Cutting Concerns](#9-cross-cutting-concerns)
10. [Regression & Edge Cases](#10-regression--edge-cases)
11. [Test Summary Matrix](#11-test-summary-matrix)

---

## 1. INTRODUCTION

### 1.1 Purpose

This document provides a comprehensive test plan for the Placers billboard advertising marketplace website. It covers functional testing, integration testing, UI/UX validation, and API verification across all user roles and features.

### 1.2 Scope

**In Scope:**
- ✅ All public pages and features
- ✅ Authentication and authorization flows
- ✅ BUYER role features (booking, bookmarks, order history)
- ✅ SELLER role features (registration, dashboard, billboard management)
- ✅ ADMIN role features (full CRUD on all entities)
- ✅ API endpoint validation
- ✅ Form validation and error handling
- ✅ File uploads and media handling
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Loading states and error boundaries

**Out of Scope:**
- ❌ Performance/load testing
- ❌ Security penetration testing
- ❌ Browser compatibility (assumes modern Chrome/Firefox/Safari)
- ❌ Automated test scripts (manual testing focus)
- ❌ Email notification testing (backend concern)

### 1.3 Testing Approach

- **Manual Testing**: All test cases executed manually
- **Black Box Testing**: UI/UX and functional validation
- **White Box Testing**: API calls, data validation, technical verification
- **Exploratory Testing**: Edge cases and negative scenarios
- **Regression Testing**: Re-test after fixes

### 1.4 Test Priorities

| Priority | Description | Examples |
|----------|-------------|----------|
| **CRITICAL** | Core business functions, blocks users | Login, Booking, Payment |
| **HIGH** | Important features, major impact | Search, Filters, Dashboard |
| **MEDIUM** | Secondary features, moderate impact | Bookmarks, Profile edit |
| **LOW** | Nice-to-have, minimal impact | Share, Follow button |

---

## 2. TEST ENVIRONMENT SETUP

### 2.1 Environment Requirements

```
Frontend URL: http://localhost:3000
Backend API URL: [Configure in .env.local]
Database: PostgreSQL (via backend)
Node.js: v18+
Next.js: 15.3.8
```

### 2.2 Browser Requirements

- **Primary**: Chrome (latest)
- **Secondary**: Firefox (latest), Safari (latest)
- **Mobile**: Chrome Mobile, Safari iOS

### 2.3 Screen Resolutions to Test

- Desktop: 1920x1080, 1366x768
- Tablet: 768x1024 (iPad)
- Mobile: 375x667 (iPhone), 360x640 (Android)

### 2.4 Test Tools

- **Browser DevTools**: Network tab for API inspection
- **Postman**: API endpoint verification
- **Screenshot Tool**: For documentation
- **Excel/Sheets**: Test result tracking

---

## 3. TEST DATA & CREDENTIALS

### 3.1 Test User Accounts

Create these test accounts before testing:

| Role | Username | Email | Phone | Password |
|------|----------|-------|-------|----------|
| BUYER | buyer_test | buyer@test.com | +6281234567890 | Test@123 |
| SELLER | seller_test | seller@test.com | +6281234567891 | Test@123 |
| ADMIN | admin_test | admin@test.com | +6281234567892 | Test@123 |

### 3.2 Test Billboard Data

Prepare at least 3 test billboards with:
- Different categories (Billboard, Videotron, Neon Box)
- Different locations (Jakarta, Bandung, Surabaya)
- Different statuses (Available, Unavailable)
- Different prices (100k, 500k, 1M)
- Multiple images (3-5 per billboard)

### 3.3 Sample Form Data

**Seller Registration:**
```
Full Name: Test Seller Indonesia
KTP: 1234567890123456
NPWP: 123456789012345
Company Name: PT Test Billboard Indonesia
KTP Address: Jl. Test No. 123, Jakarta Selatan, DKI Jakarta
Office Address: Jl. Office Test No. 456, Jakarta Pusat, DKI Jakarta
```

**Billboard Creation:**
```
Category: Billboard
Province: DKI Jakarta
City: Jakarta Selatan
Location: Jl. Sudirman No. 789
Size: 4m x 6m
Orientation: Horizontal
Display: Single Sided
Lighting: Frontlit
Rent Price: 500000
```

---

## 4. PUBLIC FEATURES TESTING

### 4.1 LANDING PAGE TESTS

#### Test Case: PUB-LP-001 - Verify Landing Page Loads Successfully
**Priority:** CRITICAL  
**Feature:** Landing Page  
**Preconditions:** User not logged in, access homepage URL

**Test Steps:**
1. Open browser and navigate to `http://localhost:3000/`
2. Observe page loading behavior
3. Wait for all content to render

**Expected Results:**
- ✅ Page loads within 3 seconds
- ✅ Logo displayed in navbar
- ✅ Hero section visible with main CTA button
- ✅ All sections load: About Us, Values, Gallery, Investor, FAQ
- ✅ Footer displayed with contact information
- ✅ No console errors in DevTools
- ✅ Loading animation (if any) completes

**API Validation:**
- No API calls expected on initial load (static page)

**Screenshot Markers:**
- `[SCREENSHOT: Landing page full view desktop]`
- `[SCREENSHOT: Landing page mobile view]`

**Pass/Fail Criteria:**
- PASS: All sections render correctly, no errors
- FAIL: Missing sections, console errors, broken images

---

#### Test Case: PUB-LP-002 - Verify Navigation Links
**Priority:** HIGH  
**Feature:** Landing Page Navigation  
**Preconditions:** Landing page loaded

**Test Steps:**
1. Click "Login" button in navbar
2. Verify redirect to login page
3. Navigate back to landing page
4. Click "Register" button
5. Verify redirect to register page
6. Navigate back to landing page
7. Click "Explore Billboards" or main CTA
8. Verify redirect to homepage

**Expected Results:**
- ✅ Login button redirects to `/login`
- ✅ Register button redirects to `/register`
- ✅ CTA button redirects to `/homepage`
- ✅ Browser back button works correctly
- ✅ Navigation is smooth without errors

**Screenshot Markers:**
- `[SCREENSHOT: Navbar with login/register buttons]`

---

#### Test Case: PUB-LP-003 - Verify FAQ Accordion Functionality
**Priority:** MEDIUM  
**Feature:** FAQ Section  
**Preconditions:** Landing page loaded, scroll to FAQ section

**Test Steps:**
1. Scroll to FAQ section
2. Click on first FAQ question
3. Observe answer expansion
4. Click on second FAQ question
5. Observe behavior (first collapse, second expand)
6. Click same question again to collapse

**Expected Results:**
- ✅ Clicking question expands answer smoothly
- ✅ Clicking another question collapses previous (accordion behavior)
- ✅ Clicking same question again collapses it
- ✅ Expand/collapse animation is smooth
- ✅ All FAQ items functional

**Screenshot Markers:**
- `[SCREENSHOT: FAQ section with expanded answer]`

---

### 4.2 HOMEPAGE & BILLBOARD BROWSING TESTS

#### Test Case: PUB-HP-001 - Load Homepage with Billboard Grid
**Priority:** CRITICAL  
**Feature:** Homepage Billboard Display  
**Preconditions:** None

**Test Steps:**
1. Navigate to `/homepage`
2. Wait for page to load
3. Observe billboard grid rendering
4. Count number of billboards displayed
5. Check pagination controls

**Expected Results:**
- ✅ Loading screen appears briefly with animated logo
- ✅ Billboard grid renders with cards
- ✅ Maximum 8 billboards per page displayed
- ✅ Each card shows: image, title, location, price, rating, seller info
- ✅ Pagination controls visible if >8 billboards
- ✅ "No billboards found" message if empty

**API Validation:**
```
Request: GET /api/billboard/all
Expected Response: 
{
  "status": true,
  "data": [
    {
      "id": "string",
      "location": "string",
      "cityName": "string",
      "provinceName": "string",
      "price": "number",
      "status": "Available" | "Unavailable",
      "category": { "name": "string" },
      "image": [{ "url": "string" }],
      "owner": { "user": { "username": "string" } }
    }
  ]
}
```

**Screenshot Markers:**
- `[SCREENSHOT: Homepage loading screen]`
- `[SCREENSHOT: Homepage billboard grid - desktop]`
- `[SCREENSHOT: Homepage billboard grid - mobile]`

**Pass/Fail Criteria:**
- PASS: Billboards load, grid displays correctly, API returns data
- FAIL: API errors, empty grid with data, broken images

---

#### Test Case: PUB-HP-002 - Search Billboards by Location
**Priority:** HIGH  
**Feature:** Search Functionality  
**Preconditions:** Homepage loaded with billboards

**Test Steps:**
1. Locate search input field
2. Enter search term "Jakarta"
3. Observe real-time filtering
4. Verify filtered results
5. Clear search field
6. Verify all billboards return

**Expected Results:**
- ✅ Search input accepts text
- ✅ Filtering happens in real-time (client-side)
- ✅ Only billboards with "Jakarta" in location/city/province/category shown
- ✅ Case-insensitive search works
- ✅ Clearing search restores all billboards
- ✅ "No results" message if no match

**Test Data:**
| Search Term | Expected Match |
|-------------|----------------|
| Jakarta | Billboards in Jakarta |
| Bandung | Billboards in Bandung |
| Billboard | Billboards in Billboard category |
| XYZ123 | No results |

**Screenshot Markers:**
- `[SCREENSHOT: Search results for 'Jakarta']`
- `[SCREENSHOT: No results found message]`

---

#### Test Case: PUB-HP-003 - Filter Billboards by Status
**Priority:** HIGH  
**Feature:** Status Filter  
**Preconditions:** Homepage loaded

**Test Steps:**
1. Locate status dropdown filter
2. Verify default value is "Semua"
3. Select "Tersedia" (Available)
4. Observe filtered results
5. Verify all shown billboards are Available
6. Select "Tidak Tersedia" (Unavailable)
7. Verify all shown billboards are Unavailable
8. Select "Semua" again
9. Verify all billboards shown

**Expected Results:**
- ✅ Dropdown shows "Semua", "Tersedia", "Tidak Tersedia"
- ✅ Filter works instantly (client-side)
- ✅ Available filter shows only Available billboards
- ✅ Unavailable filter shows only Unavailable billboards
- ✅ Semua shows all billboards
- ✅ Pagination resets to page 1 when filter changes

**Screenshot Markers:**
- `[SCREENSHOT: Status filter dropdown open]`
- `[SCREENSHOT: Filtered results - Available only]`

---

#### Test Case: PUB-HP-004 - Pagination Navigation
**Priority:** HIGH  
**Feature:** Pagination  
**Preconditions:** Homepage loaded with >8 billboards

**Test Steps:**
1. Verify pagination controls visible
2. Note total pages displayed
3. Click "Next" button
4. Observe page 2 billboards load
5. Click page number "1"
6. Verify return to page 1
7. Click "Previous" from page 2
8. Verify navigation to page 1
9. Try clicking "Previous" on page 1 (should be disabled)

**Expected Results:**
- ✅ Pagination shows page numbers (1, 2, 3...)
- ✅ Current page highlighted
- ✅ "Previous" disabled on page 1
- ✅ "Next" disabled on last page
- ✅ Clicking page number navigates correctly
- ✅ Scroll position resets to top on page change
- ✅ URL updates with page parameter (optional)

**Screenshot Markers:**
- `[SCREENSHOT: Pagination controls]`
- `[SCREENSHOT: Page 2 with different billboards]`

---

#### Test Case: PUB-HP-005 - Billboard Card Click Navigation
**Priority:** CRITICAL  
**Feature:** Billboard Card Interaction  
**Preconditions:** Homepage loaded

**Test Steps:**
1. Click on first billboard card
2. Verify redirect to billboard detail page
3. Check URL format `/billboard-detail/[id]`
4. Verify correct billboard details loaded
5. Click browser back button
6. Verify return to homepage
7. Click different billboard card
8. Verify navigation to different detail page

**Expected Results:**
- ✅ Card is clickable (cursor changes to pointer)
- ✅ Navigates to `/billboard-detail/[billboard-id]`
- ✅ Correct billboard data displayed on detail page
- ✅ Back button returns to homepage
- ✅ Previous scroll position preserved (optional)

**Screenshot Markers:**
- `[SCREENSHOT: Billboard card hover state]`

---

### 4.3 BILLBOARD DETAIL PAGE TESTS

#### Test Case: PUB-BD-001 - Load Billboard Detail Page
**Priority:** CRITICAL  
**Feature:** Billboard Detail Display  
**Preconditions:** Valid billboard ID

**Test Steps:**
1. Navigate to `/billboard-detail/[valid-id]`
2. Wait for loading screen
3. Observe page rendering

**Expected Results:**
- ✅ Loading screen with animated logo appears
- ✅ Page loads within 2 seconds
- ✅ All sections render:
  - Image carousel/gallery
  - Billboard title and location
  - Price display
  - Specifications (size, orientation, display, lighting)
  - Seller profile card
  - Reviews/ratings section
  - Share and bookmark buttons
  - "Book Now" CTA button
- ✅ No console errors

**API Validation:**
```
Request: GET /api/billboard/{id}
Expected Response:
{
  "status": true,
  "data": {
    "id": "string",
    "location": "string",
    "cityName": "string",
    "provinceName": "string",
    "size": "string",
    "orientation": "string",
    "display": "string",
    "lighting": "string",
    "rentPrice": "number",
    "sellPrice": "number",
    "status": "Available",
    "category": { "name": "string" },
    "image": [{ "url": "string" }],
    "owner": {
      "user": {
        "username": "string",
        "profilePicture": "string"
      }
    },
    "transaction": [
      {
        "rating": {
          "rating": number,
          "comment": "string",
          "user": { "username": "string" }
        }
      }
    ]
  },
  "averageRating": number
}

Request: GET /api/bookmark/mybookmark
(If user logged in)
```

**Screenshot Markers:**
- `[SCREENSHOT: Billboard detail page full view]`
- `[SCREENSHOT: Billboard detail mobile view]`

---

#### Test Case: PUB-BD-002 - Image Carousel Navigation
**Priority:** HIGH  
**Feature:** Image Gallery  
**Preconditions:** Billboard detail page loaded with multiple images

**Test Steps:**
1. Observe image carousel with first image displayed
2. Click "Next" arrow
3. Verify second image displays
4. Click "Next" repeatedly to last image
5. Click "Previous" arrow
6. Verify navigation backwards
7. Click thumbnail (if available)
8. Verify large image updates
9. Try swipe gesture on mobile

**Expected Results:**
- ✅ First image shows by default
- ✅ Next/Previous arrows visible
- ✅ Arrows navigate through images
- ✅ Last image wraps to first (circular)
- ✅ Smooth transition animation
- ✅ Thumbnails highlight active image
- ✅ Swipe works on touch devices
- ✅ Image zoom feature (optional)

**Screenshot Markers:**
- `[SCREENSHOT: Image carousel with navigation arrows]`
- `[SCREENSHOT: Thumbnail gallery]`

---

#### Test Case: PUB-BD-003 - Share Billboard Functionality
**Priority:** MEDIUM  
**Feature:** Share Modal  
**Preconditions:** Billboard detail page loaded

**Test Steps:**
1. Click "Share" button
2. Observe modal opening
3. Check share options available
4. Click "Copy Link" option
5. Verify success message
6. Paste in notepad to verify URL copied
7. Close modal by clicking X or outside

**Expected Results:**
- ✅ Share button visible and clickable
- ✅ Modal opens with smooth animation
- ✅ Share options displayed (Copy Link, WhatsApp, Facebook, etc.)
- ✅ Copy Link copies current URL to clipboard
- ✅ Toast notification "Link copied!" appears
- ✅ Modal closes on X click or outside click
- ✅ Copied URL is correct billboard detail URL

**Screenshot Markers:**
- `[SCREENSHOT: Share modal open with options]`
- `[SCREENSHOT: Success toast notification]`

---

#### Test Case: PUB-BD-004 - Bookmark Billboard (Not Logged In)
**Priority:** HIGH  
**Feature:** Bookmark Button - Guest User  
**Preconditions:** User not logged in, billboard detail page open

**Test Steps:**
1. Click bookmark (heart) icon
2. Observe behavior

**Expected Results:**
- ✅ User redirected to `/login` page
- ✅ OR Modal appears asking to log in first
- ✅ Error toast "Please login to bookmark" (if applicable)
- ✅ Bookmark not saved

**Screenshot Markers:**
- `[SCREENSHOT: Login prompt for bookmark action]`

---

#### Test Case: PUB-BD-005 - Bookmark Billboard (Logged In)
**Priority:** HIGH  
**Feature:** Bookmark Toggle  
**Preconditions:** User logged in as BUYER, billboard detail page open

**Test Steps:**
1. Observe initial bookmark state (empty heart if not bookmarked)
2. Click bookmark icon
3. Observe icon change to filled heart
4. Observe success toast message
5. Refresh page
6. Verify bookmark state persists (filled heart)
7. Click bookmark icon again
8. Observe icon change to empty heart
9. Observe success toast "Bookmark removed"

**Expected Results:**
- ✅ Empty heart icon if not bookmarked
- ✅ Filled heart icon if bookmarked
- ✅ Click toggles state optimistically (instant UI update)
- ✅ API call in background to save/remove bookmark
- ✅ Success toast appears: "Ditambahkan ke bookmark" or "Bookmark dihapus"
- ✅ State persists after page refresh
- ✅ If API fails, state reverts + error toast

**API Validation:**
```
Add Bookmark:
Request: POST /api/bookmark/{billboardId}
Expected Response: { "status": true, "message": "Bookmark added" }

Remove Bookmark:
Request: DELETE /api/bookmark/{billboardId}
Expected Response: { "status": true, "message": "Bookmark removed" }
```

**Screenshot Markers:**
- `[SCREENSHOT: Bookmark icon - empty state]`
- `[SCREENSHOT: Bookmark icon - filled state]`
- `[SCREENSHOT: Success toast message]`

---

#### Test Case: PUB-BD-006 - Book Now Button (Not Logged In)
**Priority:** CRITICAL  
**Feature:** Book Now CTA  
**Preconditions:** User not logged in

**Test Steps:**
1. Click "Book Now" button
2. Observe behavior

**Expected Results:**
- ✅ User redirected to `/login`
- ✅ OR Login modal appears
- ✅ After login, user redirected to booking page

**Screenshot Markers:**
- `[SCREENSHOT: Book Now button]`

---

#### Test Case: PUB-BD-007 - Book Now Button (Logged In - Available Billboard)
**Priority:** CRITICAL  
**Feature:** Book Now CTA  
**Preconditions:** User logged in as BUYER, billboard status "Available"

**Test Steps:**
1. Click "Book Now" button
2. Observe navigation

**Expected Results:**
- ✅ Redirects to `/booking/[billboard-id]`
- ✅ Booking page loads with billboard information
- ✅ Multi-step form displayed

**Screenshot Markers:**
- `[SCREENSHOT: Booking page after clicking Book Now]`

---

#### Test Case: PUB-BD-008 - Book Now Button Disabled (Unavailable Billboard)
**Priority:** HIGH  
**Feature:** Book Now CTA  
**Preconditions:** Billboard status "Unavailable"

**Test Steps:**
1. Observe "Book Now" button state
2. Try to click button

**Expected Results:**
- ✅ Button is disabled (grayed out) OR
- ✅ Button shows "Not Available" text
- ✅ Clicking does nothing OR
- ✅ Toast message "This billboard is unavailable"

**Screenshot Markers:**
- `[SCREENSHOT: Book Now button - disabled state]`

---

#### Test Case: PUB-BD-009 - Seller Profile Card Click
**Priority:** MEDIUM  
**Feature:** Seller Profile Navigation  
**Preconditions:** Billboard detail page loaded

**Test Steps:**
1. Locate seller profile card/section
2. Click on seller name or profile picture
3. Observe navigation

**Expected Results:**
- ✅ Navigates to `/seller-profile/[seller-id]`
- ✅ Seller profile page loads with seller's billboards
- ✅ Seller information displayed

**Screenshot Markers:**
- `[SCREENSHOT: Seller profile card in billboard detail]`

---

#### Test Case: PUB-BD-010 - Reviews and Ratings Display
**Priority:** MEDIUM  
**Feature:** Reviews Section  
**Preconditions:** Billboard has reviews/ratings

**Test Steps:**
1. Scroll to reviews section
2. Observe average rating display
3. Check individual review cards
4. Verify reviewer information shown

**Expected Results:**
- ✅ Average rating displayed (e.g., 4.5/5) with stars
- ✅ Total number of reviews shown
- ✅ Individual reviews listed with:
  - Reviewer name
  - Rating (stars)
  - Comment text
  - Date
- ✅ Reviews sorted by date (newest first)
- ✅ "No reviews yet" if no ratings

**Screenshot Markers:**
- `[SCREENSHOT: Reviews section with ratings]`
- `[SCREENSHOT: Individual review card]`

---

#### Test Case: PUB-BD-011 - Billboard Detail - Invalid ID
**Priority:** HIGH  
**Feature:** Error Handling  
**Preconditions:** None

**Test Steps:**
1. Navigate to `/billboard-detail/invalid-id-123`
2. Observe page behavior

**Expected Results:**
- ✅ Loading screen appears briefly
- ✅ Error message displayed: "Billboard not found"
- ✅ OR 404 page shown
- ✅ Link to return to homepage
- ✅ No console errors that crash the app

**API Validation:**
```
Request: GET /api/billboard/invalid-id-123
Expected Response: 
{
  "status": false,
  "message": "Billboard not found"
}
OR HTTP 404
```

**Screenshot Markers:**
- `[SCREENSHOT: Billboard not found error page]`

---

### 4.4 AUTHENTICATION TESTS

#### Test Case: AUTH-001 - User Login with Email and Password
**Priority:** CRITICAL  
**Feature:** Login  
**Preconditions:** Test user account exists

**Test Steps:**
1. Navigate to `/login`
2. Enter email: `buyer@test.com`
3. Enter password: `Test@123`
4. Click "Login" button
5. Observe loading state
6. Wait for redirect

**Expected Results:**
- ✅ Login page loads with form
- ✅ Email/phone input accepts text
- ✅ Password input masks characters
- ✅ Login button enabled when fields filled
- ✅ Loading spinner shows on button click
- ✅ Success: Redirects based on role:
  - BUYER → `/dashboard`
  - SELLER → `/seller/dashboard`
  - ADMIN → `/admin/dashboard`
- ✅ User session established (cookie set)
- ✅ Navbar shows user profile picture and name

**API Validation:**
```
Request: POST /api/proxy/auth/login
Body: 
{
  "identifier": "buyer@test.com",
  "password": "Test@123"
}
Expected Response:
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "level": "BUYER"
    }
  }
}
Cookies: access_token should be set
```

**Screenshot Markers:**
- `[SCREENSHOT: Login page]`
- `[SCREENSHOT: Login button loading state]`
- `[SCREENSHOT: Dashboard after successful login]`

**Pass/Fail Criteria:**
- PASS: Login successful, correct redirect, session active
- FAIL: Login fails, wrong redirect, session not established

---

#### Test Case: AUTH-002 - User Login with Phone Number
**Priority:** CRITICAL  
**Feature:** Login with Phone  
**Preconditions:** User registered with phone number

**Test Steps:**
1. Navigate to `/login`
2. Enter phone: `+6281234567890`
3. Enter password: `Test@123`
4. Click "Login"

**Expected Results:**
- ✅ Phone number accepted in identifier field
- ✅ Login successful with phone number
- ✅ Same redirect behavior as email login

**Test Data:**
| Phone Format | Should Work |
|--------------|-------------|
| +6281234567890 | ✅ Yes |
| 081234567890 | ✅ Yes (if backend accepts) |
| 6281234567890 | ✅ Yes (if backend accepts) |

---

#### Test Case: AUTH-003 - Login with Invalid Credentials
**Priority:** HIGH  
**Feature:** Login Error Handling  
**Preconditions:** None

**Test Steps:**
1. Navigate to `/login`
2. Enter email: `buyer@test.com`
3. Enter password: `WrongPassword123`
4. Click "Login"
5. Observe error message

**Expected Results:**
- ✅ Loading state shows briefly
- ✅ Error message displayed: "Invalid email or password"
- ✅ Form not cleared (email remains)
- ✅ Password field cleared for security
- ✅ No redirect occurs
- ✅ Login button re-enabled

**API Validation:**
```
Request: POST /api/proxy/auth/login
Expected Response:
{
  "status": false,
  "message": "Invalid credentials"
}
HTTP Status: 401 Unauthorized
```

**Screenshot Markers:**
- `[SCREENSHOT: Login error message]`

---

#### Test Case: AUTH-004 - Login Validation - Empty Fields
**Priority:** MEDIUM  
**Feature:** Form Validation  
**Preconditions:** Login page loaded

**Test Steps:**
1. Leave email field empty
2. Leave password field empty
3. Try to click Login button

**Expected Results:**
- ✅ Login button disabled when fields empty OR
- ✅ Validation error shown: "Email/phone is required", "Password is required"
- ✅ Form submission prevented

**Screenshot Markers:**
- `[SCREENSHOT: Login validation errors]`

---

#### Test Case: AUTH-005 - Google OAuth Login
**Priority:** HIGH  
**Feature:** Google Sign In  
**Preconditions:** Google OAuth configured

**Test Steps:**
1. Navigate to `/login`
2. Click "Sign in with Google" button
3. Complete Google authentication flow
4. Return to app

**Expected Results:**
- ✅ Google OAuth popup/redirect opens
- ✅ User authenticates with Google
- ✅ Returns to app after authentication
- ✅ User logged in successfully
- ✅ Redirected to appropriate dashboard
- ✅ **KNOWN ISSUE**: May fail middleware check if backend not synced

**API Validation:**
```
This uses NextAuth, may not sync with backend.
Check middleware.ts response.
```

**Screenshot Markers:**
- `[SCREENSHOT: Google Sign In button]`
- `[SCREENSHOT: Google OAuth consent screen]`

**Notes:**
- ⚠️ Google OAuth currently not fully integrated with backend
- Users authenticated via Google may face authorization issues

---

#### Test Case: AUTH-006 - User Registration - Valid Data
**Priority:** CRITICAL  
**Feature:** User Registration  
**Preconditions:** None

**Test Steps:**
1. Navigate to `/register`
2. Fill form:
   - Username: `newuser_test`
   - Email: `newuser@test.com`
   - Phone: `081234567899`
   - Password: `Test@123`
   - Confirm Password: `Test@123`
3. Click "Register" button
4. Observe response

**Expected Results:**
- ✅ All fields accept input
- ✅ Phone auto-formats to +62 prefix
- ✅ Password shows/hides with eye icon
- ✅ Confirm password validates match
- ✅ Register button shows loading state
- ✅ Success: User created, redirected to login
- ✅ Success toast: "Registration successful!"

**API Validation:**
```
Request: POST /api/proxy/auth/register
Body:
{
  "username": "newuser_test",
  "email": "newuser@test.com",
  "phone": "+6281234567899",
  "password": "Test@123"
}
Expected Response:
{
  "status": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "string",
      "username": "newuser_test",
      "email": "newuser@test.com"
    }
  }
}
```

**Screenshot Markers:**
- `[SCREENSHOT: Registration form filled]`
- `[SCREENSHOT: Success message after registration]`

---

#### Test Case: AUTH-007 - Registration Validation - Password Mismatch
**Priority:** HIGH  
**Feature:** Form Validation  
**Preconditions:** Registration page loaded

**Test Steps:**
1. Fill all fields correctly
2. Password: `Test@123`
3. Confirm Password: `Test@456` (different)
4. Try to submit

**Expected Results:**
- ✅ Error message: "Passwords do not match"
- ✅ Confirm password field highlighted in red
- ✅ Form submission prevented
- ✅ Error clears when corrected

**Screenshot Markers:**
- `[SCREENSHOT: Password mismatch error]`

---

#### Test Case: AUTH-008 - Registration Validation - Username Too Short
**Priority:** MEDIUM  
**Feature:** Form Validation  
**Preconditions:** Registration page loaded

**Test Steps:**
1. Enter username: `ab` (only 2 chars)
2. Tab out of field
3. Observe validation

**Expected Results:**
- ✅ Error message: "Username must be at least 3 characters"
- ✅ Field highlighted in red
- ✅ Submit button disabled or prevented

**Test Data:**
| Username | Valid |
|----------|-------|
| ab | ❌ No |
| abc | ✅ Yes |
| test_user_123 | ✅ Yes |

---

#### Test Case: AUTH-009 - Registration with Existing Email
**Priority:** HIGH  
**Feature:** Duplicate Email Handling  
**Preconditions:** User `buyer@test.com` already exists

**Test Steps:**
1. Fill registration form
2. Email: `buyer@test.com` (existing)
3. Click Register

**Expected Results:**
- ✅ API returns error
- ✅ Error message: "Email already registered"
- ✅ Form stays on page, not cleared
- ✅ User can correct email and retry

**API Validation:**
```
Expected Response:
{
  "status": false,
  "message": "Email already exists"
}
HTTP Status: 409 Conflict
```

---

#### Test Case: AUTH-010 - Phone Number Formatting
**Priority:** MEDIUM  
**Feature:** Phone Input Auto-Format  
**Preconditions:** Registration page loaded

**Test Steps:**
1. Enter phone: `81234567890` (without +62)
2. Tab out or submit
3. Observe value

**Expected Results:**
- ✅ Phone auto-formats to `+6281234567890`
- ✅ Leading zero removed if entered
- ✅ +62 prefix added if missing
- ✅ Formatted value submitted to API

**Test Data:**
| Input | Expected Output |
|-------|----------------|
| 81234567890 | +6281234567890 |
| 081234567890 | +6281234567890 |
| +6281234567890 | +6281234567890 |

**Screenshot Markers:**
- `[SCREENSHOT: Phone input before formatting]`
- `[SCREENSHOT: Phone input after formatting]`

---

#### Test Case: AUTH-011 - Forgot Password Flow
**Priority:** MEDIUM  
**Feature:** Password Reset  
**Preconditions:** User email exists in system

**Test Steps:**
1. Navigate to `/forgot`
2. Enter email: `buyer@test.com`
3. Click "Send Reset Link"
4. Observe response

**Expected Results:**
- ✅ Email field accepts input
- ✅ Submit button shows loading state
- ✅ Success message: "Password reset link sent to your email"
- ✅ **KNOWN ISSUE**: Backend endpoint returns 404 (not implemented)

**API Validation:**
```
Request: POST /api/proxy/auth/forgot-password
Body: { "email": "buyer@test.com" }
Expected Response:
{
  "status": true,
  "message": "Reset link sent"
}
ACTUAL: 404 Not Found (endpoint not implemented)
```

**Screenshot Markers:**
- `[SCREENSHOT: Forgot password page]`
- `[SCREENSHOT: Success message (if endpoint works)]`

**Notes:**
- ⚠️ **KNOWN ISSUE**: Forgot password endpoint doesn't exist on backend
- Backend team needs to implement `POST /auth/forgot-password`

---

#### Test Case: AUTH-012 - Logout Functionality
**Priority:** CRITICAL  
**Feature:** Logout  
**Preconditions:** User logged in

**Test Steps:**
1. While logged in, click user profile menu
2. Click "Logout" option
3. Observe confirmation modal (if present)
4. Confirm logout
5. Observe behavior

**Expected Results:**
- ✅ Logout confirmation modal appears
- ✅ Modal asks: "Are you sure you want to logout?"
- ✅ "Yes" button logs out user
- ✅ "Cancel" button closes modal
- ✅ After logout:
  - Redirected to `/login` or homepage
  - Session cookie cleared
  - Protected pages inaccessible
  - Navbar shows login/register buttons

**API Validation:**
```
Request: POST /api/proxy/auth/logout
Expected Response:
{
  "status": true,
  "message": "Logged out successfully"
}
Cookies: access_token should be cleared
```

**Screenshot Markers:**
- `[SCREENSHOT: Logout confirmation modal]`
- `[SCREENSHOT: Homepage after logout]`

---

### 4.5 BLOG AND PROMO TESTS

#### Test Case: PUB-BLOG-001 - View Blog List
**Priority:** LOW  
**Feature:** Blog Listing  
**Preconditions:** None

**Test Steps:**
1. Navigate to `/blog`
2. Observe blog grid
3. Count articles displayed
4. Check pagination

**Expected Results:**
- ✅ Blog page loads
- ✅ Blog article cards displayed in grid
- ✅ Each card shows: image, title, excerpt, author, date
- ✅ Pagination controls visible
- ✅ **NOTE**: Currently uses dummy data

**API Validation:**
```
Currently no API - uses hardcoded data
Expected future: GET /api/proxy/blog
```

**Screenshot Markers:**
- `[SCREENSHOT: Blog list page]`

**Notes:**
- ⚠️ Blog currently uses mock data, not connected to backend
- Backend needs to implement blog endpoints

---

#### Test Case: PUB-BLOG-002 - View Blog Detail
**Priority:** LOW  
**Feature:** Blog Article Detail  
**Preconditions:** Blog list loaded

**Test Steps:**
1. Click on first blog article
2. Verify navigation to `/blog/[id]`
3. Observe article content

**Expected Results:**
- ✅ Navigates to blog detail page
- ✅ Full article content displayed
- ✅ Author and date shown
- ✅ Related articles sidebar
- ✅ Back navigation works

**Screenshot Markers:**
- `[SCREENSHOT: Blog detail page]`

---

#### Test Case: PUB-PROMO-001 - View Promo Page
**Priority:** LOW  
**Feature:** Promo Display  
**Preconditions:** None

**Test Steps:**
1. Navigate to `/promo`
2. Observe promo cards
3. Click "Show More" if available
4. Check promo details

**Expected Results:**
- ✅ Promo page loads with cards
- ✅ Each card shows: title, description, period, discount
- ✅ "Show More/Less" toggle works
- ✅ **NOTE**: Currently uses dummy data

**Screenshot Markers:**
- `[SCREENSHOT: Promo page]`

**Notes:**
- ⚠️ Promo currently uses mock data
- Backend needs promo management endpoints

---

### 4.6 SELLER PROFILE VIEW TESTS

#### Test Case: PUB-SP-001 - View Public Seller Profile
**Priority:** MEDIUM  
**Feature:** Seller Profile Page  
**Preconditions:** Seller account exists with billboards

**Test Steps:**
1. Navigate to `/seller-profile/[seller-id]`
2. Wait for page load
3. Observe seller information and billboards

**Expected Results:**
- ✅ Seller profile card displays:
  - Seller name
  - Location
  - Profile picture
- ✅ Category tabs visible
- ✅ Seller's billboards displayed in grid
- ✅ Follow button visible (UI only, may not work)
- ✅ Billboards are clickable to detail page

**API Validation:**
```
Request: GET /api/billboard/all
(Filtered by seller ID on client side)
```

**Screenshot Markers:**
- `[SCREENSHOT: Seller profile page]`
- `[SCREENSHOT: Seller billboards grid]`

---

## 5. BUYER FEATURES TESTING

### 5.1 BUYER DASHBOARD TESTS

#### Test Case: BUYER-DASH-001 - Access Buyer Dashboard After Login
**Priority:** CRITICAL  
**Feature:** Buyer Dashboard  
**Preconditions:** Logged in as BUYER role

**Test Steps:**
1. Login with buyer credentials
2. Observe automatic redirect to dashboard
3. Check dashboard layout and navigation

**Expected Results:**
- ✅ Redirects to `/dashboard` automatically
- ✅ Sidebar menu visible with tabs:
  - Dashboard
  - Homepage
  - History
  - Bookmark
  - Profile
- ✅ User profile displayed in header
- ✅ Active tab highlighted (Dashboard by default)
- ✅ Main content area renders Dashboard tab

**API Validation:**
```
Request: GET /api/proxy/auth/me
Expected Response:
{
  "status": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "level": "BUYER"
    }
  }
}
```

**Screenshot Markers:**
- `[SCREENSHOT: Buyer dashboard - desktop view]`
- `[SCREENSHOT: Buyer dashboard - mobile sidebar]`

---

#### Test Case: BUYER-DASH-002 - Navigate Between Dashboard Tabs
**Priority:** HIGH  
**Feature:** Tab Navigation  
**Preconditions:** Buyer dashboard open

**Test Steps:**
1. Click "Homepage" tab in sidebar
2. Verify Homepage content loads
3. Click "History" tab
4. Verify History content loads
5. Click "Bookmark" tab
6. Verify Bookmark content loads
7. Click "Profile" tab
8. Verify Profile content loads
9. Click "Dashboard" tab
10. Verify Dashboard content loads

**Expected Results:**
- ✅ Each tab click updates main content area
- ✅ Active tab highlighted in sidebar
- ✅ Content switches without page reload
- ✅ URL updates to reflect tab (optional)
- ✅ Smooth transition animation

**Screenshot Markers:**
- `[SCREENSHOT: Each tab view]`

---

#### Test Case: BUYER-DASH-003 - Seller Upgrade Prompt (BUYER User)
**Priority:** MEDIUM  
**Feature:** Seller Upgrade CTA  
**Preconditions:** Logged in as BUYER (not SELLER)

**Test Steps:**
1. Navigate to Dashboard tab
2. Look for seller upgrade prompt/banner
3. Click "Become a Seller" button (if present)

**Expected Results:**
- ✅ Prompt/banner visible encouraging seller registration
- ✅ "Upgrade to Seller" or similar CTA button
- ✅ Clicking redirects to `/seller/register`
- ✅ If already SELLER, prompt not shown

**Screenshot Markers:**
- `[SCREENSHOT: Seller upgrade prompt]`

---

### 5.2 BOOKING FLOW TESTS

#### Test Case: BUYER-BOOK-001 - Access Booking Page
**Priority:** CRITICAL  
**Feature:** Booking Form Access  
**Preconditions:** Logged in as BUYER, valid billboard ID

**Test Steps:**
1. Navigate to `/booking/[billboard-id]`
2. Wait for page load
3. Observe booking form structure

**Expected Results:**
- ✅ Booking page loads successfully
- ✅ Stepper UI shows 4 steps:
  1. Data Pemesanan
  2. Add-On
  3. Include
  4. Review & Submit
- ✅ Step 1 active by default
- ✅ Form title: "Lengkapi Form dibawah ini"
- ✅ Back/Next navigation buttons visible

**Screenshot Markers:**
- `[SCREENSHOT: Booking page - Step 1]`
- `[SCREENSHOT: Stepper UI]`

---

#### Test Case: BUYER-BOOK-002 - Step 1 - Fill Period Dates
**Priority:** CRITICAL  
**Feature:** Booking Step 1  
**Preconditions:** Booking page open, Step 1 active

**Test Steps:**
1. Observe Step 1 form fields
2. Click "Periode Awal" date picker
3. Select start date: 2026-03-01
4. Click "Periode Akhir" date picker
5. Select end date: 2026-04-01
6. Observe "Next" button state
7. Click "Next"

**Expected Results:**
- ✅ Step 1 title: "Pilih Periode Penyewaan"
- ✅ Two date fields: Periode Awal*, Periode Akhir*
- ✅ Both marked as required
- ✅ Date pickers open on click
- ✅ Selected dates display in fields
- ✅ "Next" button disabled if dates empty
- ✅ "Next" button enabled when both dates filled
- ✅ Clicking "Next" advances to Step 2
- ✅ Step 2 becomes active in stepper

**API Validation:**
```
No API call on this step (client-side only)
```

**Screenshot Markers:**
- `[SCREENSHOT: Step 1 - Date picker open]`
- `[SCREENSHOT: Step 1 - Dates filled]`

---

#### Test Case: BUYER-BOOK-003 - Step 1 - Validation (Empty Dates)
**Priority:** HIGH  
**Feature:** Form Validation  
**Preconditions:** Booking page Step 1

**Test Steps:**
1. Leave both date fields empty
2. Try to click "Next"

**Expected Results:**
- ✅ "Next" button disabled OR
- ✅ Validation error shown: "Please select booking period"
- ✅ Cannot proceed to Step 2

---

#### Test Case: BUYER-BOOK-004 - Step 2 - Select Add-Ons
**Priority:** HIGH  
**Feature:** Booking Step 2 - Add-Ons  
**Preconditions:** Completed Step 1, now on Step 2

**Test Steps:**
1. Observe Step 2 form
2. Review available add-ons (fetched from API)
3. Check/uncheck add-on checkboxes
4. Adjust quantity fields for AR and Traffic Data
5. Enter notes in textarea
6. Click "Back" to test navigation
7. Verify return to Step 1
8. Click "Next" to return to Step 2
9. Click "Next" to proceed to Step 3

**Expected Results:**
- ✅ Step 2 title: "Add-On" or similar
- ✅ List of add-ons loaded from API displayed
- ✅ Each add-on has checkbox and name
- ✅ Augmented Reality (AR) quantity field (number input)
- ✅ Traffic Data Reporting quantity field
- ✅ Notes textarea (optional)
- ✅ "Back" button returns to Step 1 with data preserved
- ✅ "Next" button proceeds to Step 3
- ✅ Form data persists when navigating back/forward

**API Validation:**
```
Request: GET /api/add-on
Expected Response:
{
  "status": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "string"
    }
  ]
}
```

**Screenshot Markers:**
- `[SCREENSHOT: Step 2 - Add-ons list]`
- `[SCREENSHOT: Step 2 - Selected add-ons]`

---

#### Test Case: BUYER-BOOK-005 - Step 3 - Included Services Display
**Priority:** MEDIUM  
**Feature:** Booking Step 3 - Include  
**Preconditions:** Completed Steps 1-2

**Test Steps:**
1. From Step 2, click "Next"
2. Observe Step 3 content
3. Review listed included services
4. Click "Back"
5. Click "Next" again
6. Click "Next" to proceed to Step 4

**Expected Results:**
- ✅ Step 3 is informational (read-only)
- ✅ Title: "Fasilitas atau layanan yang sudah termasuk dalam paket"
- ✅ List of included services:
  - Desain sesuai identitas brand
  - Perizinan reklame lengkap
  - Invoice & nota resmi
  - Visual konten berkualitas
  - Pemasangan oleh tim profesional
  - Laporan hasil pemasangan
- ✅ Checkmark icon next to each
- ✅ "Back" and "Next" buttons work
- ✅ Clicking "Next" proceeds to Step 4

**Screenshot Markers:**
- `[SCREENSHOT: Step 3 - Included services]`

---

#### Test Case: BUYER-BOOK-006 - Step 4 - Review and Submit
**Priority:** CRITICAL  
**Feature:** Booking Step 4 - Review  
**Preconditions:** Completed Steps 1-3

**Test Steps:**
1. Observe Step 4 Review summary
2. Verify all entered data displayed correctly
3. Review sections:
   - Detail Pesanan (period dates)
   - Pilihan Layanan Tambahan (selected add-ons)
4. Click "Submit" button
5. Wait for submission

**Expected Results:**
- ✅ Step 4 title: "Periksa kembali detail pesanan sebelum Anda melakukan pembayaran"
- ✅ Summary shows:
  - Periode Sewa: [start] - [end]
  - Selected add-ons listed
  - Notes displayed
- ✅ "Submit" button labeled "Submit Booking" or similar
- ✅ Clicking "Submit" shows loading state
- ✅ Button disabled during submission

**Screenshot Markers:**
- `[SCREENSHOT: Step 4 - Review summary]`

---

#### Test Case: BUYER-BOOK-007 - Successful Booking Submission
**Priority:** CRITICAL  
**Feature:** Booking Submission  
**Preconditions:** Step 4, all data valid

**Test Steps:**
1. Click "Submit" on Step 4
2. Wait for API response
3. Observe success screen

**Expected Results:**
- ✅ Loading spinner shows during API call
- ✅ On success:
  - Success screen displays with checkmark icon
  - Message: "Booking Submitted!" or similar
  - Success toast notification
  - "Create New Booking" button shown
- ✅ Form resets if "Create New Booking" clicked

**API Validation:**
```
Request: POST /api/transaction
Body:
{
  "billboardId": "string",
  "addOnIds": ["id1", "id2"],
  "designId": null,
  "startDate": "2026-03-01",
  "endDate": "2026-04-01"
}
Expected Response:
{
  "status": true,
  "message": "Tra
## 5. BUYER FEATURES TESTING

*Buyer features test cases will cover dashboard navigation, booking flow, bookmark management, order history, payment, and profile management for BUYER role users.*

---


---

## 5-7. BUYER, SELLER, AND ADMIN FEATURES

For detailed test cases on role-specific features, please refer to the supplementary documents:

### 📄 QA_BUYER_FEATURES.md
**Covers:** Dashboard, Booking Flow, Bookmarks, Order History, Payment, Profile  
**Test Cases:** 23 detailed test cases  
**Priority:** CRITICAL - Core business functionality

### 📄 QA_SELLER_FEATURES.md  
**Covers:** Registration, Dashboard, Billboard Management, Transactions, Profile, Notifications  
**Test Cases:** 24 detailed test cases  
**Priority:** HIGH - Essential for marketplace operation

### 📄 QA_ADMIN_FEATURES.md
**Covers:** User/Seller/Billboard/Transaction/Master Data Management, Recycle Bin, Media Gallery  
**Test Cases:** 43 detailed test cases  
**Priority:** HIGH - Platform administration and control

---

## 8. INTEGRATION TESTING

### 8.1 GOOGLE OAUTH INTEGRATION

#### Test Case: INT-OAUTH-001 - Google Sign In
**Priority:** HIGH  
**Known Issue:** ⚠️ Backend sync incomplete  
**Steps:**
1. Click "Sign in with Google" on login page
2. Complete Google authentication
3. Return to application

**Expected Results:**
- ✅ Google OAuth popup opens
- ✅ User authenticates with Google account
- ✅ Returns to app after auth
- ⚠️ **KNOWN ISSUE**: May fail middleware check if backend doesn't sync Google user to database

**Recommendations:**
- Backend needs to implement `POST /auth/oauth/google` endpoint
- Sync Google user data (email, name) with local user table
- Set proper session cookie for OAuth users

---

### 8.2 GOOGLE MAPS INTEGRATION

#### Test Case: INT-MAPS-001 - Location Picker
**Priority:** HIGH  
**Preconditions:** Google Maps API key configured  
**Steps:**
1. In seller/admin billboard form, click location field
2. Start typing address
3. Select from autocomplete suggestions
4. Drag map marker to adjust position
5. Verify coordinates update

**Expected Results:**
- ✅ Google Places Autocomplete works
- ✅ Map displays with marker
- ✅ Marker is draggable
- ✅ Latitude/longitude fields update automatically
- ✅ Can manually enter coordinates

**API Key Check:**
```bash
# Verify in .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

---

### 8.3 FILE UPLOAD INTEGRATION

#### Test Case: INT-UPLOAD-001 - Image Upload Flow
**Priority:** HIGH  
**Upload Locations:**
- Profile pictures
- Billboard images (multiple)
- Design template files

**Steps:**
1. Select file(s) for upload
2. Observe preview
3. Submit form
4. Verify file(s) uploaded to server
5. Check file served via `/api/uploads/[...path]`

**Expected Results:**
- ✅ File upload accepts correct formats (JPEG, PNG, PDF, etc.)
- ✅ File size validation (max 5MB per image)
- ✅ Preview shows before upload
- ✅ Files stored in `/uploads/` directory
- ✅ Files accessible via `/api/uploads/` route
- ✅ Proper URL format: `/api/uploads/filename.jpg`

**Test Data:**
| File | Size | Format | Expected |
|------|------|--------|----------|
| test.jpg | 2MB | JPEG | ✅ Accept |
| test.png | 3MB | PNG | ✅ Accept |
| test.gif | 1MB | GIF | ❌ Reject (if not allowed) |
| large.jpg | 10MB | JPEG | ❌ Reject (too large) |

---

### 8.4 PAYMENT GATEWAY INTEGRATION

#### Test Case: INT-PAY-001 - Payment Gateway (UI Only)
**Priority:** MEDIUM  
**Status:** ⚠️ UI implemented, gateway integration pending

**Steps:**
1. Complete booking to create transaction
2. Navigate to payment page
3. Select payment method
4. Click confirm payment

**Current Behavior:**
- ✅ Payment page loads with method selection
- ✅ Order summary displayed
- ⚠️ No actual payment gateway redirect
- ⚠️ No payment processing
- ⚠️ Transaction status not updated to PAID

**Future Requirements:**
- Integrate Midtrans OR Xendit
- Redirect to payment gateway
- Handle payment callback
- Update transaction status
- Send confirmation email/notification

---

## 9. CROSS-CUTTING CONCERNS

### 9.1 AUTHORIZATION & MIDDLEWARE

#### Test Case: CROSS-AUTH-001 - Middleware Protection
**Priority:** CRITICAL  
**Test Authorization Rules:**

| User Role | Access URL | Expected Behavior |
|-----------|------------|-------------------|
| Not logged in | `/dashboard` | Redirect to `/login` |
| Not logged in | `/booking/[id]` | Redirect to `/login` |
| Not logged in | `/seller/dashboard` | Redirect to `/login` |
| Not logged in | `/admin/dashboard` | Redirect to `/login` |
| BUYER | `/dashboard` | ✅ Access granted |
| BUYER | `/seller/dashboard` | ❌ Redirect to `/dashboard` |
| BUYER | `/admin/dashboard` | ❌ Redirect to `/dashboard` |
| SELLER | `/seller/dashboard` | ✅ Access granted |
| SELLER | `/dashboard` | ✅ Access granted (or redirect to `/seller/dashboard`) |
| SELLER | `/admin/dashboard` | ❌ Redirect to `/seller/dashboard` |
| ADMIN | `/admin/dashboard` | ✅ Access granted |
| ADMIN | `/dashboard` | ✅ Access granted |
| ADMIN | `/seller/dashboard` | ✅ Access granted |

**Steps:**
1. Logout (clear session)
2. Try accessing protected routes
3. Verify redirect to login
4. Login as BUYER
5. Try accessing SELLER/ADMIN routes
6. Verify redirect to appropriate dashboard
7. Repeat for SELLER and ADMIN roles

---

### 9.2 ERROR HANDLING

#### Test Case: CROSS-ERR-001 - Error Boundaries
**Priority:** HIGH  
**Steps:**
1. Navigate to various pages
2. Trigger errors (invalid IDs, network failures)
3. Observe error handling

**Expected Results:**
- ✅ Error boundaries catch errors
- ✅ User-friendly error page displays (not white screen)
- ✅ Error message in Indonesian
- ✅ "Return to Home" button visible
- ✅ Console logs error for debugging
- ✅ App doesn't crash

**Error Pages:**
- `app/error.tsx` - Route-level error boundary
- `app/global-error.tsx` - Root-level error boundary
- `app/not-found.tsx` - 404 page

---

### 9.3 LOADING STATES

#### Test Case: CROSS-LOAD-001 - Loading State Consistency
**Priority:** MEDIUM  
**Check Loading States on:**
- Homepage billboard grid
- Billboard detail page
- Booking page
- Dashboard tabs
- Profile page
- Order history
- Bookmark page

**Expected Results:**
- ✅ LoadingScreen component shows on initial page load
- ✅ Animated logo bounce
- ✅ Clean white background
- ✅ Spinners for data tables/lists
- ✅ Loading text in Indonesian
- ✅ No content flash (loading → content)

---

### 9.4 RESPONSIVE DESIGN

#### Test Case: CROSS-RESP-001 - Mobile Responsiveness
**Priority:** HIGH  
**Test Viewports:**
- Mobile: 375x667 (iPhone SE), 360x640 (Android)
- Tablet: 768x1024 (iPad)
- Desktop: 1366x768, 1920x1080

**Pages to Test:**
- Landing page
- Homepage
- Billboard detail
- Booking form (all steps)
- Dashboard (all tabs)
- Seller dashboard
- Admin dashboard

**Expected Results:**
- ✅ All pages responsive
- ✅ No horizontal scroll on mobile
- ✅ Touch-friendly buttons (min 44x44px)
- ✅ Readable text (min 16px)
- ✅ Images scale properly
- ✅ Forms usable on mobile
- ✅ Sidebar collapses to hamburger menu
- ✅ Tables scroll horizontally or stack on mobile

---

### 9.5 SEO & ACCESSIBILITY

#### Test Case: CROSS-SEO-001 - Meta Tags & SEO
**Priority:** MEDIUM  
**Check Each Page:**

**Expected Meta Tags:**
```html
<title>[Page Title] - Placers</title>
<meta name="description" content="[Page description]" />
<meta property="og:title" content="[Page Title]" />
<meta property="og:description" content="[Description]" />
<meta property="og:image" content="[Image URL]" />
<meta name="twitter:card" content="summary_large_image" />
```

**Pages with SEO:**
- ✅ `/` - Landing page
- ✅ `/homepage` - Billboard listings
- ✅ `/billboard-detail/[id]` - Billboard detail
- ✅ `/blog` - Blog listing
- ✅ `/promo` - Promo page
- ✅ All auth pages (login, register, forgot)
- ✅ All dashboard pages

**Tools to Use:**
- View Page Source → Check `<head>` section
- Chrome DevTools → Elements → `<head>`
- Lighthouse audit → SEO score

---

## 10. REGRESSION & EDGE CASES

### 10.1 REGRESSION TESTS (After Bug Fixes)

When bugs are fixed, re-test:

1. **Seller Registration Logout Issue** (FIXED)
   - Test Case: SELLER-REG-007
   - Re-test: User stays logged in after registration
   - Verify: Can access seller dashboard immediately

2. **Forgot Password 404** (PENDING BACKEND)
   - Test Case: AUTH-011
   - Re-test: When endpoint implemented
   - Verify
