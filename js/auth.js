// js/auth.js
const firebaseConfig = {
  apiKey: "AIzaSyB4Qdlyz_KMgg_Ien24DmfFJCn3FNmMj0U",
  authDomain: "gitam-food-app.firebaseapp.com",
  projectId: "gitam-food-app",
  storageBucket: "gitam-food-app.appspot.com",
  messagingSenderId: "566061543574",
  appId: "1:566061543574:web:9f660d87121c5b1776d2b7",
  measurementId: "G-Z0EE3LBV4N"
};

// Ensure Firebase is initialized ONLY ONCE
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
  size: 'invisible'
});

window.sendOTP = function() {
  const number = document.getElementById("login-phone").value;
  if(number.trim().length !== 10) {
    alert("Invalid number! Please enter 10 digits.");
    return;
  }
  
  const phone = "+91" + number;
  
  // Disable button while sending
  const btn = document.querySelector("#otp-step-1 .btn-primary") || document.querySelector("button[onclick='sendOTP()']") || document.querySelector("button[onclick='window.sendOTP()']");
  if(btn) {
    btn.disabled = true;
    btn.innerText = "Sending...";
  }

  auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      
      // Show success message after OTP sent
      alert("OTP Sent ✅");
      
      document.getElementById('otp-step-1').style.display = 'none';
      document.getElementById('otp-step-2').style.display = 'block';
    })
    .catch((error) => {
      console.error(error);
      
      // Show error message properly
      alert("Failed to send OTP: " + error.message);
      
      if(btn) {
        btn.disabled = false;
        btn.innerText = "Send OTP";
      }

      // Reset recaptcha if error occurs
      window.recaptchaVerifier.render().then(function (widgetId) {
        grecaptcha.reset(widgetId);
      });
    });
}

window.verifyOTP = function() {
  const code = document.getElementById("login-otp").value;
  if(!code) {
    alert("Please enter the OTP code");
    return;
  }

  const btn = document.getElementById("verifyBtn") || document.querySelector("button[onclick='verifyOTP()']") || document.querySelector("button[onclick='window.verifyOTP()']");
  if(btn) {
    btn.disabled = true;
    btn.innerText = "Verifying...";
  }

  // Use confirmationResult.confirm(code)
  window.confirmationResult.confirm(code)
    .then((result) => {
      alert("Login Success 🎉");
      
      const user = result.user;
      const currentUser = { name: "Firebase User", phone: user.phoneNumber };
      localStorage.setItem('fhp_user', JSON.stringify(currentUser));
      
      window.location.href = "index.html"; 
    })
    .catch((error) => {
      console.error(error);
      alert("Wrong OTP ❌");
      if(btn) {
        btn.disabled = false;
        btn.innerText = "Verify & Login";
      }
    });
}