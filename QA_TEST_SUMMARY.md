# PLACERS WEBSITE - QA TEST SUMMARY & EXECUTION GUIDE

**Version:** 1.0  
**Date:** February 16, 2026  
**Project:** Placers Billboard Advertising Marketplace

---

## 📋 DOCUMENTATION OVERVIEW

This QA testing suite consists of 4 comprehensive documents:

| Document | Purpose | Test Cases |
|----------|---------|------------|
| **QA_TEST_PLAN.md** | Main test plan with public features (Sections 1-4) | 40+ cases |
| **QA_BUYER_FEATURES.md** | BUYER role features and workflows | 23 cases |
| **QA_SELLER_FEATURES.md** | SELLER role features and workflows | 24 cases |
| **QA_ADMIN_FEATURES.md** | ADMIN role features and workflows | 43 cases |
| **QA_TEST_SUMMARY.md** | This document - execution guide and matrix | Summary |

**Total Test Cases:** ~130+ detailed test cases

---

## 🎯 TESTING PRIORITIES

### CRITICAL Features (Must Pass for Launch)
1. ✅ User Authentication (Login/Register/Logout)
2. ✅ Booking Flow (4-step wizard)
3. ✅ Billboard Browsing and Detail
4. ✅ Seller Registration
5. ✅ Billboard Creation (Seller/Admin)
6. ✅ Transaction Management
7. ✅ Role-Based Access Control

### HIGH Priority Features
1. ✅ Search and Filters
2. ✅ Bookmark Management
3. ✅ Order History
4. ✅ Profile Management
5. ✅ Image Upload
6. ✅ Google Maps Integration

### MEDIUM Priority Features
1. ⬜ Seller Dashboard Stats
2. ⬜ Admin Master Data Management
3. ⬜ Notifications
4. ⬜ Excel Export

### LOW Priority Features
1. ⬜ Blog/Promo (Mock data currently)
2. ⬜ Media Gallery
3. ⬜ Seller Follow Button

---

## 🗂️ TEST EXECUTION ORDER

### Phase 1: Foundation (Day 1)
**Goal:** Verify core auth and navigation

1. **Setup Test Environment**
   - Configure `.env.local`
   - Start frontend and backend
   - Create test database
   - Prepare test user accounts

2. **Authentication Tests**
   - AUTH-001 to AUTH-012
   - Create BUYER, SELLER, ADMIN accounts
   - Verify login/logout/registration

3. **Public Pages Tests**
   - PUB-LP-001 to PUB-LP-003 (Landing Page)
   - PUB-HP-001 to PUB-HP-005 (Homepage)
   - PUB-BD-001 to PUB-BD-003 (Billboard Detail basic)

**Deliverable:** Authentication works, public pages load

---

### Phase 2: Buyer Journey (Day 2)
**Goal:** Complete buyer user flows

1. **Billboard Browsing**
   - PUB-HP (complete)
   - PUB-BD (complete)
   - Search, filter, pagination

2. **Booking Flow** (CRITICAL)
   - BUYER-BOOK-001 to BUYER-BOOK-008
   - Test all 4 steps
   - Validate error handling
   - Verify transaction created

3. **Buyer Dashboard**
   - BUYER-DASH-001, BUYER-DASH-002
   - Navigate all tabs
   - Verify dashboard loads

4. **Order History**
   - BUYER-OH-001 to BUYER-OH-007
   - View orders
   - Check status badges
   - Test pagination

5. **Bookmarks**
   - BUYER-BM-001 to BUYER-BM-003
   - Add/remove bookmarks
   - Bulk delete

**Deliverable:** Buyer can browse, book, and view history

---

### Phase 3: Seller Journey (Day 3)
**Goal:** Verify seller can manage billboards

1. **Seller Registration**
   - SELLER-REG-001 to SELLER-REG-007
   - Register as seller
   - Verify session refresh fix
   - Access seller dashboard

2. **Billboard Management**
   - SELLER-BB-001 to SELLER-BB-009
   - Create new billboard (full form)
   - Google Maps location picker
   - Upload images
   - Edit billboard
   - Delete billboard (soft)

3. **Transaction Management**
   - SELLER-TX-001, SELLER-TX-002
   - View sales
   - Update transaction status

4. **Seller Profile**
   - SELLER-PROF-001, SELLER-PROF-002
   - View/edit seller info

**Deliverable:** Seller can create/manage billboards and view sales

---

### Phase 4: Admin Management (Day 4-5)
**Goal:** Verify admin can manage entire platform

1. **User Management**
   - ADMIN-USER-001 to ADMIN-USER-007
   - CRUD operations on users
   - Filter and search

2. **Seller Management**
   - ADMIN-SELLER-001 to ADMIN-SELLER-004
   - View/edit/delete sellers

3. **Billboard Management**
   - ADMIN-BB-001 to ADMIN-BB-004
   - Manage all billboards
   - Recycle Bin (ADMIN-RB-001 to ADMIN-RB-003)

4. **Transaction Management**
   - ADMIN-TX-001 to ADMIN-TX-004
   - View all transactions
   - Update statuses
   - Bulk delete by status

5. **Master Data Management**
   - Categories (ADMIN-CAT-001 to ADMIN-CAT-004)
   - Designs (ADMIN-DES-001 to ADMIN-DES-003)
   - Add-Ons (ADMIN-ADDON-001 to ADMIN-ADDON-003)
   - Cities (ADMIN-CITY-001 to ADMIN-CITY-003)

**Deliverable:** Admin has full control over platform

---

### Phase 5: Integration & Edge Cases (Day 6)
**Goal:** Test integrations and error scenarios

1. **Google OAuth**
   - Test login/register with Google
   - Verify backend sync issue

2. **Google Maps**
   - Location picker in billboard form
   - Autocomplete
   - Marker dragging

3. **File Uploads**
   - Profile pictures
   - Billboard images
   - Design files
   - Size/type validation

4. **Payment Flow** (UI Only)
   - Test payment page
   - Select methods
   - Confirm (no actual charge)

5. **Error Scenarios**
   - Invalid API responses
   - Network errors
   - Validation failures
   - Unauthorized access
   - Not found pages

**Deliverable:** Edge cases handled gracefully

---

### Phase 6: Cross-Cutting Concerns (Day 7)
**Goal:** Test non-functional requirements

1. **Responsive Design**
   - Test on mobile (375px, 360px)
   - Test on tablet (768px)
   - Test on desktop (1366px, 1920px)
   - Verify all pages responsive

2. **Loading States**
   - All pages show loading
   - Spinner + Indonesian text
   - No content flash

3. **Error Boundaries**
   - Trigger errors
   - Verify error pages show
   - No white screen crashes

4. **Authorization**
   - Test middleware redirects
   - BUYER → tries accessing `/admin` → redirect
   - SELLER → tries accessing admin → redirect
   - Not logged in → redirect to login

5. **SEO & Accessibility**
   - Check meta tags
   - Check page titles
   - Verify structured data

**Deliverable:** Professional UX across all devices

---

## 📊 TEST RESULTS TRACKING

### Test Case Status Matrix

| Feature Area | Total Cases | Passed | Failed | Blocked | Not Run |
|--------------|-------------|--------|--------|---------|---------|
| **Public Features** | 40 | 0 | 0 | 0 | 40 |
| Authentication | 12 | 0 | 0 | 0 | 12 |
| Homepage & Browsing | 10 | 0 | 0 | 0 | 10 |
| Billboard Detail | 11 | 0 | 0 | 0 | 11 |
| Blog & Promo | 3 | 0 | 0 | 0 | 3 |
| Seller Profile | 1 | 0 | 0 | 0 | 1 |
| **Buyer Features** | 23 | 0 | 0 | 0 | 23 |
| Dashboard | 2 | 0 | 0 | 0 | 2 |
| Booking Flow | 8 | 0 | 0 | 0 | 8 |
| Bookmarks | 3 | 0 | 0 | 0 | 3 |
| Order History | 6 | 0 | 0 | 0 | 6 |
| Payment | 1 | 0 | 0 | 0 | 1 |
| Profile | 4 | 0 | 0 | 0 | 4 |
| **Seller Features** | 24 | 0 | 0 | 0 | 24 |
| Seller Registration | 7 | 0 | 0 | 0 | 7 |
| Dashboard | 1 | 0 | 0 | 0 | 1 |
| Billboard Management | 9 | 0 | 0 | 0 | 9 |
| Transaction Management | 2 | 0 | 0 | 0 | 2 |
| Profile | 2 | 0 | 0 | 0 | 2 |
| Notifications | 2 | 0 | 0 | 0 | 2 |
| **Admin Features** | 43 | 0 | 0 | 0 | 43 |
| Dashboard | 1 | 0 | 0 | 0 | 1 |
| User Management | 7 | 0 | 0 | 0 | 7 |
| Seller Management | 4 | 0 | 0 | 0 | 4 |
| Billboard Management | 4 | 0 | 0 | 0 | 4 |
| Recycle Bin | 3 | 0 | 0 | 0 | 3 |
| Transaction Management | 4 | 0 | 0 | 0 | 4 |
| Category Management | 4 | 0 | 0 | 0 | 4 |
| Design Management | 3 | 0 | 0 | 0 | 3 |
| Add-On Management | 3 | 0 | 0 | 0 | 3 |
| City Management | 3 | 0 | 0 | 0 | 3 |
| Media Gallery | 3 | 0 | 0 | 0 | 3 |
| Admin Profile | 1 | 0 | 0 | 0 | 1 |
| **TOTAL** | **130** | **0** | **0** | **0** | **130** |

---

## ⚠️ KNOWN ISSUES TO VERIFY DURING TESTING

### 1. Google OAuth Not Synced (AUTH-005)
- **Issue:** Users authenticated via Google may fail middleware checks
- **Impact:** Cannot access protected routes
- **Backend Fix Needed:** `POST /auth/oauth/google` to sync with database
- **Test:** Try login with Google → check dashboard access

### 2. Forgot Password Endpoint Missing (AUTH-011)
- **Issue:** `POST /auth/forgot-password` returns 404
- **Impact:** Password reset flow incomplete
- **Backend Fix Needed:** Implement endpoint
- **Test:** Submit forgot password form → expect 404

### 3. Blog and Promo Mock Data (PUB-BLOG, PUB-PROMO)
- **Issue:** Not connected to backend
- **Impact:** Cannot manage blog/promo via admin
- **Backend Fix Needed:** Implement blog/promo endpoints
- **Test:** Verify static data loads

### 4. Payment Gateway Not Integrated (BUYER-PAY-001)
- **Issue:** UI only, no actual payment processing
- **Impact:** Cannot accept real payments
- **Backend Fix Needed:** Midtrans/Xendit integration
- **Test:** Select payment method → confirm (no charge occurs)

### 5. Seller Registration Logout Issue (SELLER-REG-007) ✅ FIXED
- **Previous Issue:** User logged out after seller registration
- **Current Status:** Fixed - users stay logged in
- **Test:** Register as seller → verify redirect to seller dashboard works

### 6. Profile Picture Upload Endpoint (BUYER-PROF-004)
- **Issue:** Unclear if dedicated endpoint exists
- **Expected:** `POST ${API_BASE_URL}/user/profile-picture`
- **Test:** Try uploading profile picture → verify endpoint

---

## 🐛 BUG REPORTING TEMPLATE

When you find a bug during testing, report it with:

```markdown
### Bug ID: BUG-001
**Title:** [Short description]
**Severity:** Critical / High / Medium / Low
**Test Case:** [e.g., BUYER-BOOK-007]
**Environment:** Development / Staging
**User Role:** BUYER / SELLER / ADMIN / Public

**Steps to Reproduce:**
1. Login as BUYER
2. Navigate to booking page
3. Click Submit on Step 4
4. Observe error

**Expected Result:**
- Booking should be created
- Success screen should appear

**Actual Result:**
- Error toast: "500 Internal Server Error"
- Form stays on Step 4
- No transaction created

**API Response:**
```
POST /api/transaction
Status: 500
{
  "status": false,
  "message": "Database connection failed"
}
```

**Screenshots:**
[Attach screenshot]

**Console Errors:**
[Paste console output]

**Priority:** High (blocks buyer journey)
**Assigned To:** Backend Team
**Related Files:** `services/bookingService.ts`, backend transaction controller
```

---

## ✅ TEST COMPLETION CRITERIA

### Definition of "Done" for Each Test Case:
- ✅ Test executed according to steps
- ✅ Actual result matches expected result
- ✅ API calls verified (correct endpoint, payload, response)
- ✅ Screenshots captured
- ✅ Pass/Fail status recorded
- ✅ Bugs reported (if any)

### Definition of "Ready for Production":
- ✅ All CRITICAL test cases PASSED
- ✅ 95%+ of HIGH priority test cases PASSED
- ✅ All known issues documented
- ✅ Regression testing completed after bug fixes
- ✅ Cross-browser testing completed (Chrome, Firefox, Safari)
- ✅ Responsive design verified on mobile/tablet/desktop
- ✅ Performance acceptable (<3s page load)

---

## 📝 TEST DATA SETUP CHECKLIST

Before starting QA, ensure you have:

### Test Accounts
- [ ] BUYER account: `buyer@test.com` / `Test@123`
- [ ] SELLER account: `seller@test.com` / `Test@123`
- [ ] ADMIN account: `admin@test.com` / `Test@123`

### Master Data
- [ ] At least 5 categories (Billboard, Videotron, Neon Box, LED Display, Megatron)
- [ ] At least 3 provinces (DKI Jakarta, Jawa Barat, Jawa Timur)
- [ ] At least 10 cities across provinces
- [ ] At least 3 add-ons (Design Service, Installation, Maintenance)
- [ ] At least 2 design templates

### Test Billboards
- [ ] 10+ billboards with different categories
- [ ] Billboards in different cities
- [ ] Mix of Available/Unavailable statuses
- [ ] Billboards with multiple images
- [ ] Billboards with different price ranges

### Google API
- [ ] Google Maps API key configured in `.env.local`
- [ ] Google OAuth client ID configured

---

## 🚀 QUICK START GUIDE FOR QA TESTERS

1. **Clone Repository & Install**
   ```bash
   git clone [repo-url]
   cd placers-website
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with correct API URL, Google keys
   ```

3. **Start Frontend**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

4. **Read Documentation**
   - Start with `QA_TEST_PLAN.md` for overview
   - Review `QA_BUYER_FEATURES.md` for buyer tests
   - Review `QA_SELLER_FEATURES.md` for seller tests
   - Review `QA_ADMIN_FEATURES.md` for admin tests

5. **Begin Testing**
   - Follow test execution order (Phase 1-6)
   - Use test data from checklist
   - Record results in tracking matrix
   - Report bugs with template

---

## 📧 CONTACT & SUPPORT

**Questions about test cases?**  
Contact: QA Lead

**Backend API issues?**  
Contact: Backend Team

**Frontend bugs?**  
Create issue in GitHub repo

---

## 🎉 COMPLETION REPORT TEMPLATE

After testing, provide summary:

```markdown
# QA Testing Completion Report

**Date:** [Date]
**Tested By:** [Name]
**Environment:** Development

## Summary
- Total Test Cases: 130
- Passed: X
- Failed: Y
- Blocked: Z
- Not Run: W

## Critical Issues Found
1. [Issue 1]
2. [Issue 2]

## Recommendations
- [ ] Ready for staging deployment
- [ ] Ready for production deployment
- [ ] Requires bug fixes before deployment

## Notes
[Additional observations]
```

---

**Happy Testing! 🧪**
