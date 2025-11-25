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
          // Form is valid, proceed with login - Call the authentication API
          handleLogin(email.value, password.value);
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

      // If form is valid, submit to backend
      if (isValid) {
        handleSignup({
          first_name: firstName.value,
          last_name: lastName.value,
          email: email.value,
          phone: phone.value,
          birth_date: birthDate.value,
          password: password.value,
        });
      }
    });
  }
});

// ====================================
// API Integration Functions
// ====================================
const API_BASE_URL = "http://localhost:3000/api";

/**
 * Handle user login (signin.html)
 */
async function handleLogin(email, password) {
  try {
    // Show loading state
    const submitBtn = document.querySelector(
      '#loginForm button[type="submit"]'
    );
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success) {
      // Save token and user data to localStorage
      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      localStorage.setItem("isLoggedIn", "true");

      // Check for return URL in query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('next');

      // Check if user is admin and redirect accordingly
      if (result.data.user.role === "admin") {
        showSuccessMessage(
          "Welcome back, Admin!",
          "Redirecting to admin dashboard..."
        );
        setTimeout(() => {
          window.location.href = "/Admin/admin-dashboard.html";
        }, 1500);
      } else if (returnUrl) {
        // Redirect to the return URL (e.g., booking page)
        showSuccessMessage(
          `Welcome back, ${result.data.user.first_name}!`,
          "Redirecting..."
        );
        setTimeout(() => {
          window.location.href = decodeURIComponent(returnUrl);
        }, 1500);
      } else {
        showSuccessMessage(
          `Welcome back, ${result.data.user.first_name}!`,
          "Redirecting to homepage..."
        );
        setTimeout(() => {
          window.location.href = "/HomePage/HomePage.html";
        }, 1500);
      }
    } else {
      // Show error message
      showErrorMessage("Login Failed", result.message);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  } catch (error) {
    console.error("Login error:", error);
    showErrorMessage(
      "Connection Error",
      "Please make sure the server is running."
    );
    const submitBtn = document.querySelector(
      '#loginForm button[type="submit"]'
    );
    submitBtn.disabled = false;
    submitBtn.textContent = "Login";
  }
}

/**
 * Handle user signup (login.html - which is actually the registration page)
 */
async function handleSignup(userData) {
  try {
    // Show loading state
    const submitBtn = document.querySelector(
      '#registerForm button[type="submit"]'
    );
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating Account...";

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (result.success) {
      // Save token and user data to localStorage
      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      // Show beautiful success message
      showSuccessMessage(
        `Welcome to GoTrip, ${result.data.user.first_name}!`,
        "Your account has been created successfully. Redirecting to homepage..."
      );

      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        window.location.href = "/HomePage/HomePage.html";
      }, 2000);
    } else {
      // Show error message with more details
      const errorMsg = result.message || "Unknown error occurred";
      const detailedError = result.errorCode ? `\nError Code: ${result.errorCode}` : '';
      const sqlError = result.sqlMessage ? `\nDetails: ${result.sqlMessage}` : '';
      showErrorMessage("Registration Failed", errorMsg + detailedError + sqlError);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      console.error("Full error response:", result);
    }
  } catch (error) {
    console.error("Signup error:", error);
    showErrorMessage(
      "Connection Error",
      "Please make sure the server is running. " + (error.message || "")
    );
    const submitBtn = document.querySelector(
      '#registerForm button[type="submit"]'
    );
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
  }
}

// ====================================
// Beautiful Notification Functions
// ====================================

/**
 * Show a beautiful success message
 */
function showSuccessMessage(title, message) {
  // Remove any existing notifications
  removeNotifications();

  // Create notification container
  const notification = document.createElement("div");
  notification.className = "custom-notification success-notification";
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <div class="notification-text">
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
    </div>
    <div class="notification-progress"></div>
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotifications();
  }, 5000);
}

/**
 * Show a beautiful error message
 */
function showErrorMessage(title, message) {
  // Remove any existing notifications
  removeNotifications();

  // Create notification container
  const notification = document.createElement("div");
  notification.className = "custom-notification error-notification";
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <div class="notification-text">
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
      <button class="notification-close" onclick="removeNotifications()">×</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotifications();
  }, 5000);
}

/**
 * Remove all notifications
 */
function removeNotifications() {
  const notifications = document.querySelectorAll(".custom-notification");
  notifications.forEach((notification) => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
}
