// auth.js — Authentication state management
const Auth = (() => {
  const KEY = 'freas_user';

  function login(email, password) {
    const user = Config.ACCOUNTS.find(a => a.email === email && a.password === password);
    if (!user) return { ok: false, error: 'Invalid email or password.' };
    const session = { ...user };
    delete session.password;
    localStorage.setItem(KEY, JSON.stringify(session));
    return { ok: true, user: session };
  }

  function logout() {
    localStorage.removeItem(KEY);
    Router.navigate('login');
  }

  function current() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  }

  function require(role) {
    const u = current();
    if (!u) { Router.navigate('login'); return null; }
    if (role && u.role !== role) {
      Router.navigate(u.role === 'admin' ? 'admin/dashboard' : 'student/dashboard');
      return null;
    }
    return u;
  }

  return { login, logout, current, require };
})();
