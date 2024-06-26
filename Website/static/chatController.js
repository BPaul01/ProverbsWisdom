window.onload = LoadPageFunction;

function LoadPageFunction(){
    token = localStorage.getItem('token');
    if(token){
        document.getElementById('login-btn').remove();
        document.getElementById('signup-btn').remove();
    }

    question = sessionStorage.getItem('question');

    createUserChat(question);
    askFirstQuestion(question);
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