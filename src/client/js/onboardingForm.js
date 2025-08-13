import { applicantOnboarding } from "./auth";

export class OnboardingForm {
  constructor(formElement) {
    this.form = formElement;
    this.interests = [];
    this.INTEREST_MAX = 6;

    this.elements = {
      interestInput: document.querySelector(".interest-input"),
      tagContainer: document.querySelector(".tag-container"),
      interestContainer: document.querySelector(".interest-container"),
      profileUpload: document.querySelector(".upload-area"),
      imageCntn: document.querySelector(".upload-div"),
      profilePics: document.getElementById("profilePics"),
      bio: document.getElementById("bio"),
      websiteInput: document.getElementById("websiteInput"),
      submitBtn: document.getElementById("submitBtn"),
      hintEle: document.querySelector(".interest-hint"),
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.checkFormValidity();
  }

  bindEvents() {
    this.elements.profilePics.addEventListener("change", (e) =>
      this.handleProfilePicsChange(e)
    );

    // Interest input events
    this.elements.interestInput.addEventListener("keydown", (e) =>
      this.handleInterestKeydown(e)
    );
    this.elements.interestInput.addEventListener("keypress", (e) =>
      this.handleInterestKeypress(e)
    );

    // Text input events
    [this.elements.bio, this.elements.websiteInput].forEach((input) => {
      input.addEventListener("input", () => this.checkFormValidity());
    });

    // Form submission
    this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
  }

  handleInterestKeydown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (this.interests.length < this.INTEREST_MAX) {
        const value = this.elements.interestInput.value.trim();
        if (
          value &&
          !this.interests.includes(value.toLowerCase()) &&
          this.interests.length < this.INTEREST_MAX
        ) {
          this.interests.push(value);
          this.renderInterests();
        }
        this.elements.interestInput.value = "";
      }
    }
  }

  handleInterestKeypress(e) {
    if (this.interests.length >= this.INTEREST_MAX) {
      e.preventDefault();
    }
  }

  handleProfilePicsChange(e) {
    const file = e.target.files[0];

    if (file) {
      const isValid = this.validateFile(file);

      if (isValid) {
        this.elements.profileUpload?.classList.add("has-file");
        this.elements.imageCntn?.classList.add("has-file");
        this.elements.profileUpload?.classList.remove("has-error");
      } else {
        this.elements.profileUpload?.classList.remove("has-file");
        this.elements.imageCntn?.classList.add("has-error");
        this.elements.profileUpload?.classList.add("has-error");
        // Clear the invalid file
        e.target.value = "";
      }
    } else {
      this.elements.profileUpload?.classList.remove("has-file", "has-error");
      this.elements.imageCntn?.classList.remove("has-file", "has-error");
    }

    this.checkFormValidity();
  }

  removeInterest(index) {
    this.interests.splice(index, 1);
    this.renderInterests();
  }

  renderInterests() {
    // Remove existing tags
    const existingTags =
      this.elements.tagContainer.querySelectorAll(".interest-tag");
    existingTags.forEach((tag) => tag.remove());

    // Add current interests as tags
    this.interests.forEach((interest, index) => {
      const tag = document.createElement("div");
      tag.className = "interest-tag";
      tag.innerHTML = `${interest} <button type='button' class='tag-remove' aria-label='Remove ${interest}'>x</button>`;

      const removeButton = tag.querySelector(".tag-remove");
      removeButton.addEventListener("click", () => this.removeInterest(index));

      this.elements.tagContainer.insertAdjacentElement("beforeend", tag);
    });

    this.updateInterestLimitUI();
    this.checkFormValidity();
  }

  updateInterestLimitUI() {
    if (this.interests.length >= this.INTEREST_MAX) {
      this.elements.interestContainer.classList.add("limit-reached");
      this.elements.interestInput.disabled = true;
      this.elements.interestInput.placeholder = "Maximum 6 interest reached";
      this.elements.hintEle.textContent =
        "Maximum Interest reached. Remove one to add another";
      this.elements.hintEle.classList.add("interest-limit-reached");
    } else {
      this.elements.interestContainer.classList.remove("limit-reached");
      this.elements.interestInput.disabled = false;
      this.elements.interestInput.placeholder = "";
      this.elements.hintEle.textContent =
        "Press Enter to add, click × to remove (Max 6)";
      this.elements.hintEle.classList.remove("interest-limit-reached");
    }
  }

  validateFile(file) {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    if (file.size > maxSize) {
      return false;
    }

    return true;
  }

  checkFormValidity() {
    const hasFile = this.elements.profilePics.files?.length > 0;
    const hasValidFile =
      hasFile && !this.elements.profileUpload?.classList.contains("has-error");
    const hasBio = this.elements.bio.value.trim() !== "";
    const hasWebsite = this.elements.websiteInput.value.trim() !== "";
    const hasInterests = this.interests.length > 0;

    const hasAnyContent = hasValidFile || hasBio || hasWebsite || hasInterests;

    if (!hasAnyContent) {
      this.elements.submitBtn.disabled = true;
    } else {
      this.elements.submitBtn.disabled = false;
    }

    // this.elements.submitBtn.disabled = !hasAnyContent;
  }

  handleFormSubmit(e) {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    if (this.elements.profilePics?.files[0]) {
      const file = this.elements.profilePics.files[0];
      formData.append("profilePics", file);
    }
    formData.append("bio", this.elements.bio.value.trim());
    formData.append("website", this.elements.websiteInput.value);
    formData.append("interests", JSON.stringify(this.interests));

    this.submitForm(formData);
  }

  submitForm(formData) {
    applicantOnboarding(formData);
  }

  // Public methods for external interaction
  getFormData() {
    return {
      profilePic: this.elements.profilePics.files[0] || null,
      bio: this.elements.bio.value.trim(),
      website: this.elements.websiteInput.value,
      interests: [...this.interests],
    };
  }

  reset() {
    this.interests = [];
    this.elements.interestInput.value = "";
    this.elements.bio.value = "";
    this.elements.websiteInput.value = "";
    this.elements.profilePics.value = "";
    this.elements.profileUpload.classList.remove("has-file");
    this.elements.profileUpload.classList.remove("has-error");
    this.renderInterests();
    this.checkFormValidity();
  }

  addInterest(interest) {
    const value = interest.trim();
    if (
      value &&
      !this.interests.includes(value.toLowerCase()) &&
      this.interests.length < this.INTEREST_MAX
    ) {
      this.interests.push(value);
      this.renderInterests();
      return true;
    }
    return false;
  }
}
