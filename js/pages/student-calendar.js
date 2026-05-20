// pages/student-calendar.js
const StudentCalendar = (() => {
  let _view = 'month'; // 'month' or 'week'
  let _currentDate = new Date();

  function render() {
    const user = Auth.current();
    if (!user) { Router.navigate('login'); return; }
    _draw(user);
  }

  function prevMonth() {
    _currentDate.setMonth(_currentDate.getMonth() - 1);
    _draw(Auth.current());
  }

  function nextMonth() {
    _currentDate.setMonth(_currentDate.getMonth() + 1);
    _draw(Auth.current());
  }

  function _draw(user) {
    const monthName = _currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
    const year = _currentDate.getFullYear();

    const content = `
      <div class="page-hdr" style="margin-bottom: 24px;">
        <h2 class="serif-title">Facility Calendar</h2>
        <p>View facility availability and reservations</p>
      </div>

      <div class="card" style="padding: 24px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 1rem; font-weight: 800; text-transform: uppercase; color: #1a1a1a;">${monthName} ${year}</h3>
          <div style="display: flex; gap: 15px; align-items: center;">
            <div style="background: #f8fafc; padding: 4px; border-radius: 8px; display: flex; align-items: center;">
              <button style="padding: 8px 16px; font-size: 0.85rem; font-weight: 600; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; ${_view === 'week' ? 'background: #c53030; color: #fff;' : 'background: transparent; color: #4a5568;'}" onclick="StudentCalendar.setView('week')">
                <i class="far fa-calendar-alt"></i> Weekly Schedule
              </button>
              <button style="padding: 8px 16px; font-size: 0.85rem; font-weight: 600; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; ${_view === 'month' ? 'background: #c53030; color: #fff;' : 'background: transparent; color: #4a5568;'}" onclick="StudentCalendar.setView('month')">
                <i class="far fa-calendar-alt"></i> Monthly Overview
              </button>
            </div>
            <div style="display: flex; gap: 8px;">
              <button style="width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #1a202c; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.85rem; transition: all 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#fff'" onclick="StudentCalendar.prevMonth()">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button style="width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #1a202c; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.85rem; transition: all 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#fff'" onclick="StudentCalendar.nextMonth()">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        ${_view === 'month' ? _renderMonthGrid() : _renderWeekGrid()}

        <div style="display: flex; gap: 20px; margin-top: 24px; font-size: 0.75rem; color: #718096; font-weight: 600;">
          <div style="display: flex; align-items: center; gap: 8px;"><span style="width: 12px; height: 12px; background: #38a169; border-radius: 2px;"></span> Approved</div>
          <div style="display: flex; align-items: center; gap: 8px;"><span style="width: 12px; height: 12px; background: #3182ce; border-radius: 2px;"></span> Pending</div>
          <div style="display: flex; align-items: center; gap: 8px;"><span style="width: 12px; height: 12px; background: #cbd5e0; border-radius: 2px;"></span> Past / Rejected</div>
          <div style="display: flex; align-items: center; gap: 8px;"><span style="width: 12px; height: 12px; border: 1px solid #e2e8f0; border-radius: 2px;"></span> Available</div>
        </div>
      </div>

      <div class="card" style="padding: 24px;">
        <h3 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #1a1a1a; margin-bottom: 4px;">Upcoming Reservations</h3>
        <p style="font-size: 0.8rem; color: #a0aec0; margin-bottom: 20px;">All scheduled facility reservations</p>
        
        <div style="display: grid; gap: 12px;">
          ${_renderUpcomingReservations()}
        </div>
      </div>
    `;

    Components.renderShell(user, 'student/calendar', 'Calendar', 'View facility availability', content);
  }

  function _renderUpcomingReservations() {
    const allRes = Store.Reservations.all();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = allRes
      .filter(r => new Date(r.date) >= today)
      .sort((a,b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
    
    if (upcoming.length === 0) {
      return `<div style="padding: 30px; text-align: center; color: #a0aec0; background: #f8fafc; border-radius: 8px; border: 1px dashed #e2e8f0;">No upcoming reservations</div>`;
    }

    return upcoming.map(r => {
      const isPending = r.status === 'pending';
      const isApproved = r.status === 'approved';
      const badgeClass = isPending ? 'badge-pending' : (isApproved ? 'badge-success' : 'badge-danger');
      const badgeText = isPending ? 'Pending' : (isApproved ? 'Approved' : 'Rejected');
      const bgIcon = isPending ? '#fffbeb' : (isApproved ? '#f0fdf4' : '#fef2f2');
      const colorIcon = isPending ? '#d97706' : (isApproved ? '#16a34a' : '#dc2626');
      const icon = isPending ? 'fa-clock' : (isApproved ? 'fa-check' : 'fa-times');
      
      const dateObj = new Date(r.date);
      const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

      return `
        <div style="padding: 16px; border: 1px solid #f1f5f9; border-radius: 12px; display: flex; align-items: center; gap: 15px;">
          <div style="width: 40px; height: 40px; border-radius: 8px; background: ${bgIcon}; color: ${colorIcon}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
            <i class="far ${icon}"></i>
          </div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
              <span class="badge ${badgeClass}" style="font-size: 0.6rem;">${badgeText}</span>
              <span style="font-size: 0.85rem; font-weight: 700; color: #1a1a1a;">${dateStr}</span>
            </div>
            <div style="font-size: 0.8rem; color: #718096; display: flex; align-items: center; gap: 12px;">
              <span><i class="far fa-clock"></i> ${Utils.formatTime(r.startTime)} - ${Utils.formatTime(r.endTime)}</span>
              <span><i class="fas fa-building"></i> ${Utils.escape(r.facilityName)}</span>
              ${r.purpose ? `<span><i class="fas fa-tag"></i> ${Utils.escape(r.purpose)}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function _renderMonthGrid() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = `<div class="cal-scroll-wrap"><div style="display: grid; grid-template-columns: repeat(7, 1fr); border: 1px solid #edf2f7; border-radius: 8px; overflow: hidden; background: #fff; min-width: 700px;">`;
    
    // Headers
    days.forEach(d => {
      html += `<div style="padding: 12px; background: #f8fafc; text-align: center; font-size: 0.75rem; font-weight: 700; color: #718096; border-bottom: 1px solid #edf2f7;">${d}</div>`;
    });

    const year = _currentDate.getFullYear();
    const month = _currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Prev month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      html += `<div style="padding: 10px; background: #f8fafc; height: 100px; border-right: 1px solid #edf2f7; border-bottom: 1px solid #edf2f7; color: #cbd5e0; font-size: 0.75rem; font-weight: 600;">${d}</div>`;
    }

    const allRes = Store.Reservations.all();
    const today = new Date();

    for (let i = 1; i <= daysInMonth; i++) {
      let isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      
      const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayRes = allRes.filter(r => r.date === dateStr);

      html += `
        <div style="padding: 8px; background: #fff; height: 100px; border-right: 1px solid #edf2f7; border-bottom: 1px solid #edf2f7; position: relative; overflow-y: auto;">
          <div style="font-size: 0.75rem; font-weight: 700; color: ${isToday ? '#fff' : '#2d3748'}; background: ${isToday ? 'var(--primary)' : 'transparent'}; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 6px;">${i}</div>
          ${dayRes.map(r => {
            const bg = r.status === 'approved' ? '#38a169' : (r.status === 'pending' ? '#3182ce' : '#cbd5e0');
            return `<div style="background: ${bg}; color: #fff; font-size: 0.6rem; padding: 3px 6px; border-radius: 4px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; cursor: pointer;" title="${Utils.escape(r.facilityName)} (${Utils.formatTime(r.startTime)} - ${Utils.formatTime(r.endTime)})">${Utils.escape(r.facilityName)}</div>`;
          }).join('')}
        </div>`;
    }

    // Fill rest
    const totalCells = firstDay + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      html += `<div style="padding: 10px; background: #f8fafc; height: 100px; border-right: 1px solid #edf2f7; border-bottom: 1px solid #edf2f7; color: #cbd5e0; font-size: 0.75rem; font-weight: 600;">${i}</div>`;
    }

    html += `</div></div>`;
    return html;
  }

  function _renderWeekGrid() {
    // Basic dynamic week view placeholder showing the week of the _currentDate
    let html = `<div style="padding: 40px; text-align: center; color: #a0aec0; border: 1px solid #edf2f7; border-radius: 8px;"><i class="fas fa-hammer" style="font-size: 2rem; margin-bottom: 15px; display: block; opacity: 0.5;"></i>Weekly view is under construction. Please use Monthly Overview.</div>`;
    return html;
  }

  function setView(v) {
    _view = v;
    _draw(Auth.current());
  }

  return { render, setView, prevMonth, nextMonth };
})();
