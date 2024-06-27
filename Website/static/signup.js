document.getElementById("submit-btn").addEventListener("click", function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        document.getElementById('message').innerHTML = 'Passwords do not match. Please try again.';
        return;
    }

    fetch('/request-signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
    })
    .then(response => response.json())
    .then(data => {
        if(data.access_token) {
            localStorage.setItem('token', data.access_token);
            console.log("Authentication successful");
            console.log("Token: " + data.access_token);
            window.location.href = '/';
        }
        else{
            console.log("Authentication failed");
            document.getElementById('message').textContent = 'Invalid credentials. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
    });
})

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById("submit-btn").click();
    }
})