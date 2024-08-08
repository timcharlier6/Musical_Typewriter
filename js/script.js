let audioContext;
let noiseBuffer;

// Initialize the audio context
audioContext = new (window.AudioContext || window.webkitAudioContext)();
const synth = new Tone.Synth().toDestination();

// button to change layout of the keyboard
//document.getElementById("layoutToggle")
// Define the key rows for each difficulty level
const rowsQwerty = {
  easy: "asdfjkl;",
  medium: "asdfjkl;zxcvm,./",
  hard: "asdfjkl;zxcvm,./qweruiop",
};

const rowsAzerty = {
  easy: "qsdfjklm",
  medium: "qsdfjklmwxcv,;:=",
  hard: "qsdfjklmwxcv,;:=azeruiop",
};

// Define the key mappings
const keyMapping = {
  KeyZ: "c3",
  KeyX: "d3",
  KeyC: "e3",
  KeyV: "f3",
  KeyM: "g3",
  Comma: "a3",
  Period: "b3",
  Slash: "c4",
  KeyA: "c4",
  KeyS: "d4",
  KeyD: "e4",
  KeyF: "f4",
  KeyJ: "g4",
  KeyK: "a4",
  KeyL: "b4",
  Semicolon: "c5",
  KeyQ: "c5",
  KeyW: "d5",
  KeyE: "e5",
  KeyR: "f5",
  KeyU: "g5",
  KeyI: "a5",
  KeyO: "b5",
  KeyP: "c6",
  Enter: "brown",
  Space: "white",
};

// Generate a random sentence based on the difficulty level and sentence length
function generateRandomSentence(difficulty = "easy", sentenceLength = 79) {
  const keyRow = rowsQwerty[difficulty];
  const sentenceChunks = [];

  // Helper function to generate a string of four random characters
  function generateChunk() {
    let chunk = "";
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * keyRow.length);
      chunk += keyRow[randomIndex];
    }
    return chunk;
  }

  // Build the sentence in chunks of four characters followed by a space
  while (sentenceChunks.join(" ").length < sentenceLength) {
    sentenceChunks.push(generateChunk());
  }

  // Join chunks with spaces and trim to the desired length
  const sentence = sentenceChunks.join(" ").slice(0, sentenceLength);

  return sentence;
}

// Render a new sentence on the screen
function renderNewSentence(randomSentence) {
  const sentenceDisplayElement = document.getElementById("sentenceDisplay");
  sentenceDisplayElement.innerHTML = "";
  randomSentence.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    sentenceDisplayElement.appendChild(characterSpan);
  });
}

// Process user typing input
function processUserTypingInput() {
  const sentenceDisplayElement = document.getElementById("sentenceDisplay");
  const inputElement = document.getElementById("typeInput");

  // Generate the initial sentence default
  let randomSentence = generateRandomSentence();
  renderNewSentence(randomSentence);

  // Event listener for user input
  inputElement.addEventListener("input", () => {
    const arraySentence = sentenceDisplayElement.querySelectorAll("span");
    const arrayValue = inputElement.value.split("");
    console.log(arrayValue);

    let correct = true;
    arraySentence.forEach((characterSpan, index) => {
      const character = arrayValue[index];
      if (character == null) {
        characterSpan.classList.remove("correct");
        characterSpan.classList.remove("incorrect");
        characterSpan.classList.remove("underline");
      } else if (character === characterSpan.innerText) {
        characterSpan.classList.add("correct");
        characterSpan.classList.remove("incorrect");
        characterSpan.classList.remove("underline");
      } else if (
        character !== characterSpan.innerText &&
        (characterSpan.innerText === " " || characterSpan.innerText === "\n")
      ) {
        characterSpan.classList.add("incorrect");
        correct = false;
      } else {
        characterSpan.classList.remove("correct");
        characterSpan.classList.add("incorrect");
        characterSpan.classList.remove("underline");
        correct = false;
      }
    });

    if (arrayValue.length < arraySentence.length) {
      arraySentence[arrayValue.length].classList.add("underline");
    }

    if (arrayValue.length === arraySentence.length) {
      if (correct) {
        // Generate a new sentence based on current difficulty level
        const newDifficulty = "medium"; // Change difficulty as needed
        randomSentence = generateRandomSentence(newDifficulty, 8);
        renderNewSentence(randomSentence);
        inputElement.value = ""; // Clear the input field
      } else {
        inputElement.value = ""; // Clear the input field on incorrect completion
      }
    }
  });
}

// Play note or noise based on key press
function playNoteById(noteId) {
  function createWhiteNoise() {
    const bufferSize = 2 * audioContext.sampleRate; // 2 seconds buffer
    noiseBuffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate,
    );
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1; // Values between -1 and 1
    }
  }

  // Brown Noise Generator
  function createBrownNoise() {
    const bufferSize = 2 * audioContext.sampleRate; // 2 seconds buffer
    noiseBuffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate,
    );
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0;

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1 + lastOut * 0.8; // Decaying white noise
      lastOut = output[i];
    }
  }

  // Play Noise Function for a quarter note
  function playNoise(type) {
    if (type === "white") {
      createWhiteNoise();
    } else if (type === "brown") {
      createBrownNoise();
    }

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(audioContext.destination);

    noiseSource.start();
    noiseSource.stop(audioContext.currentTime + 0.25); // Play for a quarter note (assuming 1 second is a whole note)
  }

  switch (noteId) {
    case "c3":
    case "d3":
    case "e3":
    case "f3":
    case "g3":
    case "a3":
    case "b3":
    case "c4":
    case "d4":
    case "e4":
    case "f4":
    case "g4":
    case "a4":
    case "b4":
    case "c5":
    case "d5":
    case "e5":
    case "f5":
    case "g5":
    case "a5":
    case "b5":
    case "c6":
      synth.triggerAttackRelease(noteId.toUpperCase(), "4n");
      break;
    case "white":
      playNoise("white");
      break;
    case "brown":
      playNoise("brown");
      break;
  }
}

document.addEventListener("DOMContentLoaded", processUserTypingInput);

document.addEventListener("keydown", function (event) {
  if (Tone.context.state !== "running") {
    Tone.start();
  }

  const noteId = keyMapping[event.code];
  if (noteId) {
    playNoteById(noteId);
    console.log(event.code);
  }
});
