import axios from "axios";
import { showAlert } from "./alert.js";

export const handleFavorite = async (favoriteBtn) => {
  const jobContainer = favoriteBtn.closest(".job-card, .job-detail");
  const icon = favoriteBtn.querySelector(".fav-image, .detail-fav-image");
  const jobId = jobContainer.dataset.jobid;
  const isFavorite = jobContainer.dataset.favorite === "true";

  // Optimistic UI update
  icon.src = isFavorite
    ? "/img/general/favorite-default.svg"
    : "/img/general/favorite-active.svg";
  jobContainer.dataset.favorite = (!isFavorite).toString();

  // Call API
  const success = await toggleFavourite(jobId);

  if (!success) {
    icon.src = isFavorite
      ? "/img/general/favorite-active.svg"
      : "/img/general/favorite-default.svg";
    jobContainer.dataset.favorite = isFavorite.toString();
  } else if (window.location.pathname === "/favorites" && isFavorite) {
    // Remove job card on /favorites if unfavorited
    updateJobContainer(jobContainer);
  }
};

const updateJobContainer = (jobContainer) => {
  jobContainer.remove();
  const jobList = document.querySelector(".jobs-grid");
  const jobHeader = document.querySelector(".jobs-count");
  const remainingJobs = jobList.querySelectorAll(".job-card").length;
  jobHeader.textContent = `Showing ${remainingJobs} Jobs`;
  if (remainingJobs === 0) {
    jobList.innerHTML = "<p>No jobs found.</p>";
  }
};

const toggleFavourite = async (jobId) => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `http://localhost:4000/api/v1/jobs/favourite/${jobId}`,
      withCredentials: true,
    });

    if (response.data.status === "success") {
      showAlert("success", response.data.message);
      return true;
    }
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 401 || err.response.status === 500) {
      showAlert("error", "Please log in to favorite or unfavorite a job.");
    } else {
      showAlert("error", "Error updating favorite. Please try again.");
    }
    return false;
  }
  return false;
};
