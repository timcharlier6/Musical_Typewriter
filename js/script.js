// Define the key rows for each difficulty level
const rows = {
  easy: "asdfjkl;",
  medium: "asdfjkl;zxcvm,./",
  hard: "asdfjkl;zxcvm,./qweruiop",
};

function setBackground() {
  const body = document.querySelector("body");
  const sentenceDisplayElement = document.getElementById("sentenceDisplay");

  body.style.backgroundColor = "black";
  sentenceDisplayElement.style.color = "rgba(255, 255, 255, 0.5)";
}

// Function to generate a random sentence
function generateRandomSentence(difficulty = "easy", sentenceLength = 4) {
  const keyRow = rows[difficulty];
  let sentence = "";
  let spaceCounter = 4; // Position to insert a space
  let carriageReturnCounter = 19; // Position to insert a newline

  for (let i = 0; i < sentenceLength; i++) {
    if (i === spaceCounter) {
      sentence += " ";
      spaceCounter += 5; // Move to the next position for inserting a space
    }

    if (i === carriageReturnCounter) {
      sentence += "\n";
      carriageReturnCounter += 20; // Move to the next position for inserting a newline
    }

    const randomIndex = Math.floor(Math.random() * keyRow.length);
    sentence += keyRow[randomIndex];
  }

  return sentence;
}

// Function to render a new sentence on the screen
function renderNewSentence(randomSentence) {
  const sentenceDisplayElement = document.getElementById("sentenceDisplay");
  sentenceDisplayElement.innerHTML = "";
  randomSentence.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    sentenceDisplayElement.appendChild(characterSpan);
  });
}

// Function to process user typing input
function processUserTypingInput() {
  const sentenceDisplayElement = document.getElementById("sentenceDisplay");
  const inputElement = document.getElementById("typeInput");

  // Generate the initial sentence
  let randomSentence = generateRandomSentence("easy", 20);
  renderNewSentence(randomSentence);

  // Event listener for user input
  inputElement.addEventListener("input", () => {
    const arraySentence = sentenceDisplayElement.querySelectorAll("span");
    const arrayValue = inputElement.value.split("");

    let correct = true;
    arraySentence.forEach((characterSpan, index) => {
      const character = arrayValue[index];
      if (character == null) {
        characterSpan.classList.remove("correct");
        characterSpan.classList.remove("incorrect");
      } else if (character === characterSpan.innerText) {
        characterSpan.classList.add("correct");
        characterSpan.classList.remove("incorrect");
        characterSpan.classList.remove("transparent");
      } else {
        characterSpan.classList.remove("correct");
        characterSpan.classList.add("incorrect");
        characterSpan.classList.remove("transparent");
        correct = false;
      }
    });

    if (arrayValue.length === arraySentence.length) {
      if (correct) {
        // Generate a new sentence based on current difficulty level
        const newDifficulty = "medium"; // Change difficulty as needed
        randomSentence = generateRandomSentence(newDifficulty, 40);
        renderNewSentence(randomSentence);
        inputElement.value = ""; // Clear the input field
      } else {
        inputElement.value = ""; // Clear the input field on incorrect completion
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", processUserTypingInput);
