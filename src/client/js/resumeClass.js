import { handleUpload } from "./handleResumeUpload";

export class JobApplicationModal {
  constructor() {
    // DOM elements
    this.applyBtn = document.querySelector(".job-apply-btn");
    this.modal = document.querySelector(".modal");
    this.overlay = document.querySelector(".overlay");
    this.header = document.querySelector(".header");
    this.closeBtn = document.querySelector(".close-btn");
    this.uploadArea = document.querySelector("#uploadArea");
    this.fileInput = document.querySelector("#resume");
    this.submitBtn = document.querySelector("#submitBtn");
    this.fileInfo = document.querySelector("#fileInfo");
    this.fileName = document.querySelector("#fileName");
    this.fileSize = document.querySelector("#fileSize");
    this.removeFileBtn = document.querySelector(".remove-file");
    this.errorMessage = document.querySelector("#errorMessage");
    this.uploadPrompt = document.querySelector(".upload-prompt");
    this.uploadSuccess = document.querySelector(".upload-success");
    this.jobId = this.modal?.dataset.jobid;

    // Bind methods
    this.toggleModal = this.toggleModal.bind(this);
    this.resetModal = this.resetModal.bind(this);
    this.validateFile = this.validateFile.bind(this);
    this.updateFileInfo = this.updateFileInfo.bind(this);
    this.updateApplyButton = this.updateApplyButton.bind(this);
    this.handleFileSelection = this.handleFileSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // Initialize event listeners
    this.initEventListeners();
  }

  // Initialize all event listeners
  initEventListeners() {
    if (this.applyBtn && this.modal && this.overlay) {
      this.applyBtn.addEventListener("click", (e) => {
        if (this.applyBtn.tagName === "A") return; // Let <a> redirect to /login
        if (this.applyBtn.dataset.applied === "true") return;
        this.toggleModal();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", this.toggleModal);
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", this.toggleModal);
    }

    if (this.uploadArea && this.fileInput) {
      this.uploadArea.addEventListener("click", () => this.fileInput.click());
      this.fileInput.addEventListener("change", this.handleFileSelection);
    }

    if (this.removeFileBtn) {
      this.removeFileBtn.addEventListener("click", this.resetModal);
    }

    if (this.submitBtn) {
      this.submitBtn.addEventListener("click", this.handleSubmit);
    }
  }

  // Show/hide modal
  toggleModal() {
    this.modal.classList.toggle("hidden");
    this.overlay.classList.toggle("hidden");
    this.header.classList.toggle("hidden");
    this.resetModal();
  }

  // Reset modal state
  resetModal() {
    this.fileInput.value = "";
    this.fileInfo.classList.add("hidden");
    this.errorMessage.classList.add("hidden");
    this.uploadPrompt.classList.remove("hidden");
    this.uploadSuccess.classList.add("hidden");
    this.submitBtn.disabled = true;
    this.fileName.textContent = "";
    this.fileSize.textContent = "";
  }

  // Validate file
  validateFile(file) {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.textContent = "Please upload a PDF, or DOCX file.";
      this.errorMessage.classList.remove("hidden");
      return false;
    }
    if (file.size > maxSize) {
      this.errorMessage.textContent = "File size exceeds 5 MB.";
      this.errorMessage.classList.remove("hidden");
      return false;
    }
    return true;
  }

  // Update UI with file details
  updateFileInfo(file) {
    this.fileName.textContent = file.name;
    this.fileSize.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    this.fileInfo.classList.remove("hidden");
    this.uploadPrompt.classList.add("hidden");
    this.uploadSuccess.classList.remove("hidden");
    this.submitBtn.disabled = false;
    this.errorMessage.classList.add("hidden");
  }

  // Update apply button state
  updateApplyButton() {
    if (this.applyBtn.tagName === "BUTTON") {
      this.applyBtn.textContent = "Applied";
      this.applyBtn.disabled = true;
      this.applyBtn.dataset.applied = "true";
    }
  }

  // Handle file selection
  handleFileSelection(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (this.validateFile(file)) {
      this.updateFileInfo(file);
    } else {
      this.fileInput.value = "";
      this.submitBtn.disabled = true;
    }
  }

  // Handle form submission
  async handleSubmit() {
    const file = this.fileInput.files[0];
    if (!file) {
      showAlert("error", "Please upload a resume.");
      return;
    }
    this.submitBtn.disabled = true;

    const success = await handleUpload(this.jobId, file);

    this.submitBtn.disabled = true;

    if (success) {
      this.updateApplyButton();
      this.toggleModal();
    } else {
      this.submitBtn.disabled = false;
    }
  }
}
