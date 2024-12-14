document.addEventListener("DOMContentLoaded", function () {
  let selectedPhoto = "https://via.placeholder.com/100"; // Default profile photo

  // Handle file selection for profile photo
  document.getElementById("replacePhoto").addEventListener("click", function () {
    document.getElementById("photoInput").click();
  });

  document.getElementById("photoInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        selectedPhoto = e.target.result;
        document.getElementById("profileImage").src = selectedPhoto;
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle form submission (Add or Edit user)
  document.getElementById("profileForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();

    if (!firstName || !lastName || !email) {
      alert("Please fill in all required fields.");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("userProfiles")) || [];
    const isEditing = document.getElementById("profileForm").dataset.editing;

    if (isEditing) {
      // Update the existing user
      const userIndex = storedUsers.findIndex((user) => user.email === isEditing);
      if (userIndex !== -1) {
        storedUsers[userIndex] = {
          firstName,
          lastName,
          email,
          username,
          profileImageURL: selectedPhoto,
        };
      }
      delete document.getElementById("profileForm").dataset.editing; // Remove editing flag
    } else {
      // Add a new user
      const user = {
        firstName,
        lastName,
        email,
        username,
        profileImageURL: selectedPhoto,
      };
      storedUsers.push(user);
    }

    // Save the updated users list to localStorage
    localStorage.setItem("userProfiles", JSON.stringify(storedUsers));
    displayProfiles(storedUsers);

    // Reset form and image to default
    document.getElementById("profileForm").reset();
    document.getElementById("profileImage").src = "https://via.placeholder.com/100";
    selectedPhoto = "https://via.placeholder.com/100";
  });

  // Function to display profiles
  function displayProfiles(users) {
    const profileList = document.getElementById("profileList");
    profileList.innerHTML = ""; // Clear existing profiles

    users.forEach((user) => {
      const profileCard = document.createElement("div");
      profileCard.classList.add("profile-card");
      profileCard.innerHTML = `
        <img src="${user.profileImageURL}" alt="Profile" class="profile-image" width="100">
        <h2>${user.firstName} ${user.lastName}</h2>
        <p>${user.email}</p>
        <p>${user.username}</p>
        <button onclick="editUser('${user.email}')">Edit</button>
        <button onclick="deleteUser('${user.email}')">Delete</button>
      `;
      profileList.appendChild(profileCard);
    });
  }

  // Delete a user
  window.deleteUser = function (email) {
    if (confirm("Are you sure you want to delete this user?")) {
      const storedUsers = JSON.parse(localStorage.getItem("userProfiles")) || [];
      const updatedUsers = storedUsers.filter((user) => user.email !== email);

      // Update localStorage and re-render the list
      localStorage.setItem("userProfiles", JSON.stringify(updatedUsers));
      displayProfiles(updatedUsers);

      alert("User deleted.");
    }
  };

 // Edit a user
 window.editUser = function (email) {
  const storedUsers = JSON.parse(localStorage.getItem("userProfiles")) || [];
  const user = storedUsers.find((user) => user.email === email);

  if (user) {
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("email").value = user.email;
    document.getElementById("username").value = user.username;
    document.getElementById("profileImage").src = user.profileImageURL;
    selectedPhoto = user.profileImageURL; // Set selected photo for editing

    document.getElementById("profileForm").dataset.editing = email; // Mark form as editing this user
  }
};

// Display stored profiles on page load
const storedUsers = JSON.parse(localStorage.getItem("userProfiles")) || [];
displayProfiles(storedUsers);
});

// Email validation

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const emailInput = document.getElementById("email");
const errorMessage = document.getElementById("errorMessage");
const emailForm = document.getElementById("emailForm");

emailInput.addEventListener("input", () => {
  if (validateEmail(emailInput.value)) {
    emailInput.classList.remove("error");
    emailInput.classList.add("success");
    errorMessage.style.display = "none";
  } else {
    emailInput.classList.remove("success");
    emailInput.classList.add("error");
    errorMessage.style.display = "block";
  }
});

    emailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateEmail(emailInput.value)) {
        alert("Please correct the email address before submitting.");
      } else {
        alert("Email submitted successfully!")
      }
      });