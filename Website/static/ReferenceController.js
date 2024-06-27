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


const checkbox = document.getElementById("reference");
const insertedElementsContainer = document.getElementById("reference-controls-insertion-point");
const previewInsertionPoint = document.getElementById("reference-preview-insertion-point");

checkbox.addEventListener("change", function() {
    if (this.checked) {
        //Include reference elements
        console.log("Reference included");

        //Create elements
        referenceProverbsTextElement = document.createElement("div");
        referenceSelectChapterInputElement = document.createElement("select");
        reference2PointsTextElement = document.createElement("div");
        referenceSelectFirstVerseInputElement = document.createElement("select");
        referenceDashLineTextElement = document.createElement("div");
        referenceSelectLastVerseInputElement = document.createElement("select");
        referencePreviewElement = document.createElement("div");

        /*****Add element attributes*****/

        //Add attributes for referenceProverbsTextElement
        referenceProverbsTextElement.textContent = "Proverbs";
        referenceProverbsTextElement.classList.add("reference-text");
        referenceProverbsTextElement.classList.add("reference-element");

        //Add attributes and options for referenceSelectChapterInputElement
        referenceSelectChapterInputElement.setAttribute('id', 'chapter-select');
        referenceSelectChapterInputElement.classList.add("reference-select-input");
        referenceSelectChapterInputElement.classList.add("reference-element");
        referenceSelectChapterInputElement.addEventListener('change', updateReferencePreview);
        referenceSelectChapterInputElement.addEventListener('change', validateReferenceForChapter);
        for (let i = 1; i <= 31; i++) {
            referenceSelectChapterInputElement.innerHTML += `<option value="${i}">${i}</option>`;
        }

        //Add attributes for reference2PointsTextElement
        reference2PointsTextElement.textContent = ":";
        reference2PointsTextElement.classList.add("reference-element");
        reference2PointsTextElement.classList.add("two-points");

        //Add attributes and options for referenceSelectFirstVerseInputElement
        referenceSelectFirstVerseInputElement.setAttribute('id', 'first-verse-select');
        referenceSelectFirstVerseInputElement.classList.add("reference-select-input");
        referenceSelectFirstVerseInputElement.classList.add("reference-element");
        referenceSelectFirstVerseInputElement.addEventListener('change', validateReferenceForFirstVerse);
        referenceSelectFirstVerseInputElement.addEventListener('change', updateReferencePreview);
        for (let i = 1; i <= 33; i++) {
            referenceSelectFirstVerseInputElement.innerHTML += `<option value="${i}">${i}</option>`;
        }
        
        //Add attributes for referenceDashLineTextElement
        referenceDashLineTextElement.textContent = "-";
        referenceDashLineTextElement.classList.add("reference-element");
        referenceDashLineTextElement.classList.add("dash-line");

        //Add attributes and options for referenceSelectLastVerseInputElement
        referenceSelectLastVerseInputElement.setAttribute('id', 'last-verse-select');
        referenceSelectLastVerseInputElement.classList.add("reference-select-input");
        referenceSelectLastVerseInputElement.classList.add("reference-element");
        referenceSelectLastVerseInputElement.addEventListener('change', updateReferencePreview);
        for (let i = 1; i <= 33; i++) {
            referenceSelectLastVerseInputElement.innerHTML += `<option value="${i}">${i}</option>`;
        }
        referenceSelectLastVerseInputElement.value = 6;

        //Add attributes for referencePreviewElement
        referencePreviewElement.classList.add("reference-preview");
        referencePreviewElement.innerHTML = "1. The proverbs of Solomon the son of David, king of Israel;<br>"
                                            + "2. To know wisdom and instruction; to perceive the words of understanding;<br>"
                                            + "3. To receive the instruction of wisdom, justice, and judgment, and equity;<br>"
                                            + "4. To give subtilty to the simple, to the young man knowledge and discretion.<br>"
                                            + "5. A wise [man] will hear, and will increase learning; and a man of understanding shall attain unto wise counsels:<br>"
                                            + "6. To understand a proverb, and the interpretation; the words of the wise, and their dark sayings.";

        /*****Add elements to DOM*****/
        insertedElementsContainer.appendChild(referenceProverbsTextElement);
        insertedElementsContainer.appendChild(referenceSelectChapterInputElement);
        insertedElementsContainer.appendChild(reference2PointsTextElement);
        insertedElementsContainer.appendChild(referenceSelectFirstVerseInputElement);
        insertedElementsContainer.appendChild(referenceDashLineTextElement);
        insertedElementsContainer.appendChild(referenceSelectLastVerseInputElement);

        previewInsertionPoint.appendChild(referencePreviewElement);

    } else {
        //Exclude reference elements
        console.log("Reference excluded");

        //Remove elements
        insertedElementsContainer.removeChild(referenceProverbsTextElement);
        insertedElementsContainer.removeChild(referenceSelectChapterInputElement);
        insertedElementsContainer.removeChild(reference2PointsTextElement);
        insertedElementsContainer.removeChild(referenceSelectFirstVerseInputElement);
        insertedElementsContainer.removeChild(referenceDashLineTextElement);
        insertedElementsContainer.removeChild(referenceSelectLastVerseInputElement);
        previewInsertionPoint.removeChild(referencePreviewElement);

        referenceProverbsTextElement = null;
        referenceSelectChapterInputElement = null;
        reference2PointsTextElement = null;
        referenceSelectFirstVerseInputElement = null;
        referenceDashLineTextElement = null;
        referenceSelectLastVerseInputElement = null;
        referencePreviewElement = null;
    }
})

/*****Reference update mechanism*****/
let data = [];

// Load the jsonl file
async function loadJSONL(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        return text;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Parse the jsonl text
function parseJSONL(text) {
    return text.trim().split('\n').map(JSON.parse);
}

function organizeVerses(data) {
    const bookChapters = [];

    data.forEach(item => {
        // Extract chapter and verse numbers
        const [chapter, verse] = item.Reference.split(':').map(Number);
        
        // Create book chapters if they don't exist
        if (!bookChapters[chapter - 1]) {
            bookChapters[chapter - 1] = [];
        }
        
        // Add the verse to the corresponding book chapter
        bookChapters[chapter - 1][verse - 1] = item.Verse;
    });

    return bookChapters;
}

async function loadAndOrganizeVerses(url) {
    try {
        const jsonlContent = await loadJSONL(url);
        const parsedData = parseJSONL(jsonlContent);
        const organizedVerses = organizeVerses(parsedData);
        return organizedVerses;
    } catch (error) {
        console.error('Error loading or processing the JSONL file:', error);
    }
}

async function initializeData() {
    const url = "/get/data/bible/kjv";
    data = await loadAndOrganizeVerses(url);
    console.log(data);
}

function updateReferencePreview() {
    const selectedChapter = referenceSelectChapterInputElement.value;
    const selectedFirstVerse = referenceSelectFirstVerseInputElement.value;
    const selectedLastVerse = referenceSelectLastVerseInputElement.value;
    referencePreviewElement.textContent = data[selectedChapter - 1].slice(selectedFirstVerse - 1, selectedLastVerse).join('\n');
}

function validateReferenceForChapter(){
    //Updates the selects elements of the first and last verses depending on the selected chapter
    let chapter = Number(document.getElementById('chapter-select').value);
    let firstVerse = 1;
    let lastVerse = data[chapter - 1].length;

    let options = "";
    for(let i = firstVerse; i <= lastVerse; i++){
        options += `<option value="${i}">${i}</option>`;
    }

    referenceSelectFirstVerseInputElement.innerHTML = options;
    referenceSelectLastVerseInputElement.innerHTML = options;
}

function validateReferenceForFirstVerse() {
    //Updates the select element of the last verse depending on the selected first verse
    let firstVerse = Number(document.getElementById('first-verse-select').value);
    let chapter = Number(document.getElementById('chapter-select').value);
    let lastChapterVerse = data[chapter - 1].length;
    let lastVerse = 0;

    if(lastChapterVerse - firstVerse > 7){
        lastVerse = firstVerse + 6;
    }
    else{
        lastVerse = lastChapterVerse;
    }

    referenceSelectLastVerseInputElement.innerHTML = "";
    let options = "";
    for(let i = firstVerse; i <= lastVerse; i++){
        options += `<option value="${i}">${i}</option>`;
    }
    referenceSelectLastVerseInputElement.innerHTML = options;
}

function updateTopButtonsAsNecessary(){
    token = localStorage.getItem('token');
    if(!token){
        let loginButton = document.createElement("button");
        loginButton.setAttribute("id", "login-btn");
        loginButton.classList.add("login-btn");
        loginButton.classList.add("top-button");
        loginButton.innerHTML = "Log In";
        loginButton.addEventListener('click', function() {
            window.location.href = "/login";
        });

        let signupButton = document.createElement("button");
        signupButton.setAttribute("id", "signup-btn");
        signupButton.classList.add("signup-btn");
        signupButton.classList.add("top-button");
        signupButton.innerHTML = "Sign Up";
        signupButton.addEventListener('click', function() {
            window.location.href = "/signup";
        });

        menu = document.getElementById("menu-btn");
        container = document.getElementById("btn-container");

        container.insertBefore(loginButton, menu);
        container.insertBefore(signupButton, menu);
    }
    else{
        initializeSideMenu();
        initializeOldConversationsSection();
    }
}

function initializeOldConversationsSection(){
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

function updateReferenceSlider(){
    if (checkbox.checked){
        //Uncheck the checkbox
        checkbox.checked = false;
    }
}

window.onload = function(){
    initializeData();
    updateTopButtonsAsNecessary();
    updateReferenceSlider();
}

document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = '/';
})