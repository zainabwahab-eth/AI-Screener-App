import axios from "axios";
import { showAlert } from "./alert";
axios.defaults.withCredentials = true;

export const selectRole = async (selectedRole) => {
  localStorage.setItem("role", selectedRole);
  window.location.assign("/signup");
};

export const signup = async (name, email, password, role) => {
  if (!role) {
    showAlert("error", "Please select a role first");
    window.setTimeout(() => {
      window.location.assign("/roles");
    }, 1000);
  }
  try {
    const response = await axios({
      method: "POST",
      url: "http://localhost:4000/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        role,
      },
    });

    if (response.data.status === "success") {
      showAlert("success", "Signup Successfully");
      localStorage.removeItem("role");
      window.setTimeout(() => {
        window.location.assign("/user-onboard");
      }, 500);
      return true;
    } else {
      console.error("API returned error status:", response.data);
      showAlert("error", "Failed Signup. Please try again.");
      return false;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    return false;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios({
      method: "POST",
      url: "http://localhost:4000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (response.data.status === "success") {
      showAlert("success", "Login Successfully");
      window.setTimeout(() => {
        window.location.assign("/");
      }, 500);
    } else {
      console.error("API returned error status:", response.data);
      showAlert("error", "Failed Login. Please try again.");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: "http://localhost:4000/api/v1/users/logout",
    });
    if (response.data.status === "success") {
      location.reload(true);
    }
  } catch (err) {
    console.err(err);
    showAlert("error", "Error logging out please try agin later");
  }
};

export const applicantOnboarding = async (data) => {
  console.log("applicant", data.get("bio"), data);
  try {
    const response = await axios({
      method: "PATCH",
      url: "http://localhost:4000/api/v1/users/applicant/onboard",
      data,
      withCredentials: true,
      // headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response);
    if (response.data.status === "success") {
      window.location.assign("/");
    }
  } catch (err) {
    console.error("err", err);
    showAlert("error", "Error onboarding please try agin later");
  }
};
