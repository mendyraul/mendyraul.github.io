const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitleEl = document.getElementById("modalTitle");
const modalMessageEl = document.getElementById("modalMessage");
const modalCloseBtn = document.getElementById("modalClose");

function showModal({ title, message }) {
  if (!modalBackdrop || !modalTitleEl || !modalMessageEl) return;
  modalTitleEl.textContent = title || "Notice";
  modalMessageEl.textContent = message || "";
  modalBackdrop.classList.add("is-visible");
}

function hideModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove("is-visible");
}

if (modalBackdrop && modalCloseBtn) {
  modalCloseBtn.addEventListener("click", hideModal);
  modalBackdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) {
      hideModal();
    }
  });
}
