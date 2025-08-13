import { collectAndFilter } from "./handleFilter";
import { login, logout, selectRole, signup } from "./auth";
import { handleFavorite } from "./favorite";
import { OnboardingForm } from "./onboardingForm";
import { JobApplicationModal } from "./resumeClass";

const filterForm = document.getElementById("filterSidebar");
const applyButton = document.querySelector(".filter-sidebar__submit");
const refreshButton = document.querySelector(".filter-sidebar__refresh");
const roleBtn = document.querySelector(".role-submit ");
const signupForm = document.querySelector(".signup-form");
const loginForm = document.querySelector(".login-form");
const logoutBtn = document.querySelector(".header__logout");
const onboardingForm = document.querySelector(".onboarding-form");
const jobApplyBtn = document.querySelector(".job-apply-btn");

if (applyButton) {
  applyButton.addEventListener("click", () => {
    const endpoint =
      window.location.pathname === "/favorites"
        ? "/api/v1/jobs/my-favorites"
        : "/api/v1/jobs";
    collectAndFilter(endpoint, filterForm);
  });
}

if (refreshButton) {
  refreshButton.addEventListener("click", () => {
    if (filterForm) {
      filterForm.reset();
      console.log("Filters reset");
      const endpoint =
        window.location.pathname === "/favorites"
          ? "/api/v1/jobs/my-favorites"
          : "/api/v1/jobs";
      collectAndFilter(endpoint, filterForm);
    }
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = localStorage.getItem("role");
    const submitButton = signupForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    const success = await signup(name, email, password, role);
    if (!success) {
      submitButton.disabled = false;
      submitButton.textContent = "Signup";
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email, password);
    login(email, password);
  });
}

if (roleBtn) {
  roleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedRole = document.querySelector(
      "input[name='user-role']:checked"
    ).value;
    selectRole(selectedRole);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (onboardingForm) {
  new OnboardingForm(onboardingForm);
}

document.addEventListener("click", async (e) => {
  const favoriteBtn = e.target.closest(
    ".job-card__favorite, .job-detail__favorite"
  );
  if (!favoriteBtn) return;

  handleFavorite(favoriteBtn);
});

if (jobApplyBtn) {
  new JobApplicationModal();
}
