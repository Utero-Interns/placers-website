# QA TEST CASES - BUYER FEATURES

**Related to:** QA_TEST_PLAN.md Section 5  
**Role:** BUYER  
**Date:** February 16, 2026

---

## BUYER DASHBOARD TESTS

### ✅ BUYER-DASH-001: Access Dashboard After Login
- **Priority:** CRITICAL
- **Steps:**
  1. Login with buyer credentials
  2. Verify redirect to `/dashboard`
  3. Check sidebar shows: Dashboard, Homepage, History, Bookmark, Profile tabs
- **Expected:** Dashboard loads, all tabs visible, no errors
- **API:** `GET /api/proxy/auth/me`

### ✅ BUYER-DASH-002: Tab Navigation
- **Priority:** HIGH
- **Steps:** Click each tab, verify content switches
- **Expected:** Smooth tab switching, active tab highlighted

---

## BOOKING FLOW TESTS (CRITICAL FEATURE)

### ✅ BUYER-BOOK-001: Access Booking Page
- **Priority:** CRITICAL
- **URL:** `/booking/[billboard-id]`
- **Expected:** 4-step wizard loads (Data Pemesanan, Add-On, Include, Review)

###

 ✅ BUYER-BOOK-002: Step 1 - Fill Period Dates
- **Priority:** CRITICAL  
- **Fields:** Periode Awal* (required), Periode Akhir* (required)
- **Steps:**
  1. Select start date: 2026-03-01
  2. Select end date: 2026-04-01
  3. Click Next
- **Expected:** Dates accepted, Next enabled, advances to Step 2

### ✅ BUYER-BOOK-003: Step 1 - Validation (Empty Dates)
- **Priority:** HIGH
- **Steps:** Try clicking Next without selecting dates
- **Expected:** Next button disabled OR validation error shown

### ✅ BUYER-BOOK-004: Step 2 - Select Add-Ons
- **Priority:** HIGH
- **API:** `GET /api/add-on` - fetches available add-ons
- **Steps:**
  1. Check/uncheck add-on checkboxes
  2. Set AR quantity to 2
  3. Set Traffic Data quantity to 1
  4. Enter notes: "Test booking notes"
  5. Click Next
- **Expected:** Add-ons selected, data persists, advances to Step 3

### ✅ BUYER-BOOK-005: Step 3 - Included Services (Read-Only)
- **Priority:** MEDIUM
- **Expected:** 
  - Shows 6 included services
  - Informational only (no inputs)
  - Back/Next work

### ✅ BUYER-BOOK-006: Step 4 - Review Summary
- **Priority:** CRITICAL
- **Expected:**
  - Periode Sewa: 2026-03-01 - 2026-04-01
  - Selected add-ons listed
  - Notes displayed
  - Submit button visible

### ✅ BUYER-BOOK-007: Successful Submission
- **Priority:** CRITICAL
- **API:** `POST /api/transaction`
- **Payload:**
  ```json
  {
    "billboardId": "string",
    "addOnIds": ["id1", "id2"],
    "designId": null,
    "startDate": "2026-03-01",
    "endDate": "2026-04-01"
  }
  ```
- **Expected:**
  - Success screen with checkmark
  - Toast: "Booking berhasil dibuat!"
  - Transaction created in database
  - Status: PENDING

### ⚠️ BUYER-BOOK-008: Error Handling
- **Priority:** HIGH
- **Error Messages (Indonesian):**
  - 401: "Sesi Anda telah berakhir. Silakan login kembali."
  - 400: "Data yang Anda masukkan tidak valid."
  - 404: "Billboard tidak ditemukan."
  - 409: "Periode yang Anda pilih sudah dibooking."
  - Network: "Koneksi bermasalah. Periksa internet Anda."
- **Expected:** Specific error shown, form remains on Step 4, can retry

---

## BOOKMARK TESTS

### ✅ BUYER-BM-001: View Bookmarks
- **API:** `GET /api/bookmark/mybookmark`
- **Expected:** Grid of bookmarked billboards, or "No bookmarks" message

### ✅ BUYER-BM-002: Search/Filter Bookmarks
- **Steps:** 
  1. Enter search term
  2. Select status filter
  3. Select category filter
- **Expected:** Real-time filtering works

### ✅ BUYER-BM-003: Edit Mode - Bulk Delete
- **Priority:** HIGH
- **Steps:**
  1. Click "Edit" button
  2. Check "Select All"
  3. Click "Delete Selected"
  4. Confirm deletion
- **API:** `DELETE /api/bookmark/{id}` for each selected
- **Expected:**
  - Checkboxes appear
  - Select all/individual works
  - Optimistic UI update (immediate removal)
  - If API fails: restore + error toast

---

## ORDER HISTORY TESTS

### ✅ BUYER-OH-001: View Order History
- **API:** `GET /api/history?take=3&cursor=undefined`
- **Expected:**
  - Order cards with: ID, status badge, date, location, price
  - Pagination controls
  - Empty state if no orders

### ✅ BUYER-OH-002: Status Badges
- **Colors:**
  - PENDING: Gray/Yellow
  - PAID: Blue
  - COMPLETED: Green
  - CANCELLED/REJECTED: Red
  - EXPIRED: Orange
- **Expected:** Correct color and text for each status

### ✅ BUYER-OH-003: Filter by Status Tabs
- **Tabs:** Semua, Upcoming, Ongoing, Completed
- **Expected:** Each tab filters correctly

### ✅ BUYER-OH-004: Pagination
- **Features:** Rows per page (3/5/10), Previous/Next, Page numbers
- **Expected:** Cursor-based pagination, smooth navigation

### ✅ BUYER-OH-005: View Order Detail Modal
- **Steps:** Click "Lihat Detail" on order card
- **Expected:** Modal opens with full order details

### ✅ BUYER-OH-006: View Invoice
- **Steps:** Click "Lihat Nota"
- **Expected:** Print-friendly invoice layout

---

## PAYMENT FLOW TESTS

### ⚠️ BUYER-PAY-001: Payment Page (UI ONLY - Integration Pending)
- **Priority:** CRITICAL
- **URL:** `/payment/[transaction-id]`
- **Payment Methods:**
  - Bank Transfer: BCA, BNI, Mandiri, BRI
  - E-Wallet: DANA, OVO, GoPay, ShopeePay
  - Virtual Account
  - Credit/Debit Card
- **Expected:** Payment method selection, order summary
- **KNOWN ISSUE:** No actual payment gateway integration yet

---

## PROFILE TESTS

### ✅ BUYER-PROF-001: View Profile
- **API:** `GET ${API_BASE_URL}/user/profile/me`
- **Expected:** Displays username, email, phone, profile picture

### ✅ BUYER-PROF-002: Edit Profile
- **API:** `PUT ${API_BASE_URL}/user/me`
- **Steps:**
  1. Click "Edit Profile"
  2. Change username
  3. Change phone
  4. Click Save
- **Expected:** Profile updated, success toast

### ✅ BUYER-PROF-003: Change Password
- **API:** `PUT ${API_BASE_URL}/user/password`
- **Fields:** oldPassword, newPassword
- **Expected:** Password updated, success alert

### ✅ BUYER-PROF-004: Upload Profile Picture
- **Steps:** Select image, preview, save
- **Expected:** Image uploaded, served via `/api/uploads/`

---

## BUYER FEATURE CHECKLIST

| Feature | Test Cases | Status |
|---------|-----------|--------|
| Dashboard Access | DASH-001, DASH-002 | ⬜ TODO |
| Booking Flow | BOOK-001 to BOOK-008 | ⬜ TODO |
| Bookmarks | BM-001 to BM-003 | ⬜ TODO |
| Order History | OH-001 to OH-006 | ⬜ TODO |
| Payment | PAY-001 | ⬜ TODO (UI only) |
| Profile | PROF-001 to PROF-004 | ⬜ TODO |

**Total Test Cases:** 23  
**Critical:** 8  
**High:** 10  
**Medium:** 5

---

## Notes for QA Testers

1. **Booking is the most critical flow** - test thoroughly
2. **Error messages should be in Indonesian** - verify all error texts
3. **Bookmark bulk delete** - verify optimistic updates and rollback on failure
4. **Payment is UI only** - no actual charges will process
5. **Profile picture** - check if upload endpoint exists before testing
