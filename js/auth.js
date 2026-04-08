const firebaseConfig = {
  apiKey: "AIzaSyB4Qdlyz_KMgg_Ien24DmfFJCn3FNmMj0U",
  authDomain: "gitam-food-app.firebaseapp.com",
  projectId: "gitam-food-app",
  storageBucket: "gitam-food-app.appspot.com",
  messagingSenderId: "566061543574",
  appId: "1:566061543574:web:9f660d87121c5b1776d2b7",
  measurementId: "G-Z0EE3LBV4N"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
  size: 'invisible'
});
window.recaptchaVerifier.render();

function sendOTP() {
  const number = document.getElementById("phone").value;
  if(number.length !== 10) {
    alert("Invalid number! Please enter 10 digits.");
    return;
  }
  const phone = "+91" + number;

  const btn = document.querySelector("#otp-step-1 .btn-primary");
  if(btn) {
    btn.disabled = true;
    btn.innerText = "Sending...";
  }

  auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      
      // Show Success Toast/Alert
      alert("OTP Sent ✅");
      
      // Update UI state
      document.getElementById('otp-step-1').style.display = 'none';
      document.getElementById('otp-step-2').style.display = 'block';
    })
    .catch(function (error) {
      console.error(error);
      alert("Failed to send OTP: " + error.message);
      
      if(btn) {
        btn.disabled = false;
        btn.innerText = "Send OTP";
      }

      // 🔥 RESET RECAPTCHA (VERY IMPORTANT)
      window.recaptchaVerifier.render().then(function (widgetId) {
        grecaptcha.reset(widgetId);
      });
    });
}

function verifyOTP() {
  const code = document.getElementById("otp").value;
  if(!code) {
    alert("Please enter the OTP code");
    return;
  }

  const btn = document.getElementById("verifyBtn");
  if(btn) {
    btn.disabled = true;
    btn.innerText = "Verifying...";
  }

  confirmationResult.confirm(code)
    .then((result) => {
      alert("Login Success 🎉");
      
      // INTEGRATION: Save logged in user for main App!
      const user = result.user;
      const currentUser = { name: "User", phone: user.phoneNumber };
      localStorage.setItem('fhp_user', JSON.stringify(currentUser));
      
      window.location.href = "index.html"; 
    })
    .catch(() => {
      alert("Wrong OTP ❌");
      if(btn) {
        btn.disabled = false;
        btn.innerText = "Verify & Login";
      }
    });
}