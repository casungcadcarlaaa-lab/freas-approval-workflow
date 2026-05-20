// pages/student-events.js — Student Event Approval Requests
const StudentEvents = (() => {
  let _page = 1, _filter = 'all';

  function render() {
    const user = Auth.require('student');
    if (!user) return;
    _page = 1; _filter = 'all';
    _draw(user);
  }

  function _draw(user) {
    user = user || Auth.current();
    let list = Store.Events.byUser(user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (_filter !== 'all') list = list.filter(e => e.status === _filter);
    const paged = Components.paginate(list, _page);

    const cards = paged.items.length ? paged.items.map(e => `
      <div class="approval-card ${e.status}">
        <div class="approval-hdr">
          <div>
            <div class="approval-title">${Utils.escape(e.eventName)}</div>
            <div style="font-size:.75rem;color:var(--text-3);margin-top:2px">${Utils.escape(e.eventType)} Event</div>
          </div>
          ${Utils.statusBadge(e.status)}
        </div>
        <div class="approval-meta">
          <span><i class="fas fa-building"></i>${Utils.escape(e.facilityName)}</span>
          <span><i class="fas fa-calendar-day"></i>${Utils.formatDate(e.date)}</span>
          <span><i class="fas fa-clock"></i>${Utils.formatTime(e.startTime)} - ${Utils.formatTime(e.endTime)}</span>
          <span><i class="fas fa-users"></i>${e.attendees} expected</span>
        </div>
        <div style="font-size:.85rem;color:var(--text-2);margin-bottom:12px;line-height:1.5">${Utils.escape(e.description)}</div>
        
        ${e.adminNote ? `
          <div style="background:var(--bg);padding:10px;border-radius:6px;font-size:.8rem;margin-bottom:10px">
            <strong style="color:var(--primary)">Admin Note:</strong> ${Utils.escape(e.adminNote)}
          </div>` : ''}

        <div class="approval-actions">
          <button class="btn btn-outline btn-sm" onclick="StudentEvents.viewDetails('${e.id}')">View Full Details</button>
          ${e.status === 'pending' ? `
            <button class="btn btn-ghost btn-sm" style="color:var(--rejected)" onclick="StudentEvents.cancel('${e.id}')"><i class="fas fa-trash"></i> Cancel Request</button>
          ` : ''}
        </div>
      </div>`).join('') :
      `<div class="empty-state"><i class="fas fa-star-half-alt"></i><h4>No event requests</h4><p>You haven't submitted any event approval requests yet.</p></div>`;

    const content = `
      <div class="page-hdr">
        <div><h2>My Event Requests</h2><p>Track your multi-stage event approval workflows</p></div>
        <button class="btn btn-primary" onclick="StudentEvents.create()"><i class="fas fa-plus"></i>Request Event Approval</button>
      </div>

      <div class="tabs-scroll">
        <button class="btn btn-sm ${_filter === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="StudentEvents.setFilter('all')">All</button>
        <button class="btn btn-sm ${_filter === 'pending' ? 'btn-primary' : 'btn-outline'}" onclick="StudentEvents.setFilter('pending')">Pending</button>
        <button class="btn btn-sm ${_filter === 'under_review' ? 'btn-primary' : 'btn-outline'}" onclick="StudentEvents.setFilter('under_review')">Under Review</button>
        <button class="btn btn-sm ${_filter === 'approved' ? 'btn-primary' : 'btn-outline'}" onclick="StudentEvents.setFilter('approved')">Approved</button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:20px">
        ${cards}
      </div>
      
      ${Components.paginationBar(paged, 'StudentEvents.goPage')}`;

    Components.renderShell(user, 'student/events', 'Event Approvals', 'Manage your event request lifecycle', content);
  }

  function create() {
    const body = `
      <div class="form-group"><label>Event Name</label>
        <input id="e-name" class="form-control" type="text" placeholder="e.g. Annual Tech Symposium" /></div>
      <div class="form-row">
        <div class="form-group"><label>Event Type</label>
          <select id="e-type" class="form-control">
            <option value="Academic">Academic</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Social">Social</option>
            <option value="Other">Other</option>
          </select></div>
        <div class="form-group"><label>Facility</label>
          <select id="e-facility" class="form-control">${Store.Facilities.active().map(f => `<option value="${f.id}">${f.name}</option>`).join('')}</select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Date</label><input id="e-date" class="form-control" type="date" min="${new Date().toISOString().split('T')[0]}" /></div>
        <div class="form-group"><label>Attendees</label><input id="e-attendees" class="form-control" type="number" placeholder="Exp. count" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Start Time</label><input id="e-start" class="form-control" type="time" /></div>
        <div class="form-group"><label>End Time</label><input id="e-end" class="form-control" type="time" /></div>
      </div>
      <div class="form-group"><label>Description & Scope</label>
        <textarea id="e-desc" class="form-control" rows="3" placeholder="Provide a detailed description of the event..."></textarea></div>`;

    Components.openModal('Request Event Approval', body, `
      <button class="btn btn-outline btn-sm" onclick="Components.closeModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="StudentEvents._submit()">Submit for Approval</button>`);
  }

  function _submit() {
    const data = {
      eventName: document.getElementById('e-name').value.trim(),
      eventType: document.getElementById('e-type').value,
      facilityId: document.getElementById('e-facility').value,
      date: document.getElementById('e-date').value,
      attendees: parseInt(document.getElementById('e-attendees').value),
      startTime: document.getElementById('e-start').value,
      endTime: document.getElementById('e-end').value,
      description: document.getElementById('e-desc').value.trim()
    };

    if (!data.eventName || !data.date || !data.startTime || !data.endTime || isNaN(data.attendees)) {
      Components.toast('Please fill in all required fields.', 'error'); return;
    }

    Store.Events.create(data, Auth.current());
    Components.closeModal();
    Components.toast('Event request submitted for review.', 'success');
    _draw();
  }

  function cancel(id) {
    Components.confirm('Are you sure you want to cancel this event request?', () => {
      Store.Events.delete(id);
      Components.toast('Event request cancelled.', 'info');
      _draw();
    });
  }

  function viewDetails(id) {
    const e = Store.Events.get(id);
    if (!e) return;
    const body = `
      <div style="display:grid;gap:14px;font-size:.9rem">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:700;font-size:1.1rem;color:var(--primary)">${Utils.escape(e.eventName)}</span>
          ${Utils.statusBadge(e.status)}
        </div>
        <div style="color:var(--text-3);border-bottom:1px solid var(--border);padding-bottom:10px">${e.eventType} Event</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div><strong>Facility:</strong> ${e.facilityName}</div>
          <div><strong>Expected:</strong> ${e.attendees} pax</div>
          <div><strong>Date:</strong> ${Utils.formatDate(e.date)}</div>
          <div><strong>Time:</strong> ${Utils.formatTime(e.startTime)} - ${Utils.formatTime(e.endTime)}</div>
        </div>
        <div><strong>Description:</strong><p style="margin-top:5px;line-height:1.5">${Utils.escape(e.description)}</p></div>
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
          <div style="font-weight:700;margin-bottom:8px">Approval Timeline</div>
          <ul class="timeline">
            <li class="done">
              <div class="tl-status">Request Submitted</div>
              <div class="tl-date">${Utils.formatDateTime(e.createdAt)}</div>
            </li>
            <li class="${e.status !== 'pending' ? 'done' : 'current'}">
              <div class="tl-status">Administrative Review</div>
              <div class="tl-date">${e.reviewedAt ? Utils.formatDateTime(e.reviewedAt) : 'In progress...'}</div>
            </li>
            <li class="${e.status === 'approved' ? 'done' : (e.status === 'rejected' ? 'rejected' : '')}">
              <div class="tl-status">Final Decision</div>
              <div class="tl-date">${(e.status === 'approved' || e.status === 'rejected') ? Utils.formatDateTime(new Date()) : 'Awaiting review'}</div>
            </li>
          </ul>
        </div>
      </div>`;
    Components.openModal('Event Request Details', body, `<button class="btn btn-outline btn-sm" onclick="Components.closeModal()">Close</button>`);
  }

  function setFilter(f) { _filter = f; _page = 1; _draw(); }
  function goPage(p) { _page = p; _draw(); }

  return { render, create, _submit, cancel, viewDetails, setFilter, goPage };
})();
