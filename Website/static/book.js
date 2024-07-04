window.onload = loadPage;

let data = [];

document.getElementById("chapter").addEventListener("change", function() {
    initializeText();
});

async function loadPage() {
    await initializeData();
    initializeText();
}

async function initializeData() {
    const url = "/get/data/bible/kjv";
    data = await loadAndOrganizeVerses(url);
    console.log(data);
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

function initializeText() {
    const targetContainer = document.getElementById("verses-container");
    const selectedChapter = document.getElementById("chapter").value;

    text = "";
    for(let i = 0; i< data[selectedChapter - 1].length; i++) {
        text += (i+1).toString() + ". " + data[selectedChapter - 1][i] + "<br>";
    }
    targetContainer.innerHTML = text;
}