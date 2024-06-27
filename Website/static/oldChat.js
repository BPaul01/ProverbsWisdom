const tabletMediaQuery = window.matchMedia("(min-width: 481px) and (max-width: 768px)");
const mobileMediaQuery = window.matchMedia("(max-width: 480px)");
const oldConvoDiv = document.getElementById('old-convo-div');
let chatContainer = document.getElementById('chat-container');

document.getElementById('new-convo-btn').addEventListener('click', function() {
    //Redirect to the chat page
    window.location.href = "/";
});

document.getElementById("old-convo-btn").addEventListener("click", function() {
    token = localStorage.getItem('token');

    fetch('/get/older/conversations', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        for (let i = 0; i < data.length; i++) {
            const conversation = data[i];
            //console.log(conversation[0]);

            aConvo = document.createElement('a');
            aConvo.classList.add('a-menu-btn');
            aConvo.innerText = conversation[0];
            aConvo.addEventListener('click', function() {
                // Save the info in sessionStorage to display it on the old_conversation page
                sessionStorage.setItem('position_of_conversation_to_fetch', i);

                window.location.href = '/old_conversation';
            });
            oldConvoDiv.appendChild(aConvo);
        }
    })
})

document.getElementById("old-convo-btn").addEventListener("click", function() {
    if(tabletMediaQuery.matches){
        // If media query matches
        oldConvoDiv.style.width = '40vw';
    }
    else if(mobileMediaQuery.matches){
        // If media query matches
        oldConvoDiv.style.width = '45vw';
    }
    else{
        oldConvoDiv.style.width = '25vw';
    }
})

document.getElementById('old-convo-close-btn').addEventListener('click', function() {
    oldConvoDiv.style.width = '0';
});

function initializeSideMenu(){
    menuBtn = document.createElement('a');
    menuBtn.setAttribute('id', 'menu-btn');
    menuBtn.innerHTML = '<img src="static/menu-svgrepo-com.svg" alt="menu" class="top-button open-menu-btn">';
    document.getElementById('btn-container').appendChild(menuBtn);

    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.getElementById('close-btn');

    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if(tabletMediaQuery.matches){
            // If media query matches
            sideMenu.style.width = '40vw';
        }
        else if(mobileMediaQuery.matches){
            // If media query matches
            sideMenu.style.width = '45vw';
        }
        else{
            sideMenu.style.width = '25vw';
        }
    });

    closeBtn.addEventListener('click', function() {
        sideMenu.style.width = '0';
    });
}

window.onload = function() {
    initializeSideMenu();

    token = localStorage.getItem('token');
    idOfConvoToFetch = sessionStorage.getItem('position_of_conversation_to_fetch');

    params = `positionOfConvoToFetch=${idOfConvoToFetch}`;

    fetch('/get/old/conversation?' + params, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

        for (let i = 0; i < data.length; i++) {
            let message = data[i];
            let containerRole = message[1] === 'user' ? 'user-container' : 'bot-container'
            let messageContainerRole = message[1] === 'user' ? 'user-text' : 'bot-text'

            console.log("role: " + message[1]);
            console.log("containerRole: " + containerRole);
            console.log("messageContainerRole: " + messageContainerRole);
            
            messageContainer = document.createElement('div');
            messageContainer.classList.add('container');
            messageContainer.classList.add(containerRole);

            messageDiv = document.createElement('div');
            messageDiv.classList.add('chat');
            messageDiv.classList.add(messageContainerRole);
            messageDiv.innerHTML = message[0];

            messageContainer.appendChild(messageDiv);
            chatContainer.appendChild(messageContainer);
        }
    })
}