// components.js — Reusable UI components (Sidebar, Header, Modal, Toast)
const Components = (() => {

  // ── Toast ──────────────────────────────────────────
  function toast(msg, type = 'info', duration = 3500) {
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span><button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => { el.style.animation = 'fadeOut .3s ease forwards'; setTimeout(() => el.remove(), 300); }, duration);
  }

  // ── Modal ──────────────────────────────────────────
  function openModal(title, bodyHtml, footerHtml) {
    const overlay = document.getElementById('modal-overlay');
    const box = document.getElementById('modal-box');
    box.innerHTML = `
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="Components.closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}`;
    overlay.classList.remove('hidden');
    overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-box').innerHTML = '';
  }

  // ── Confirm Dialog ──────────────────────────────────
  function confirm(message, onOk, danger = true) {
    const footer = `
      <button class="btn btn-outline btn-sm" onclick="Components.closeModal()">Cancel</button>
      <button class="btn ${danger ? 'btn-danger' : 'btn-primary'} btn-sm" id="confirm-ok-btn">Confirm</button>`;
    openModal('Confirm Action', `<p style="color:var(--text-2);font-size:.9rem">${message}</p>`, footer);
    document.getElementById('confirm-ok-btn').onclick = () => { closeModal(); onOk(); };
  }

  // ── Sidebar ──────────────────────────────────────────
  function renderSidebar(user, activePage) {
    let navItems;
    let showHeader = true;
    if (user.role === 'admin') {
      navItems = [
        { id: 'admin/dashboard', name: 'Dashboard', icon: 'fas fa-th-large', link: '#/admin/dashboard' },
        { id: 'student/new-request', name: 'New Request', icon: 'fas fa-file-alt', link: '#/student/new-request' },
        { id: 'student/reservations', name: 'My Requests', icon: 'fas fa-clipboard-list', link: '#/student/reservations' },
        { id: 'student/calendar', name: 'Calendar', icon: 'far fa-calendar-alt', link: '#/student/calendar' },
        { id: 'admin/approvals', name: 'Approvals', icon: 'fas fa-check-double', link: '#/admin/approvals' },
        { id: 'admin/reservations', name: 'All Bookings', icon: 'fas fa-calendar-check', link: '#/admin/reservations' },
        { id: 'admin/profile', name: 'Profile', icon: 'fas fa-user-circle', link: '#/admin/profile' }
      ];
    } else {
      navItems = [
        { id: 'student/dashboard', name: 'Dashboard', icon: 'fas fa-home', link: '#/student/dashboard' },
        { id: 'student/new-request', name: 'New Request', icon: 'fas fa-file-alt', link: '#/student/new-request' },
        { id: 'student/reservations', name: 'My Requests', icon: 'fas fa-clipboard-list', link: '#/student/reservations' },
        { id: 'student/calendar', name: 'Calendar', icon: 'fas fa-calendar-alt', link: '#/student/calendar' },
        { id: 'student/profile', name: 'Profile', icon: 'fas fa-user-circle', link: '#/student/profile' }
      ];
    }

    return `
      <aside class="sidebar" id="sidebar">
        <button onclick="Components.toggleSidebar()" style="position: absolute; top: 20px; left: 20px; background: transparent; border: none; color: #fff; font-size: 1.3rem; cursor: pointer; z-index: 10;"><i class="fas fa-bars"></i></button>
        <button class="mobile-close-btn" onclick="Components.toggleSidebar()" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; display: none;"><i class="fas fa-times"></i></button>
        
        ${showHeader ? `
        <div class="sidebar-hdr" style="padding: 50px 20px 20px 20px; display: flex; flex-direction: column; align-items: center; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 10px;">
          <img src="assets/logo.png" alt="UNC Logo" style="width: 60px; height: auto; margin-bottom: 12px;" />
          <div class="serif-title" style="color: var(--primary); font-size: 1.3rem; letter-spacing: 0.05em; font-weight: 800; text-transform: uppercase;">F.R.E.A.S.</div>
          <div style="font-size: 0.65rem; color: #8e9aaf; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-top: 4px;">FACILITY RESERVATION SYSTEM</div>
        </div>
        ` : `
        <div style="height: 30px;"></div>
        `}
        
        <div style="font-size: 0.7rem; font-weight: 800; color: #888; text-transform: uppercase; letter-spacing: 0.08em; padding: 10px 20px 8px 20px; opacity: 0.6;">NAVIGATION</div>
        
        <div class="sidebar-nav" style="flex: 1; display: flex; flex-direction: column;">
          ${navItems.map(item => `
            <a href="${item.link}" class="sidebar-item ${activePage === item.id ? 'active' : ''}">
              <i class="${item.icon}"></i>
              <span>${item.name}</span>
            </a>
          `).join('')}
          <div style="flex: 1;"></div>
          <a href="#" class="sidebar-item mobile-only-sidebar-logout" onclick="Auth.logout(); return false;" style="color: var(--primary); margin-top: auto; margin-bottom: 30px;">
            <i class="fas fa-sign-out-alt"></i> Logout
          </a>
        </div>
      </aside>`;
  }

  // ── Top Header ──────────────────────────────────────
  function renderHeader(title, subtitle) {
    const user = Auth.current();
    const unreadCount = Store.Notifications.unreadCount(user.id);
    return `
      <header class="top-header" style="background: #1c1c1c; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <button onclick="Components.toggleSidebar()" style="background: transparent; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; padding: 5px; display: none; align-items: center; justify-content: center;" class="menu-toggle"><i class="fas fa-bars"></i></button>
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="assets/logo.png" alt="UNC Logo" style="width: 38px; height: auto;" />
            <div style="display: flex; flex-direction: column;">
              <span class="serif-title" style="color: #fff; font-size: 1.1rem; letter-spacing: 0.02em; line-height: 1.1; font-weight: 800; text-transform: none;">F.R.E.A.S.-UNC</span>
              <span style="font-size: 0.6rem; color: #8e9aaf; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-top: 2px;">FACILITY RESERVATION SYSTEM</span>
            </div>
          </div>
        </div>
        <div class="header-right" style="display: flex; align-items: center; gap: 25px;">
          <div class="header-notif" style="position: relative;">
            <button id="notif-bell-btn" title="Notifications" onclick="Components.toggleNotifications(event)" style="color: #cbd5e0; font-size: 1.2rem; background: none; border: none; cursor: pointer; position: relative;" class="${unreadCount > 0 ? 'bell-shake' : ''}">
              <i class="far fa-bell"></i>
              ${unreadCount > 0 ? `<span class="notif-dot">${unreadCount}</span>` : ''}
            </button>
            
            <!-- Notifications Dropdown -->
            <div id="notif-dropdown" class="notif-dropdown">
              <div class="notif-dropdown-header">
                <span style="font-weight: 800; font-size: 0.85rem; text-transform: uppercase; color: #1a1a1a; letter-spacing: 0.05em;">Notifications</span>
                ${unreadCount > 0 ? `<a href="#" onclick="Components.markAllNotifsRead(event)" style="font-size: 0.75rem; color: var(--primary); font-weight: 700; text-decoration: none;">Mark all as read</a>` : ''}
              </div>
              <div class="notif-items-list" id="notif-items-list">
                ${_renderNotifItems(user.id)}
              </div>
              <div class="notif-dropdown-footer">
                <button onclick="Components.clearAllNotifs(event)" class="notif-clear-btn">Clear All</button>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="text-align: right; line-height: 1.3;">
              <div style="font-weight: 700; font-size: 0.9rem; color: #fff; letter-spacing: 0.02em;">${user.name}</div>
              <div style="font-size: 0.65rem; font-weight: 800; color: var(--primary); letter-spacing: 0.05em; text-transform: uppercase;">${user.role}</div>
            </div>
            <button onclick="Auth.logout()" style="background: transparent; border: none; color: #cbd5e0; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; text-transform: uppercase; transition: color 0.2s; padding: 0;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#cbd5e0'">
              <i class="fas fa-sign-out-alt"></i> LOGOUT
            </button>
          </div>
        </div>
      </header>`;
  }

  function toggleNotifications(event) {
    if (event) event.stopPropagation();
    const dd = document.getElementById('notif-dropdown');
    if (dd) {
      const isOpen = dd.classList.contains('open');
      if (isOpen) {
        dd.classList.remove('open');
      } else {
        dd.classList.add('open');
      }
    }
  }

  function markAllNotifsRead(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const user = Auth.current();
    if (!user) return;
    Store.Notifications.markAllRead(user.id);
    _refreshHeaderNotif(user);
    toast('All notifications marked as read', 'success');
  }

  function clearAllNotifs(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const user = Auth.current();
    if (!user) return;
    Store.Notifications.clear(user.id);
    _refreshHeaderNotif(user);
    toast('Notifications cleared', 'info');
  }

  function handleNotifClick(id, link, event) {
    if (event) event.stopPropagation();
    Store.Notifications.markRead(id);
    
    // Close dropdown with animation
    const dd = document.getElementById('notif-dropdown');
    if (dd) dd.classList.remove('open');

    const user = Auth.current();
    _refreshHeaderNotif(user);

    if (link) {
      Router.navigate(link);
    }
  }

  function _refreshHeaderNotif(user) {
    const headerNotif = document.querySelector('.header-notif');
    if (headerNotif) {
      const unreadCount = Store.Notifications.unreadCount(user.id);
      
      const btn = headerNotif.querySelector('#notif-bell-btn');
      if (btn) {
        // Update bell shake
        if (unreadCount > 0) {
          btn.classList.add('bell-shake');
        } else {
          btn.classList.remove('bell-shake');
        }
        // Update dot
        let dot = btn.querySelector('.notif-dot');
        if (unreadCount > 0) {
          if (dot) {
            dot.textContent = unreadCount;
          } else {
            dot = document.createElement('span');
            dot.className = 'notif-dot';
            dot.textContent = unreadCount;
            btn.appendChild(dot);
          }
        } else if (dot) {
          dot.remove();
        }
      }
      
      const listDiv = document.getElementById('notif-items-list');
      if (listDiv) {
        listDiv.innerHTML = _renderNotifItems(user.id);
      }
      
      // Update Mark all as read link
      const headerEl = headerNotif.querySelector('.notif-dropdown-header');
      if (headerEl) {
        let markLink = headerEl.querySelector('a');
        if (unreadCount > 0) {
          if (!markLink) {
            markLink = document.createElement('a');
            markLink.href = '#';
            markLink.onclick = (e) => Components.markAllNotifsRead(e);
            markLink.style.cssText = 'font-size: 0.75rem; color: var(--primary); font-weight: 700; text-decoration: none;';
            markLink.textContent = 'Mark all as read';
            headerEl.appendChild(markLink);
          }
        } else if (markLink) {
          markLink.remove();
        }
      }
    }
  }

  function _renderNotifItems(userId) {
    const list = Store.Notifications.byUser(userId);
    if (list.length === 0) {
      return `
        <div style="padding: 40px 20px; text-align: center; color: #a0aec0;">
          <i class="far fa-bell-slash" style="font-size: 1.8rem; margin-bottom: 10px; display: block; opacity: 0.5;"></i>
          <span style="font-size: 0.8rem; font-weight: 500;">No notifications yet</span>
        </div>`;
    }

    return list.map(n => {
      const isUnread = !n.read;
      const bg = isUnread ? '#fffdfa' : '#ffffff';
      const timeAgo = Utils.formatTimeAgo ? Utils.formatTimeAgo(n.createdAt) : new Date(n.createdAt).toLocaleDateString();
      const typeIcon = n.type === 'success' ? 'fa-check-circle' : (n.type === 'error' ? 'fa-times-circle' : 'fa-info-circle');
      const typeColor = n.type === 'success' ? '#059669' : (n.type === 'error' ? '#dc2626' : '#3182ce');

      return `
        <div onclick="Components.handleNotifClick('${n.id}', '${n.link || ''}', event)" style="padding: 14px 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: background 0.2s; display: flex; gap: 12px; align-items: flex-start; background: ${bg}; border-left: 3px solid ${isUnread ? 'var(--primary)' : 'transparent'};" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='${bg}'">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #f8fafc; color: ${typeColor}; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; margin-top: 2px;">
            <i class="fas ${typeIcon}"></i>
          </div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3px; gap: 10px;">
              <span style="font-size: 0.8rem; font-weight: 700; color: #1a1a1a;">${Utils.escape(n.title)}</span>
              <span style="font-size: 0.65rem; color: #a0aec0; font-weight: 500; flex-shrink: 0;">${timeAgo}</span>
            </div>
            <p style="font-size: 0.75rem; color: #718096; line-height: 1.4; margin: 0; font-weight: 500;">${Utils.escape(n.message)}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Add click listener outside to close dropdown
  window.addEventListener('click', (e) => {
    const dd = document.getElementById('notif-dropdown');
    if (dd && dd.classList.contains('open')) {
      const headerNotif = document.querySelector('.header-notif');
      if (headerNotif && !headerNotif.contains(e.target)) {
        dd.classList.remove('open');
      }
    }
  });

  // Ripple effect for all .btn elements
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  }

  // ── App Shell ──────────────────────────────────────
  function renderShell(user, activePage, headerTitle, headerSub, contentHtml) {
    document.getElementById('app').innerHTML = `
      <div class="app-layout">
        <div class="sidebar-overlay" onclick="Components.toggleSidebar()"></div>
        ${renderSidebar(user, activePage)}
        <div class="main-content">
          ${renderHeader(headerTitle, headerSub)}
          <main class="page-content">${contentHtml}</main>
        </div>
      </div>`;
  }

  // ── Action note modal (approve/reject) ──────────────
  function promptNote(title, label, btnClass, btnLabel, onSubmit) {
    const body = `
      <div class="form-group">
        <label>${label}</label>
        <textarea id="action-note" class="form-control" rows="3" placeholder="Optional note or reason..."></textarea>
      </div>`;
    const footer = `
      <button class="btn btn-outline btn-sm" onclick="Components.closeModal()">Cancel</button>
      <button class="btn ${btnClass} btn-sm" id="action-submit-btn">${btnLabel}</button>`;
    openModal(title, body, footer);
    document.getElementById('action-submit-btn').onclick = () => {
      const note = document.getElementById('action-note').value.trim();
      closeModal();
      onSubmit(note);
    };
  }

  // ── Pagination helper ──────────────────────────────
  function paginate(items, page, perPage = 8) {
    const total = items.length;
    const pages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    return { items: items.slice(start, start + perPage), total, pages, page };
  }

  function paginationBar(paged, onPage) {
    if (paged.pages <= 1) return '';
    let btns = '';
    for (let i = 1; i <= paged.pages; i++) {
      btns += `<button class="btn btn-sm ${i === paged.page ? 'btn-primary' : 'btn-outline'}" onclick="(${onPage})(${i})">${i}</button>`;
    }
    return `<div style="display:flex;gap:6px;justify-content:flex-end;margin-top:16px;align-items:center">
      <span style="font-size:.8rem;color:var(--text-3)">Page ${paged.page} of ${paged.pages} (${paged.total} records)</span>
      ${btns}
    </div>`;
  }

  return { toast, openModal, closeModal, confirm, promptNote, renderSidebar, renderHeader, renderShell, toggleSidebar, paginate, paginationBar, toggleNotifications, markAllNotifsRead, clearAllNotifs, handleNotifClick };
})();
