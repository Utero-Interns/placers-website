# 🔍 COMPREHENSIVE QA ERROR REPORT - Placers Website

**Generated:** 2026-02-16  
**Testing Type:** Whitebox + Blackbox Analysis  
**Backend API Reference:** `D:\UTERO\Placers_API.postman_collection.json`

---

## 📊 EXECUTIVE SUMMARY

| **Category** | **Count** |
|--------------|-----------|
| 🔴 Critical Errors | 12 |
| 🟡 High Priority | 11 |
| 🟠 Medium Priority | 13 |
| 🟢 Low Priority | 14 |
| **TOTAL ISSUES** | **50** |

### **Status Overview**

| **Status** | **Count** |
|------------|-----------|
| ✅ Working Features | 17 |
| ❌ Broken/Missing Features | 17 |
| ⚠️ Missing Backend Endpoints | 28 |

---

## 🔴 CRITICAL ERRORS (12)

### 1. **BUILD ERROR - Missing Pagination Props**
- **File:** `app/dashboard/components/HomepageTab.tsx`
- **Line:** 76
- **Severity:** 🔴 CRITICAL (Blocks Build)
- **Description:** Pagination component missing required props
- **Error Message:** 
  ```
  Type '{}' is missing the following properties from type 'PaginationProps': 
  totalData, currentPage, onPageChange
  ```
- **Expected:** `<Pagination totalData={filteredBillboards.length} currentPage={1} onPageChange={handlePageChange} />`
- **Actual:** `<Pagination />`
- **Impact:** Build fails, cannot deploy to production
- **Fix:** Add pagination state and props

---

### 2. **MOCK DATA IN PRODUCTION - Profile Service**
- **File:** `services/profileService.ts`
- **Lines:** 1-38 (entire file)
- **Severity:** 🔴 CRITICAL
- **Description:** User profile management uses hardcoded mock data instead of real API integration
- **Expected Backend Endpoints:** 
  - `GET /user/profile/me` - Get current user profile
  - `PUT /user/me` - Update user profile
  - `PUT /user/password` - Change password
- **Actual:** Returns static mock user object with setTimeout simulation
- **Impact:** 
  - Users cannot view their real profile data
  - Profile edits don't persist
  - Password changes don't work
  - Logout/login shows same mock data
- **Test Case:**
  ```typescript
  // Current (BROKEN)
  const user = await userService.getUser(); 
  // Returns: { id: '1', username: 'johndoe', email: 'john@example.com' } (always same)
  
  // Expected
  const user = await userService.getUser();
  // Should return: actual logged-in user data from backend
  ```
- **Fix Recommendation:**
  ```typescript
  export const userService = {
    getUser: async (): Promise<User> => {
      const res = await fetch('/api/proxy/user/profile/me', { 
        credentials: 'include',
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      return data.user || data.data;
    },
    updateUser: async (updatedData: Partial<User>): Promise<User> => {
      const res = await fetch('/api/proxy/user/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error('Failed to update user');
      return res.json();
    },
    updatePassword: async (oldPassword: string, newPassword: string) => {
      const res = await fetch('/api/proxy/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword })
      });
      return res.json();
    }
  };
  ```

---

### 3. **MOCK DATA - Blog System**
- **File:** `app/blog/page.tsx`
- **Lines:** 8-15
- **Severity:** 🔴 CRITICAL
- **Description:** Blog articles are hardcoded dummy data array, not fetched from backend
- **Expected:** Fetch from backend API (endpoint likely `/blog` or `/article`)
- **Actual:** 
  ```typescript
  const blogData = [
    { id: 1, title: 'Lorem Ipsum...', description: '...', ... },
    // ... 9 identical dummy articles
  ];
  ```
- **Impact:** Blog feature completely non-functional, no way to manage blog content
- **Test Case:** Navigate to `/blog` → Shows same 9 dummy articles always
- **Fix:** Create API integration for blog posts

---

### 4. **MOCK DATA - Promo System**
- **File:** `app/promo/page.tsx`
- **Lines:** 12-48
- **Severity:** 🔴 CRITICAL
- **Description:** Promo data is hardcoded static array
- **Expected:** Fetch from backend API (endpoint likely `/promo`)
- **Actual:** 
  ```typescript
  const promoData = [
    { id: '1', title: 'Diskon 50%...', period: '1-31 Januari 2025', ... },
    // ... hardcoded promo array
  ];
  ```
- **Impact:** Promo management not connected to backend, cannot create/update promos
- **Fix:** Create API service and integrate with backend

---

### 5. **API ENDPOINT MISMATCH - Billboard Detail**
- **File:** `app/api/billboard/[id]/route.ts`
- **Line:** 11
- **Severity:** 🔴 CRITICAL
- **Description:** Calling wrong backend endpoint
- **Backend Spec (Postman line 216-233):** `GET /billboard/:id`
- **Frontend Calls:** `GET /billboard/detail/:id`
- **Impact:** Billboard detail page fails to load
- **Error:** 404 Not Found when viewing billboard details
- **Test Case:** Click any billboard card → Detail page shows error/empty
- **Fix:**
  ```typescript
  // Change line 11 from:
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/billboard/detail/${id}`,
    { cache: "no-store" }
  );
  
  // To:
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/billboard/${id}`,
    { cache: "no-store" }
  );
  ```

---

### 6. **MISSING QUERY PARAMETERS - List Billboards**
- **File:** `app/api/billboard/all/route.ts`
- **Lines:** 5-10
- **Severity:** 🔴 CRITICAL
- **Description:** No query parameters passed to backend (no pagination, no filters)
- **Backend Spec (Postman line 136-171):** 
  ```
  GET /billboard/all?page=1&limit=10&city={city}&categoryId={categoryId}
  ```
- **Frontend Actual:** `GET /billboard/all` (no params)
- **Impact:** 
  - Cannot paginate billboards (shows all at once)
  - Cannot filter by city or category
  - Performance issues with large datasets
- **Test Case:** Homepage shows all billboards, no pagination works
- **Fix:**
  ```typescript
  export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = queryString 
      ? `${process.env.NEXT_PUBLIC_API_URL}/billboard/all?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL}/billboard/all`;
    
    const res = await fetch(url, { cache: "no-store" });
    // ... rest
  }
  ```

---

### 7. **MISSING BACKEND INTEGRATION - Advanced Filters**
- **File:** `components/homepage/Filters.tsx`
- **Lines:** 166-216
- **Severity:** 🔴 CRITICAL
- **Description:** Advanced filter UI (Category, Location, Size, Orientation, Display) renders but doesn't filter data
- **Expected:** Should call `/billboard/all?categoryId={id}&city={city}&size={size}` etc.
- **Actual:** Checkboxes are UI-only, state changes don't trigger API calls
- **Impact:** Users see filter UI but clicking filters does nothing
- **Test Case:** 
  1. Click "More Filters"
  2. Select a category checkbox
  3. Close popover
  4. Result: Billboard grid unchanged
- **Fix:** Connect filter state to parent component and pass to API call

---

### 8. **MISSING REQUIRED FIELD - Transaction Creation**
- **File:** `services/bookingService.ts`
- **Lines:** 11-17
- **Severity:** 🔴 CRITICAL
- **Description:** Field name mismatch between frontend and backend
- **Backend Expects (Postman line 496):** 
  ```json
  { "billboardId": "uuid", "designId": "uuid", "startDate": "2026-03-01", 
    "endDate": "2026-03-31", "addOns": [] }
  ```
- **Frontend Sends:** 
  ```typescript
  { billboardId, addOnIds, designId, startDate, endDate }
  ```
- **Issue:** Backend expects `addOns` (array), frontend sends `addOnIds`
- **Impact:** Transaction creation may fail or add-ons not saved
- **Test Case:** Complete booking flow → Add-ons not applied to transaction
- **Fix:** Verify backend API and update to match field name

---

### 9. **FORGOT PASSWORD ENDPOINT NOT VERIFIED**
- **File:** `app/lib/auth.ts`
- **Line:** 105
- **Severity:** 🔴 CRITICAL
- **Description:** Frontend calls `POST /auth/forgot-password` but endpoint not in Postman collection
- **Frontend Calls:** 
  ```typescript
  await fetch(`${API_BASE_URL}/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email })
  });
  ```
- **Backend Spec:** Endpoint not documented in Postman
- **Impact:** Forgot password feature likely broken (404 or 500 error)
- **Test Case:** Click "Lupa Password?" → Enter email → Submit → Check network tab
- **Fix:** Either verify endpoint exists on backend or remove feature

---

### 10. **PAYMENT PAGE NOT INTEGRATED**
- **File:** `app/payment/[id]/page.tsx`
- **Lines:** 28-32
- **Severity:** 🔴 CRITICAL
- **Description:** Payment confirmation only logs to console, no backend integration
- **Code:**
  ```typescript
  const handleConfirm = () => {
    console.log('Payment confirmed with:', selectedMethod);
    setShowModal(false);
  };
  ```
- **Backend:** No payment endpoint in Postman collection
- **Impact:** Users cannot complete payment, money not processed
- **Test Case:** Complete booking → Select payment method → Confirm → Nothing happens
- **Fix:** Integrate with payment gateway and backend transaction update endpoint

---

### 11. **MISSING API ENDPOINT - Nearby Billboards**
- **Backend Endpoint (Postman line 174-212):** 
  ```
  GET /billboard/nearby?lat={lat}&lng={lng}&radiusKm={radius}
  ```
- **Frontend Status:** Not implemented anywhere
- **Severity:** 🔴 CRITICAL (Missing Feature)
- **Description:** Geo-spatial search feature completely missing
- **Impact:** Users cannot search billboards by location radius
- **Expected Flow:** User allows location → Map shows nearby billboards
- **Fix:** Create UI in homepage to:
  1. Request user location
  2. Call nearby endpoint
  3. Display results on map

---

### 12. **MISSING API ENDPOINT - Create Billboard (Seller)**
- **Backend Endpoint (Postman line 236-333):** `POST /billboard` with FormData
- **Required Fields:** categoryId, description, location, cityId, provinceId, status, mode, size, orientation, display, lighting, tax, landOwnership, rentPrice, servicePrice, images (file)
- **Frontend Status:** Implemented in `app/seller/dashboard/core.ts` but complex
- **Severity:** 🔴 CRITICAL (Validation Missing)
- **Issues:** 
  - No clear validation for required fields in booking flow
  - Image upload validation missing
  - FormData structure unclear
- **Impact:** Seller billboard creation may fail silently
- **Fix:** Add comprehensive validation before submission

---

## 🟡 HIGH PRIORITY ERRORS (11)

### 13. **MISSING OAUTH BACKEND SYNC**
- **File:** `app/api/auth/[...nextauth]/route.ts`
- **Lines:** 15-18
- **Severity:** 🟡 HIGH
- **Description:** Google OAuth login doesn't sync users with backend database
- **Code Comment:** `// Here you can handle backend syncing if needed in the future`
- **Impact:** 
  - Google-authenticated users not registered in backend
  - Cannot access protected routes (middleware checks backend session)
  - No user record for transactions/bookmarks
- **Test Case:** 
  1. Click "Google" login button
  2. Authenticate with Google
  3. Redirect to dashboard
  4. Middleware checks backend session → Fails → Redirect to login (loop)
- **Fix:**
  ```typescript
  async signIn({ user, account }) {
    // Sync with backend
    const response = await fetch('http://utero.viewdns.net:3100/auth/oauth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        image: user.image,
        googleId: account.providerAccountId
      })
    });
    return response.ok;
  }
  ```

---

### 14. **HARDCODED API URL IN MIDDLEWARE**
- **File:** `middleware.ts`
- **Line:** 34
- **Severity:** 🟡 HIGH
- **Description:** Backend URL hardcoded instead of using environment variable
- **Code:** `await fetch('http://utero.viewdns.net:3100/auth/me', ...)`
- **Expected:** `await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, ...)`
- **Impact:** Breaks in staging/production environments with different API URLs
- **Fix:** Use environment variable

---

### 15. **BUILD WARNING - Unused Variable**
- **File:** `components/homepage/Filters.tsx`
- **Line:** 59
- **Severity:** 🟡 HIGH
- **Description:** `getLabel` function defined but never used
- **Code:**
  ```typescript
  const getLabel = (key: string, option: string): string => {
    // ... 8 lines of code
  };
  ```
- **Impact:** Build fails in strict mode, dead code
- **Fix:** Remove lines 59-66 or use the function

---

### 16. **MISSING API ROUTES - Category, Province, City**
- **Backend Endpoints:** 
  - `GET /category` (Postman line 340-352)
  - `GET /province` (Postman line 359-371)
  - `GET /city?provinceId={id}` (Postman line 373-393)
- **Frontend:** Only accessible via `/api/proxy/[...path]` in admin/seller dashboards
- **Severity:** 🟡 HIGH
- **Impact:** 
  - Buyer users cannot filter by category/location on homepage
  - Public routes need category/location data for filters
- **Fix:** Create dedicated public API routes or ensure proxy allows public access

---

### 17. **MISSING ENDPOINT - Get Transaction by ID**
- **Backend:** `GET /transaction/:id` (Postman line 509-527)
- **Frontend:** Not implemented
- **Severity:** 🟡 HIGH
- **Impact:** Cannot view individual transaction details after booking
- **Expected:** Transaction detail page at `/transaction/[id]` or `/order/[id]`
- **Fix:** Create transaction detail page

---

### 18. **INCORRECT LINK - Forgot Password**
- **File:** `app/(auth)/login/page.tsx`
- **Line:** 101
- **Severity:** 🟡 HIGH
- **Link:** `<Link href="/auth/forgot">`
- **Actual Route:** `app/(auth)/forgot/page.tsx` (should be `/forgot`)
- **Impact:** Link may 404 depending on routing config
- **Test Case:** Click "Lupa Password?" → Check URL
- **Fix:** Change to `<Link href="/forgot">`

---

### 19. **MISSING SELLER REGISTRATION VALIDATION**
- **File:** `app/seller/register/page.tsx`
- **Lines:** 109-127
- **Severity:** 🟡 HIGH
- **Description:** Frontend validates locally but may not match backend requirements exactly
- **Backend Expected (Postman line 438-458):** 
  ```json
  { "fullname": "string", "companyName": "string", "ktp": "16 digits", 
    "npwp": "15-16 digits", "ktpAddress": "string", "officeAddress": "string" }
  ```
- **Frontend Validation:** Basic checks, but unclear if rules match backend
- **Impact:** Form submits but backend rejects with validation error
- **Fix:** Ensure validation rules exactly match backend

---

### 20. **MISSING DASHBOARD ENDPOINT INTEGRATION**
- **Backend:**
  - `GET /dashboard/admin` (Postman line 534-545)
  - `GET /dashboard/seller` (Postman line 548-560)
- **Frontend:** Admin/seller dashboards use complex TypeScript classes that fetch data directly
- **Severity:** 🟡 HIGH
- **Issue:** Unclear if using official dashboard endpoints or custom queries
- **Impact:** Dashboard statistics may be incorrect or incomplete
- **Fix:** Verify dashboards use official endpoints

---

### 21. **MISSING DESIGNID VALIDATION**
- **File:** `services/bookingService.ts`
- **Line:** 14
- **Severity:** 🟡 HIGH
- **Description:** `designId` can be `null` but backend may require it
- **Backend (Postman line 496):** `designId` appears required
- **Frontend:** `designId: data.designId || null`
- **Impact:** Transactions fail if design not selected
- **Test Case:** Complete booking without selecting design → Submit fails
- **Fix:** Either make design selection required in UI or verify backend accepts null

---

### 22. **MISSING USER MANAGEMENT ROUTES**
- **Backend Endpoints:**
  - `GET /user` - List all users (Postman line 400-410)
  - `GET /user/:id` - Get user by ID (Postman line 413-431)
- **Frontend:** Only accessible via admin dashboard internal calls
- **Severity:** 🟡 HIGH
- **Impact:** No standalone user management page for admins
- **Status:** Acceptable for MVP but should be documented

---

### 23. **REGISTRATION FIELD MISMATCH**
- **File:** `app/(auth)/register/page.tsx`
- **Lines:** 48-54
- **Severity:** 🟡 HIGH
- **Frontend Sends:** `{ email, phone, username, password, confirmPassword }`
- **Backend Expects (Postman line 66):** Same, but notes "No `level` field (defaults to BUYER)"
- **Issue:** `confirmPassword` sent to backend but backend should validate it matches
- **Impact:** Frontend validates password match, but if backend doesn't, mismatch could occur
- **Fix:** Ensure backend also validates `confirmPassword === password`

---

## 🟠 MEDIUM PRIORITY ERRORS (13)

### 24. **MISSING PHONE FORMAT VALIDATION**
- **File:** `app/(auth)/register/page.tsx`
- **Line:** 103
- **Severity:** 🟠 MEDIUM
- **Description:** No phone number format validation
- **Backend Requires (Postman line 66):** International format `+62...`
- **Frontend:** Plain text input, no validation or auto-formatting
- **Impact:** Registration fails if user enters `08123456789` instead of `+628123456789`
- **Test Case:** Register with phone `08123456789` → Backend rejects
- **Fix:**
  ```typescript
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) return `+62${cleaned.slice(1)}`;
    if (cleaned.startsWith('62')) return `+${cleaned}`;
    return `+62${cleaned}`;
  };
  ```

---

### 25. **LOGIN IDENTIFIER FIELD CONFUSION**
- **File:** `app/(auth)/login/page.tsx`
- **Line:** 91
- **Severity:** 🟠 MEDIUM
- **Input Label:** "Email"
- **Backend Field (Postman line 105):** `identifier` (can be email OR phone)
- **Impact:** Users don't know they can log in with phone number
- **Test Case:** User tries to log in with phone but sees "Email" label → Confusion
- **Fix:** Change placeholder to "Email atau No. Telepon"

---

### 26. **MISSING LOGOUT CONFIRMATION**
- **Files:** Multiple (dashboard, admin, seller)
- **Severity:** 🟠 MEDIUM
- **Description:** Logout happens immediately without confirmation dialog
- **Impact:** Accidental logouts, data loss if user has unsaved work
- **Fix:** Add confirmation modal:
  ```typescript
  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      authService.logout();
      router.push('/login');
    }
  };
  ```

---

### 27. **MISSING BOOKING FORM FIELDS MAPPING**
- **File:** `components/booking/steps/DataPemesananStep.tsx`
- **Severity:** 🟠 MEDIUM
- **Form Fields Collected:** nama, noTelepon, alamat, periodeAwal, periodeAkhir
- **Backend Transaction (Postman line 496):** Only needs billboardId, designId, startDate, endDate, addOns
- **Issue:** nama, noTelepon, alamat collected but not sent to backend
- **Impact:** User contact info lost, not saved with transaction
- **Fix:** Either:
  1. Remove unused fields from form
  2. Add to backend transaction payload
  3. Save separately as "customer info"

---

### 28. **MISSING INCLUDE STEP IMPLEMENTATION**
- **File:** `components/booking/steps/IncludeStep.tsx`
- **Severity:** 🟠 MEDIUM
- **Description:** Step 3 of booking flow exists but likely minimal content
- **Impact:** Confusing UX, empty step in wizard
- **Fix:** Review implementation and either:
  1. Add actual included services selection
  2. Remove step and make 3-step flow
  3. Make it informational only

---

### 29. **SELLER REGISTRATION LOGOUT FLOW**
- **File:** `app/seller/register/page.tsx`
- **Lines:** 143-147
- **Severity:** 🟠 MEDIUM
- **Description:** After seller registration, user is logged out then redirected to seller dashboard (which requires login)
- **Code:**
  ```typescript
  await authService.logout();
  router.push('/seller/dashboard');
  ```
- **Impact:** User registers as seller → Gets logged out → Sees login page (confusing)
- **Test Case:** Complete seller registration → Redirected to login instead of dashboard
- **Fix:** Either keep user logged in with session refresh, or redirect to login with success message

---

### 30. **MISSING IMAGE UPLOAD VALIDATION**
- **File:** `app/seller/dashboard/core.ts`
- **Severity:** 🟠 MEDIUM
- **Description:** No client-side validation for image file types/sizes
- **Backend (Postman line 319-322):** Expects images in FormData
- **Impact:** Users can upload invalid files (txt, exe, etc.), large files crash server
- **Fix:** Add validation:
  ```typescript
  const validateImage = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Only JPG, PNG, WEBP allowed');
    }
    if (file.size > maxSize) {
      throw new Error('Max file size 5MB');
    }
  };
  ```

---

### 31. **MISSING AVATAR/PROFILE PICTURE UPLOAD**
- **Files:** Multiple profile views
- **Severity:** 🟠 MEDIUM
- **Description:** No UI to upload or change profile picture
- **Backend:** User model has `profilePicture` field
- **Impact:** Users stuck with default avatar, cannot personalize profile
- **Fix:** Add file input in profile edit page with image upload to backend

---

### 32. **BOOKMARK ICON STATE NOT PERSISTED**
- **File:** `app/billboard-detail/[id]/page.tsx`
- **Lines:** 45-56
- **Severity:** 🟠 MEDIUM
- **Description:** Bookmark toggle updates UI optimistically but on failure just alerts
- **Impact:** If API fails, bookmark icon shows wrong state until page refresh
- **Fix:** Add toast notification and revert state on failure:
  ```typescript
  const handleBookmarkToggle = async () => {
    const prevState = isBookmarked;
    setIsBookmarked(!isBookmarked); // Optimistic
    
    try {
      const success = isBookmarked 
        ? await removeBookmark(id) 
        : await addBookmark(id);
      if (!success) throw new Error('Failed');
    } catch (error) {
      setIsBookmarked(prevState); // Revert
      toast.error('Bookmark failed');
    }
  };
  ```

---

### 33. **MISSING TRANSACTION STATUS DISPLAY**
- **File:** `app/dashboard/components/HistoryTab.tsx`
- **Severity:** 🟠 MEDIUM
- **Description:** Order history shows transactions but status may not be clearly displayed
- **Backend Statuses:** PENDING | PAID | EXPIRED | REJECTED | CANCELLED | COMPLETED
- **Impact:** Users don't know if payment pending, order confirmed, etc.
- **Fix:** Add status badges with color coding:
  ```typescript
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    EXPIRED: 'bg-gray-100 text-gray-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800'
  };
  ```

---

### 34. **MISSING ORDER HISTORY PAGINATION UI**
- **File:** `services/orderHistoryService.ts`
- **Lines:** 88-111
- **Severity:** 🟠 MEDIUM
- **Description:** Backend supports cursor-based pagination but UI doesn't implement "Load More"
- **Backend Response:** `{ data: [...], meta: { nextCursor, take } }`
- **Impact:** Users can only see first page of orders (10 items), old orders hidden
- **Fix:** Implement infinite scroll or "Load More" button in HistoryTab

---

### 35. **NAVBAR PROFILE IMAGE URL INCORRECT**
- **File:** `components/NavBar.tsx`
- **Lines:** 129, 243
- **Severity:** 🟠 MEDIUM
- **Description:** Directly uses `process.env.NEXT_PUBLIC_API_URL` for images (should use proxy)
- **Code:** `src={`${process.env.NEXT_PUBLIC_API_URL}/${user.profilePicture}`}`
- **Impact:** Images may not load correctly, CORS issues
- **Fix:**
  ```typescript
  <Image 
    src={`/api/uploads/${user.profilePicture.replace(/^uploads\//, '')}`} 
    // ... 
  />
  ```

---

### 36. **MISSING ERROR HANDLING - Booking Submission**
- **File:** `app/booking/[id]/page.tsx`
- **Lines:** 59-70
- **Severity:** 🟠 MEDIUM
- **Description:** No detailed error feedback on booking submission failure
- **Code:**
  ```typescript
  } catch (error) {
    console.error('Error:', error);
    toast.error('Terjadi kesalahan, silakan coba lagi');
  }
  ```
- **Impact:** Users don't know why booking failed (auth, validation, sold out, etc.)
- **Fix:** Parse backend error response and show specific message:
  ```typescript
  } catch (error) {
    const message = error.response?.data?.message || 'Terjadi kesalahan';
    toast.error(message);
  }
  ```

---

## 🟢 LOW PRIORITY ERRORS (14)

### 37. **MISSING SELLER UPGRADE LINK CLARITY**
- **File:** `components/NavBar.tsx`
- **Lines:** 113, 231
- **Severity:** 🟢 LOW
- **Link:** `/seller`
- **Issue:** Links to generic seller page, not clear upgrade CTA
- **Expected:** Link to `/seller/register` for direct upgrade flow
- **Impact:** Extra click for users wanting to become sellers
- **Fix:** Update link or improve seller landing page

---

### 38. **INCONSISTENT DATE FORMATS**
- **Multiple Files:** Various components display dates
- **Severity:** 🟢 LOW
- **Description:** No centralized date formatting utility
- **Impact:** Dates display differently across pages (2026-01-15 vs 15 Jan 2026 vs Jan 15, 2026)
- **Fix:** Create utility:
  ```typescript
  export const formatDate = (date: string | Date, format = 'long') => {
    const d = new Date(date);
    if (format === 'long') return d.toLocaleDateString('id-ID', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    return d.toLocaleDateString('id-ID');
  };
  ```

---

### 39. **MISSING LOADING STATES CONSISTENCY**
- **Multiple Files:** Various pages
- **Severity:** 🟢 LOW
- **Description:** Some pages use `<LoadingScreen />`, others show "Loading..." text
- **Impact:** Inconsistent UX
- **Fix:** Standardize loading indicators across all pages

---

### 40. **MISSING ERROR BOUNDARIES**
- **All Pages:** No React error boundaries
- **Severity:** 🟢 LOW
- **Impact:** If any component crashes, entire page shows blank screen
- **Fix:** Add error boundary to main layout:
  ```typescript
  // app/error.tsx
  'use client';
  export default function Error({ error, reset }) {
    return (
      <div>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </div>
    );
  }
  ```

---

### 41. **MISSING SEO META TAGS**
- **File:** `app/layout.tsx`
- **Lines:** 23-26
- **Severity:** 🟢 LOW
- **Description:** Generic meta tags, no dynamic per-page SEO
- **Current:** `title: "Create Next App", description: "Generated by create next app"`
- **Impact:** Poor SEO, bad social sharing previews
- **Fix:** Add metadata exports to each page:
  ```typescript
  // app/homepage/page.tsx
  export const metadata = {
    title: 'Cari Billboard - Placers',
    description: 'Temukan lokasi billboard terbaik...',
    openGraph: { ... }
  };
  ```

---

### 42. **MISSING ANALYTICS INTEGRATION**
- **All Pages:** No analytics tracking
- **Severity:** 🟢 LOW
- **Impact:** Cannot track user behavior, page views, conversions
- **Fix:** Add Google Analytics or similar:
  ```typescript
  // app/layout.tsx
  <Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
  ```

---

### 43. **MISSING ACCESSIBILITY FEATURES**
- **All Forms:** Limited ARIA labels, keyboard navigation
- **Severity:** 🟢 LOW
- **Impact:** Not accessible for screen readers, keyboard-only users
- **Fix:** Add proper accessibility attributes:
  ```typescript
  <input 
    aria-label="Email address" 
    aria-required="true"
    aria-invalid={error ? 'true' : 'false'}
  />
  ```

---

### 44. **MISSING RESPONSIVE TESTING DOCUMENTATION**
- **Multiple Components:** May not be fully responsive
- **Severity:** 🟢 LOW
- **Impact:** Potential UI breaks on mobile/tablet
- **Fix:** Comprehensive testing on all breakpoints (320px, 768px, 1024px, 1440px)

---

### 45. **UNUSED TRANSLATIONS**
- **File:** `app/context/LanguageContext.tsx`
- **Severity:** 🟢 LOW
- **Description:** Translation system exists but not fully utilized everywhere
- **Impact:** Inconsistent multilingual support (some parts EN/ID, others hardcoded ID)
- **Fix:** Complete all translations or remove unused language infrastructure

---

### 46. **MISSING ENV VALIDATION**
- **No validation** that required env variables exist at runtime
- **Severity:** 🟢 LOW
- **Impact:** App crashes if env vars missing, unclear error messages
- **Fix:** Add env validation:
  ```typescript
  // app/lib/env.ts
  const requiredEnvVars = ['NEXT_PUBLIC_API_URL', 'GOOGLE_CLIENT_ID'];
  requiredEnvVars.forEach(key => {
    if (!process.env[key]) throw new Error(`Missing ${key}`);
  });
  ```

---

### 47. **MISSING API ERROR LOGGING**
- **Multiple API routes:** Errors logged to console only
- **Severity:** 🟢 LOW
- **Impact:** Production errors not tracked, hard to debug
- **Fix:** Add error tracking (Sentry, LogRocket, etc.)

---

### 48. **MISSING RATE LIMITING**
- **All API routes:** No rate limiting
- **Severity:** 🟢 LOW
- **Impact:** Vulnerable to spam, DDoS
- **Fix:** Add rate limiting middleware (next-rate-limit, upstash, etc.)

---

### 49. **MISSING CSRF PROTECTION**
- **All POST requests:** No CSRF tokens
- **Severity:** 🟢 LOW
- **Impact:** Vulnerable to CSRF attacks
- **Fix:** Add CSRF token validation for state-changing operations

---

### 50. **MISSING INPUT SANITIZATION**
- **All Forms:** No XSS prevention
- **Severity:** 🟢 LOW
- **Impact:** Vulnerable to XSS attacks
- **Fix:** Sanitize all user inputs with libraries like DOMPurify

---

## ✅ WORKING FEATURES (17)

1. ✅ User Registration (email/password)
2. ✅ User Login (email/phone identifier)
3. ✅ Google OAuth (frontend, but no backend sync)
4. ✅ Billboard Listing (basic, no filters applied)
5. ✅ Billboard Detail View (after fixing endpoint)
6. ✅ Bookmark Add/Remove
7. ✅ Bookmark Listing
8. ✅ Seller Registration
9. ✅ Transaction Creation (booking flow structure)
10. ✅ Order History Fetch
11. ✅ Add-On Listing
12. ✅ Admin Dashboard (via TypeScript classes)
13. ✅ Seller Dashboard (via TypeScript classes)
14. ✅ Role-based Access Control (middleware)
15. ✅ Protected Routes
16. ✅ Image Proxy (/api/uploads)
17. ✅ General Proxy Route

---

## ❌ BROKEN/MISSING FEATURES (17)

1. ❌ User Profile View/Edit (mock data)
2. ❌ Password Change (mock data)
3. ❌ Forgot Password (endpoint may not exist)
4. ❌ Password Reset Page (not implemented)
5. ❌ Billboard Nearby Search (geo-spatial)
6. ❌ Billboard Filtering (UI only, not connected)
7. ❌ Billboard Pagination (backend supports, frontend doesn't use)
8. ❌ Category Public Listing (admin only)
9. ❌ Province/City Public Access
10. ❌ Blog System (all mock data)
11. ❌ Promo System (all mock data)
12. ❌ Payment Processing (console.log only)
13. ❌ Transaction Detail View
14. ❌ Profile Picture Upload
15. ❌ Notification System UI
16. ❌ OAuth Backend Sync
17. ❌ Design Management (admin only, no buyer access)

---

## 📋 MISSING BACKEND ENDPOINTS (28)

These endpoints are called by frontend but **not documented** in Postman collection:

**Authentication:**
1. `POST /auth/forgot-password`
2. `GET /auth/me`

**User Management:**
3. `GET /user/profile/me`
4. `PUT /user/me`
5. `PUT /user/password`
6. `GET /user/id/:id`
7. `PUT /user/id/:id`

**Billboard:**
8. `GET /billboard/detail/:id` (should be `/billboard/:id`)

**Bookmark:**
9. `GET /bookmark/mybookmarks` (correct endpoint)

**Transaction:**
10. `GET /history`

**Notifications:**
11. `GET /notification/seller/unread-count`
12. `GET /notification/seller`
13. `POST /notification/seller/read-all`
14. `PUT /notification/seller/:id/read`

**Seller:**
15. `GET /seller/me`
16. `GET /seller/all`
17. `GET /seller/detail/:id`

**Design:**
18. `GET /design/:id`
19. `GET /design`
20. `POST /design`
21. `PATCH /design/:id`
22. `DELETE /design/:id`

**Category (Admin):**
23. `POST /category`
24. `PATCH /category/:id`
25. `DELETE /category/:id`

**City (Admin):**
26. `POST /city`
27. `PATCH /city/:id`
28. `DELETE /city/:id`

**Note:** These may exist on backend but weren't included in Postman collection for testing.

---

## 🎯 RECOMMENDED FIX PRIORITY

### **Phase 1: Critical Fixes (Must Fix for MVP)**
1. Fix build error (HomepageTab.tsx Pagination props)
2. Fix billboard detail API endpoint mismatch
3. Replace profile service mock data with real API
4. Replace blog mock data with API integration
5. Replace promo mock data with API integration
6. Add billboard query parameters (pagination + filters)
7. Integrate payment processing
8. Fix Google OAuth backend sync

**Estimated Time:** 2-3 days

---

### **Phase 2: High Priority (Important for Launch)**
9. Fix advanced filters backend integration
10. Add nearby billboard search
11. Verify forgot password endpoint
12. Add transaction detail page
13. Fix middleware hardcoded URL
14. Improve error handling across forms
15. Add phone format validation

**Estimated Time:** 2-3 days

---

### **Phase 3: Medium Priority (Post-Launch v1.1)**
16. Add profile picture upload
17. Implement order history pagination UI
18. Add transaction status display
19. Fix seller registration logout flow
20. Add image upload validation
21. Improve bookmark error handling
22. Add logout confirmation

**Estimated Time:** 1-2 days

---

### **Phase 4: Low Priority (Future Iterations)**
23. Add SEO meta tags
24. Integrate analytics
25. Add accessibility features
26. Implement error boundaries
27. Add rate limiting
28. Add CSRF protection
29. Improve responsive design
30. Security hardening (XSS, input sanitization)

**Estimated Time:** 3-4 days

---

## 🧪 TESTING CHECKLIST

### **Authentication Testing**
- [ ] Register new user (email/password)
- [ ] Login with email
- [ ] Login with phone number
- [ ] Login with Google OAuth
- [ ] Forgot password flow
- [ ] Logout from all dashboards
- [ ] Access protected routes without auth (should redirect)
- [ ] Role-based access (ADMIN, SELLER, BUYER)

### **Billboard Testing**
- [ ] View all billboards on homepage
- [ ] Filter by category
- [ ] Filter by location
- [ ] Search by keyword
- [ ] Paginate results (if implemented)
- [ ] View billboard detail
- [ ] Add/remove bookmark
- [ ] View nearby billboards (if implemented)

### **Booking Testing**
- [ ] Complete booking flow (all 4 steps)
- [ ] Select add-ons
- [ ] Submit booking
- [ ] View order history
- [ ] View transaction details

### **Profile Testing**
- [ ] View profile
- [ ] Edit profile (username, email, phone)
- [ ] Change password
- [ ] Upload profile picture (if implemented)

### **Seller Testing**
- [ ] Register as seller
- [ ] Access seller dashboard
- [ ] Create billboard
- [ ] Edit billboard
- [ ] View earnings

### **Admin Testing**
- [ ] Access admin dashboard
- [ ] View statistics
- [ ] Manage users
- [ ] Manage billboards
- [ ] Manage categories
- [ ] View transactions

---

## 📊 FINAL STATISTICS

| **Metric** | **Count** | **%** |
|------------|-----------|-------|
| Total Features Tested | 34 | 100% |
| Working Features | 17 | 50% |
| Broken Features | 17 | 50% |
| Critical Errors | 12 | - |
| High Priority | 11 | - |
| Medium Priority | 13 | - |
| Low Priority | 14 | - |
| **Total Issues** | **50** | - |

---

## 🔐 SECURITY REVIEW

### **Critical Security Issues:**
1. ⚠️ No CSRF protection
2. ⚠️ No rate limiting
3. ⚠️ No input sanitization (XSS vulnerable)
4. ⚠️ API credentials in .env.local (ensure not committed)
5. ⚠️ Direct backend URL exposed in middleware

### **Security Best Practices Implemented:**
1. ✅ HttpOnly cookies for session management
2. ✅ Role-based access control
3. ✅ Protected routes with middleware
4. ✅ Credentials included in fetch requests
5. ✅ Server-side authentication checks

---

## 📝 CONCLUSION

The Placers website has a **solid architectural foundation** with working authentication, role-based access control, and core billboard browsing functionality. However, **50 issues** were identified across all severity levels.

**Top 3 Critical Blockers:**
1. **Profile management using mock data** - Users cannot view/edit real profiles
2. **Blog and promo systems disconnected** - Entire features non-functional
3. **Payment flow incomplete** - Cannot process actual payments

**Overall Assessment:**
- **Code Quality:** Good structure, TypeScript typing, component organization
- **Functionality:** ~50% features working, 50% broken or mock data
- **Security:** Needs hardening (CSRF, rate limiting, XSS prevention)
- **Readiness:** Not production-ready, needs Phase 1 fixes minimum

**Recommendation:** Fix all Critical errors (Phase 1) before any production deployment. High priority fixes (Phase 2) strongly recommended for launch.

---

**Report Generated By:** Comprehensive QA Analysis (Whitebox + Blackbox)  
**Date:** 2026-02-16  
**Next Steps:** Begin Phase 1 critical fixes
