// app.js — Main Application Bootstrap
(function () {
  // 1. Register Routes
  Router.register('login', LoginPage.render);

  // Student Routes
  Router.register('student/dashboard', StudentDashboard.render);
  Router.register('student/reservations', StudentReservations.render);
  Router.register('student/events', StudentEvents.render);
  Router.register('student/new-request', StudentNewRequest.render);
  Router.register('student/calendar', StudentCalendar.render);
  Router.register('student/profile', ProfilePage.render);

  // Admin Routes
  Router.register('admin/dashboard', AdminDashboard.render);
  Router.register('admin/reservations', AdminReservations.render);
  Router.register('admin/approvals', AdminApprovals.render);
  Router.register('admin/facilities', AdminFacilities.render);
  Router.register('admin/block-dates', AdminBlockDates.render);
  Router.register('admin/reports', () => Components.toast('Reports dashboard coming soon!', 'info'));
  Router.register('admin/users', () => Components.toast('User management coming soon!', 'info'));
  Router.register('admin/profile', ProfilePage.render);

  // 2. Initialize App
  function init() {
    console.log('F.R.E.A.S-UNC Initializing...');

    const user = Auth.current();
    const hash = window.location.hash;

    // Standardize initial route
    if (!hash || hash === '#/' || hash === '#') {
      if (user) {
        Router.navigate(user.role === 'admin' ? 'admin/dashboard' : 'student/dashboard');
      } else {
        Router.navigate('login');
      }
    } else if (!user && hash !== '#/login') {
      Router.navigate('login');
    }

    // Initialize Router
    Router.init();

    // Hide splash screen after initialization
    setTimeout(() => {
      const splash = document.querySelector('.splash-screen');
      if (splash) {
        splash.style.opacity = '0';
        splash.style.transition = 'opacity 0.4s ease';
        setTimeout(() => splash.remove(), 400);
      }
    }, 600);
  }

  // Handle global errors gracefully
  window.onerror = function (msg, url, line) {
    console.warn('System Notice:', msg, 'at', url, 'line', line);
  };

  // Start the engine
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
