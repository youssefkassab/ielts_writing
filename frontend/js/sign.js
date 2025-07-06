// Get references to the input fields and the signup button
let username = document.getElementById("username");
let email_sign = document.getElementById("email_sign");
let password_sign = document.getElementById("password_sign");
let form_sign = document.getElementById("form_sign"); // Assuming this is the form element
let sign = document.getElementById("sign"); // Assuming 'sign' is your signup button

// Add an event listener to the signup button
sign.onclick = (event) => {
    // Prevent the default form submission behavior if 'sign' is a submit button inside a form
    // This stops the page from reloading if the button is type="submit"
    if (form_sign && sign.type === 'submit') { // Check if form_sign exists and button is submit type
        event.preventDefault();
    }

    // Create an object with the user's input data
    let save_object_sign = {
        "user_name": username.value,
        "email": email_sign.value,
        "password": password_sign.value
    };

    // Send a POST request to your signup API endpoint
    fetch("http:///sign_up", {
        method: "POST", // Specify the HTTP method
        headers: {
            "Content-Type": "application/json" // Tell the server we're sending JSON
        },
        body: JSON.stringify(save_object_sign) // Convert the JavaScript object to a JSON string
    })
    .then(response => {
        // Check if the response is OK (status 200-299)
        if (!response.ok) {
            // If not OK, parse the error message from the server if available
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Something went wrong on the server.');
            });
        }
        // If OK, parse the JSON response
        return response.json();
    })
    .then(data => {
        // This block handles the successful response from your API
        if (data.success) {
            // If signup was successful, redirect the user to the login page
            window.location.href = "/login";
        } else {
            // If signup was not successful (e.g., server returned success: false)
            // Display the error message from the server to the user
            console.error("Sign up failed:", data.message);
            // You can use an alert or update a specific div on your page to show this message
            alert("Sign up failed: " + (data.message || "Please try again."));
        }
    })
    .catch(error => {
        // This block handles network errors or errors thrown in the .then(response => ...) block
        console.error("Error during signup process:", error);
        alert("An error occurred during sign up: " + error.message);
    });
};

// Example: Accessing a protected page with token
const token = localStorage.getItem('token');
fetch('http:///signup', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(response => {
  if (response.ok) {
    // If the response is HTML, redirect to the page
    window.location.href = '/signup';
  } else {
    return response.json().then(data => {
      alert(data.message || 'Access denied.');
    });
  }
});