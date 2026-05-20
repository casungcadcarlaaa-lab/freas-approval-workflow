// utils.js — Global utility functions for F.R.E.A.S-UNC
const Utils = (() => {

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  }

  function formatTime(time24) {
    if (!time24) return 'N/A';
    const [h, m] = time24.split(':');
    const hh = parseInt(h);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }

  function escape(str) {
    if (typeof str !== 'string') return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return str.replace(/[&<>"']/g, m => map[m]);
  }

  function statusBadge(status) {
    const s = (status || 'pending').toLowerCase();
    const map = {
      pending:      { label: 'Pending',      class: 'badge-pending' },
      approved:     { label: 'Approved',     class: 'badge-approved' },
      rejected:     { label: 'Rejected',     class: 'badge-rejected' },
      under_review: { label: 'Under Review', class: 'badge-review' }
    };
    const data = map[s] || { label: s, class: '' };
    return `<span class="badge ${data.class}">${data.label}</span>`;
  }

  function formatTimeAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function formatDateTime(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return `${formatDate(dateStr)} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  return { formatDate, formatTime, escape, statusBadge, formatTimeAgo, formatDateTime };
})();
