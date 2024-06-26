document.getElementById('login-btn').addEventListener('click', function() {
    window.location.href = "/login";
});

document.getElementById('signup-btn').addEventListener('click', function() {
    window.location.href = "/signup";
});

window.onload = function(){
    token = localStorage.getItem('token');
    if(token){
        document.getElementById('login-btn').remove();
        document.getElementById('signup-btn').remove();
    }
}