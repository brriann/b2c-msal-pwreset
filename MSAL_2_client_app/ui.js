// DOM elements
const loggedInDisplay = document.getElementById("loggedInDisplay");
const usernameDisplay = document.getElementById("usernameDisplay");

function showLoggedInState (username) {
    loggedInDisplay.innerHTML = "yes!";
    usernameDisplay.innerHTML = username;
}

