// Function to show the login and registration forms
function showAuthForms() {
    document.querySelector('.overlay').style.display = 'flex';
}

// Function to hide the login and registration forms
function hideAuthForms() {
    document.querySelector('.overlay').style.display = 'none';
}

// Register function: Save user data to the backend
async function register() {
    const username = document.getElementById('register-username').value;
    const mobile = document.getElementById('register-mobile').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const user = {
        username: username,
        mobile: mobile,
        email: email,
        password: password
    };

    // Send the user data to the backend to store in an Excel file
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const result = await response.json();

        if (result.success) {
            alert("Registration successful! Redirecting to login...");
            hideAuthForms(); // Hide the registration form
            window.location.href = "login.html"; // Redirect to login page
        } else {
            alert(result.message || "Registration failed! Please try again.");
        }
    } catch (error) {
        console.error("Error during registration:", error);
    }
}

// Login function: Check credentials against stored data
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Send the login credentials to the backend to verify
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();

        if (result.success) {
            alert("Login successful! Redirecting...");
            
            // Store the login state in localStorage
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);  // Save username
            
            // Redirect to main page or dashboard
            window.location.href = "index.html";
        } else {
            alert(result.message || "Login failed! Please check your credentials.");
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}

// Logout function: Clear login state and redirect to the home page
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    alert("You have logged out.");
    window.location.href = "index.html"; // Redirect to home page
}

// Update UI based on login state
function updateUI() {
    if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('auth-buttons').style.display = 'none'; // Hide the login/register buttons
        document.getElementById('welcome-message').innerHTML = `Welcome, ${localStorage.getItem('username')}!`;
        document.getElementById('logout-button').style.display = 'block'; // Show logout button
    } else {
        document.getElementById('auth-buttons').style.display = 'flex'; // Show login/register buttons
        document.getElementById('logout-button').style.display = 'none'; // Hide logout button
    }
}

// Call updateUI on page load
window.onload = updateUI;