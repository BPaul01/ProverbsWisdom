window.onload = LoadPageFunction;

const tabletMediaQuery = window.matchMedia("(min-width: 481px) and (max-width: 768px)");
const mobileMediaQuery = window.matchMedia("(max-width: 480px)");

if (tabletMediaQuery.matches) {
    // If media query matches
    console.log("Media query matches: Tablet query");
}
else if (mobileMediaQuery.matches) {
    // If media query matches
    console.log("Media query matches: Mobile query");
}
else{
    console.log("Media query matches : Desktop query");
}

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

function LoadPageFunction(){
    
    // if(!token){
    //     let loginButton = document.createElement("button");
    //     loginButton.setAttribute("id", "login-btn");
    //     loginButton.classList.add("login-btn");
    //     loginButton.classList.add("top-button");
    //     loginButton.innerHTML = "Log In";
    //     loginButton.addEventListener('click', function() {
    //         window.location.href = "/login";
    //     });

    //     let signupButton = document.createElement("button");
    //     signupButton.setAttribute("id", "signup-btn");
    //     signupButton.classList.add("signup-btn");
    //     signupButton.classList.add("top-button");
    //     signupButton.innerHTML = "Sign Up";
    //     signupButton.addEventListener('click', function() {
    //         window.location.href = "/signup";
    //     });

    //     menu = document.getElementById("menu-btn");
    //     container = document.getElementById("btn-container");

    //     container.insertBefore(loginButton, menu);
    //     container.insertBefore(signupButton, menu);
    // }

    question = sessionStorage.getItem('question');

    createUserChat(question);
    askFirstQuestion(question);

    token = localStorage.getItem('token');
    if(token){
        initializeSideMenu();
    }
}

function askFirstQuestion(question) {
    let bodyData;
    if(sessionStorage.getItem('reference') === 'true') {
        chapter = sessionStorage.getItem('chapter');
        firstVerse = sessionStorage.getItem('first-verse');
        lastVerse = sessionStorage.getItem('last-verse');
        bodyData = {
            text: question,
            includeReference: 'true',
            chapter: chapter,
            firstVerse: firstVerse,
            lastVerse: lastVerse
        }
    }
    else {
        bodyData = {
            text: question,
            includeReference: 'false'
        }
    }

    fetch('/ask-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(data => {
        //Display the response
        createBotChat(data.answer)
    });
}

document.getElementById("input-textarea").addEventListener('keydown', function(event) {
    if(event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        askFollowUp(this.value);
    }
});

function askFollowUp(text) {
    if (text !== ""){
        //Put the text in the user-text div 
        createUserChat(text);

        //Clear the input
        document.getElementById("input-textarea").value = "";

        // Get all the past chats 
        let chatArray = buildChatArray();

        let bodyData;
        if(sessionStorage.getItem('reference') === 'true') {
            chapter = sessionStorage.getItem('chapter');
            firstVerse = sessionStorage.getItem('first-verse');
            lastVerse = sessionStorage.getItem('last-verse');
            bodyData = {
                chats: chatArray,
                includeReference: 'true',
                chapter: chapter,
                firstVerse: firstVerse,
                lastVerse: lastVerse
            }
        }
        else {
            bodyData = {
                chats: chatArray,
                includeReference: 'false'
            }
        }

        //Send the text to the server
        fetch('/ask-follow-up-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        })
        .then(response => response.json())
        .then(data => {
            //Display the response
            createBotChat(data.answer)
            scrollToBottom();
        });
    }
}

function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}

function buildChatArray(){
    const containers = document.querySelectorAll('.container');
    const chatArray = [];

    containers.forEach(container => {
        const chatDiv = container.querySelector('.chat');
        const role = container.classList.contains('user-container') ? 'user' : 'bot';
        const text = chatDiv.innerHTML;

        element = {
            'role': role,
            'text': text
        }
        chatArray.push(element);
    });

    return chatArray;
}

function createUserChat(text) {
    newUserContainer = document.createElement("div");
    newUserContainer.classList.add("user-container");
    newUserContainer.classList.add("container");

    newUserChat = document.createElement("div");
    newUserChat.classList.add("chat");
    newUserChat.classList.add("user-text");
    newUserChat.innerHTML = text;

    document.getElementById("chat-container").appendChild(newUserContainer);
    newUserContainer.appendChild(newUserChat);
}

function createBotChat(text) {
    newBotContainer = document.createElement("div");
    newBotContainer.classList.add("bot-container");
    newBotContainer.classList.add("container");

    newBotChat = document.createElement("div");
    newBotChat.classList.add("chat");
    newBotChat.classList.add("bot-text");
    newBotChat.innerHTML = text;

    document.getElementById("chat-container").appendChild(newBotContainer);
    newBotContainer.appendChild(newBotChat);
}