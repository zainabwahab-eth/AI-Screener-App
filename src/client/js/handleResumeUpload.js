import axios from "axios";
import { showAlert } from "./alert.js";

export const handleUpload = async (jobId, file) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await axios({
      method: "POST",
      url: `http://localhost:4000/api/v1/applications/${jobId}/apply`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    console.log(response);

    if (response.data.status === "success") {
      showAlert("success", "Application submitted successfully!");
      window.location.reload();
      return true;
    }
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 400) {
      showAlert(
        "error",
        err.response.data.message || "Failed to submit application."
      );
    } else if (err.response && err.response.status === 401) {
      showAlert("error", "Please log in to submit an application.");
    } else {
      showAlert("error", "Error submitting application. Please try again.");
    }
    return false;
  }
  return false;
};

// let selectedFile = null;

//         function handleFileSelect(event) {
//             const file = event.target.files[0];
//             if (file) {
//                 validateAndUploadFile(file);
//             }
//         }

//         function validateAndUploadFile(file) {
//             const uploadArea = document.getElementById('uploadArea');
//             const errorMessage = document.getElementById('errorMessage');
//             const fileInfo = document.getElementById('fileInfo');
//             const submitBtn = document.getElementById('submitBtn');

//             // Reset error state
//             uploadArea.classList.remove('error');
//             errorMessage.classList.remove('show');

//             // Validate file type
//             const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//             if (!allowedTypes.includes(file.type)) {
//                 showError('Please upload a PDF or DOC file.');
//                 return;
//             }

//             // Validate file size (5MB limit)
//             const maxSize = 5 * 1024 * 1024; // 5MB in bytes
//             if (file.size > maxSize) {
//                 showError('File size must be less than 5MB.');
//                 return;
//             }

//             // Show loading state
//             uploadArea.classList.add('loading');

//             // Simulate upload delay
//             setTimeout(() => {
//                 selectedFile = file;
//                 uploadArea.classList.remove('loading');
//                 uploadArea.classList.add('uploaded');

//                 // Show file info
//                 displayFileInfo(file);
//                 fileInfo.classList.add('show');

//                 // Enable submit button
//                 submitBtn.disabled = false;
//             }, 1500);
//         }

//         function displayFileInfo(file) {
//             const fileName = document.getElementById('fileName');
//             const fileSize = document.getElementById('fileSize');

//             fileName.textContent = file.name;
//             fileSize.textContent = formatFileSize(file.size);
//         }

//         function formatFileSize(bytes) {
//             if (bytes === 0) return '0 Bytes';
//             const k = 1024;
//             const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//             const i = Math.floor(Math.log(bytes) / Math.log(k));
//             return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//         }

//         function showError(message) {
//             const uploadArea = document.getElementById('uploadArea');
//             const errorMessage = document.getElementById('errorMessage');

//             uploadArea.classList.add('error');
//             errorMessage.textContent = message;
//             errorMessage.classList.add('show');

//             // Clear file input
//             document.getElementById('fileInput').value = '';
//         }

//         function removeFile() {
//             const uploadArea = document.getElementById('uploadArea');
//             const fileInfo = document.getElementById('fileInfo');
//             const submitBtn = document.getElementById('submitBtn');
//             const fileInput = document.getElementById('fileInput');

//             selectedFile = null;
//             uploadArea.classList.remove('uploaded');
//             fileInfo.classList.remove('show');
//             submitBtn.disabled = true;
//             fileInput.value = '';
//         }

//         function submitApplication() {
//             if (selectedFile) {
//                 alert(`Application submitted with resume: ${selectedFile.name}`);
//                 closeOverlay();
//             }
//         }

//         function closeOverlay() {
//             // In a real application, you would hide the overlay
//             // For this demo, we'll just reset the form
//             removeFile();
//         }

//         // Drag and drop functionality
//         const uploadArea = document.getElementById('uploadArea');

//         uploadArea.addEventListener('dragover', (e) => {
//             e.preventDefault();
//             uploadArea.classList.add('dragover');
//         });

//         uploadArea.addEventListener('dragleave', (e) => {
//             e.preventDefault();
//             uploadArea.classList.remove('dragover');
//         });

//         uploadArea.addEventListener('drop', (e) => {
//             e.preventDefault();
//             uploadArea.classList.remove('dragover');

//             const files = e.dataTransfer.files;
//             if (files.length > 0) {
//                 validateAndUploadFile(files[0]);
//             }
//         });
