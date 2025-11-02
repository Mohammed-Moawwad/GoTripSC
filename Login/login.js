document.addEventListener("DOMContentLoaded", function () {
  // Login form validation
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");
      let isValid = true;
      // Phone number input restriction
      const phoneInput = document.getElementById("phone");
      if (phoneInput) {
        phoneInput.addEventListener("input", function (e) {
          // Remove any non-digit characters
          this.value = this.value.replace(/\D/g, "");

          // Limit to 15 digits
          if (this.value.length > 15) {
            this.value = this.value.slice(0, 15);
            const phoneError = document.getElementById("phoneError");
            phoneError.textContent = "Phone number cannot exceed 15 digits";
            phoneError.classList.remove("hidden");
          } else {
            document.getElementById("phoneError").classList.add("hidden");
          }
        });
      }
      // Reset errors
      email.classList.remove("error");
      password.classList.remove("error");
      emailError.classList.add("hidden");
      passwordError.classList.add("hidden");
      // Email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook)\.com$/;
      if (!emailRegex.test(email.value)) {
        email.classList.add("error");
        emailError.classList.remove("hidden");
        isValid = false;
      }
      // Password validation
      if (password.value.trim() === "") {
        password.classList.add("error");
        passwordError.textContent = "Password is required";
        passwordError.classList.remove("hidden");
        isValid = false;
      } else {
        // Check password requirements
        const hasLength =
          password.value.length >= 8 && password.value.length <= 32;
        const hasDigit = /\d/.test(password.value);
        const hasSymbol = /[!@#$%^&*]/.test(password.value);
        const hasUpper = /[A-Z]/.test(password.value);

        if (!hasLength || !hasDigit || !hasSymbol || !hasUpper) {
          password.classList.add("error");
          passwordError.textContent = "Password must meet all requirements";
          passwordError.classList.remove("hidden");
          isValid = false;
        }
      }
      if (isValid) {
        // Check password requirements again in case they bypassed UI validation
        const hasLength =
          password.value.length >= 8 && password.value.length <= 32;
        const hasDigit = /\d/.test(password.value);
        const hasSymbol = /[!@#$%^&*]/.test(password.value);
        const hasUpper = /[A-Z]/.test(password.value);

        if (hasLength && hasDigit && hasSymbol && hasUpper) {
          // Form is valid, proceed with login
          alert("Login successful! Redirecting...");
          // window.location.href = 'dashboard.html';
        } else {
          password.classList.add("error");
          passwordError.textContent = "Password must meet all requirements";
          passwordError.classList.remove("hidden");
        }
      }
    });
  }
  // Password requirement indicators for registration form
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const password = this.value;

      // Get requirement elements
      const lengthReq = document.getElementById("lengthReq");
      const digitReq = document.getElementById("digitReq");
      const symbolReq = document.getElementById("symbolReq");
      const upperReq = document.getElementById("upperReq");
      // Check each requirement
      const hasLength = password.length >= 8 && password.length <= 32;
      const hasDigit = /\d/.test(password);
      const hasSymbol = /[!@#$%^&*]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const isValidPassword = hasLength && hasDigit && hasSymbol && hasUpper;

      // Update requirement indicators
      lengthReq.className = hasLength ? "text-green-600" : "text-gray-500";
      digitReq.className = hasDigit ? "text-green-600" : "text-gray-500";
      symbolReq.className = hasSymbol ? "text-green-600" : "text-gray-500";
      upperReq.className = hasUpper ? "text-green-600" : "text-gray-500";

      // Update submit button state
      const submitBtn = document.querySelector(
        '#registerForm button[type="submit"]'
      );
      if (submitBtn) {
        submitBtn.disabled = !isValidPassword;
        submitBtn.style.opacity = isValidPassword ? "1" : "0.7";
        submitBtn.style.cursor = isValidPassword ? "pointer" : "not-allowed";
      }
    });
  }

  // Registration form validation
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const firstName = document.getElementById("firstName");
      const lastName = document.getElementById("lastName");
      const birthDate = document.getElementById("birthDate");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const phone = document.getElementById("phone");

      const firstNameError = document.getElementById("firstNameError");
      const lastNameError = document.getElementById("lastNameError");
      const birthDateError = document.getElementById("birthDateError");
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");
      const phoneError = document.getElementById("phoneError");

      let isValid = true;

      // Reset all errors first
      [
        firstNameError,
        lastNameError,
        birthDateError,
        emailError,
        passwordError,
        phoneError,
      ].forEach((error) => {
        if (error) error.classList.add("hidden");
      });
      [firstName, lastName, birthDate, email, password, phone].forEach(
        (field) => {
          if (field) field.classList.remove("error");
        }
      );

      // Phone number validation
      if (phone) {
        const phoneNumber = phone.value.replace(/\D/g, ""); // Remove all non-digit characters
        phone.value = phoneNumber; // Update the field with cleaned value

        if (phoneNumber.length === 0) {
          phone.classList.add("error");
          phoneError.classList.remove("hidden");
          phoneError.textContent = "Phone number is required";
          isValid = false;
        } else if (phoneNumber.length < 10) {
          phone.classList.add("error");
          phoneError.classList.remove("hidden");
          phoneError.textContent = "Phone number must be at least 10 digits";
          isValid = false;
        } else if (phoneNumber.length > 15) {
          phone.classList.add("error");
          phoneError.classList.remove("hidden");
          phoneError.textContent = "Phone number cannot exceed 15 digits";
          isValid = false;
        }
      }

      // Password validation
      const hasLength =
        password.value.length >= 8 && password.value.length <= 32;
      const hasDigit = /\d/.test(password.value);
      const hasSymbol = /[!@#$%^&*]/.test(password.value);
      const hasUpper = /[A-Z]/.test(password.value);

      if (!hasLength || !hasDigit || !hasSymbol || !hasUpper) {
        password.classList.add("error");
        passwordError.textContent = "Password must meet all requirements";
        passwordError.classList.remove("hidden");
        isValid = false;
      }
      // If all validations pass, redirect to home page and store user info
      if (isValid) {
        // Store user info in localStorage (for demo/session)
        localStorage.setItem("gotripUser", JSON.stringify({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value
        }));
        window.location.href = "../HomePage/HomePage.html";
      }
    });
  }
});
