const shrink_btn = document.querySelector(".shrink-btn");
const search = document.querySelector(".search");
const sidebar_links = document.querySelectorAll(".sidebar-links a");
const active_tab = document.querySelector(".active-tab");
const shortcuts = document.querySelector(".sidebar-links h4");
const tooltip_elements = document.querySelectorAll(".tooltip-element");
const form = document.querySelector('form');

let activeIndex = 0; // Initialize activeIndex to 0

shrink_btn.addEventListener("click", () => {
  document.body.classList.toggle("shrink");
  setTimeout(moveActiveTab, 400);

  shrink_btn.classList.add("hovered");

  setTimeout(() => {
    shrink_btn.classList.remove("hovered");
  }, 500);
});


function moveActiveTab() {
  let topPosition = activeIndex * 58 + 2.5;

  if (activeIndex > 3) {
    topPosition += shortcuts.clientHeight;
  }

  active_tab.style.top = `${topPosition}px`;
}

function changeLink() {
  sidebar_links.forEach((sideLink) => sideLink.classList.remove("active"));
  this.classList.add("active");

  activeIndex = this.dataset.active; // Update activeIndex

  moveActiveTab();
}

sidebar_links.forEach((link) => link.addEventListener("click", changeLink));

function showTooltip(event) {
  let tooltip = event.currentTarget.parentNode.lastElementChild;
  let spans = tooltip.children;
  let tooltipIndex = event.currentTarget.dataset.tooltip;

  Array.from(spans).forEach((sp) => sp.classList.remove("show"));
  spans[tooltipIndex].classList.add("show");

  tooltip.style.top = `${(100 / (spans.length * 2)) * (tooltipIndex * 2 + 1)}%`;
}

tooltip_elements.forEach((elem) => {
  elem.addEventListener("maouseover", showTooltip);
});






// Event listener for delete, edit, and save buttons using event delegation
form.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button')) {
        // Delete button clicked
        const formRow = event.target.closest('.form-row');
        clearFormRow(formRow);
        alert('Data deleted');
    } else if (event.target.classList.contains('edit-button')) {
        // Edit button clicked
        const formRow = event.target.closest('.form-row');
        enableFormRowEditing(formRow);
        alert('Form ready for editing');
    } else if (event.target.classList.contains('save-button')) {
        // Save button clicked
        saveFormData();
        alert('Data saved successfully');
        // Redirect to another page
        window.location.href = 'customerdata.html';
    }
});

// Function to clear all input fields in a form row
function clearFormRow(formRow) {
    const inputFields = formRow.querySelectorAll('input');
    inputFields.forEach(input => {
        input.value = '';
    });
}

// Function to enable editing of all input fields in a form row
function enableFormRowEditing(formRow) {
    const inputFields = formRow.querySelectorAll('input');
    inputFields.forEach(input => {
        input.removeAttribute('readonly');
    });
}

// Function to save form data to local storage
function saveFormData() {
    const formData = {
        // Get the values from all input fields and save them to an object
    };
    localStorage.setItem('formData', JSON.stringify(formData));
}

function redirectToDashboard() {
  // Redirect to the dashboard page
  window.location.href = "dashboard.html";
  }

  function goBack() {
    window.history.back();
  }
  



document.addEventListener('DOMContentLoaded', function() {
  // Retrieve stored form data from sessionStorage
  const storedFormDataJSON = sessionStorage.getItem('formData');
  if (storedFormDataJSON) {
    const storedFormData = JSON.parse(storedFormDataJSON);

    // Populate form fields with stored data
    const form = document.querySelector('form');
    for (const key in storedFormData) {
      if (Object.hasOwnProperty.call(storedFormData, key)) {
        const input = form.querySelector(`input[name="${key}"]`);
        if (input) {
          input.value = storedFormData[key];
        }
      }
    }
  }

  // Event listener for form submission
  document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Fetch the entered form data
    const formData = new FormData(this);

    // Convert FormData to plain object
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    // Store form data in sessionStorage
    sessionStorage.setItem('formData', JSON.stringify(formDataObject));

    // Submit the form
    this.submit();
  });
});


 


  function calculateTotal() {
    // Get the offered cost and IGST values
    var offeredCost = parseFloat(document.getElementById("offeredCost").value) || 0;
    var IGST = parseFloat(document.getElementById("IGST").value) || 0;

    // Calculate the total value
    var totalValue = offeredCost + (offeredCost * IGST / 100);

    // Update the total value field
    document.getElementById("totalValue").value = totalValue.toFixed(2); // Display total value with two decimal places
  }




// Select the delete button
const deleteButton = document.querySelector('.delete-button');

// Add event listener to the delete button
deleteButton.addEventListener('click', function () {
  // Select all input fields inside the form
  const formInputs = document.querySelectorAll('.form input[type="text"], .form input[type="number"], .form input[type="date"], .form input[type="file"]');
  
  // Clear the value of each input field
  formInputs.forEach(function (input) {
    input.value = '';
  });
  
  // Optionally, focus on the first input field after clearing
  if (formInputs.length > 0) {
    formInputs[0].focus();
  }
});
 
// Select the edit button
const editButton = document.querySelector('.edit-button');

// Add event listener to the edit button
editButton.addEventListener('click', function () {
  // Select all input fields inside the form
  const formInputs = document.querySelectorAll('.form input[type="text"], .form input[type="number"], .form input[type="date"], .form input[type="file"]');
  
  // Set the contentEditable attribute of input fields to true to make them editable
  formInputs.forEach(function (input) {
    input.contentEditable = true;
  });
  
  // Optionally, focus on the first input field after setting them editable
  if (formInputs.length > 0) {
    formInputs[0].focus();
  }
});
function redirectToDashboard() {
  // Redirect to the dashboard page
  window.location.href = "dashboard.html";
  alert("Successfully closed");
  }

  function redirectToTracker() {
    // Redirect to the dashboard page
    window.location.href = "trackers.html";
    }

   
