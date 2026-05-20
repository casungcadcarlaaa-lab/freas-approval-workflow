// pages/student-reservations.js — Full CRUD for student reservations
const StudentReservations = (() => {
  let _page = 1, _filter = 'all', _search = '';

  function render() {
    const user = Auth.current();
    if (!user) { Router.navigate('login'); return; }
    _page = 1; _filter = 'all'; _search = '';
    _draw(user);
  }

  function _draw(user) {
    user = user || Auth.current();
    let allList = Store.Reservations.byUser(user.id);
    let list = [...allList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const stats = {
      pending: allList.filter(r => r.status === 'pending').length,
      approved: allList.filter(r => r.status === 'approved').length,
      rejected: allList.filter(r => r.status === 'rejected').length
    };

    if (_filter !== 'all') list = list.filter(r => r.status === _filter);
    if (_search) list = list.filter(r => (r.facilityName + r.purpose).toLowerCase().includes(_search.toLowerCase()));

    const paged = Components.paginate(list, _page);

    const rows = paged.items.length ? paged.items.map(r => `
      <tr>
        <td data-label="Facility / Purpose">
          <div style="font-weight: 800; color: #1a1a1a; text-transform: uppercase; font-size: 0.85rem; margin-bottom: 2px;">${Utils.escape(r.facilityName)}</div>
          <div style="font-size: 0.75rem; color: #a0aec0; font-style: italic;">${Utils.escape(r.purpose)}</div>
        </td>
        <td data-label="Date">${Utils.formatDate(r.date)}</td>
        <td data-label="Time">${Utils.formatTime(r.startTime)} – ${Utils.formatTime(r.endTime)}</td>
        <td data-label="Attendees" style="font-weight: 600;">${r.attendees || 0}</td>
        <td data-label="Status">${Utils.statusBadge(r.status)}</td>
        <td data-label="Actions" style="text-align: center;">
          <div class="table-actions" style="display: flex; gap: 6px; align-items: center; justify-content: center;">
            <button style="background: #fff; border: 1px solid #cbd5e0; border-radius: 4px; padding: 4px 8px; color: #1a202c; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;" onmouseover="this.style.borderColor='#a0aec0'" onmouseout="this.style.borderColor='#cbd5e0'" onclick="StudentReservations.view('${r.id}')" title="View Details"><i class="fas fa-eye"></i></button>
            ${r.status === 'pending' ? `<button style="background: #fff; border: 1px solid #cbd5e0; border-radius: 4px; padding: 4px 8px; color: #e53e3e; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;" onmouseover="this.style.borderColor='#fc8181'" onmouseout="this.style.borderColor='#cbd5e0'" onclick="StudentReservations.cancel('${r.id}')" title="Cancel"><i class="fas fa-trash-alt"></i></button>` : ''}
          </div>
        </td>
      </tr>`).join('') :
      `<tr><td colspan="6" style="padding: 60px 0;">
        <div style="text-align: center; color: #a0aec0;">
          <i class="fas fa-file-invoice" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
          <div style="font-weight: 700; font-size: 1rem; color: #718096; margin-bottom: 4px;">No requests found</div>
        </div>
      </td></tr>`;

    const content = `
      <div class="page-hdr" style="margin-bottom: 30px;">
        <h2 class="serif-title" style="font-size: 1.rem; font-weight: 800; margin-bottom: 4px;">My Requests</h2>
        <p style="color: #718096; font-size: 0.95rem;">Track the status of your facility reservation requests</p>
      </div>

      <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 30px;">
        <div class="card" style="padding: 24px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 800; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">In Progress</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #d97706;">${stats.pending}</div>
          </div>
          <div style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid #fef3c7; display: flex; align-items: center; justify-content: center; color: #d97706; font-size: 1.2rem;">
            <i class="far fa-clock"></i>
          </div>
        </div>
        <div class="card" style="padding: 24px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 800; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Approved</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #059669;">${stats.approved}</div>
          </div>
          <div style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid #d1fae5; display: flex; align-items: center; justify-content: center; color: #059669; font-size: 1.2rem;">
            <i class="far fa-check-circle"></i>
          </div>
        </div>
        <div class="card" style="padding: 24px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 800; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Rejected</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #dc2626;">${stats.rejected}</div>
          </div>
          <div style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid #fee2e2; display: flex; align-items: center; justify-content: center; color: #dc2626; font-size: 1.2rem;">
            <i class="far fa-times-circle"></i>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 24px; padding: 12px 20px;">
        <div style="position: relative;">
          <i class="fas fa-search" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #cbd5e0;"></i>
          <input type="text" class="form-control" placeholder="Search by facility, purpose, or department..." value="${Utils.escape(_search)}" 
            style="padding-left: 45px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff;"
            oninput="StudentReservations.search(this.value)" />
        </div>
      </div>

      <div class="tab-bar" style="margin-bottom: 24px;">
        <button class="tab-item ${_filter === 'all' ? 'active' : ''}" onclick="StudentReservations.setFilter('all')">
          All Requests <span class="tab-count">${allList.length}</span>
        </button>
        <button class="tab-item ${_filter === 'pending' ? 'active' : ''}" onclick="StudentReservations.setFilter('pending')">
          In Progress
        </button>
        <button class="tab-item ${_filter === 'approved' ? 'active' : ''}" onclick="StudentReservations.setFilter('approved')">
          Approved
        </button>
        <button class="tab-item ${_filter === 'rejected' ? 'active' : ''}" onclick="StudentReservations.setFilter('rejected')">
          Rejected
        </button>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Facility / Purpose</th>
                <th>Date</th>
                <th>Time</th>
                <th>Attendees</th>
                <th>Status</th>
                <th style="text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div style="padding: 10px 20px;">${Components.paginationBar(paged, 'StudentReservations.goPage')}</div>
      </div>`;

    Components.renderShell(user, 'student/reservations', 'My Requests', 'Track your facility reservation requests', content);
  }

  function _facilityOptions(selected = '') {
    return Store.Facilities.active().map(f =>
      `<option value="${f.id}" ${selected === f.id ? 'selected' : ''}>${Utils.escape(f.name)} (Cap: ${f.capacity})</option>`).join('');
  }

  function _formModal(title, data, onSave) {
    const body = `
      <div class="form-group"><label>Facility</label>
        <select id="f-facility" class="form-control"><option value="">Select a facility…</option>${_facilityOptions(data.facilityId || '')}</select></div>
      <div class="form-row">
        <div class="form-group"><label>Date</label><input id="f-date" class="form-control" type="date" value="${data.date || ''}" min="${new Date().toISOString().slice(0, 10)}" /></div>
        <div class="form-group"><label>Attendees</label><input id="f-attendees" class="form-control" type="number" min="1" value="${data.attendees || ''}" placeholder="No. of attendees" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Start Time</label><input id="f-start" class="form-control" type="time" value="${data.startTime || ''}" /></div>
        <div class="form-group"><label>End Time</label><input id="f-end" class="form-control" type="time" value="${data.endTime || ''}" /></div>
      </div>
      <div class="form-group"><label>Purpose / Description</label>
        <textarea id="f-purpose" class="form-control" rows="3" placeholder="Describe the purpose of your reservation…">${Utils.escape(data.purpose || '')}</textarea></div>`;
    const footer = `
      <button class="btn btn-outline btn-sm" onclick="Components.closeModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="StudentReservations._save()">Submit Request</button>`;
    Components.openModal(title, body, footer);
    window._onResSave = onSave;
  }

  function _save() {
    const facilityId = document.getElementById('f-facility').value;
    const date = document.getElementById('f-date').value;
    const startTime = document.getElementById('f-start').value;
    const endTime = document.getElementById('f-end').value;
    const attendees = document.getElementById('f-attendees').value;
    const purpose = document.getElementById('f-purpose').value.trim();
    if (!facilityId || !date || !startTime || !endTime || !attendees || !purpose) {
      Components.toast('Please fill in all required fields.', 'error'); return;
    }
    if (startTime >= endTime) { Components.toast('End time must be after start time.', 'error'); return; }
    Components.closeModal();
    window._onResSave({ facilityId, date, startTime, endTime, attendees: parseInt(attendees), purpose });
  }

  function create() {
    _formModal('New Facility Reservation', {}, data => {
      const user = Auth.current();
      Store.Reservations.create(data, user);
      Components.toast('Reservation submitted successfully!', 'success');
      _draw(user);
    });
  }

  function cancel(id) {
    const body = `
      <div style="text-align: center; padding: 10px 10px 20px;">
        <div style="width: 70px; height: 70px; border-radius: 50%; background: #fff5f5; color: #e53e3e; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 20px;">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 style="font-size: 1.3rem; font-weight: 800; color: #1a202c; margin-bottom: 12px;">Cancel Reservation?</h3>
        <p style="color: #718096; font-size: 0.95rem; line-height: 1.5; margin-bottom: 0;">Are you sure you want to cancel this reservation request? This action cannot be undone.</p>
      </div>
    `;
    const footer = `
      <div style="display: flex; gap: 12px; width: 100%; justify-content: center;">
        <button style="flex: 1; padding: 12px; background: #edf2f7; color: #4a5568; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#edf2f7'" onclick="Components.closeModal()">Keep Request</button>
        <button style="flex: 1; padding: 12px; background: #e53e3e; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#c53030'" onmouseout="this.style.background='#e53e3e'" onclick="StudentReservations._executeCancel('${id}')">Yes, Cancel</button>
      </div>
    `;
    Components.openModal('', body, footer);
  }

  function _executeCancel(id) {
    Components.closeModal();
    Store.Reservations.delete(id);
    Components.toast('Reservation cancelled successfully.', 'success');
    _draw(Auth.current());
  }

  function view(id) {
    const r = Store.Reservations.get(id);
    if (!r) return;
    const body = `
      <div style="background: #f8fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 24px; font-size: 0.9rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
          <div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #1a202c; text-transform: uppercase;">${Utils.escape(r.facilityName)}</div>
            <div style="color: #a0aec0; font-size: 0.8rem; margin-top: 6px; font-weight: 500;"><i class="far fa-calendar-alt"></i> Submitted: ${Utils.formatDateTime(r.createdAt)}</div>
          </div>
          <div>${Utils.statusBadge(r.status)}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div>
            <div style="font-size: 0.7rem; color: #a0aec0; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.05em;">Date</div>
            <div style="font-weight: 700; color: #2d3748; font-size: 0.95rem;">${Utils.formatDate(r.date)}</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; color: #a0aec0; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.05em;">Time</div>
            <div style="font-weight: 700; color: #2d3748; font-size: 0.95rem;">${Utils.formatTime(r.startTime)} – ${Utils.formatTime(r.endTime)}</div>
          </div>
          <div style="grid-column: span 2;">
            <div style="font-size: 0.7rem; color: #a0aec0; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.05em;">Attendees</div>
            <div style="font-weight: 700; color: #2d3748; font-size: 0.95rem;"><i class="fas fa-users" style="color:#cbd5e0; margin-right:6px;"></i>${r.attendees || 0}</div>
          </div>
        </div>

        <div>
          <div style="font-size: 0.7rem; color: #a0aec0; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">Purpose / Event Description</div>
          <div style="background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #edf2f7; color: #4a5568; line-height: 1.6;">${Utils.escape(r.purpose)}</div>
        </div>
        
        ${r.adminNote ? `
        <div style="margin-top: 24px; background: #fff5f5; border: 1px solid #fed7d7; border-left: 4px solid #e53e3e; padding: 16px; border-radius: 8px;">
          <div style="font-size: 0.7rem; color: #c53030; font-weight: 800; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em;">Admin Remarks</div>
          <div style="color: #742a2a; font-size: 0.9rem; line-height: 1.5;">${Utils.escape(r.adminNote)}</div>
        </div>` : ''}
      </div>`;

    const footer = `<button style="background:#e2e8f0; color:#4a5568; border:none; padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer; width:100%; transition:all 0.2s;" onmouseover="this.style.background='#cbd5e0'" onmouseout="this.style.background='#e2e8f0'" onclick="Components.closeModal()">Close Details</button>`;

    Components.openModal('Reservation Details', body, footer);
  }

  function search(v) { _search = v; _page = 1; _draw(); }
  function setFilter(v) { _filter = v; _page = 1; _draw(); }
  function goPage(p) { _page = p; _draw(); }

  return { render, create, cancel, _executeCancel, view, search, setFilter, goPage, _save };
})();
