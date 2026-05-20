// pages/student-dashboard.js
const StudentDashboard = (() => {
  function render() {
    const user = Auth.require('student');
    if (!user) return;

    const rStats = Store.Reservations.stats(user.id);
    const recent = Store.Reservations.byUser(user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

    const content = `
      <div style="margin-bottom: 20px;">
        <h2 class="serif-title" style="font-size: 1.1rem; font-weight: 800; margin-bottom: 2px; color: #1a1a1a;">WELCOME BACK, ${user.name.toUpperCase()}!</h2>
        <p style="color: #718096; font-size: 0.8rem;">Manage your facility reservation requests</p>
      </div>

      <div class="hero-banner" style="background: #9b1c2b; color: #fff; padding: 20px 28px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; box-shadow: 0 4px 15px rgba(155, 28, 43, 0.25);">
        <div>
          <h3 class="serif-title" style="font-size: 1.05rem; font-weight: 800; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; color: #fff;">Need to reserve a facility?</h3>
          <p style="font-size: 0.8rem; opacity: 0.9; margin: 0;">Submit a new request in just a few clicks</p>
        </div>
        <button class="btn" style="background: #fff; color: #9b1c2b; border: none; font-weight: 800; padding: 10px 20px; border-radius: 6px; font-size: 0.8rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);" onclick="Router.navigate('student/new-request')">
          <i class="fas fa-plus"></i> New Request
        </button>
      </div>

      <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 30px; gap: 16px;">
        <div class="card" style="padding: 20px; min-height: 130px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.75rem; color: #718096; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Total Requests</div>
            <div class="serif-title" style="font-size: 2.2rem; font-weight: 900; color: #1a1a1a; line-height: 1;">${rStats.total}</div>
          </div>
          <div style="font-size: 0.75rem; color: #a0aec0; display: flex; align-items: center; gap: 8px;">
            <i class="far fa-calendar-alt"></i> All time
          </div>
        </div>
        <div class="card" style="padding: 20px; min-height: 130px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.75rem; color: #718096; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Pending</div>
            <div class="serif-title" style="font-size: 2.2rem; font-weight: 900; color: var(--primary); line-height: 1;">${rStats.pending}</div>
          </div>
          <div style="font-size: 0.75rem; color: #a0aec0; display: flex; align-items: center; gap: 8px;">
            <i class="far fa-clock"></i> Awaiting review
          </div>
        </div>
        <div class="card" style="padding: 20px; min-height: 130px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.75rem; color: #718096; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Approved</div>
            <div class="serif-title" style="font-size: 2.2rem; font-weight: 900; color: #059669; line-height: 1;">${rStats.approved}</div>
          </div>
          <div style="font-size: 0.75rem; color: #a0aec0; display: flex; align-items: center; gap: 8px;">
            <i class="far fa-check-circle"></i> Confirmed
          </div>
        </div>
        <div class="card" style="padding: 20px; min-height: 130px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.75rem; color: #718096; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Rejected</div>
            <div class="serif-title" style="font-size: 2.2rem; font-weight: 900; color: #718096; line-height: 1;">${rStats.rejected}</div>
          </div>
          <div style="font-size: 0.75rem; color: #a0aec0; display: flex; align-items: center; gap: 8px;">
            <i class="far fa-times-circle"></i> Not approved
          </div>
        </div>
      </div>

      <div class="card">
        <div style="padding: 24px; border-bottom: 1px solid #f1f5f9;">
          <h3 class="serif-title" style="font-size: 1.15rem; font-weight: 800; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Recent Requests</h3>
          <p style="font-size: 0.95rem; color: #718096;">Your latest facility reservation requests</p>
        </div>
        <div style="padding: 20px;">
          <div style="display: grid; gap: 12px;">
            ${recent.length ? recent.map(r => `
              <div style="padding: 18px; border: 1px solid #f1f5f9; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
                    <span style="font-weight: 800; font-size: 0.9rem; color: #1a1a1a; text-transform: uppercase;">${Utils.escape(r.facilityName)}</span>
                    ${Utils.statusBadge(r.status)}
                  </div>
                  <div style="font-size: 0.85rem; color: #718096; display: flex; align-items: center; gap: 8px;">
                    <i class="far fa-calendar-alt"></i> ${Utils.formatDate(r.date)}
                  </div>
                  <div style="font-size: 0.8rem; color: #a0aec0; margin-top: 6px; font-style: italic;">${Utils.escape(r.purpose)}</div>
                </div>
                <button class="btn btn-ghost" onclick="StudentReservations.view('${r.id}')" style="color: #cbd5e0;"><i class="fas fa-chevron-right"></i></button>
              </div>
            `).join('') : '<div class="empty-state" style="padding: 40px; color: #a0aec0;">No recent requests found</div>'}
          </div>
          <div style="margin-top: 24px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px;">
            <button onclick="Router.navigate('student/reservations')" style="background: none; border: none; font-size: 0.85rem; font-weight: 700; color: #1a1a1a; cursor: pointer;">View All Requests</button>
          </div>
        </div>
      </div>`;

    Components.renderShell(user, 'student/dashboard', 'Dashboard', 'Overview of your reservations', content);
  }

  return { render };
})();
