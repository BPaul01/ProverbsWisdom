const oldConvoDiv = document.getElementById('old-convo-div');
let chatContainer = document.getElementById('chat-container');

document.getElementById('new-convo-btn').addEventListener('click', function() {
    //Save the current conversation
    let chatContainerKids = chatContainer.children;
    let messages = [];

    for (let i = 0; i < chatContainerKids.length; i++) {
        messageContainer = chatContainerKids[i];
        text = messageContainer.children[0].innerHTML;
        role = messageContainer.classList.contains('user-container') ? 'user' : 'assistant';

        message = {
            'position': i,
            'role': role,
            'text': text
        }

        messages.push(message);
    }

    fetch('/save/conversation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({messages: messages}),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })

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