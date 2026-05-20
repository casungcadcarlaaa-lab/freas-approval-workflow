// store.js — localStorage data store with full CRUD
const Store = (() => {
  const KEYS = { facilities: 'freas_facilities', reservations: 'freas_reservations', events: 'freas_events', notifications: 'freas_notifications' };

  function _load(key, seed) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    const data = seed ? JSON.parse(JSON.stringify(seed)) : [];
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }

  function _save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

  // ONE-TIME CLEANUP (Requested by user to remove dummy reservations except Sports Palace)
  if (!localStorage.getItem('freas_cleaned_dummy')) {
    try {
      let res = JSON.parse(localStorage.getItem(KEYS.reservations) || '[]');
      // Keep only Sports Palace requests
      res = res.filter(r => r.facilityName === 'Sports Palace' || r.purpose === 'sddd');
      localStorage.setItem(KEYS.reservations, JSON.stringify(res));

      let evts = JSON.parse(localStorage.getItem(KEYS.events) || '[]');
      evts = evts.filter(e => e.facilityName === 'Sports Palace' || e.purpose === 'sddd');
      localStorage.setItem(KEYS.events, JSON.stringify(evts));

      localStorage.setItem('freas_cleaned_dummy', 'true');
    } catch(e) {}
  }

  function _id(prefix) { return prefix + Date.now() + Math.random().toString(36).slice(2, 6); }

  // ── Facilities ──
  const Facilities = {
    all()         { return _load(KEYS.facilities, Config.FACILITIES); },
    active()      { return Facilities.all().filter(f => f.status === 'active'); },
    get(id)       { return Facilities.all().find(f => f.id === id); },
    create(data)  { const list = Facilities.all(); const rec = { ...data, id: _id('f'), createdAt: new Date().toISOString() }; list.push(rec); _save(KEYS.facilities, list); return rec; },
    update(id, d) { const list = Facilities.all().map(f => f.id === id ? { ...f, ...d } : f); _save(KEYS.facilities, list); return list.find(f => f.id === id); },
    delete(id)    { const list = Facilities.all().filter(f => f.id !== id); _save(KEYS.facilities, list); }
  };

  // ── Reservations ──
  const Reservations = {
    all()               { return _load(KEYS.reservations, Config.RESERVATIONS); },
    byUser(uid)         { return Reservations.all().filter(r => r.userId === uid); },
    get(id)             { return Reservations.all().find(r => r.id === id); },
    create(data, user)  {
      const list = Reservations.all();
      const rec = { ...data, id: _id('r'), userId: user.id, userName: user.name, status: 'pending', adminNote: '', createdAt: new Date().toISOString() };
      const fac = Facilities.get(data.facilityId);
      rec.facilityName = fac ? fac.name : data.facilityId;
      list.push(rec);
      _save(KEYS.reservations, list);
      
      // Create admin notifications
      const admins = ['admin.vp@unc.edu.ph', 'admin.gbmo@unc.edu.ph'];
      admins.forEach(adm => {
        Notifications.create(adm, 'New Reservation Request', `${user.name} requested reservation for ${rec.facilityName} on ${Utils.formatDate(rec.date)}.`, 'info', 'admin/approvals');
      });
      return rec;
    },
    update(id, d)       { const list = Reservations.all().map(r => r.id === id ? { ...r, ...d } : r); _save(KEYS.reservations, list); return list.find(r => r.id === id); },
    delete(id)          { const list = Reservations.all().filter(r => r.id !== id); _save(KEYS.reservations, list); },
    approve(id, note, adminName) { 
      const rec = Reservations.update(id, { status: 'approved', adminNote: note || '', approvedBy: adminName, reviewedAt: new Date().toISOString() });
      Notifications.create(rec.userId, 'Reservation Approved', `Your reservation for ${rec.facilityName} on ${Utils.formatDate(rec.date)} has been approved by ${adminName}.`, 'success', 'student/reservations');
      return rec;
    },
    reject(id, note, adminName)  { 
      const rec = Reservations.update(id, { status: 'rejected', adminNote: note || '', rejectedBy: adminName, reviewedAt: new Date().toISOString() });
      const reasonMsg = note ? ` Reason: ${note}` : '';
      Notifications.create(rec.userId, 'Reservation Rejected', `Your reservation for ${rec.facilityName} on ${Utils.formatDate(rec.date)} was rejected by ${adminName}.${reasonMsg}`, 'error', 'student/reservations');
      return rec;
    },
    stats(uid) {
      const list = uid ? Reservations.byUser(uid) : Reservations.all();
      return { total: list.length, pending: list.filter(r => r.status==='pending').length, approved: list.filter(r => r.status==='approved').length, rejected: list.filter(r => r.status==='rejected').length };
    }
  };

  // ── Events ──
  const Events = {
    all()               { return _load(KEYS.events, Config.EVENTS); },
    byUser(uid)         { return Events.all().filter(e => e.userId === uid); },
    get(id)             { return Events.all().find(e => e.id === id); },
    create(data, user)  {
      const list = Events.all();
      const rec = { ...data, id: _id('e'), userId: user.id, userName: user.name, status: 'pending', adminNote: '', createdAt: new Date().toISOString() };
      const fac = Facilities.get(data.facilityId);
      rec.facilityName = fac ? fac.name : data.facilityId;
      list.push(rec);
      _save(KEYS.events, list);
      
      // Create admin notifications
      const admins = ['admin.vp@unc.edu.ph', 'admin.gbmo@unc.edu.ph'];
      admins.forEach(adm => {
        Notifications.create(adm, 'New Event Proposal', `${user.name} submitted a new event proposal for ${rec.facilityName}.`, 'info', 'admin/approvals');
      });
      return rec;
    },
    update(id, d)       { const list = Events.all().map(e => e.id === id ? { ...e, ...d } : e); _save(KEYS.events, list); return list.find(e => e.id === id); },
    delete(id)          { const list = Events.all().filter(e => e.id !== id); _save(KEYS.events, list); },
    review(id, adminName)    { 
      const rec = Events.update(id, { status: 'under_review', reviewedBy: adminName, reviewedAt: new Date().toISOString() });
      Notifications.create(rec.userId, 'Event Under Review', `Your event proposal for ${rec.facilityName} is now under review by ${adminName}.`, 'info', 'student/events');
      return rec;
    },
    approve(id, note, adminName) { 
      const rec = Events.update(id, { status: 'approved', adminNote: note || '', approvedBy: adminName, reviewedAt: new Date().toISOString() });
      Notifications.create(rec.userId, 'Event Proposal Approved', `Your event proposal for ${rec.facilityName} has been approved by ${adminName}!`, 'success', 'student/events');
      return rec;
    },
    reject(id, note, adminName)  { 
      const rec = Events.update(id, { status: 'rejected', adminNote: note || '', rejectedBy: adminName, reviewedAt: new Date().toISOString() });
      const reasonMsg = note ? ` Reason: ${note}` : '';
      Notifications.create(rec.userId, 'Event Proposal Rejected', `Your event proposal for ${rec.facilityName} was rejected by ${adminName}.${reasonMsg}`, 'error', 'student/events');
      return rec;
    },
    stats(uid) {
      const list = uid ? Events.byUser(uid) : Events.all();
      return { total: list.length, pending: list.filter(e => e.status==='pending').length, under_review: list.filter(e => e.status==='under_review').length, approved: list.filter(e => e.status==='approved').length, rejected: list.filter(e => e.status==='rejected').length };
    }
  };

  // ── Notifications ──
  const Notifications = {
    all() { 
      // Seed some initial notifications if storage is empty
      const seed = [
        { id: 'n1', userId: 'student@unc.edu.ph', title: 'Welcome to F.R.E.A.S-UNC', message: 'Your account is active. You can now request facility reservations and track approvals.', type: 'info', read: false, createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), link: 'student/dashboard' },
        { id: 'n2', userId: 'student@unc.edu.ph', title: 'Reservation Approved', message: 'Your booking request for Sports Palace on May 24, 2026 has been approved!', type: 'success', read: false, createdAt: new Date(Date.now() - 600000).toISOString(), link: 'student/reservations' },
        { id: 'n3', userId: 'admin.vp@unc.edu.ph', title: 'New Reservation Request', message: 'Juan Dela Cruz submitted a request for Covered Court A.', type: 'info', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), link: 'admin/approvals' },
        { id: 'n4', userId: 'admin.gbmo@unc.edu.ph', title: 'New Event Proposal', message: 'Juan Dela Cruz submitted a high-profile event proposal for Social Hall.', type: 'info', read: false, createdAt: new Date(Date.now() - 1800000).toISOString(), link: 'admin/approvals' }
      ];
      return _load(KEYS.notifications, seed); 
    },
    byUser(uid) { 
      return Notifications.all()
        .filter(n => n.userId === uid)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
    },
    unreadCount(uid) { 
      return Notifications.byUser(uid).filter(n => !n.read).length; 
    },
    create(uid, title, message, type = 'info', link = '') {
      const list = Notifications.all();
      const rec = { id: _id('n'), userId: uid, title, message, type, read: false, createdAt: new Date().toISOString(), link };
      list.push(rec);
      _save(KEYS.notifications, list);
      return rec;
    },
    markRead(id) {
      const list = Notifications.all().map(n => n.id === id ? { ...n, read: true } : n);
      _save(KEYS.notifications, list);
      return list.find(n => n.id === id);
    },
    markAllRead(uid) {
      const list = Notifications.all().map(n => n.userId === uid ? { ...n, read: true } : n);
      _save(KEYS.notifications, list);
    },
    clear(uid) {
      const list = Notifications.all().filter(n => n.userId !== uid);
      _save(KEYS.notifications, list);
    }
  };
 
  return { Facilities, Reservations, Events, Notifications };
})();
