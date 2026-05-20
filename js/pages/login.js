// pages/login.js — Login page
const LoginPage = (() => {

  function render() {
    const demoStudents = [
      { name: 'College', email: 'student@unc.edu.ph', pw: 'student123' },
      { name: 'JHS', email: 'student.jhs@unc.edu.ph', pw: 'student123' },
      { name: 'SHS', email: 'student.shs@unc.edu.ph', pw: 'student123' }
    ];
    const demoAdmins = [
      { name: 'VP for Admin', email: 'admin.vp@unc.edu.ph', pw: 'admin123' },
      { name: 'GBMO', email: 'admin.gbmo@unc.edu.ph', pw: 'admin123' }
    ];

    const demoStudentHTML = demoStudents.map(d => `
      <div class="demo-account" onclick="LoginPage.fillDemo('${d.email}','${d.pw}')">
        <div class="demo-name">${d.name} STUDENT</div>
        <div class="demo-creds">
          <div class="demo-cred-row"><i class="far fa-envelope"></i> <span>${d.email}</span></div>
          <div class="demo-cred-row"><i class="fas fa-key"></i> <strong>${d.pw}</strong></div>
        </div>
      </div>`).join('');

    const demoAdminHTML = demoAdmins.map(d => `
      <div class="demo-account" onclick="LoginPage.fillDemo('${d.email}','${d.pw}')">
        <div class="demo-name">${d.name} ADMIN</div>
        <div class="demo-creds">
          <div class="demo-cred-row"><i class="far fa-envelope"></i> <span>${d.email}</span></div>
          <div class="demo-cred-row"><i class="fas fa-key"></i> <strong>${d.pw}</strong></div>
        </div>
      </div>`).join('');

    document.getElementById('app').innerHTML = `
      <div class="login-page">
        <!-- LEFT PANEL -->
        <div class="login-left">
          <div class="login-card">
            <div class="login-seal">
              <img src="assets/logo.png" alt="UNC Logo" />
            </div>
            <h1 class="serif-title">WELCOME BACK</h1>
            <div class="login-sub">F.R.E.A.S.-UNC</div>

            <form class="login-form" onsubmit="LoginPage.submit(event)">
              <div class="form-group">
                <label>LOGIN AS</label>
                <select id="login-role" class="form-control">
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label>USERNAME</label>
                <input id="login-email" class="form-control bg-light" type="email" placeholder="your@unc.edu.ph" required />
              </div>
              <div class="form-group">
                <div class="pw-row">
                  <label>PASSWORD</label>
                  <a href="#" class="forgot-link" onclick="LoginPage.forgotPw(event)">Forgot password?</a>
                </div>
                <div style="position:relative">
                  <input id="login-pw" class="form-control bg-light" type="password" placeholder="••••••••" required />
                  <button type="button" onclick="LoginPage.togglePw()" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;color:#a0aec0;cursor:pointer" id="pw-eye"><i class="fas fa-eye"></i></button>
                </div>
              </div>
              <div id="login-error" style="color:#C41E3A;font-size:.75rem;margin-bottom:10px;display:none;text-align:center;font-weight:600"></div>
              <button type="submit" class="login-btn">
                <span id="login-btn-text">Sign In to Portal</span>
              </button>
            </form>

            <div class="signup-row">
              New to F.R.E.A.S.? <a href="#" onclick="LoginPage.signupMsg(event)" class="text-red">Sign up here</a>
            </div>
          </div>

          <button class="view-demo-btn" onclick="LoginPage.toggleDemoModal(true)">
            <i class="fas fa-key"></i> View Demo Credentials
          </button>
        </div>

        <!-- RIGHT PANEL -->
        <div class="login-right">
          <img src="assets/bg.jpg" alt="University of Nueva Caceres" />
          <div class="login-right-overlay">
            <div class="login-right-card">
              <h2 class="serif-title">University of Nueva Caceres</h2>
              <p>Faculty Reservation and Event Approval System. Streamline your bookings, track approvals, and manage campus resources from one centralized platform.</p>
            </div>
          </div>
        </div>

        <!-- DEMO MODAL -->
        <div id="demo-modal" class="demo-modal-overlay hidden">
          <div class="demo-modal-content">
            <div class="demo-modal-header">
              <h2 class="serif-title">DEMO ACCOUNTS FOR PROTOTYPE</h2>
              <button onclick="LoginPage.toggleDemoModal(false)" class="close-btn">&times;</button>
            </div>
            <div class="demo-modal-body">
              <div class="demo-group-label">STUDENT</div>
              ${demoStudentHTML}
              <div class="demo-group-label" style="margin-top:24px">ADMIN</div>
              ${demoAdminHTML}
            </div>
          </div>
        </div>
      </div>`;
  }

  function submit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pw = document.getElementById('login-pw').value;
    const role = document.getElementById('login-role').value;
    const errEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn-text');

    errEl.style.display = 'none';
    btn.textContent = 'Signing in…';

    setTimeout(() => {
      const result = Auth.login(email, pw);
      if (!result.ok) {
        errEl.textContent = result.error;
        errEl.style.display = 'block';
        btn.textContent = 'Sign In to Portal';
        return;
      }
      if (result.user.role !== role) {
        errEl.textContent = `This account is a ${result.user.role} account, not ${role}.`;
        errEl.style.display = 'block';
        btn.textContent = 'Sign In to Portal';
        Auth.logout();
        return;
      }
      Components.toast(`Welcome back, ${result.user.name}!`, 'success');
      Router.navigate(result.user.role === 'admin' ? 'admin/dashboard' : 'student/dashboard');
    }, 600);
  }

  function fillDemo(email, pw) {
    document.getElementById('login-email').value = email;
    document.getElementById('login-pw').value = pw;
    const role = email.includes('admin') ? 'admin' : 'student';
    document.getElementById('login-role').value = role;
  }

  function togglePw() {
    const inp = document.getElementById('login-pw');
    const ico = document.querySelector('#pw-eye i');
    if (inp.type === 'password') { inp.type = 'text'; ico.className = 'fas fa-eye-slash'; }
    else { inp.type = 'password'; ico.className = 'fas fa-eye'; }
  }

  function forgotPw(e) { e.preventDefault(); Components.toast('Password reset is not available in this prototype.', 'info'); }
  function signupMsg(e) { e.preventDefault(); Components.toast('Self-registration is not available. Contact your administrator.', 'info'); }

  function toggleDemoModal(show) {
    const modal = document.getElementById('demo-modal');
    if (show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
  }

  return { render, submit, fillDemo, togglePw, forgotPw, signupMsg, toggleDemoModal };
})();
