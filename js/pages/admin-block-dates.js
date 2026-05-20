// pages/admin-block-dates.js — Admin Calendar Block Dates
const AdminBlockDates = (() => {
  function render() {
    const user = Auth.require('admin');
    if (!user) return;

    const content = `
      <div class="page-hdr">
        <div>
          <h2>Block Dates</h2>
          <p>Prevent facility bookings on specific holidays or university events.</p>
        </div>
        <button class="btn btn-primary" onclick="Components.toast('Add Block Date functionality coming soon!', 'info')">
          <i class="fas fa-calendar-plus"></i> Block New Date
        </button>
      </div>

      <div class="card">
        <div class="card-header"><h3>Current Blocked Dates</h3></div>
        <div class="card-body">
          <div class="empty-state" style="padding:40px">
            <i class="fas fa-calendar-times" style="font-size:3rem;opacity:0.2;margin-bottom:15px"></i>
            <h4>No active block dates</h4>
            <p>All facilities are currently following their standard availability.</p>
          </div>
        </div>
      </div>`;

    Components.renderShell(user, 'admin/block-dates', 'Block Dates', 'Manage campus-wide booking blackouts', content);
  }

  return { render };
})();
