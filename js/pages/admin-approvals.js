// pages/admin-approvals.js — Admin Event Approval Workflow
const AdminApprovals = (() => {
  let _page = 1, _filter = 'all';

  function render() {
    const user = Auth.require('admin');
    if (!user) return;
    _page = 1; _filter = 'all';
    _draw(user);
  }

  function _draw(user) {
    user = user || Auth.current();
    let list = Store.Events.all().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (_filter !== 'all') list = list.filter(e => e.status === _filter);

    const counts = {
      all: Store.Events.all().length,
      pending: Store.Events.all().filter(e => e.status === 'pending').length,
      under_review: Store.Events.all().filter(e => e.status === 'under_review').length,
      approved: Store.Events.all().filter(e => e.status === 'approved').length,
      rejected: Store.Events.all().filter(e => e.status === 'rejected').length,
    };

    const paged = Components.paginate(list, _page);

    const statusConfig = {
      pending:      { color: '#d97706', bg: '#fef3c7', border: '#fbbf24', label: 'Pending' },
      under_review: { color: '#4f46e5', bg: '#e0e7ff', border: '#818cf8', label: 'Under Review' },
      approved:     { color: '#059669', bg: '#d1fae5', border: '#34d399', label: 'Approved' },
      rejected:     { color: '#dc2626', bg: '#fee2e2', border: '#f87171', label: 'Rejected' },
    };

    const cards = paged.items.map(e => {
      const sc = statusConfig[e.status] || statusConfig.pending;
      return `
        <div style="background:#fff; border-radius:14px; border:1px solid #f1f5f9; box-shadow:0 2px 8px rgba(0,0,0,0.04); overflow:hidden; transition:all 0.2s; display:flex; flex-direction:column;"
             onmouseover="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.09)'; this.style.transform='translateY(-2px)'"
             onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'; this.style.transform='none'">
          <div style="height:4px; background:${sc.border};"></div>
          <div style="padding:20px 22px; flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; gap:10px;">
              <div style="flex:1; min-width:0;">
                <div style="font-weight:800; font-size:0.95rem; color:#1a1a1a; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${Utils.escape(e.eventName)}</div>
                <div style="font-size:0.72rem; color:#a0aec0; font-weight:600;">${Utils.escape(e.userName)} &middot; ${e.eventType}</div>
              </div>
              <span style="flex-shrink:0; padding:4px 10px; border-radius:999px; font-size:0.68rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; background:${sc.bg}; color:${sc.color};">${sc.label}</span>
            </div>

            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
              <div style="display:flex; align-items:center; gap:5px; font-size:0.78rem; color:#718096; background:#f8fafc; padding:5px 10px; border-radius:6px;">
                <i class="fas fa-building" style="color:#cbd5e0; font-size:0.7rem;"></i> ${Utils.escape(e.facilityName)}
              </div>
              <div style="display:flex; align-items:center; gap:5px; font-size:0.78rem; color:#718096; background:#f8fafc; padding:5px 10px; border-radius:6px;">
                <i class="fas fa-calendar-alt" style="color:#cbd5e0; font-size:0.7rem;"></i> ${Utils.formatDate(e.date)}
              </div>
              <div style="display:flex; align-items:center; gap:5px; font-size:0.78rem; color:#718096; background:#f8fafc; padding:5px 10px; border-radius:6px;">
                <i class="fas fa-users" style="color:#cbd5e0; font-size:0.7rem;"></i> ${e.attendees} pax
              </div>
            </div>

            ${e.description ? `
              <div style="font-size:0.8rem; color:#718096; line-height:1.55; padding:10px 14px; background:#f8fafc; border-radius:8px; border-left:3px solid ${sc.border}; margin-bottom:14px;">
                ${Utils.escape(e.description).slice(0, 140)}${e.description.length > 140 ? '…' : ''}
              </div>` : ''}
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:8px; padding:14px 22px; border-top:1px solid #f1f5f9; background:#fafafa;">
            ${e.status === 'pending' ? `
              <button style="padding:7px 14px; background:#ede9fe; color:#4f46e5; border:none; border-radius:8px; font-size:0.78rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:5px; transition:all 0.2s;"
                onmouseover="this.style.background='#ddd6fe'" onmouseout="this.style.background='#ede9fe'"
                onclick="AdminApprovals.review('${e.id}')"><i class="fas fa-search"></i> Mark Under Review</button>
            ` : ''}
            ${(e.status === 'pending' || e.status === 'under_review') ? `
              <button style="padding:7px 14px; background:#d1fae5; color:#059669; border:none; border-radius:8px; font-size:0.78rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:5px; transition:all 0.2s;"
                onmouseover="this.style.background='#a7f3d0'" onmouseout="this.style.background='#d1fae5'"
                onclick="AdminApprovals.approve('${e.id}')"><i class="fas fa-check"></i> Approve</button>
              <button style="padding:7px 14px; background:#fee2e2; color:#dc2626; border:none; border-radius:8px; font-size:0.78rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:5px; transition:all 0.2s;"
                onmouseover="this.style.background='#fecaca'" onmouseout="this.style.background='#fee2e2'"
                onclick="AdminApprovals.reject('${e.id}')"><i class="fas fa-times"></i> Reject</button>
            ` : ''}
            <button style="padding:7px 14px; background:#fff; color:#718096; border:1px solid #e2e8f0; border-radius:8px; font-size:0.78rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:5px; transition:all 0.2s; margin-left:auto;"
              onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'"
              onclick="AdminApprovals.viewDetails('${e.id}')"><i class="fas fa-expand-alt"></i> View Details</button>
          </div>
        </div>
      `;
    }).join('');

    const filterBtn = (val, label, count) => `
      <button onclick="AdminApprovals.setFilter('${val}')"
        style="padding:8px 16px; border-radius:20px; border:1.5px solid ${_filter === val ? 'var(--primary)' : '#e2e8f0'}; background:${_filter === val ? 'var(--primary)' : '#fff'}; color:${_filter === val ? '#fff' : '#718096'}; font-size:0.8rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.2s; white-space:nowrap;">
        ${label}
        <span style="background:${_filter === val ? 'rgba(255,255,255,0.25)' : '#f1f5f9'}; color:${_filter === val ? '#fff' : '#a0aec0'}; padding:2px 7px; border-radius:10px; font-size:0.7rem;">${count}</span>
      </button>`;

    const content = `
      <div class="page-hdr" style="margin-bottom:24px;">
        <div>
          <h2 class="serif-title">Event Approval Requests</h2>
          <p>Process and manage multi-stage event applications</p>
        </div>
      </div>

      <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; margin-bottom:24px; flex-wrap:wrap;">
        ${filterBtn('all', 'All', counts.all)}
        ${filterBtn('pending', 'New Requests', counts.pending)}
        ${filterBtn('under_review', 'Under Review', counts.under_review)}
        ${filterBtn('approved', 'Approved', counts.approved)}
        ${filterBtn('rejected', 'Rejected', counts.rejected)}
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">
        ${cards || '<div style="grid-column:1/-1; text-align:center; padding:80px 20px; color:#a0aec0;"><i class="fas fa-inbox" style="font-size:3rem; margin-bottom:16px; display:block; opacity:0.4;"></i><div style="font-weight:700; font-size:1rem; color:#718096;">No requests found in this category</div></div>'}
      </div>

      ${Components.paginationBar(paged, 'AdminApprovals.goPage')}`;

    Components.renderShell(user, 'admin/approvals', 'Event Approvals', 'Lifecycle management of campus events', content);
  }

  function review(id) {
    Store.Events.review(id, Auth.current().name);
    Components.toast('Event request is now under review.', 'info');
    _draw();
  }

  function approve(id) {
    Components.promptNote('Approve Event', 'Final approval notes or conditions:', 'btn-success', 'Confirm Approval', (note) => {
      Store.Events.approve(id, note, Auth.current().name);
      Components.toast('Event has been approved!', 'success');
      _draw();
    });
  }

  function reject(id) {
    Components.promptNote('Reject Event Request', 'Reason for rejection (will be visible to student):', 'btn-danger', 'Reject Request', (note) => {
      if (!note) { Components.toast('A rejection reason is required.', 'warning'); return; }
      Store.Events.reject(id, note, Auth.current().name);
      Components.toast('Event request rejected.', 'info');
      _draw();
    });
  }

  function viewDetails(id) {
    const e = Store.Events.get(id);
    if (!e) return;
    const body = `
      <div style="display:grid; gap:14px; font-size:.9rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px; background:#f8fafc; border-radius:10px;">
          <strong style="color:#718096; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">Request ID</strong>
          <span style="font-family:monospace; font-size:0.82rem; color:#4a5568;">${e.id}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px; background:#f8fafc; border-radius:10px;">
          <strong style="color:#718096; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">Status</strong>
          ${Utils.statusBadge(e.status)}
        </div>
        <hr style="border:0; border-top:1px solid #f1f5f9;">
        <div><strong style="color:#1a1a1a;">Event Name:</strong><div style="margin-top:4px; color:#4a5568;">${Utils.escape(e.eventName)}</div></div>
        <div><strong style="color:#1a1a1a;">Submitted By:</strong><div style="margin-top:4px; color:#4a5568;">${Utils.escape(e.userName)}</div></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div><strong style="color:#1a1a1a;">Type:</strong><div style="margin-top:4px; color:#4a5568;">${e.eventType}</div></div>
          <div><strong style="color:#1a1a1a;">Attendees:</strong><div style="margin-top:4px; color:#4a5568;">${e.attendees} pax</div></div>
        </div>
        <div><strong style="color:#1a1a1a;">Venue:</strong><div style="margin-top:4px; color:#4a5568;">${Utils.escape(e.facilityName)}</div></div>
        <div><strong style="color:#1a1a1a;">Schedule:</strong><div style="margin-top:4px; color:#4a5568;">${Utils.formatDate(e.date)} &nbsp;|&nbsp; ${Utils.formatTime(e.startTime)} – ${Utils.formatTime(e.endTime)}</div></div>
        <div><strong style="color:#1a1a1a;">Description:</strong><p style="margin-top:6px; font-size:.85rem; line-height:1.6; color:#718096; background:#f8fafc; padding:12px 16px; border-radius:8px;">${Utils.escape(e.description)}</p></div>
        ${e.adminNote ? `<div style="background:#fff5f5; padding:14px 18px; border-radius:10px; border-left:4px solid var(--primary);">
          <strong style="font-size:0.75rem; color:#c53030; text-transform:uppercase; letter-spacing:0.05em;">Admin Decision Note</strong>
          <div style="margin-top:6px; color:#742a2a; font-size:.85rem;">${Utils.escape(e.adminNote)}</div>
        </div>` : ''}
      </div>`;
    Components.openModal('Event Request Details', body, `<button class="btn btn-outline btn-sm" onclick="Components.closeModal()">Close</button>`);
  }

  function setFilter(f) { _filter = f; _page = 1; _draw(); }
  function goPage(p) { _page = p; _draw(); }

  return { render, review, approve, reject, viewDetails, setFilter, goPage };
})();
