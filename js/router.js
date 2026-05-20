// router.js — Hash-based client-side router
const Router = (() => {
  const routes = {};

  function register(path, handler) { routes[path] = handler; }

  function navigate(path) {
    window.location.hash = '#/' + path;
  }

  function _resolve() {
    const hash = window.location.hash.replace('#/', '').replace('#', '') || 'login';
    const handler = routes[hash];
    if (handler) {
      try {
        handler();
      } catch (err) {
        console.error('Render Error:', err);
        navigate('login');
      }
    } else {
      const user = Auth.current();
      if (!user) navigate('login');
      else navigate(user.role === 'admin' ? 'admin/dashboard' : 'student/dashboard');
    }
  }

  function init() {
    window.addEventListener('hashchange', _resolve);
    _resolve();
  }

  return { register, navigate, init };
})();
