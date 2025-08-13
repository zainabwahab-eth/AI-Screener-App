// Display jobs in the UI (customize based on your needs)
// export const displayJobs = (jobs) => {
//   const jobList = document.querySelector(".jobs-grid");
//   const jobHeader = document.querySelector(".jobs-header");
//   if (!jobList) {
//     console.error("Job container not found");
//     return;
//   }

//   jobList.innerHTML = "";
//   jobHeader.innerHTML = "";

//   if (jobs.length === 0) {
//     jobList.innerHTML = "<p>No jobs found.</p>";
//     return;
//   }
//   const jobText = document.createElement("div");
//   jobText.className = "jobs-count";
//   jobText.textContent = `Showing ${jobs.length} Jobs`;
//   jobHeader.append(jobText);

//   jobs.forEach((job) => {
//     const jobCard = document.createElement("div");
//     jobCard.className = "job-card animate-fade-in";
//     jobCard.innerHTML = `
//       <div class="job-card__header">
//         <div class="job-card__left">
//           <div class="job-card__logo">👔</div>
//           <div class="job-card__info">
//             <a href="#" class="job-card__title">${job.title}</a>
//             <div class="job-card__meta">
//               <span>• ${
//                 job.recruiterId?.company?.name || "Unknown Company"
//               }</span>
//               <span>• ${job.location || "N/A"}</span>
//               <span>• ${job.locationType || "N/A"}</span>
//               <span class="job-card__salary">• ${job.minSalary || 0} - ${
//       job.maxSalary || "N/A"
//     }</span>
//             </div>
//           </div>
//           <button class="job-card__favorite" aria-label="Add to favorites">♡</button>
//         </div>
//       </div>
//       <p class="job-card__description">${job.description || ""}</p>
//       <div class="job-card__footer">
//         <div class="job-card__deadline">
//           <span>• Deadline: ${job.expiringDate || "N/A"}</span>
//         </div>
//         <div class="job-card__posted">
//           <span>• Posted: ${new Date(job.createdAt).toLocaleDateString()}</span>
//         </div>
//       </div>
//     `;
//     jobList.appendChild(jobCard);
//   });
// };

// export const fetchJobs = async () => {
//   try {
//     const response = await fetch("/api/v1/jobs", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch jobs");
//     }

//     const data = await response.json();
//     console.log("Initial Load Response:", data);
//     if (data.status === "success") {
//       displayJobs(data.data.jobs);
//       console.log(data.data)
//     }
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     alert("Failed to load jobs. Please try again.");
//   }
// }

// filterForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   // Collect form data
//   const form = e.target;
//   const formData = new FormData(form);
//   const queryParams = new URLSearchParams();

//   // Handle keyword
//   const keyword = formData.get("keyword");
//   if (keyword) {
//     queryParams.append("keyword", keyword);
//   }

//   // Handle experience (multiple selections)
//   const experience = formData.getAll("experience");
//   if (experience.length > 0) {
//     queryParams.append("experience[in]", experience.join(","));
//   }

//   // Handle locationType (multiple selections)
//   const locationType = formData.getAll("locationType");
//   if (locationType.length > 0) {
//     queryParams.append("locationType[in]", locationType.join(","));
//   }

//   // Handle salary ranges
//   const salary = formData.get("salary");
//   if (salary) {
//     if (salary === "under-1000") {
//       queryParams.append("minSalary[lt]", "1000");
//     } else if (salary === "1000-10000") {
//       queryParams.append("minSalary[gte]", "1000");
//       queryParams.append("minSalary[lte]", "10000");
//     } else if (salary === "10000-50000") {
//       queryParams.append("minSalary[gte]", "10000");
//       queryParams.append("minSalary[lte]", "50000");
//     } else if (salary === "above-50000") {
//       queryParams.append("minSalary[gt]", "50000");
//     }
//   }

//   // Fetch filtered jobs
//   try {
//     const response = await fetch(`/api/v1/jobs?${queryParams.toString()}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch jobs");
//     }

//     const data = await response.json();

//     if (data.status === "success") {
//       displayJobs(data.data.job);
//     }
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     alert("Failed to load jobs. Please try again.");
//   }
// });

// Fetch filtered jobs
// try {
//   const response = await fetch(`/api/v1/jobs?${queryParams.toString()}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch jobs");
//   }

//   const data = await response.json();

//   if (data.status === "success") {
//     displayJobs(data.data.job);
//   }
// } catch (error) {
//   console.error("Error fetching jobs:", error);
//   alert("Failed to load jobs. Please try again.");
// }
