// Shared Logout Modal Functions for Admin Pages
// This file provides common modal functionality across all admin pages

function showLogoutModal(redirectPath) {
  const modal = document.getElementById("logoutModal");
  const cancelBtn = document.getElementById("cancelLogout");
  const confirmBtn = document.getElementById("confirmLogout");

  if (!modal || !cancelBtn || !confirmBtn) {
    // Fallback to browser confirm if modal not found
    if (confirm("Are you sure you want to quit the admin dashboard?")) {
      window.location.href = redirectPath;
    }
    return;
  }

  modal.classList.add("show");

  // Cancel button
  const handleCancel = () => {
    modal.classList.remove("show");
    cleanup();
  };

  // Confirm button
  const handleConfirm = () => {
    modal.classList.remove("show");
    setTimeout(() => {
      window.location.href = redirectPath;
    }, 300);
    cleanup();
  };

  // Click outside modal to close
  const handleOverlayClick = (e) => {
    if (e.target === modal) {
      handleCancel();
    }
  };

  // Cleanup event listeners
  const cleanup = () => {
    cancelBtn.removeEventListener("click", handleCancel);
    confirmBtn.removeEventListener("click", handleConfirm);
    modal.removeEventListener("click", handleOverlayClick);
  };

  cancelBtn.addEventListener("click", handleCancel);
  confirmBtn.addEventListener("click", handleConfirm);
  modal.addEventListener("click", handleOverlayClick);
}
