const { postPowerMode } = require("../utilities/sql/bot.advice");

module.exports.getAdivce = async (package) => {
  const { target, context, msg, client } = package;

  // Should get second word like in !advice off, it will return "off"
  const secondWord = getTextBetweenFirstTwoSpacesOrToEnd(msg);

  if (secondWord == "on" || secondWord == "off") {
    const resp = await postPowerMode(secondWord, target);
    client.say(target, `Turning ${resp} advice feature`);
    return;
  }

  // This should be a string "!advice"
  const mainCmd = msg.slice(0, 7);

  // Gets random slip of advice
  if (mainCmd === "!advice") {
    const randomAdvice = await getRandomAdvice();
    client.say(target, randomAdvice);
    return;
  }
};

// function to get target input
function getTextBetweenFirstTwoSpacesOrToEnd(inputString) {
  const spaceIndexes = [];
  for (let i = 0; i < inputString.length; i++) {
    if (inputString[i] === " ") {
      spaceIndexes.push(i);
    }
    if (spaceIndexes.length === 2) {
      return inputString.substring(spaceIndexes[0] + 1, spaceIndexes[1]);
    }
  }

  // If there are fewer than two spaces, return the portion from the first space to the end
  if (spaceIndexes.length === 1) {
    return inputString.substring(spaceIndexes[0] + 1);
  }

  return null; // Return null if there are no spaces
}

async function getRandomAdvice() {
  // Bunch of random sentence starters
  const randomStarters = [
    `Grandpappy used to say: `,
    `My mom always said: `,
    `Some random advice: `,
    "Back in the day, they used to say: ",
    "I remember hearing from my old teacher: ",
    "In times like these, people often share: ",
    "As the saying goes: ",
    "One piece of wisdom I've come across: ",
    "Folklore has it: ",
    "An old proverb comes to mind: ",
    "When I was young, I was told: ",
    "A nugget of advice from the wise: ",
    "You know, there's an old saying: ",
    "I've heard it said that: ",
    "Here's a little nugget for you: ",
    "From what I've learned: ",
    "There's an old adage: ",
    "Let me share this with you: ",
    "In the realm of advice, they mention: ",
    "As the ancient wisdom goes: ",
    "People often pass down: ",
    "If I may impart: ",
    "It's been told that: ",
    "Take it from me: ",
    "A little pearl of wisdom: ",
    "Remember this: ",
    "It's been said that: ",
    "In the realm of advice: ",
    "Here's a thought: ",
    "Here's a saying to ponder: ",
    "From the mouths of sages: ",
    "One thing I've heard: ",
    "As the story goes: ",
    "A timeless lesson: ",
    "A bit of guidance: ",
    "Here's an old saying: ",
    "It's worth noting: ",
    "In the world of counsel: ",
    "Consider this advice: ",
    "Let this sink in: ",
    "Reflect on this: ",
    "Let me share with you: ",
    "From the annals of wisdom: ",
    "Here's a gem for you: ",
    "Think about this: ",
    "For what it's worth: ",
    "They say that: ",
    "In matters of advice: ",
    "Here's a piece of advice: ",
    "A nugget of truth: ",
    "From ages past: ",
    "Here's a tidbit for you: ",
    "Take a moment to ponder: ",
    "Ponder this saying: ",
    "Consider these words: ",
    "For your contemplation: ",
    "From the voices of old: ",
    "Here's a saying to consider: ",
    "Mull over this: ",
    "A word to the wise: ",
    "Here's a thought to consider: ",
    "Here's a saying to remember: ",
    "From the wisdom of the ages: ",
    "Think on this: ",
    "A point to remember: ",
    "Here's a lesson for you: ",
    "Take this to heart: ",
    "Consider these words of advice: ",
    "A saying to mull over: ",
    "An old saying suggests: ",
    "From days gone by: ",
    "Ponder this advice: ",
    "An old saying goes: ",
    "Here's something to remember: ",
    "Here's a nugget for you: ",
    "Reflect on these words: ",
    "An old saying tells us: ",
    "A pearl of wisdom: ",
    "A timeless saying: ",
    "From the past comes: ",
    "Contemplate this saying: ",
    "A piece of advice to remember: ",
    "From yesteryears: ",
    "Consider these timeless words: ",
    "From ancient teachings: ",
    "Meditate on this saying: ",
    "A classic saying goes: ",
    "Here's something to ponder: ",
    "From wise voices: ",
    "Here's something to think about: ",
    "Remember this adage: ",
    "A saying from the ages: ",
    "An age-old saying: ",
    "From olden times: ",
    "An old proverb shares: ",
    "Consider this age-old wisdom: ",
    "A saying to keep in mind: ",
    "From times long past: ",
    "Here's a classic saying: ",
    "From times of old: ",
    "Consider this piece of advice: ",
    "Here's a timeless lesson: ",
    "An old adage goes: ",
    "From ancient times: ",
    "Consider these ancient words: ",
    "A nugget of insight: ",
    "A piece of wisdom suggests: ",
    "From the wisdom of old: ",
    "A saying to take to heart: ",
    "From the mouths of the wise: ",
    "Reflect on this timeless advice: ",
    "An old saying teaches: ",
    "Here's an adage to consider: ",
    "From days of yore: ",
    "Consider this sage advice: ",
    "A classic adage goes: ",
    "From voices of yesteryears: ",
    "An old saying imparts: ",
    "Consider these pearls of wisdom: ",
    "A lesson from the past: ",
    "Here's an old adage: ",
    "From bygone eras: ",
    "A saying from the past: ",
    "Consider this classic wisdom: ",
    "Here's a timeless saying: ",
    "From days long past: ",
    "A piece of insight to remember: ",
    "From the wisdom of the ancients: ",
    "An old saying reminds us: ",
    "Ponder this piece of advice: ",
    "An age-old adage: ",
    "Here's a nugget of counsel: ",
  ];

  // Gets random sentence starter
  const rand = Math.floor(Math.random() * randomStarters.length);
  // Gets random piece of advice from API
  const response = await fetch("https://api.adviceslip.com/advice");
  // Parses response to a json format
  const randomAdvice = await response.json();
  // extracts ID and advice from randomAdvice
  // const id = randomAdvice.slip.id;
  const advice = randomAdvice.slip.advice;

  // Sends message with piece of advice
  return `${randomStarters[rand]}${advice}`;
}
