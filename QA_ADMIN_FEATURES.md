# QA TEST CASES - ADMIN FEATURES

**Related to:** QA_TEST_PLAN.md Section 7  
**Role:** ADMIN  
**Date:** February 16, 2026

---

## ADMIN DASHBOARD OVERVIEW

### ✅ ADMIN-DASH-001: Access Admin Dashboard
- **Priority:** CRITICAL
- **Preconditions:** Logged in as ADMIN
- **URL:** `/admin/dashboard`
- **Expected:**
  - Dashboard loads successfully
  - Sidebar with 12 modules visible
  - Statistics cards show counts (users, billboards, transactions)
  - Recent activity table

**Modules:**
1. Dashboard
2. Users
3. Sellers
4. Billboards
5. Transactions
6. Recycle Bin
7. Categories
8. Designs
9. Add-ons
10. Cities
11. Media
12. My Profile

---

## USER MANAGEMENT TESTS

### ✅ ADMIN-USER-001: View Users List
- **Priority:** HIGH
- **API:** `GET /api/proxy/user`
- **Expected:**
  - Table with all users
  - Columns: ID, Username, Email, Phone, Level, Status, Actions
  - Search box
  - Filter by level (BUYER/SELLER/ADMIN)
  - Pagination controls

### ✅ ADMIN-USER-002: Create New User
- **Priority:** CRITICAL
- **API:** `POST /api/proxy/user`
- **Steps:**
  1. Click "Add User" button
  2. Fill form:
     - Username: `admin_test2`
     - Email: `admin2@test.com`
     - Phone: `+6281234567893`
     - Password: `Admin@123`
     - Level: ADMIN (dropdown)
  3. Upload profile picture (optional)
  4. Click "Submit"
- **Expected:**
  - Modal opens with user form
  - All fields validated
  - Level dropdown: BUYER, SELLER, ADMIN
  - User created successfully
  - Table refreshes
  - Success toast: "User created"

### ✅ ADMIN-USER-003: Edit Existing User
- **Priority:** HIGH
- **API:** `PUT /api/proxy/user/{id}`
- **Steps:**
  1. Click "Edit" on user row
  2. Change username to `buyer_updated2`
  3. Change level from BUYER to SELLER
  4. Save
- **Expected:**
  - Form pre-filled with user data
  - Can update any field
  - Password field optional (only if changing)
  - User updated in database

### ✅ ADMIN-USER-004: Delete User
- **Priority:** MEDIUM
- **API:** `DELETE /api/proxy/user/{id}`
- **Steps:**
  1. Click "Delete" on user row
  2. Confirm deletion
- **Expected:**
  - Confirmation modal: "Are you sure you want to delete this user?"
  - User removed from system (hard delete OR soft delete)
  - Table refreshes

### ✅ ADMIN-USER-005: Filter Users by Level
- **Priority:** MEDIUM
- **Steps:**
  1. Select "BUYER" from level filter
  2. Observe filtered results
  3. Select "SELLER"
  4. Select "ADMIN"
  5. Select "ALL"
- **Expected:** Table filters by selected user level

### ✅ ADMIN-USER-006: Search Users
- **Priority:** MEDIUM
- **Steps:** Enter username/email in search box
- **Expected:** Real-time search, table updates

### ✅ ADMIN-USER-007: Export Users to Excel
- **Priority:** LOW
- **Steps:** Click "Export" button
- **Expected:** Excel file downloads with all user data

---

## SELLER MANAGEMENT TESTS

### ✅ ADMIN-SELLER-001: View All Sellers
- **Priority:** HIGH
- **API:** `GET /api/proxy/seller/all`
- **Expected:**
  - Table with all registered sellers
  - Columns: ID, Full Name, Company, KTP, NPWP, Status, Actions
  - View/Edit/Delete buttons

### ✅ ADMIN-SELLER-002: View Seller Details
- **Priority:** MEDIUM
- **API:** `GET /api/proxy/seller/{id}`
- **Steps:** Click "View" on seller row
- **Expected:**
  - Modal shows full seller information
  - All registration fields displayed
  - Associated user account info

### ✅ ADMIN-SELLER-003: Edit Seller Data
- **Priority:** MEDIUM
- **API:** `PUT /api/proxy/seller/{id}`
- **Steps:**
  1. Click "Edit" on seller
  2. Update company name
  3. Update office address
  4. Save
- **Expected:** Seller data updated, same validation as registration

### ✅ ADMIN-SELLER-004: Delete Seller Account
- **Priority:** MEDIUM
- **API:** `DELETE /api/proxy/seller/{id}`
- **Steps:**
  1. Click "Delete" on seller
  2. Confirm deletion
- **Expected:**
  - Seller profile removed
  - User level reverted to BUYER (or user deleted)
  - Associated billboards handled (deleted OR transferred)

---

## BILLBOARD MANAGEMENT TESTS (ADMIN)

### ✅ ADMIN-BB-001: View All Billboards
- **Priority:** HIGH
- **API:** `GET /api/proxy/billboard/all`
- **Expected:**
  - Table with billboards from all sellers
  - Can edit/delete any billboard
  - Same features as seller billboard management

### ✅ ADMIN-BB-002: Create Billboard (Any Seller)
- **Priority:** MEDIUM
- **Steps:** Similar to seller, but can assign to any seller
- **Expected:** Admin can create billboard for any seller account

### ✅ ADMIN-BB-003: Edit Any Billboard
- **Priority:** MEDIUM
- **Steps:** Edit billboard owned by another seller
- **Expected:** Admin has permission, billboard updated

### ✅ ADMIN-BB-004: Delete Any Billboard
- **Priority:** MEDIUM
- **Steps:** Delete billboard
- **Expected:** Soft delete, moves to recycle bin

---

## RECYCLE BIN TESTS

### ✅ ADMIN-RB-001: View Deleted Billboards
- **Priority:** HIGH
- **API:** `GET /api/proxy/billboard/recycle-bin`
- **Expected:**
  - Table with soft-deleted billboards
  - Shows: ID, Title, Deleted Date, Original Owner
  - "Restore" and "Purge" buttons

### ✅ ADMIN-RB-002: Restore Billboard
- **Priority:** HIGH
- **API:** `POST /api/proxy/billboard/{id}/restore`
- **Steps:**
  1. Click "Restore" on deleted billboard
  2. Confirm restoration
- **Expected:**
  - Billboard restored to active state
  - Removed from recycle bin
  - Appears in billboard list again
  - Owner can see it in their dashboard

### ✅ ADMIN-RB-003: Permanently Delete (Purge)
- **Priority:** HIGH
- **API:** `DELETE /api/proxy/billboard/{id}/purge?confirm=true`
- **Steps:**
  1. Click "Purge" on deleted billboard
  2. Confirmation modal: "This action is PERMANENT"
  3. Type "CONFIRM" or click final confirm
  4. Delete permanently
- **Expected:**
  - Strong confirmation required
  - Billboard permanently removed from database
  - Cannot be restored
  - Success message: "Billboard permanently deleted"

---

## TRANSACTION MANAGEMENT TESTS

### ✅ ADMIN-TX-001: View All Transactions
- **Priority:** CRITICAL
- **API:** `GET /api/proxy/transaction/all`
- **Expected:**
  - Table with all transactions (buyers + sellers)
  - Columns: ID, Buyer, Seller, Billboard, Amount, Status, Date, Actions
  - Filter by status
  - Search by transaction ID

### ✅ ADMIN-TX-002: View Transaction Details
- **Priority:** HIGH
- **Steps:** Click on transaction row
- **Expected:**
  - Modal shows full transaction details:
    - Buyer info
    - Seller info
    - Billboard details
    - Selected add-ons
    - Pricing breakdown
    - Payment info
    - Status history

### ✅ ADMIN-TX-003: Update Transaction Status
- **Priority:** CRITICAL
- **API:** `PUT /api/proxy/transaction/{id}`
- **Steps:**
  1. Click "Edit" on transaction
  2. Change status from PENDING to PAID
  3. Save
- **Expected:**
  - Can update status
  - Status change logged
  - Buyer/Seller notified

### ✅ ADMIN-TX-004: Bulk Delete by Status
- **Priority:** MEDIUM
- **API:** `DELETE /api/proxy/transaction?status={status}`
- **Steps:**
  1. Click "Bulk Delete" button
  2. Modal opens with status selector
  3. Select status: "CANCELLED"
  4. Confirm deletion
- **Expected:**
  - Modal shows: "Select status to delete all transactions"
  - Dropdown: PENDING, CANCELLED, EXPIRED, REJECTED
  - Confirmation: "Delete all [status] transactions?"
  - All transactions with selected status deleted
  - Success toast: "X transactions deleted"

---

## CATEGORY MANAGEMENT TESTS

### ✅ ADMIN-CAT-001: View Categories
- **Priority:** MEDIUM
- **API:** `GET /api/proxy/category`
- **Expected:**
  - Simple table: ID, Name, Description
  - CRUD buttons

### ✅ ADMIN-CAT-002: Create Category
- **Priority:** MEDIUM
- **API:** `POST /api/proxy/category`
- **Form:** Name* (required), Description (optional)
- **Steps:**
  1. Click "Add Category"
  2. Name: `LED Display`
  3. Description: `Modern LED billboard displays`
  4. Submit
- **Expected:** Category created, table refreshes

### ✅ ADMIN-CAT-003: Edit Category
- **Priority:** MEDIUM
- **API:** `PUT /api/proxy/category/{id}`
- **Expected:** Can update name and description

### ✅ ADMIN-CAT-004: Delete Category
- **Priority:** MEDIUM
- **API:** `DELETE /api/proxy/category/{id}`
- **Expected:**
  - Confirmation modal
  - Check if category used by billboards
  - Warning if in use
  - Deleted if confirmed

---

## DESIGN MANAGEMENT TESTS

### ✅ ADMIN-DES-001: View Design Templates
- **Priority:** MEDIUM
- **API:** `GET /api/proxy/design`
- **Expected:**
  - Table: ID, Name, Description, Price, Files
  - View design files/thumbnails

### ✅ ADMIN-DES-002: Create Design Template
- **Priority:** MEDIUM
- **API:** `POST /api/proxy/design`
- **Form:**
  - Name*: `Modern Corporate Design`
  - Description: `Professional design for corporate clients`
  - Price*: 1500000
  - Files*: Upload design files (PSD, AI, PDF)
- **Steps:**
  1. Fill form
  2. Upload multiple design files
  3. Submit
- **Expected:**
  - Design created
  - Files uploaded and associated
  - Available for selection during booking

### ✅ ADMIN-DES-003: Delete Design
- **Priority:** LOW
- **API:** `DELETE /api/proxy/design/{id}`
- **Expected:** Design removed (check if used in transactions first)

---

## ADD-ON MANAGEMENT TESTS

### ✅ ADMIN-ADDON-001: View Add-Ons
- **Priority:** MEDIUM
- **API:** `GET /api/proxy/add-on`
- **Expected:** Table: ID, Name, Description, Price

### ✅ ADMIN-ADDON-002: Create Add-On
- **Priority:** MEDIUM
- **API:** `POST /api/proxy/add-on`
- **Form:**
  - Name*: `Premium Installation`
  - Description: `Professional installation with warranty`
  - Price*: 500000
- **Expected:**
  - Add-on created
  - Available in booking flow immediately

### ✅ ADMIN-ADDON-003: Edit/Delete Add-On
- **Priority:** MEDIUM
- **APIs:** `PUT /api/proxy/add-on/{id}`, `DELETE /api/proxy/add-on/{id}`
- **Expected:** Standard edit/delete functionality

---

## CITY MANAGEMENT TESTS

### ✅ ADMIN-CITY-001: View Cities
- **Priority:** MEDIUM
- **API:** `GET /api/proxy/city`
- **Expected:**
  - Table: ID, City Name, Province, Actions
  - Filter by province

### ✅ ADMIN-CITY-002: Create City
- **Priority:** MEDIUM
- **API:** `POST /api/proxy/city`
- **Form:**
  - Province*: DKI Jakarta (dropdown)
  - City Name*: Jakarta Utara
- **Steps:**
  1. Select province
  2. Enter city name
  3. Submit
- **Expected:**
  - City created under selected province
  - Available in billboard location dropdowns

### ✅ ADMIN-CITY-003: Edit/Delete City
- **Priority:** LOW
- **Expected:**
  - Can update city name or province
  - Delete checks if city used by billboards

---

## MEDIA GALLERY TESTS

### ✅ ADMIN-MEDIA-001: View Media Library
- **Priority:** LOW
- **API:** `GET /api/proxy/media`
- **Expected:**
  - Grid view of uploaded files
  - Thumbnails for images
  - File names, sizes, upload dates
  - Delete button for each file

### ✅ ADMIN-MEDIA-002: Upload Media Files
- **Priority:** LOW
- **Steps:**
  1. Click "Upload" button
  2. Select multiple files
  3. Upload
- **Expected:** Files uploaded to `/uploads/` directory

### ✅ ADMIN-MEDIA-003: Delete Media Files
- **Priority:** LOW
- **Expected:**
  - Can delete unused files
  - Warning if file in use by billboard/user
  - Confirmation required

---

## MY PROFILE (ADMIN)

### ✅ ADMIN-PROF-001: View/Edit Admin Profile
- **Priority:** MEDIUM
- **Expected:** Same as buyer/seller profile management

---

## ADMIN FEATURE CHECKLIST

| Module | Test Cases | Status |
|--------|-----------|--------|
| Dashboard | DASH-001 | ⬜ TODO |
| User Management | USER-001 to USER-007 | ⬜ TODO |
| Seller Management | SELLER-001 to SELLER-004 | ⬜ TODO |
| Billboard Management | BB-001 to BB-004 | ⬜ TODO |
| Recycle Bin | RB-001 to RB-003 | ⬜ TODO |
| Transaction Management | TX-001 to TX-004 | ⬜ TODO |
| Category Management | CAT-001 to CAT-004 | ⬜ TODO |
| Design Management | DES-001 to DES-003 | ⬜ TODO |
| Add-On Management | ADDON-001 to ADDON-003 | ⬜ TODO |
| City Management | CITY-001 to CITY-003 | ⬜ TODO |
| Media Gallery | MEDIA-001 to MEDIA-003 | ⬜ TODO |
| Admin Profile | PROF-001 | ⬜ TODO |

**Total Test Cases:** 43  
**Critical:** 5  
**High:** 13  
**Medium:** 22  
**Low:** 3

---

## Critical Admin Workflows to Test

### 1. User Lifecycle Management
```
Create User → Edit User → Change Level → Delete User
```

### 2. Billboard Lifecycle
```
Create → Edit → Delete → Recycle Bin → Restore OR Purge
```

### 3. Transaction Management
```
View All → Filter by Status → View Details → Update Status → Bulk Delete
```

### 4. Master Data Management
```
Categories → Cities → Add-Ons → Designs
Create → Edit → Delete (check dependencies first)
```

---

## Security Considerations

**Test that ONLY ADMIN can:**
- ✅ Access `/admin/dashboard`
- ✅ Create/Edit/Delete users
- ✅ View all transactions
- ✅ Access recycle bin
- ✅ Permanently delete data
- ✅ Bulk delete transactions
- ✅ Manage master data (categories, cities, etc.)

**Test that ADMIN middleware protection works:**
- ❌ BUYER user accessing `/admin/dashboard` → Redirect to `/dashboard`
- ❌ SELLER user accessing `/admin/dashboard` → Redirect to `/seller/dashboard`
- ❌ Not logged in → Redirect to `/login`

---

## Data Cleanup After Testing

After admin testing, clean up test data:

1. Delete test users created
2. Delete test billboards
3. Purge recycle bin
4. Delete test categories/add-ons (if not needed)
5. Delete test transactions

---

## API Endpoint Reference

```
# Users
GET /api/proxy/user - List all users
POST /api/proxy/user - Create user
PUT /api/proxy/user/{id} - Update user
DELETE /api/proxy/user/{id} - Delete user

# Sellers
GET /api/proxy/seller/all - List all sellers
GET /api/proxy/seller/{id} - Get seller details
PUT /api/proxy/seller/{id} - Update seller
DELETE /api/proxy/seller/{id} - Delete seller

# Billboards (Admin)
GET /api/proxy/billboard/all - All billboards
POST /api/proxy/billboard - Create billboard
PUT /api/proxy/billboard/{id} - Update billboard
DELETE /api/proxy/billboard/{id} - Soft delete

# Recycle Bin
GET /api/proxy/billboard/recycle-bin - Deleted billboards
POST /api/proxy/billboard/{id}/restore - Restore billboard
DELETE /api/proxy/billboard/{id}/purge?confirm=true - Permanent delete

# Transactions
GET /api/proxy/transaction/all - All transactions
PUT /api/proxy/transaction/{id} - Update transaction
DELETE /api/proxy/transaction?status={status} - Bulk delete by status

# Categories
GET /api/proxy/category - List categories
POST /api/proxy/category - Create category
PUT /api/proxy/category/{id} - Update category
DELETE /api/proxy/category/{id} - Delete category

# Designs
GET /api/proxy/design - List designs
POST /api/proxy/design - Create design
PUT /api/proxy/design/{id} - Update design
DELETE /api/proxy/design/{id} - Delete design

# Add-Ons
GET /api/proxy/add-on - List add-ons
POST /api/proxy/add-on - Create add-on
PUT /api/proxy/add-on/{id} - Update add-on
DELETE /api/proxy/add-on/{id} - Delete add-on

# Cities
GET /api/proxy/city - List cities
POST /api/proxy/city - Create city
PUT /api/proxy/city/{id} - Update city
DELETE /api/proxy/city/{id} - Delete city

# Media
GET /api/proxy/media - Media library
POST /api/proxy/media - Upload files
DELETE /api/proxy/media/{id} - Delete file
```
