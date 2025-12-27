import { getImageUrl } from '../../../lib/utils';
import { ApiData } from '../types';

export const getProfileFormHTML = (user: ApiData['currentUser']): string => {
    return `
      <div class="table-container" style="padding: 2rem; max-width: 600px;">
          <h3 style="margin-bottom: 2rem;">My Profile</h3>
          
          <form id="admin-profile-form">
              <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 2rem;">
                  <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; background: var(--primary-red); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; position: relative;">
                      ${user?.image
            ? `<img id="admin-profile-preview" src="${getImageUrl(user.image)}" style="width:100%; height:100%; object-fit:cover;">`
            : `<span id="admin-profile-initial">${(user?.username || 'A').charAt(0).toUpperCase()}</span>`
        }
                  </div>
                  <div style="flex:1;">
                      <label class="form-label">Profile Picture</label>
                      <input type="file" name="file" id="admin-profile-input" class="form-control">
                  </div>
              </div>

              <div class="form-group">
                  <label class="form-label">Username</label>
                  <input type="text" class="form-control" name="username" value="${user?.username || ''}" required>
              </div>
              <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" name="email" value="${user?.email || ''}" required>
              </div>
              <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input type="text" class="form-control" name="phone" value="${user?.phone || ''}">
              </div>
              
              <div class="form-group" style="margin-top:2rem;">
                  <label class="form-label">Change Password <span style="font-weight:normal; color:#666;">(Leave blank to keep current)</span></label>
                  <input type="password" class="form-control" name="password" placeholder="New Password">
              </div>
              <div class="form-group">
                  <label class="form-label">Confirm Password</label>
                  <input type="password" class="form-control" name="confirmPassword" placeholder="Confirm New Password">
              </div>

              <div class="form-group">
                   <label class="form-label">Role</label>
                   <input type="text" class="form-control" value="${user?.level || 'ADMIN'}" disabled style="background:#eee;">
              </div>

              <button type="submit" class="btn btn-primary" style="width:100%; margin-top:1rem;">Update Profile</button>
          </form>
      </div>
    `;
};
