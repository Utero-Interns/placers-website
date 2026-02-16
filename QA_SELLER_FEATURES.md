# QA TEST CASES - SELLER FEATURES

**Related to:** QA_TEST_PLAN.md Section 6  
**Role:** SELLER  
**Date:** February 16, 2026

---

## SELLER REGISTRATION TESTS

### ✅ SELLER-REG-001: Access Seller Registration (as BUYER)
- **Priority:** CRITICAL
- **Preconditions:** Logged in as BUYER (not already SELLER)
- **URL:** `/seller/register`
- **Expected:** Registration form loads with 6 required fields

### ✅ SELLER-REG-002: Fill Registration Form - Valid Data
- **Priority:** CRITICAL
- **API:** `POST /api/proxy/seller`
- **Form Fields:**
  ```
  Full Name*: Test Seller Indonesia (min 3 chars)
  KTP*: 1234567890123456 (exactly 16 digits)
  NPWP*: 123456789012345 (15-16 digits)
  Company Name*: PT Test Billboard Indonesia
  KTP Address*: Jl. Test No. 123, Jakarta Selatan, DKI Jakarta (min 10 chars)
  Office Address*: Jl. Office Test No. 456, Jakarta Pusat, DKI Jakarta (min 10 chars)
  ```
- **Steps:**
  1. Fill all fields with valid data
  2. Click "Submit" button
  3. Wait for response
- **Expected:**
  - Real-time validation shows green checkmarks
  - Submit button enabled
  - Loading state during submission
  - Success: Redirect to `/seller/dashboard`
  - User role upgraded to SELLER
  - Session refreshed (user stays logged in)

### ✅ SELLER-REG-003: Validation - KTP Number
- **Priority:** HIGH
- **Test Data:**
  | KTP Input | Valid |
  |-----------|-------|
  | 123456789012345 | ❌ (15 digits) |
  | 1234567890123456 | ✅ (16 digits) |
  | 12345678901234567 | ❌ (17 digits) |
  | abcd567890123456 | ❌ (non-numeric) |
- **Expected:** Error shown for invalid inputs, prevented submission

### ✅ SELLER-REG-004: Validation - NPWP Number
- **Priority:** HIGH
- **Test Data:**
  | NPWP Input | Valid |
  |------------|-------|
  | 12345678901234 | ❌ (14 digits) |
  | 123456789012345 | ✅ (15 digits) |
  | 1234567890123456 | ✅ (16 digits) |
  | 12345678901234567 | ❌ (17 digits) |

### ✅ SELLER-REG-005: Validation - Minimum Length Fields
- **Priority:** MEDIUM
- **Full Name:** Minimum 3 characters
- **KTP Address:** Minimum 10 characters
- **Office Address:** Minimum 10 characters
- **Expected:** Error messages for fields below minimum

### ✅ SELLER-REG-006: Pre-filled Data (Already Registered Seller)
- **Preconditions:** User already has seller profile
- **API:** `GET /api/proxy/seller`
- **Steps:**
  1. Navigate to `/seller/register`
  2. Observe form
- **Expected:**
  - Form pre-filled with existing seller data
  - Can update information
  - Submit updates existing record (PUT instead of POST)

### ⚠️ SELLER-REG-007: Session Refresh After Registration (FIXED)
- **Priority:** CRITICAL
- **Previous Issue:** User logged out after registration, couldn't access seller dashboard
- **Current Behavior:**
  - User stays logged in
  - Session refreshed with updated SELLER role
  - Redirect to `/seller/dashboard` works
  - No middleware rejection
- **Expected:** ✅ User can access seller dashboard immediately

---

## SELLER DASHBOARD TESTS

### ✅ SELLER-DASH-001: Access Seller Dashboard
- **Priority:** CRITICAL
- **Preconditions:** Logged in as SELLER
- **URL:** `/seller/dashboard`
- **Expected:**
  - Dashboard loads successfully
  - Sidebar menu with tabs:
    - Dashboard (stats overview)
    - My Billboards
    - My Transactions
    - My Profile
    - History
    - My Wallet
  - Floating notification button (bottom-right)
  - Search, filter controls visible

---

## MY BILLBOARDS TESTS

### ✅ SELLER-BB-001: View Billboard List
- **Priority:** HIGH
- **API:** `GET /api/proxy/billboard/myBillboards`
- **Expected:**
  - Table with seller's billboards
  - Columns: ID, Category, Location, Size, Price, Status, Actions
  - "Add Billboard" button visible
  - Empty state if no billboards

### ✅ SELLER-BB-002: Add New Billboard - Full Form
- **Priority:** CRITICAL
- **API:** `POST /api/proxy/billboard`
- **Preconditions:** Categories, provinces, cities exist in system
- **Steps:**
  1. Click "Add Billboard" button
  2. Fill form with all fields
  3. Upload 3-5 images
  4. Select location on Google Maps
  5. Click "Submit"

**Form Fields:**
```
Category*: Billboard (dropdown from API)
Province*: DKI Jakarta (dropdown from API)
City*: Jakarta Selatan (filtered by province, dropdown from API)
Location*: Jl. Sudirman No. 789 (text input OR Google Maps autocomplete)
Latitude: -6.2088 (from Google Maps picker)
Longitude: 106.8456 (from Google Maps picker)
Size*: 4m x 6m (text input, format: WxH)
Orientation*: Horizontal (dropdown: Horizontal/Vertical)
Display*: Single Sided (dropdown: Single/Double)
Lighting*: Frontlit (dropdown: Frontlit/Backlit/None)
Description: Premium location... (textarea)
Rent Price: 500000 (number)
Sell Price: 50000000 (number)
Service Price: 100000 (number)
Tax: 11% (text)
Land Ownership: Owned (text)
Status: Available (dropdown: Available/Unavailable)
Images*: [file1.jpg, file2.jpg, file3.jpg] (multiple upload)
```

**Expected:**
- ✅ Form opens in modal
- ✅ Category, province, city dropdowns populated from API
- ✅ City dropdown filtered when province selected
- ✅ Google Maps shows location picker
- ✅ Can drag marker or search address
- ✅ Coordinates auto-fill when marker moved
- ✅ Multiple image upload works (3-5 images)
- ✅ All required fields validated
- ✅ Submit creates billboard
- ✅ Success toast, modal closes, table refreshes
- ✅ New billboard appears in list

**API Sequence:**
1. `GET /api/proxy/category` - Load categories
2. `GET /api/proxy/province` - Load provinces
3. `GET /api/proxy/city?provinceId=X` - Load cities when province selected
4. `POST /api/proxy/billboard` - Create billboard with FormData (images + fields)

### ✅ SELLER-BB-003: Google Maps Location Picker
- **Priority:** HIGH
- **Steps:**
  1. In billboard form, focus on location field
  2. Start typing address
  3. Select from autocomplete suggestions
  4. Observe map update and marker placement
  5. Drag marker to different location
  6. Verify coordinates update
- **Expected:**
  - Google Places Autocomplete works
  - Map centers on selected address
  - Marker draggable
  - Lat/Long fields update in real-time
  - Can manually enter coordinates

### ✅ SELLER-BB-004: Image Upload - Multiple Files
- **Priority:** HIGH
- **Steps:**
  1. Click image upload area
  2. Select 3 image files (JPEG/PNG)
  3. Observe preview thumbnails
  4. Remove one image
  5. Add another image
- **Expected:**
  - Multiple file selection works
  - Previews show for each image
  - Can remove individual images
  - File type validation (JPEG, PNG only)
  - File size validation (max 5MB each)

### ✅ SELLER-BB-005: Edit Billboard
- **Priority:** HIGH
- **API:** `PUT /api/proxy/billboard/{id}`
- **Steps:**
  1. Click "Edit" button on billboard row
  2. Modal opens with pre-filled data
  3. Change status to "Unavailable"
  4. Update rent price to 600000
  5. Click "Save"
- **Expected:**
  - Form pre-filled with existing data
  - Can edit any field
  - Images shown, can add/remove
  - Save updates billboard
  - Table refreshes with updated data

### ✅ SELLER-BB-006: Delete Billboard (Soft Delete)
- **Priority:** MEDIUM
- **API:** `DELETE /api/proxy/billboard/{id}`
- **Steps:**
  1. Click "Delete" button on billboard
  2. Confirmation modal appears
  3. Confirm deletion
- **Expected:**
  - Confirmation modal: "Are you sure?"
  - Deleting performs soft delete
  - Billboard removed from seller's list
  - Billboard moves to recycle bin (admin can restore)
  - Success toast: "Billboard deleted"

### ✅ SELLER-BB-007: Search/Filter Billboards
- **Priority:** MEDIUM
- **Steps:**
  1. Enter search term in search box
  2. Select category filter
  3. Select status filter (Available/Unavailable)
- **Expected:**
  - Real-time search by location/title
  - Filter by category dropdown
  - Filter by status dropdown
  - Table updates immediately

### ✅ SELLER-BB-008: Pagination and Sorting
- **Priority:** MEDIUM
- **Expected:**
  - Pagination controls if >10 billboards
  - Column headers clickable for sorting
  - Sort by: Date, Price, Status

### ✅ SELLER-BB-009: Export to Excel
- **Priority:** LOW
- **Steps:** Click "Export" button
- **Expected:**
  - Excel file downloads
  - Contains all billboard data
  - Formatted with headers

---

## MY TRANSACTIONS TESTS

### ✅ SELLER-TX-001: View Sales Transactions
- **Priority:** HIGH
- **API:** `GET /api/proxy/transaction/mySales`
- **Expected:**
  - Table with transactions where seller is the billboard owner
  - Columns: ID, Buyer, Billboard, Amount, Status, Date, Actions
  - Can filter by status
  - Can view transaction details

### ✅ SELLER-TX-002: Update Transaction Status
- **Priority:** CRITICAL
- **API:** `PUT /api/proxy/transaction/{id}`
- **Steps:**
  1. Click on transaction row
  2. View detail modal
  3. Change status from PENDING to PAID
  4. Save
- **Expected:**
  - Can update status (workflow: PENDING → PAID → COMPLETED)
  - Status badge updates
  - Buyer notified (if notification system exists)

---

## MY PROFILE TESTS

### ✅ SELLER-PROF-001: View Seller Profile
- **Priority:** MEDIUM
- **API:** `GET /api/proxy/seller/me`
- **Expected:**
  - Shows all seller info (fullname, KTP, NPWP, company, addresses)
  - "Edit" button visible

### ✅ SELLER-PROF-002: Edit Seller Profile
- **Priority:** MEDIUM
- **API:** `PUT /api/proxy/seller/me`
- **Steps:**
  1. Click "Edit"
  2. Update company name
  3. Update office address
  4. Save
- **Expected:** Seller info updated, same validation as registration

---

## NOTIFICATIONS TESTS

### ✅ SELLER-NOTIF-001: Notification Bell Icon
- **Priority:** MEDIUM
- **API:** `GET /api/proxy/notification/seller/unread-count`
- **Expected:**
  - Floating button in bottom-right corner
  - Badge shows unread count
  - Clicking opens notification panel

### ✅ SELLER-NOTIF-002: View Notifications
- **Priority:** MEDIUM
- **API:** `GET /api/proxy/notification/seller`
- **Expected:**
  - Panel shows list of notifications
  - Each notification: type, message, date, read/unread status
  - Can mark as read
  - Can dismiss

---

## SELLER FEATURE CHECKLIST

| Feature | Test Cases | Status |
|---------|-----------|--------|
| Seller Registration | REG-001 to REG-007 | ⬜ TODO |
| Dashboard Access | DASH-001 | ⬜ TODO |
| My Billboards | BB-001 to BB-009 | ⬜ TODO |
| Google Maps Integration | BB-003 | ⬜ TODO |
| Image Upload | BB-004 | ⬜ TODO |
| My Transactions | TX-001 to TX-002 | ⬜ TODO |
| My Profile | PROF-001 to PROF-002 | ⬜ TODO |
| Notifications | NOTIF-001 to NOTIF-002 | ⬜ TODO |

**Total Test Cases:** 24  
**Critical:** 6  
**High:** 10  
**Medium:** 7  
**Low:** 1

---

## Critical Data Dependencies

**Before testing seller features, ensure:**

1. **Categories exist** - At least 3-5 categories (Billboard, Videotron, Neon Box, etc.)
2. **Provinces exist** - At least Jakarta, Bandung, Surabaya
3. **Cities exist** - Multiple cities per province
4. **Google Maps API Key** - Configured in environment
5. **Image upload directory** - `/uploads` writable, served via `/api/uploads/`
6. **Test BUYER account** - To upgrade to SELLER

---

## Known Issues & Notes

1. ✅ **FIXED**: Seller registration logout issue - users now stay logged in
2. ⚠️ **Category/Province/City APIs** - Check if public or require auth
3. 📍 **Google Maps** - Requires valid API key in `.env.local`
4. 🖼️ **Image Upload** - Check max file size limits
5. 📊 **Excel Export** - Verify library installed and working
6. 🔔 **Notifications** - May not be fully implemented

---

## API Endpoint Reference

```
# Seller
POST /api/proxy/seller - Register as seller
GET /api/proxy/seller - Get current seller data
GET /api/proxy/seller/me - Get seller profile
PUT /api/proxy/seller/me - Update seller profile

# Billboards
GET /api/proxy/billboard/myBillboards - Seller's billboards
POST /api/proxy/billboard - Create billboard
PUT /api/proxy/billboard/{id} - Update billboard
DELETE /api/proxy/billboard/{id} - Soft delete billboard

# Support Data
GET /api/proxy/category - List categories
GET /api/proxy/province - List provinces
GET /api/proxy/city?provinceId=X - List cities

# Transactions
GET /api/proxy/transaction/mySales - Seller's sales
PUT /api/proxy/transaction/{id} - Update transaction

# Notifications
GET /api/proxy/notification/seller - Seller notifications
GET /api/proxy/notification/seller/unread-count - Unread count
```
