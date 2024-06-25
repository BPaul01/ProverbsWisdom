window.onload = LoadPageFunction;

function LoadPageFunction(){
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
        newBotContainer = document.createElement("div");
        newBotContainer.classList.add("bot-container");
        newBotContainer.classList.add("container");

        newBotChat = document.createElement("div");
        newBotChat.classList.add("chat");
        newBotChat.classList.add("bot-text");

        document.getElementById("chat-container").appendChild(newBotContainer);
        newBotContainer.appendChild(newBotChat);

        newBotChat.innerHTML = data.answer;
    });
}

document.getElementById("input-textarea").addEventListener('keydown', function(event) {
    if(event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        console.log("Here, ask follow up...");
        //askFollowUp(this.value);
    }
});

function askFollowUp(text) {
    //Put the text in the user-text div 
    createUserChat(text);

    //Clear the input
    document.getElementById("input-textarea").value = "";

    //Send the text to the server
    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
        //Display the response
        document.getElementById("bot-text").innerHTML = data.answer;
    });
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