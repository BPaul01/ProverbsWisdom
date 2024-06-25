document.getElementById("input-textarea").addEventListener('keydown', function(event) {
    if(event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        startChatting(this.value);
    }
});

function startChatting(text){
    sessionStorage.setItem('question', text);
    referenceCheck = document.getElementById("reference");
    if(referenceCheck.checked){
        sessionStorage.setItem('reference', 'true');
        sessionStorage.setItem('chapter', document.getElementById("chapter-select").value);
        sessionStorage.setItem('first-verse', document.getElementById("first-verse-select").value);
        sessionStorage.setItem('last-verse', document.getElementById("last-verse-select").value);
    }
    else
    {
        sessionStorage.setItem('reference', 'false');
    }
    //Redirect to the chat page
    window.location.href = "/start-chatting";
}