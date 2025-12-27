import { getImageUrl } from '../../../lib/utils';
import { CurrentUser } from '../../../admin/dashboard/types';

interface SellerProfile {
    fullname?: string;
    companyName?: string;
    ktp?: string;
    npwp?: string;
    ktpAddress?: string;
    officeAddress?: string;
}

export const getProfileHTML = (
    profile: SellerProfile,
    user: CurrentUser
): string => {
    const p = profile || {};
    const c = user || {};

    return `
        <div style="padding: 0; width: 100%;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
                <h3>My Profile</h3>
                <button class="btn btn-outline" style="border-color: #fee2e2; color: #b91c1c; background:white;" id="delete-profile-btn">
                    Delete Profile & Move to Buyer
                </button>
            </div>

            <div style="display: grid; grid-template-columns: 3fr 2fr; gap: 1.5rem; align-items: start;">
                
                <!-- Section 1: Business Details (Seller Profile) - LEFT -->
                <div class="card" style="background: #fff; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
                         <h4 style="margin:0; color: var(--text-primary); font-size: 1.1rem;">Business Details</h4>
                         <span class="badge badge-info">Seller</span>
                    </div>
                    
                    <form id="seller-business-form">
                        <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" name="fullname" value="${p.fullname || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Company Name</label>
                                <input type="text" class="form-control" name="companyName" value="${p.companyName || ''}">
                            </div>
                        </div>
                        
                        <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">KTP</label>
                                <input type="text" class="form-control" name="ktp" value="${p.ktp || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">NPWP</label>
                                <input type="text" class="form-control" name="npwp" value="${p.npwp || ''}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">KTP Address</label>
                            <textarea class="form-control" name="ktpAddress" rows="2">${p.ktpAddress || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Office Address</label>
                            <textarea class="form-control" name="officeAddress" rows="2">${p.officeAddress || ''}</textarea>
                        </div>
                        
                        <div style="margin-top: 2rem; display:flex; justify-content: flex-end;">
                            <button type="submit" class="btn btn-primary">Save Business Details</button>
                        </div>
                    </form>
                </div>

                <!-- Section 2: User Account (Base User) - RIGHT -->
                <div class="card" style="background: #fff; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                     <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
                         <h4 style="margin:0; color: var(--text-primary); font-size: 1.1rem;">User Account</h4>
                         <span class="badge" style="background:#f1f5f9; color:#64748b;">Login Info</span>
                    </div>

                     <form id="user-profile-form">
                        <div style="display:flex; flex-direction:column; align-items:center; margin-bottom: 1.5rem; text-align:center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; background: #f8fafc; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); margin-bottom: 1rem; position: relative;">
                                <img id="profile-preview-img" src="${c.image ? getImageUrl(c.image) : `https://ui-avatars.com/api/?name=${c.username || 'User'}&background=random`}" style="width:100%; height:100%; object-fit:cover;">
                            </div>
                            <label for="profile-image-input" style="cursor:pointer; font-size:0.875rem; color:var(--primary-color); font-weight:500;">Change Picture</label>
                            <input type="file" name="file" id="profile-image-input" style="display:none;">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Username</label>
                            <input type="text" class="form-control" name="username" value="${c.username || ''}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" name="email" value="${c.email || ''}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone</label>
                            <input type="text" class="form-control" name="phone" value="${c.phone || ''}">
                        </div>
                        
                        <div style="border-top: 1px dashed #e2e8f0; margin: 1.5rem 0; padding-top: 1.5rem;">
                            <div class="form-group">
                                <label class="form-label">New Password</label>
                                <input type="password" class="form-control" name="password" placeholder="Leave blank to keep current">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" name="confirmPassword" placeholder="Confirm new password">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width:100%;">Update Account</button>
                     </form>
                </div>

            </div>
        </div>
    `;
};