import axios from "axios";
import { showAlert } from "./alert";

export const collectAndFilter = (endpoint = "/api/v1/jobs", filterForm) => {
  const formData = new FormData(filterForm);
  const queryParams = new URLSearchParams();

  // Handle keyword
  const keyword = formData.get("keyword");
  if (keyword) {
    queryParams.append("keyword", keyword);
  }

  // Handle experience (multiple selections)
  const experience = formData.getAll("experience");
  if (experience.length > 0) {
    queryParams.append("experience[in]", experience.join(","));
  }

  // Handle locationType (multiple selections)
  const locationType = formData.getAll("locationType");
  if (locationType.length > 0) {
    queryParams.append("locationType[in]", locationType.join(","));
  }

  // Handle salary ranges
  const salary = formData.get("salary");
  if (salary) {
    if (salary === "under-1000") {
      queryParams.append("minSalary[lt]", "1000");
    } else if (salary === "1000-10000") {
      queryParams.append("minSalary[gte]", "1000");
      queryParams.append("minSalary[lte]", "10000");
    } else if (salary === "10000-50000") {
      queryParams.append("minSalary[gte]", "10000");
      queryParams.append("minSalary[lte]", "50000");
    } else if (salary === "above-50000") {
      queryParams.append("minSalary[gt]", "50000");
    }
  }
  handleFilter(queryParams, endpoint);
};

export const displayJobs = async (jobs) => {
  const jobList = document.querySelector(".jobs-grid");
  const jobHeader = document.querySelector(".jobs-header");
  if (!jobList || !jobHeader) {
    console.error("Job container or header not found");
    return;
  }

  jobList.innerHTML = "";
  jobHeader.innerHTML = "";

  if (jobs?.length === 0) {
    jobList.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  let favoriteJobs = [];
  try {
    const response = await axios({
      method: "GET",
      url: "http://localhost:4000/api/v1/jobs/my-favorites",
      withCredentials: true,
    });
    if (response.data.status === "success") {
      favoriteJobs = response.data.data.jobs.map((job) => job._id.toString());
    }
  } catch (error) {
    console.error(
      "User not authenticated or error fetching favorite jobs:",
      error.response?.data?.message
    );
  }

  const jobText = document.createElement("div");
  jobText.className = "jobs-count";
  jobText.textContent = `Showing ${jobs.length} Jobs`;
  jobHeader.append(jobText);

  jobs.forEach((job) => {
    const isFavorite = favoriteJobs.includes(job._id.toString());
    const favImage = isFavorite
      ? "/img/general/favorite-active.svg"
      : "/img/general/favorite-default.svg";
    const jobCard = document.createElement("div");
    jobCard.className = "job-card animate-fade-in";
    jobCard.setAttribute("data-jobid", job._id);
    jobCard.setAttribute("data-favorite", isFavorite);
    jobCard.innerHTML = `
      <div class="job-card__header">
        <div class="job-card__left">
          <div class="job-card__logo">
            ${
              job.recruiterId?.company?.logo?.url
                ? `<img class="job-card__logo" src="${job.recruiterId.company.logo.url}" alt="${job.recruiterId.company.name} logo">`
                : `<img class="job-card__logo default-image" src="/img/company/defaultcompany.svg" alt="Company logo">`
            }
          </div>
          <div class="job-card__info">
            <a href='/job/${job._id}' class="job-card__title">${job.title}</a>
            <div class="job-card__meta">
              <span>• ${
                job.recruiterId?.company?.name || "Unknown Company"
              }</span>
              <span>• ${job.location || "N/A"}</span>
              <span>• ${job.locationType || "N/A"}</span>
              <span class="job-card__salary">• ${job.minSalary || 0} - ${
      job.maxSalary || "N/A"
    }</span>
            </div>
          </div>
          <button class="job-card__favorite" aria-label="Add to favorites" data-jobid="${
            job._id
          }">
            <img class="fav-image" src="${favImage}">
          </button>
        </div>
      </div>
      <p class="job-card__description">${job.description || ""}</p>
      <div class="job-card__footer">
        <div class="job-card__deadline">
          <span>• Deadline: ${job.expiringDate || "N/A"}</span>
        </div>
        <div class="job-card__posted">
          <span>• Posted: ${new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `;
    jobList.appendChild(jobCard);
  });
};

const handleFilter = async (queryParams, endpoint = "/api/v1/jobs") => {
  try {
    const response = await axios({
      method: "GET",
      url: `${endpoint}?${queryParams.toString()}`,
      withCredentials: true,
    });

    if (response.data.status === "success") {
      displayJobs(response.data.data.jobs);
    } else {
      console.error("API returned error status:", response.data);
      showAlert("error", "Failed to load jobs. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    showAlert("error", "Failed to load jobs. Please try again.");
  }
};
