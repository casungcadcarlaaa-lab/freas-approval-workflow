// pages/admin-reservations.js — Admin Management of All Reservations
const AdminReservations = (() => {
  let _page = 1, _search = '', _filter = 'all', _facilityFilter = 'all', _timeFilter = 'upcoming';

  function render() {
    const user = Auth.require('admin');
    if (!user) return;
    _page = 1; _filter = 'all'; _search = ''; _facilityFilter = 'all'; _timeFilter = 'upcoming';
    _draw(user);
  }

  function _draw(user) {
    user = user || Auth.current();
    let list = Store.Reservations.all().sort((a, b) => new Date(a.date) - new Date(b.date));

    // Stats
    const today = new Date().toISOString().split('T')[0];
    const all = Store.Reservations.all();
    const counts = {
      total: all.length,
      pending: all.filter(r => r.status === 'pending').length,
      approved: all.filter(r => r.status === 'approved').length,
      rejected: all.filter(r => r.status === 'rejected').length,
      upcoming: all.filter(r => r.date >= today && r.status === 'approved').length,
    };

    // Filters
    if (_filter !== 'all') list = list.filter(r => r.status === _filter);
    if (_facilityFilter !== 'all') list = list.filter(r => r.facilityName === _facilityFilter);
    if (_timeFilter === 'upcoming') {
      list = list.filter(r => r.date >= today);
    } else if (_timeFilter === 'past') {
      list = list.filter(r => r.date < today);
    }
    if (_search) list = list.filter(r =>
      (r.userName + r.facilityName + r.purpose + (r.eventName || '')).toLowerCase().includes(_search.toLowerCase())
    );

    const paged = Components.paginate(list, _page);

    const rows = paged.items.map(r => {
      const isPending = r.status === 'pending';
      const isApproved = r.status === 'approved';
      const badgeStyle = isPending ? 'background: #fef3c7; color: #d97706;' : (isApproved ? 'background: #d1fae5; color: #059669;' : 'background: #fee2e2; color: #dc2626;');
      const badgeText = isPending ? 'Pending' : (isApproved ? 'Approved' : 'Rejected');
      const badge = `<span style="padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 500; ${badgeStyle}">${badgeText}</span>`;
      
      const eventName = r.eventName && r.eventName !== 'Facility Request' ? r.eventName : (r.purpose || 'Facility Request');
      const subName = r.purpose || r.eventName || 'Facility Request';

      return `
      <tr>
        <td style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9;">
          <div style="font-weight: 700; color: #1a1a1a; font-size: 0.85rem; margin-bottom: 2px;">${Utils.escape(eventName).toUpperCase()}</div>
          <div style="font-size: 0.75rem; color: #718096; text-transform: uppercase;">${Utils.escape(subName)}</div>
        </td>
        <td style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9;">
          <div style="font-weight: 600; color: #1a1a1a; font-size: 0.85rem; margin-bottom: 2px;">${Utils.escape(r.userName)}</div>
          <div style="display: inline-block; padding: 2px 8px; background: #f8fafc; border-radius: 12px; font-size: 0.7rem; color: #4a5568; border: 1px solid #e2e8f0;">student</div>
        </td>
        <td style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; color: #1a1a1a;">
          <i class="fas fa-map-marker-alt" style="color: #a0aec0; margin-right: 6px;"></i>${Utils.escape(r.facilityName)}
        </td>
        <td style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; color: #1a1a1a;">
          ${Utils.formatDate(r.date)}
        </td>
        <td style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; color: #1a1a1a;">
          <i class="far fa-clock" style="color: #a0aec0; margin-right: 6px;"></i>${Utils.formatTime(r.startTime)}-${Utils.formatTime(r.endTime)}
        </td>
        <td style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; color: #1a1a1a;">
          <i class="far fa-user" style="color: #a0aec0; margin-right: 6px;"></i>${r.attendees}
        </td>
        <td style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9;">
          ${badge}
        </td>
        <td style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9; text-align: center;">
          <button style="background: transparent; border: none; cursor: pointer; color: #1a1a1a; font-size: 1rem; margin-right: 8px;" onclick="AdminReservations.view('${r.id}')" title="View Details">
            <i class="far fa-eye"></i>
          </button>
          <button style="background: transparent; border: none; cursor: pointer; color: #e53e3e; font-size: 1rem;" onclick="AdminReservations.remove('${r.id}')" title="Delete">
            <i class="far fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `}).join('');

    const statCard = (label, val, color, icon, footerIcon, footerText) => `
      <div class="card" style="padding: 20px; border-radius: 8px; background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; min-height: 140px;">
        <div>
          <div style="font-size: 0.85rem; color: #718096; margin-bottom: 12px; font-weight: 500;">${label}</div>
          <div class="serif-title" style="font-size: 2.2rem; font-weight: 700; color: ${color}; line-height: 1;">${val}</div>
        </div>
        <div style="font-size: 0.75rem; color: #718096; display: flex; align-items: center; gap: 8px; margin-top: 20px;">
          <i class="${footerIcon}"></i> ${footerText}
        </div>
      </div>`;

    const dropdownBg = "url('data:image/svg+xml;utf8,<svg fill=\"%23a0aec0\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>')";

    const content = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
        <div>
          <h2 class="serif-title" style="font-size: 1.1rem; font-weight: 800; margin-bottom: 4px; color: #1a1a1a; letter-spacing: 0.05em; text-transform: uppercase;">ALL FACILITY BOOKINGS</h2>
          <p style="color: #4a5568; font-size: 0.9rem;">Monitor and manage all facility reservations across the university</p>
        </div>
        <button class="btn btn-outline" style="background: #fff; color: #1a1a1a; font-weight: 500; font-size: 0.85rem; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); cursor: pointer;"><i class="fas fa-download"></i> Export CSV</button>
      </div>

      <!-- 5 Stat Cards -->
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px;">
        ${statCard('Total Bookings', counts.total, '#1a1a1a', 'far fa-calendar-alt', 'far fa-calendar-alt', 'All time')}
        ${statCard('Pending', counts.pending, '#d97706', 'far fa-clock', 'far fa-clock', 'Awaiting review')}
        ${statCard('Approved', counts.approved, '#38a169', 'far fa-check-circle', 'far fa-check-circle', 'Confirmed')}
        ${statCard('Rejected', counts.rejected, '#e53e3e', 'far fa-times-circle', 'far fa-times-circle', 'Not approved')}
        ${statCard('Upcoming Events', counts.upcoming, '#e53e3e', 'far fa-calendar-alt', 'far fa-calendar-alt', 'Scheduled')}
      </div>

      <!-- Filters Bar -->
      <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <div style="position: relative;">
          <i class="fas fa-search" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #a0aec0; font-size: 0.9rem;"></i>
          <input type="text" placeholder="Search bookings..." style="width: 100%; padding: 10px 14px 10px 36px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; color: #1a1a1a; outline: none; background: #fff;" value="${Utils.escape(_search)}" oninput="AdminReservations.search(this.value)">
        </div>
        <select style="width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; color: #1a1a1a; outline: none; appearance: none; background: ${dropdownBg} no-repeat right 8px center/20px #fff; cursor: pointer;" onchange="AdminReservations.setFilter(this.value)">
          <option value="all" ${_filter === 'all' ? 'selected' : ''}>All Status</option>
          <option value="pending" ${_filter === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="approved" ${_filter === 'approved' ? 'selected' : ''}>Approved</option>
          <option value="rejected" ${_filter === 'rejected' ? 'selected' : ''}>Rejected</option>
        </select>
        <select style="width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; color: #1a1a1a; outline: none; appearance: none; background: ${dropdownBg} no-repeat right 8px center/20px #fff; cursor: pointer;" onchange="AdminReservations.setFacilityFilter(this.value)">
          <option value="all" ${_facilityFilter === 'all' ? 'selected' : ''}>All Facilities</option>
          ${Store.Facilities.all().map(f => `<option value="${f.name}" ${_facilityFilter === f.name ? 'selected' : ''}>${f.name}</option>`).join('')}
        </select>
        <select style="width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; color: #1a1a1a; outline: none; appearance: none; background: ${dropdownBg} no-repeat right 8px center/20px #fff; cursor: pointer;" onchange="AdminReservations.setTimeFilter(this.value)">
          <option value="upcoming" ${_timeFilter === 'upcoming' ? 'selected' : ''}>Upcoming</option>
          <option value="past" ${_timeFilter === 'past' ? 'selected' : ''}>Past</option>
          <option value="all" ${_timeFilter === 'all' ? 'selected' : ''}>All Time</option>
        </select>
      </div>

      <!-- Table Card -->
      <div style="background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.02); overflow: hidden;">
        <div style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 class="serif-title" style="font-size: 1rem; font-weight: 800; color: #1a1a1a; letter-spacing: 0.05em; margin-bottom: 4px; text-transform: uppercase;">BOOKINGS LIST</h3>
            <p style="font-size: 0.9rem; color: #718096; margin: 0;">${list.length} booking${list.length !== 1 ? 's' : ''} found</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #4a5568; background: #f8fafc; padding: 6px 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <i class="fas fa-filter" style="font-size: 0.8rem;"></i> ${paged.page} / ${paged.pages || 1}
          </div>
        </div>

        <div class="table-wrap">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 16px 24px; font-size: 0.8rem; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #f1f5f9; text-transform: none; letter-spacing: normal;">Event Name</th>
                <th style="text-align: left; padding: 16px 24px; font-size: 0.8rem; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #f1f5f9; text-transform: none; letter-spacing: normal;">Requester</th>
                <th style="text-align: left; padding: 16px 24px; font-size: 0.8rem; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #f1f5f9; text-transform: none; letter-spacing: normal;">Facility</th>
                <th style="text-align: left; padding: 16px 24px; font-size: 0.8rem; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #f1f5f9; text-transform: none; letter-spacing: normal;">Date</th>
                <th style="text-align: left; padding: 16px 24px; font-size: 0.8rem; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #f1f5f9; text-transform: none; letter-spacing: normal;">Time</th>
                <th style="text-align: left; padding: 16px 24px; font-size: 0.8rem; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #f1f5f9; text-transform: none; letter-spacing: normal;">Attendees</th>
                <th style="text-align: left; padding: 16px 24px; font-size: 0.8rem; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #f1f5f9; text-transform: none; letter-spacing: normal;">Status</th>
                <th style="text-align: center; padding: 16px 24px; font-size: 0.8rem; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #f1f5f9; text-transform: none; letter-spacing: normal;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows || '<tr><td colspan="8" style="padding: 40px; text-align: center; color: #718096;">No bookings found.</td></tr>'}
            </tbody>
          </table>
        </div>
        <div style="padding: 16px 24px; border-top: 1px solid #f1f5f9; background: #fff;">
          ${Components.paginationBar(paged, 'AdminReservations.goPage')}
        </div>
      </div>`;

    Components.renderShell(user, 'admin/reservations', '', '', content);
  }

  function approve(id) {
    Components.promptNote('Approve Reservation', 'Add an optional note for the student:', 'btn-success', 'Approve Now', (note) => {
      Store.Reservations.approve(id, note, Auth.current().name);
      Components.toast('Reservation approved successfully!', 'success');
      _draw();
    });
  }

  function reject(id) {
    Components.promptNote('Reject Reservation', 'State the reason for rejection:', 'btn-danger', 'Confirm Rejection', (note) => {
      if (!note) { Components.toast('A reason is required for rejection.', 'warning'); return; }
      Store.Reservations.reject(id, note, Auth.current().name);
      Components.toast('Reservation rejected.', 'info');
      _draw();
    });
  }

  function view(id) {
    const r = Store.Reservations.get(id);
    if (!r) return;
    const body = `
      <div style="display:grid; gap:14px; font-size:.9rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px; background:#f8fafc; border-radius:10px;">
          <strong style="color:#718096; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">Status</strong>
          ${Utils.statusBadge(r.status)}
        </div>
        <div><strong style="color:#1a1a1a;">Facility:</strong><div style="margin-top:4px; color:#4a5568;">${Utils.escape(r.facilityName)}</div></div>
        <div><strong style="color:#1a1a1a;">Requested By:</strong><div style="margin-top:4px; color:#4a5568;">${Utils.escape(r.userName)}</div></div>
        <div><strong style="color:#1a1a1a;">Schedule:</strong><div style="margin-top:4px; color:#4a5568;">${Utils.formatDate(r.date)} &nbsp;|&nbsp; ${Utils.formatTime(r.startTime)} – ${Utils.formatTime(r.endTime)}</div></div>
        <div><strong style="color:#1a1a1a;">Attendees:</strong><div style="margin-top:4px; color:#4a5568;">${r.attendees} pax</div></div>
        <div><strong style="color:#1a1a1a;">Purpose:</strong><p style="margin-top:6px; font-size:.85rem; color:#718096; line-height:1.6; background:#f8fafc; padding:12px 16px; border-radius:8px;">${Utils.escape(r.purpose)}</p></div>
        ${r.adminNote ? `<div style="background:#fff5f5; padding:14px 18px; border-radius:10px; border-left:4px solid var(--primary);">
          <strong style="font-size:0.75rem; color:#c53030; text-transform:uppercase; letter-spacing:0.05em;">Admin Note</strong>
          <div style="margin-top:6px; color:#742a2a; font-size:.85rem;">${Utils.escape(r.adminNote)}</div>
        </div>` : ''}
      </div>`;
    const footer = `
      ${r.status === 'pending' ? `
        <button class="btn btn-success btn-sm" onclick="AdminReservations.approve('${r.id}')"><i class="fas fa-check"></i> Approve</button>
        <button class="btn btn-danger btn-sm" onclick="AdminReservations.reject('${r.id}')"><i class="fas fa-times"></i> Reject</button>
      ` : ''}
      <button class="btn btn-outline btn-sm" onclick="Components.closeModal()">Close</button>
    `;
    Components.openModal('Reservation Summary', body, footer);
  }

  function remove(id) {
    const body = `
      <div style="text-align:center; padding:10px 10px 24px;">
        <div style="width:72px; height:72px; border-radius:50%; background:#fff5f5; color:#e53e3e; display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 20px;">
          <i class="fas fa-trash-alt"></i>
        </div>
        <h3 style="font-size:1.3rem; font-weight:800; color:#1a202c; margin-bottom:12px;">Delete Record?</h3>
        <p style="color:#718096; font-size:0.95rem; line-height:1.6;">Are you sure you want to permanently delete this reservation record? This action <strong>cannot be undone</strong>.</p>
      </div>`;
    const footer = `
      <div style="display:flex; gap:12px; width:100%;">
        <button style="flex:1; padding:13px; background:#edf2f7; color:#4a5568; border:none; border-radius:10px; font-weight:700; font-size:0.95rem; cursor:pointer; transition:all 0.2s;"
          onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#edf2f7'"
          onclick="Components.closeModal()">Cancel</button>
        <button style="flex:1; padding:13px; background:#e53e3e; color:#fff; border:none; border-radius:10px; font-weight:700; font-size:0.95rem; cursor:pointer; transition:all 0.2s;"
          onmouseover="this.style.background='#c53030'" onmouseout="this.style.background='#e53e3e'"
          onclick="AdminReservations._executeRemove('${id}')">Yes, Delete</button>
      </div>`;
    Components.openModal('', body, footer);
  }

  function _executeRemove(id) {
    Components.closeModal();
    Store.Reservations.delete(id);
    Components.toast('Record deleted.', 'info');
    _draw();
  }

  function search(v) { _search = v; _page = 1; _draw(); }
  function setFilter(v) { _filter = v; _page = 1; _draw(); }
  function setFacilityFilter(v) { _facilityFilter = v; _page = 1; _draw(); }
  function setTimeFilter(v) { _timeFilter = v; _page = 1; _draw(); }
  function goPage(p) { _page = p; _draw(); }

  return { render, approve, reject, view, remove, _executeRemove, search, setFilter, setFacilityFilter, setTimeFilter, goPage };
})();
