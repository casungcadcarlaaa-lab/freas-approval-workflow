// pages/admin-dashboard.js
const AdminDashboard = (() => {
  function render() {
    const user = Auth.require('admin');
    if (!user) return;

    const reservations = Store.Reservations.all();
    const events = Store.Events.all();
    const facilities = Store.Facilities.all();

    const stats = {
      pendingReservations: reservations.filter(r => r.status === 'pending').length,
      pendingEvents: events.filter(e => e.status === 'pending').length,
      approvedReservations: reservations.filter(r => r.status === 'approved').length,
      totalFacilities: facilities.length
    };

    const content = `
      <div style="margin-bottom: 24px;">
        <h2 class="serif-title" style="font-size: 1.1rem; font-weight: 800; margin-bottom: 2px; color: #1a1a1a;">WELCOME BACK, ${user.name.toUpperCase()}!</h2>
        <p style="color: #718096; font-size: 0.8rem;">Manage facility reservations and approvals</p>
      </div>

      <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 24px; gap: 16px;">
        <!-- Total Requests -->
        <div class="card" style="padding: 20px; min-height: 130px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.75rem; color: #718096; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Total Requests</div>
            <div class="serif-title" style="font-size: 2.2rem; font-weight: 900; color: #1a1a1a; line-height: 1; text-transform: none;">${reservations.length}</div>
          </div>
          <div style="font-size: 0.75rem; color: #a0aec0; display: flex; align-items: center; gap: 8px;">
            <i class="far fa-calendar-alt"></i> This month
          </div>
        </div>
        <!-- Pending Approvals -->
        <div class="card" style="padding: 20px; min-height: 130px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.75rem; color: #718096; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Pending Approvals</div>
            <div class="serif-title" style="font-size: 2.2rem; font-weight: 900; color: var(--primary); line-height: 1; text-transform: none;">${stats.pendingReservations + stats.pendingEvents}</div>
          </div>
          <div style="font-size: 0.75rem; color: #a0aec0; display: flex; align-items: center; gap: 8px;">
            <i class="far fa-clock"></i> Needs attention
          </div>
        </div>
        <!-- Active Facilities -->
        <div class="card" style="padding: 20px; min-height: 130px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.75rem; color: #718096; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Active Facilities</div>
            <div class="serif-title" style="font-size: 2.2rem; font-weight: 900; color: #1a1a1a; line-height: 1; text-transform: none;">9</div>
          </div>
          <div style="font-size: 0.75rem; color: #a0aec0; display: flex; align-items: center; gap: 8px;">
            <i class="far fa-building"></i> Available for booking
          </div>
        </div>
        <!-- Active Users -->
        <div class="card" style="padding: 20px; min-height: 130px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.75rem; color: #718096; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Active Users</div>
            <div class="serif-title" style="font-size: 2.2rem; font-weight: 900; color: #1a1a1a; line-height: 1; text-transform: none;">7</div>
          </div>
          <div style="font-size: 0.75rem; color: #a0aec0; display: flex; align-items: center; gap: 8px;">
            <i class="far fa-user"></i> Registered
          </div>
        </div>
      </div>

      <div class="hero-banner" style="background: #9b1c2b; color: #fff; padding: 20px 28px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; box-shadow: 0 4px 15px rgba(155, 28, 43, 0.25);">
        <div>
          <h3 class="serif-title" style="font-size: 1.05rem; font-weight: 800; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; color: #fff;">ADMINISTRATOR CONTROLS</h3>
          <p style="font-size: 0.8rem; opacity: 0.9; margin: 0;">Manage facilities, approvals, and system settings</p>
        </div>
        <button class="btn" style="background: #fff; color: #9b1c2b; border: none; font-weight: 800; padding: 10px 20px; border-radius: 6px; font-size: 0.8rem; display: flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1);" onclick="Router.navigate('student/new-request')">
          <i class="fas fa-plus"></i> New Request
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
        <!-- Pending Approvals Card -->
        <div class="card" onclick="Router.navigate('admin/approvals')" style="padding: 28px; border-left: 4px solid var(--primary); cursor: pointer; transition: all 0.2s; background: #fff; border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between; min-height: 180px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.04)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 2px 10px rgba(0, 0, 0, 0.04)';">
          <div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <span style="color: var(--primary); background: rgba(233, 53, 88, 0.08); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                <i class="far fa-check-circle"></i>
              </span>
              <h3 class="serif-title" style="font-size: 0.95rem; font-weight: 800; color: #1a1a1a; letter-spacing: 0.05em; margin: 0;">PENDING APPROVALS</h3>
            </div>
            <p style="font-size: 0.85rem; color: #718096; margin-left: 48px; margin-top: -4px;">Review and approve facility requests</p>
          </div>
          <div style="margin-left: 48px; margin-top: 15px;">
            <div style="font-size: 2.2rem; font-weight: 700; color: #1a1a1a; line-height: 1;">${stats.pendingReservations + stats.pendingEvents}</div>
            <div style="font-size: 0.75rem; color: #a0aec0; margin-top: 4px;">requests waiting</div>
          </div>
        </div>

        <!-- Calendar Card -->
        <div class="card" onclick="Router.navigate('student/calendar')" style="padding: 28px; border-left: 4px solid #10b981; cursor: pointer; transition: all 0.2s; background: #fff; border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between; min-height: 180px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.04)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 2px 10px rgba(0, 0, 0, 0.04)';">
          <div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <span style="color: #10b981; background: rgba(16, 185, 129, 0.08); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                <i class="far fa-calendar-alt"></i>
              </span>
              <h3 class="serif-title" style="font-size: 0.95rem; font-weight: 800; color: #1a1a1a; letter-spacing: 0.05em; margin: 0;">CALENDAR</h3>
            </div>
            <p style="font-size: 0.85rem; color: #718096; margin-left: 48px; margin-top: -4px;">View facility schedule &amp; availability</p>
          </div>
          <div style="margin-left: 48px; margin-top: 15px;">
            <div style="font-size: 2.2rem; font-weight: 700; color: #1a1a1a; line-height: 1;">—</div>
            <div style="font-size: 0.75rem; color: #a0aec0; margin-top: 4px;">view schedule</div>
          </div>
        </div>

        <!-- All Bookings Card -->
        <div class="card" onclick="Router.navigate('admin/reservations')" style="padding: 28px; border-left: 4px solid #6366f1; cursor: pointer; transition: all 0.2s; background: #fff; border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between; min-height: 180px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.04)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 2px 10px rgba(0, 0, 0, 0.04)';">
          <div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <span style="color: #6366f1; background: rgba(99, 102, 241, 0.08); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                <i class="fas fa-calendar-check"></i>
              </span>
              <h3 class="serif-title" style="font-size: 0.95rem; font-weight: 800; color: #1a1a1a; letter-spacing: 0.05em; margin: 0;">ALL BOOKINGS</h3>
            </div>
            <p style="font-size: 0.85rem; color: #718096; margin-left: 48px; margin-top: -4px;">View and manage all reservations</p>
          </div>
          <div style="margin-left: 48px; margin-top: 15px;">
            <div style="font-size: 2.2rem; font-weight: 700; color: #1a1a1a; line-height: 1;">${reservations.length}</div>
            <div style="font-size: 0.75rem; color: #a0aec0; margin-top: 4px;">total bookings</div>
          </div>
        </div>
      </div>`;

    Components.renderShell(user, 'admin/dashboard', 'Dashboard', 'Global management overview', content);
  }

  return { render };
})();
