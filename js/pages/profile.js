// pages/profile.js — User Account and Profile
const ProfilePage = (() => {
  let isEditing = false;

  function toggleEdit() {
    isEditing = !isEditing;
    const inputs = document.querySelectorAll('.profile-editable');
    const btn = document.getElementById('edit-profile-btn');

    if (isEditing) {
      inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.style.background = '#fff';
        input.style.color = '#1a1a1a';
        input.style.borderColor = 'var(--primary)';
      });
      btn.innerHTML = '<i class="fas fa-save"></i> Save Profile';
      btn.style.background = '#059669'; // Green for save
      // Focus first input
      if (inputs.length > 0) inputs[0].focus();
    } else {
      // Save changes
      const user = Auth.current();
      if (user) {
        user.name = document.getElementById('profile-name').value;
        user.id = document.getElementById('profile-email').value;
        user.dept = document.getElementById('profile-dept').value;
        user.role_title = document.getElementById('profile-role').value;
        user.idnum = document.getElementById('profile-idnum').value;
        user.contact = document.getElementById('profile-contact').value;
        user.orgs = document.getElementById('profile-orgs').value;
        localStorage.setItem('freas_user', JSON.stringify(user));

        if (typeof Config !== 'undefined' && Config.ACCOUNTS) {
          const index = Config.ACCOUNTS.findIndex(a => a.email === user.email);
          if (index !== -1) {
            Config.ACCOUNTS[index] = { ...Config.ACCOUNTS[index], ...user };
          }
        }
      }

      inputs.forEach(input => {
        input.setAttribute('readonly', 'true');
        input.style.background = '#f8fafc';
        input.style.color = '#a0aec0';
        input.style.borderColor = '#edf2f7';
      });
      btn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
      btn.style.background = '#9b1c2b';
      Components.toast('Profile updated successfully!', 'success');

      // Update header after a tiny delay so the toast shows smoothly
      setTimeout(() => ProfilePage.render(), 400);
    }
  }

  function render() {
    isEditing = false;
    const user = Auth.current();
    if (!user) { Router.navigate('login'); return; }

    const roleTitle = user.role_title || 'N/A';
    const idNum = user.idnum || 'N/A';
    const contact = user.contact || '';

    const content = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
        <div>
          <h2 class="serif-title" style="font-size: 1.1rem; font-weight: 800; margin-bottom: 4px;">My Profile</h2>
          <p style="color: #718096; font-size: 0.95rem;">Manage your personal information and contact details</p>
        </div>
        <button id="edit-profile-btn" class="btn" style="background: #9b1c2b; color: #fff; font-weight: 700; padding: 10px 24px; border-radius: 8px; font-size: 0.85rem; transition: background 0.3s;" onclick="ProfilePage.toggleEdit()">
          <i class="fas fa-edit"></i> Edit Profile
        </button>
      </div>

      <div class="card" style="padding: 30px; margin-bottom: 30px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 25px; color: var(--primary);">
          <i class="far fa-user" style="font-size: 1.1rem;"></i>
          <h3 style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Personal Information</h3>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px 30px;">
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.75rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px;">Full Name</label>
            <div style="position: relative;">
              <i class="far fa-user" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #cbd5e0; font-size: 0.8rem;"></i>
              <input type="text" id="profile-name" class="form-control profile-editable" value="${user.name}" readonly style="padding-left: 42px; background: #f8fafc; color: #a0aec0; border: 1px solid #edf2f7; border-radius: 8px; transition: all 0.3s;" />
            </div>
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.75rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px;">Email Address</label>
            <div style="position: relative;">
              <i class="far fa-envelope" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #cbd5e0; font-size: 0.8rem;"></i>
              <input type="text" id="profile-email" class="form-control profile-editable" value="${user.id || user.email || ''}" readonly style="padding-left: 42px; background: #f8fafc; color: #a0aec0; border: 1px solid #edf2f7; border-radius: 8px; transition: all 0.3s;" />
            </div>
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.75rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px;">Department / College</label>
            <div style="position: relative;">
              <i class="far fa-building" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #cbd5e0; font-size: 0.8rem;"></i>
              <input type="text" id="profile-dept" class="form-control profile-editable" value="${user.dept || 'N/A'}" readonly style="padding-left: 42px; background: #f8fafc; color: #a0aec0; border: 1px solid #edf2f7; border-radius: 8px; transition: all 0.3s;" />
            </div>
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.75rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px;">Role / Position</label>
            <div style="position: relative;">
              <i class="fas fa-user-tag" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #cbd5e0; font-size: 0.8rem;"></i>
              <input type="text" id="profile-role" class="form-control profile-editable" value="${roleTitle}" readonly style="padding-left: 42px; background: #f8fafc; color: #a0aec0; border: 1px solid #edf2f7; border-radius: 8px; transition: all 0.3s;" />
            </div>
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.75rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px;">ID Number</label>
            <div style="position: relative;">
              <i class="fas fa-hashtag" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #cbd5e0; font-size: 0.8rem;"></i>
              <input type="text" id="profile-idnum" class="form-control profile-editable" value="${idNum}" readonly style="padding-left: 42px; background: #f8fafc; color: #a0aec0; border: 1px solid #edf2f7; border-radius: 8px; transition: all 0.3s;" />
            </div>
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.75rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px;">Contact Number</label>
            <div style="position: relative;">
              <i class="fas fa-phone-alt" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #cbd5e0; font-size: 0.8rem;"></i>
              <input type="text" id="profile-contact" class="form-control profile-editable" value="${contact}" placeholder="e.g. 0912 345 6789" readonly style="padding-left: 42px; background: #f8fafc; color: #a0aec0; border: 1px solid #edf2f7; border-radius: 8px; transition: all 0.3s;" />
            </div>
          </div>
        </div>

        <div style="margin-top: 25px;">
          <label style="font-size: 0.75rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Organizations / Affiliations</label>
          <div style="position: relative;">
            <i class="fas fa-users" style="position: absolute; left: 16px; top: 16px; color: #cbd5e0; font-size: 0.8rem;"></i>
            <textarea id="profile-orgs" class="form-control profile-editable" placeholder="e.g. CS Council, Glee Club, Red Cross" readonly style="padding-left: 42px; min-height: 44px; background: #f8fafc; color: #a0aec0; border: 1px solid #edf2f7; border-radius: 8px; transition: all 0.3s;">${user.orgs || ''}</textarea>
          </div>
          <p style="font-size: 0.7rem; color: #a0aec0; margin-top: 6px;">List all organizations you are a member of, separated by commas. These will appear as booking options.</p>
        </div>
      </div>

      <div class="card" style="padding: 24px 30px;">
        <h3 style="font-size: 0.75rem; font-weight: 800; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">Account Information</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; color: #718096;">Account Role:</span>
            <span style="font-size: 0.85rem; font-weight: 700; color: #1a1a1a; text-transform: capitalize;">${user.role}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; color: #718096;">System ID:</span>
            <span style="font-size: 0.65rem; color: #cbd5e0; font-family: monospace;">bc1a7b8d-6cb5-4f2d-a81f-ae156fad1ed3</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; color: #718096;">Verification Status:</span>
            <span class="badge badge-approved" style="font-size: 0.65rem; padding: 4px 12px;">Verified by Admin</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; color: #718096;">Member Since:</span>
            <span style="font-size: 0.85rem; font-weight: 700; color: #1a1a1a;">May 2026</span>
          </div>
        </div>
      </div>`;
    Components.renderShell(user, user.role === 'admin' ? 'admin/profile' : 'student/profile', 'My Profile', 'Manage your account settings', content);
  }

  return { render, toggleEdit };
})();
