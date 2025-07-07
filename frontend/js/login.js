// Event listener for form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send AJAX request to the server
    fetch("/login", {
        method: 'POST',     
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message); // Login successful
            if (data.token) {
                // Save the token to localStorage for later use
                localStorage.setItem('token', data.token);
            }
            if (data.redirectTo) {
                window.location.href = data.redirectTo; // Redirect to specified URL
            }
        } else {
            alert(data.message); // Invalid credentials
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
