# Error Log

Please paste any error logs or descriptions of issues you encounter in this file. I will use this information to help debug and fix the problems.

## Issue 1:

**Error Log / Description:**

```
 ⨯ ./app/admin/dashboard/core.ts
Error:   × Expression expected
     ╭─[D:\UTERO\placers-website\app\admin\dashboard\core.ts:935:1]
 932 │                     } else {
 933 │                         this.showToast(`View ${id} (Implementation pending for this module)`, 'info');
 934 │                     }
 935 │             });
     ·              ─
 936 │         });
 937 │ 
 938 │         container.querySelectorAll('.action-edit').forEach(btn => {
     ╰────

Caused by:
    Syntax Error

Import trace for requested module:
./app/admin/dashboard/core.ts
./app/admin/dashboard/page.tsx
 ⨯ ./app/admin/dashboard/views/user.ts:3:1
Module not found: Can't resolve '../../lib/utils'
  1 |
  2 | import { CurrentUser } from '../types';
> 3 | import { getImageUrl } from '../../lib/utils';
    | ^
  4 |
  5 | export const getUserViewHTML = (user: CurrentUser): string => {
  6 |     return `

https://nextjs.org/docs/messages/module-not-found
```

**To Reproduce (Optional):**

1.  Run `npm run dev`
---
