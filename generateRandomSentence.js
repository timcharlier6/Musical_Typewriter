// Define the key rows for each difficulty level
const rows = {
  easy: "asdfjkl;",
  medium: "asdfjkl;zxcvm,./",
  hard: "asdfjkl;zxcvm,./qweruiop",
};

// Function to generate a random sentence
function generateRandomSentence(difficulty, sentenceLength) {
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

// Example usage
const difficulty = "easy"; // Choose 'easy', 'medium', or 'hard'
const sentenceLength = 79; // Length of the generated sentence
const randomSentence = generateRandomSentence(difficulty, sentenceLength);

console.log(randomSentence);
