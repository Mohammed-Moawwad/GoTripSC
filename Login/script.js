document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      // Admin credentials check
      if (
        email.value === "admin@gotrip.com" &&
        password.value === "Admin@1234"
      ) {
        window.location.href = "../Admin/admin-dashboard.html";
        return;
      }
      // User credentials validation (example, always pass for demo)
      // You can add your own validation here
      window.location.href = "../HomePage/HomePage.html";
    });
  }
});
