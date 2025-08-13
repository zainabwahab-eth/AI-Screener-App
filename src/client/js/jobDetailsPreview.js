// Resume Preview functionality
export class ResumePreviewHandler {
  constructor() {
    this.previewModal = document.querySelector(".preview-modal");
    this.previewOverlay = document.querySelector(".preview-overlay");
    this.previewCloseBtn = document.querySelector(".preview-close-btn");
    this.previewOpenBtn = document.querySelector(".preview-open-btn");
    this.previewFilename = document.querySelector(".preview-filename");
    this.header = document.querySelector(".header");

    // State elements
    this.previewLoading = document.querySelector(".preview-loading");
    this.previewError = document.querySelector(".preview-error");
    this.previewSuccess = document.querySelector(".preview-success");
    this.errorText = document.querySelector(".error-text");

    this.currentPreviewUrl = null;
    this.currentApplicationId = null;
    this.currentFilename = null;

    this.init();
  }

  init() {
    // Add click handlers for preview buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest(".preview-btn")) {
        console.log("Im here");
        this.handlePreviewClick(e);
      }
    });

    // Close modal handlers
    if (this.previewCloseBtn) {
      this.previewCloseBtn.addEventListener("click", () => this.closeModal());
    }

    if (this.previewOverlay) {
      this.previewOverlay.addEventListener("click", () => this.closeModal());
    }

    // Open preview button
    if (this.previewOpenBtn) {
      this.previewOpenBtn.addEventListener("click", () => this.openPreview());
    }

    // ESC key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isModalOpen()) {
        this.closeModal();
      }
    });
  }

  async handlePreviewClick(e) {
    e.preventDefault();

    const previewBtn = e.target.closest(".preview-btn");
    console.log(previewBtn);

    // Get data from button attributes
    this.currentApplicationId = previewBtn.dataset.applicationId;
    this.currentFilename = previewBtn.dataset.filename;
    const mimetype = previewBtn.dataset.mimetype;
    const url = previewBtn.dataset.url;
    console.log(this.currentApplicationId, this.currentFilename, mimetype, url);

    // Update modal filename
    if (this.previewFilename) {
      this.previewFilename.textContent = this.currentFilename;
    }

    // Show modal
    this.showModal();

    // If we already have the preview URL, show success
    if (this.currentPreviewUrl) {
      this.showSuccessState();
      return;
    }

    // Fetch preview URL
    await this.fetchPreviewUrl();
  }

  async fetchPreviewUrl() {
    this.showLoadingState();

    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/applications/${this.currentApplicationId}/preview`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any auth headers your app needs
            ...(this.getAuthToken() && {
              Authorization: `Bearer ${this.getAuthToken()}`,
            }),
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to load preview (${response.status})`
        );
      }

      const data = await response.json();
      this.currentPreviewUrl = data.data.previewUrl;

      this.showSuccessState();
    } catch (error) {
      console.error("Error fetching preview URL:", error);
      this.showErrorState(error.message);
    }
  }

  openPreview() {
    if (this.currentPreviewUrl) {
      window.open(this.currentPreviewUrl, "_blank", "noopener,noreferrer");
      // Optionally close modal after opening
      // this.closeModal();
    } else {
      // Try fetching again if no URL
      this.fetchPreviewUrl();
    }
  }

  showModal() {
    if (this.previewModal && this.previewOverlay) {
      this.previewModal.classList.remove("hidden");
      this.previewOverlay.classList.remove("hidden");
      this.header.classList.add("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  closeModal() {
    if (this.previewModal && this.previewOverlay) {
      this.previewModal.classList.add("hidden");
      this.previewOverlay.classList.add("hidden");
      this.header.classList.remove("hidden");
      document.body.style.overflow = "";

      // Reset states
      this.hideAllStates();
    }
  }

  isModalOpen() {
    return this.previewModal && !this.previewModal.classList.contains("hidden");
  }

  showLoadingState() {
    this.hideAllStates();
    if (this.previewLoading) {
      this.previewLoading.classList.remove("hidden");
    }

    // Disable open button
    if (this.previewOpenBtn) {
      this.previewOpenBtn.disabled = true;
      this.previewOpenBtn.style.opacity = "0.5";
      this.previewOpenBtn.style.cursor = "not-allowed";
    }
  }

  showSuccessState() {
    this.hideAllStates();
    if (this.previewSuccess) {
      this.previewSuccess.classList.remove("hidden");
    }

    // Enable open button
    if (this.previewOpenBtn) {
      this.previewOpenBtn.disabled = false;
      this.previewOpenBtn.style.opacity = "1";
      this.previewOpenBtn.style.cursor = "pointer";
    }
  }

  showErrorState(message) {
    this.hideAllStates();
    if (this.previewError) {
      this.previewError.classList.remove("hidden");
      if (this.errorText) {
        this.errorText.textContent = message;
      }
    }

    // Enable button for retry
    if (this.previewOpenBtn) {
      this.previewOpenBtn.disabled = false;
      this.previewOpenBtn.style.opacity = "1";
      this.previewOpenBtn.style.cursor = "pointer";

      // Change button text to "Try Again"
      const buttonText = this.previewOpenBtn.textContent;
      if (!buttonText.includes("Try Again")) {
        this.previewOpenBtn.innerHTML = `
            <img src='/img/general/refresh.svg' alt='retry-icon'>
            Try Again
          `;
      }
    }
  }

  hideAllStates() {
    const states = [
      this.previewLoading,
      this.previewError,
      this.previewSuccess,
    ];
    states.forEach((state) => {
      if (state) {
        state.classList.add("hidden");
      }
    });

    // Reset button text
    if (this.previewOpenBtn) {
      this.previewOpenBtn.innerHTML = `
          <img src='/img/general/external-link.svg' alt='open-icon'>
          Open Resume Preview
        `;
    }
  }

  getAuthToken() {
    // Adjust based on your auth implementation
    return (
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      this.getCookie("authToken")
    );
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
}
