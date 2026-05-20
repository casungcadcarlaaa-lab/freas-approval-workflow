// pages/admin-facilities.js — Facility Inventory Management
const AdminFacilities = (() => {
  function render() {
    const user = Auth.require('admin');
    if (!user) return;
    _draw(user);
  }

  function _draw(user) {
    const facilities = Store.Facilities.all();

    const cards = facilities.map(f => `
      <div class="facility-card">
        <div class="facility-thumb">
          <i class="fas ${Utils.facilityIcon(f.type)}"></i>
          <span class="facility-type-tag">${f.type}</span>
        </div>
        <div class="facility-body">
          <div class="facility-name">${Utils.escape(f.name)}</div>
          <div class="facility-loc"><i class="fas fa-map-marker-alt"></i> ${Utils.escape(f.location)}</div>
          <div class="facility-meta">
            <div class="facility-cap"><i class="fas fa-users"></i> ${f.capacity} max</div>
            ${Utils.statusBadge(f.status)}
          </div>
          <div class="facility-actions">
            <button class="btn btn-outline btn-sm btn-full" onclick="AdminFacilities.edit('${f.id}')"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--rejected)" onclick="AdminFacilities.remove('${f.id}')"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>
    `).join('');

    const content = `
      <div class="page-hdr">
        <div><h2>Facility Management</h2><p>Configure campus resources and availability</p></div>
        <button class="btn btn-primary" onclick="AdminFacilities.create()"><i class="fas fa-plus"></i> Add Facility</button>
      </div>

      <div class="facilities-grid">
        ${cards}
      </div>`;

    Components.renderShell(user, 'admin/facilities', 'Facilities', 'Manage campus rooms, halls, and outdoor areas', content);
  }

  function _formModal(title, data, onSave) {
    const body = `
      <div class="form-group"><label>Facility Name</label>
        <input id="fac-name" class="form-control" type="text" value="${data.name||''}" placeholder="e.g. Conference Room A" /></div>
      <div class="form-row">
        <div class="form-group"><label>Category</label>
          <select id="fac-type" class="form-control">
            <option value="Auditorium" ${data.type==='Auditorium'?'selected':''}>Auditorium</option>
            <option value="Conference Room" ${data.type==='Conference Room'?'selected':''}>Conference Room</option>
            <option value="Laboratory" ${data.type==='Laboratory'?'selected':''}>Laboratory</option>
            <option value="Sports Facility" ${data.type==='Sports Facility'?'selected':''}>Sports Facility</option>
            <option value="Audio-Visual Room" ${data.type==='Audio-Visual Room'?'selected':''}>Audio-Visual Room</option>
            <option value="Function Hall" ${data.type==='Function Hall'?'selected':''}>Function Hall</option>
            <option value="Outdoor Area" ${data.type==='Outdoor Area'?'selected':''}>Outdoor Area</option>
          </select></div>
        <div class="form-group"><label>Capacity</label>
          <input id="fac-cap" class="form-control" type="number" value="${data.capacity||''}" placeholder="Max pax" /></div>
      </div>
      <div class="form-group"><label>Location</label>
        <input id="fac-loc" class="form-control" type="text" value="${data.location||''}" placeholder="e.g. Main Bldg, 2F" /></div>
      <div class="form-group"><label>Status</label>
        <select id="fac-status" class="form-control">
          <option value="active" ${data.status==='active'?'selected':''}>Active / Available</option>
          <option value="maintenance" ${data.status==='maintenance'?'selected':''}>Under Maintenance</option>
          <option value="inactive" ${data.status==='inactive'?'selected':''}>Inactive</option>
        </select></div>`;
    
    Components.openModal(title, body, `
      <button class="btn btn-outline btn-sm" onclick="Components.closeModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="AdminFacilities._save()">Save Facility</button>`);
    
    window._onFacSave = onSave;
  }

  function _save() {
    const data = {
      name: document.getElementById('fac-name').value.trim(),
      type: document.getElementById('fac-type').value,
      capacity: parseInt(document.getElementById('fac-cap').value),
      location: document.getElementById('fac-loc').value.trim(),
      status: document.getElementById('fac-status').value
    };

    if (!data.name || isNaN(data.capacity) || !data.location) {
      Components.toast('Please fill in all fields correctly.', 'warning'); return;
    }

    Components.closeModal();
    window._onFacSave(data);
  }

  function create() {
    _formModal('Add New Facility', {}, (data) => {
      Store.Facilities.create(data);
      Components.toast('Facility added successfully!', 'success');
      _draw(Auth.current());
    });
  }

  function edit(id) {
    const f = Store.Facilities.get(id);
    if (!f) return;
    _formModal('Edit Facility', f, (data) => {
      Store.Facilities.update(id, data);
      Components.toast('Facility updated.', 'success');
      _draw(Auth.current());
    });
  }

  function remove(id) {
    Components.confirm('Are you sure you want to delete this facility? Existing reservations may be affected.', () => {
      Store.Facilities.delete(id);
      Components.toast('Facility removed from inventory.', 'info');
      _draw(Auth.current());
    });
  }

  return { render, create, edit, remove, _save };
})();
