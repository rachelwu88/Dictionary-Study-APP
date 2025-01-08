// DOM Elements
const inputE1 = document.getElementById("input");
const infoTextE1 = document.getElementById("info-text");
const meaningContainerE1 = document.getElementById("meaning-container");
const titleE1 = document.getElementById("title");
const meaningE1 = document.getElementById("meaning");
const audioElement = document.getElementById("audio");
const saveWordBtn = document.getElementById("save-word-btn");
const savedWordsList = document.getElementById("saved-words-list");
const savedWordsContainer = document.getElementById("saved-words-container");
const saved = document.getElementById("saved");

let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

function displaySavedWords() {
    savedWordsList.innerHTML = ""; 

    if (savedWords.length === 0){
        saved.textContent = "No saved words.";
    } else {
        saved.textContent = "Click on the word to view or delete";
    savedWords.forEach(word => {
        const listItem = document.createElement("li");
        listItem.classList.add("saved-word-item");

        const button = document.createElement("button");
        button.innerHTML = word;
        button.classList.add("saved-word-button");
        button.style.backgroundColor = "rgb(81, 100, 160)";
        button.style.color = "white";
        button.style.borderRadius = "30px";

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "x";
        deleteButton.classList.add("delete-word-button");
        deleteButton.style.backgroundColor = "rgba(255, 0, 0, 0.46)";
        deleteButton.style.color = "white";
        deleteButton.style.borderRadius = "30px";
        deleteButton.style.display = "none"; 

        listItem.addEventListener("mouseenter", () => {
            deleteButton.style.display = "inline-block";
        });
        listItem.addEventListener("mouseleave", () => {
            deleteButton.style.display = "none";
        });

        button.addEventListener("click", () => {
            overrideInput(word);
            fetchAPI(word); 
        });

        deleteButton.addEventListener("click", () => {
            removeWordFromSavedList(word);
            displaySavedWords();
        });

        listItem.appendChild(button);
        listItem.appendChild(deleteButton);

        savedWordsList.appendChild(listItem);
    });
}
}

function removeWordFromSavedList(wordToDelete) {
    savedWords = savedWords.filter(word => word !== wordToDelete);
    localStorage.setItem("savedWords", JSON.stringify(savedWords));
}


function overrideInput(newText) {
    inputE1.value = newText;
}

async function fetchAPI(word) {
    try {
        infoTextE1.style.display = "block";
        meaningContainerE1.style.display = "none";
        infoTextE1.innerText = `Searching the meaning of "${word}"...`;

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const result = await fetch(url).then((res) => res.json());

        if(savedWordsList.length === 0){
            savedWordsContainer.style.display = "none";
        }else{
            savedWordsContainer.style.display = "block";
        }

        if (result.title) {
            meaningContainerE1.style.display = "block";
            infoTextE1.style.display = "none";
            titleE1.innerText = word;
            meaningE1.innerText = "N/A";
            audioElement.style.display = "none";
            saveWordBtn.style.display = "none";
        } else {
            infoTextE1.style.display = "none";
            meaningContainerE1.style.display = "block";
            titleE1.innerText = result[0].word;
            meaningE1.innerText = result[0].meanings[0].definitions[0].definition;

            if (result[0].phonetics[0].audio) {
                audioElement.style.display = "inline-flex";
                audioElement.src = result[0].phonetics[0].audio;
            } else {
                audioElement.style.display = "none";
            }
            saveWordBtn.style.display = "block"; 
        }
    } catch (error) {
        console.error(error);
        infoTextE1.innerText = "An error occurred while fetching the word. Please try again.";
    }
}

saveWordBtn.addEventListener("click", () => {
    const word = titleE1.innerText;
    if (word && !savedWords.includes(word)) {
        savedWords.push(word);
        localStorage.setItem("savedWords", JSON.stringify(savedWords));
        displaySavedWords();
    }
});

inputE1.addEventListener("keyup", (e) => {
    if (e.target.value && e.key === "Enter") {
        fetchAPI(e.target.value.trim());
    }
});

displaySavedWords();