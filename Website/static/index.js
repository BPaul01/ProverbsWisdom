const oldConvoDiv = document.getElementById('old-convo-div');

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

        // Reset the old_convo_div
        oldConvoDiv.innerHTML = '<a class="close-btn" id="old-convo-close-btn">&times;</a>';
        document.getElementById('old-convo-close-btn').addEventListener('click', function() {
            oldConvoDiv.style.width = '0';
        });

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
    .catch(error => {
        console.error('Error:', error);
    });
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

document.getElementById('book-btn').addEventListener('click', function() {
    const bookBtn = document.getElementById('book-btn');
    const bookDiv = document.getElementById('book-reading-div');
    
    if(bookBtn.classList.contains('clicked')){
        bookBtn.classList.remove('clicked');
        
        // Hide the book interface
        bookDiv.style.width = '0vw';
        bookDiv.style.height = '0vh';
        document.getElementById('body').style.overflow = 'auto';
        document.getElementById('book-reading').style.border = '0px none';
    }
    else{
        bookBtn.classList.add('clicked');
        
        // Show the book interface
        bookDiv.style.width = '100vw';
        bookDiv.style.height = '75vh';
        document.getElementById('body').style.overflow = 'hidden';
        document.getElementById('book-reading').style.border = '5px solid #BBF9E5';
    }
});