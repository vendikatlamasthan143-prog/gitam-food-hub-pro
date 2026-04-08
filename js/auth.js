// ============================================================
// GITAM Food Hub Pro — Firebase Auth (OTP + Google)
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyB4Qdlyz_KMgg_Ien24DmfFJCn3FNmMj0U",
  authDomain: "gitam-food-app.firebaseapp.com",
  projectId: "gitam-food-app",
  storageBucket: "gitam-food-app.appspot.com",
  messagingSenderId: "566061543574",
  appId: "1:566061543574:web:9f660d87121c5b1776d2b7",
  measurementId: "G-Z0EE3LBV4N"
};

// Init only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// ---- Toast ----
function showAuthToast(msg) {
  const t = document.getElementById('auth-toast');
  if(!t) return;
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ---- reCAPTCHA ----
function setupRecaptcha() {
  if(window.recaptchaVerifier) return;
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
    size: 'invisible'
  });
  window.recaptchaVerifier.render().catch(console.error);
}

// Call on load
document.addEventListener('DOMContentLoaded', function() {
  setupRecaptcha();
  // If already logged in, redirect to home
  const saved = localStorage.getItem('fhp_user');
  if(saved) {
    window.location.href = 'index.html';
  }
});

// ---- OTP: Send ----
window.sendOTP = function() {
  const rawNum = document.getElementById('login-phone').value.trim();
  if(rawNum.length !== 10 || isNaN(rawNum)) {
    showAuthToast('⚠️ Enter a valid 10-digit number');
    return;
  }

  const btn = document.getElementById('send-otp-btn');
  btn.disabled = true;
  btn.innerText = '⏳ Sending...';

  const phone = '+91' + rawNum;

  auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      window._otpPhone = rawNum;
      showAuthToast('OTP sent to +91' + rawNum + ' ✅');

      // Switch step
      document.getElementById('step-phone').classList.remove('active');
      document.getElementById('step-otp').classList.add('active');
      document.getElementById('otp-sent-to').innerText = `OTP sent to +91 ${rawNum}. Check your SMS.`;
      btn.disabled = false;
      btn.innerText = '📲 Send OTP';
    })
    .catch((error) => {
      console.error(error);
      showAuthToast('❌ ' + error.message);
      btn.disabled = false;
      btn.innerText = '📲 Send OTP';

      // Reset reCaptcha
      window.recaptchaVerifier.render().then(function(widgetId) {
        grecaptcha.reset(widgetId);
      });
    });
};

// ---- OTP: Resend ----
window.resendOTP = function() {
  document.getElementById('step-otp').classList.remove('active');
  document.getElementById('step-phone').classList.add('active');
  window.recaptchaVerifier = null;
  setupRecaptcha();
};

// ---- OTP: Verify ----
window.verifyOTP = function() {
  const code = document.getElementById('login-otp').value.trim();
  if(code.length < 4) {
    showAuthToast('⚠️ Enter the OTP code');
    return;
  }

  const btn = document.getElementById('verify-otp-btn');
  btn.disabled = true;
  btn.innerText = '⏳ Verifying...';

  window.confirmationResult.confirm(code)
    .then((result) => {
      btn.disabled = false;
      btn.innerText = '✅ Verify & Login';
      const firebaseUser = result.user;
      
      // Check if new user
      const existing = JSON.parse(localStorage.getItem('fhp_user'));
      if(existing && existing.phone === window._otpPhone) {
        // Returning user — go home
        showAuthToast('Welcome back ' + existing.name + '! 🎉');
        setTimeout(() => window.location.href = 'index.html', 1000);
      } else {
        // New user — ask for name
        window._pendingUser = { phone: '+91' + window._otpPhone, uid: firebaseUser.uid };
        showUsernameModal();
      }
    })
    .catch((err) => {
      console.error(err);
      showAuthToast('❌ Wrong OTP. Try again.');
      btn.disabled = false;
      btn.innerText = '✅ Verify & Login';
    });
};

// ---- Google Login ----
window.googleLogin = function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      const existing = JSON.parse(localStorage.getItem('fhp_user'));
      
      if(existing && existing.email === user.email) {
        // Returning
        showAuthToast('Welcome back, ' + existing.name + '! 🎉');
        setTimeout(() => window.location.href = 'index.html', 1000);
      } else {
        // Save immediately — Google provides name
        const fhpUser = {
          name: user.displayName || 'User',
          phone: user.phoneNumber || '',
          email: user.email,
          avatar: user.photoURL || '',
          uid: user.uid
        };
        localStorage.setItem('fhp_user', JSON.stringify(fhpUser));
        showAuthToast('Welcome, ' + fhpUser.name + '! 🎉');
        setTimeout(() => window.location.href = 'index.html', 1000);
      }
    })
    .catch((err) => {
      console.error(err);
      showAuthToast('❌ Google login failed: ' + err.message);
    });
};

// ---- Username Modal ----
function showUsernameModal() {
  const modal = document.getElementById('username-modal');
  if(modal) modal.classList.add('show');
}

window.saveUsername = function() {
  const nameInput = document.getElementById('username-input');
  const name = nameInput ? nameInput.value.trim() : '';
  if(!name || name.length < 2) {
    showAuthToast('⚠️ Please enter your name');
    return;
  }

  const fhpUser = {
    name: name,
    phone: window._pendingUser ? window._pendingUser.phone : '',
    email: '',
    uid: window._pendingUser ? window._pendingUser.uid : ''
  };
  localStorage.setItem('fhp_user', JSON.stringify(fhpUser));
  showAuthToast('Welcome, ' + name + '! 🎉');
  setTimeout(() => window.location.href = 'index.html', 1000);
};