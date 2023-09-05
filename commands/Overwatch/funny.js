module.exports.funnyOW = (inputString) => {
  const regex = /^!realOW\s+(\S+)/;

  const match = inputString.match(regex);

  if (!match) {
    return null; // Invalid format
  }

  let randomStart = getRandomFromArray(surpriseRankPhrases);
  let battletag = match[1].trim(); // "battletag#1234"
  let tank = `Tank: ${getRandomRank()}`;
  let offense = `Offense: ${getRandomRank()}`;
  let support = `Support: ${getRandomRank()}`;
  let randomEnd = getRandomFromArray(endPhrases);

  return `For ${battletag}. ${randomStart} ${tank} | ${offense} | ${support}... ${randomEnd}`;
};

function getRandomRank() {
  // Define the ranks and their divisions with custom probabilities
  const rankProbabilities = [
    { rank: "Bronze", weight: 5 },
    { rank: "Silver", weight: 5 },
    { rank: "Gold", weight: 3 },
    { rank: "Platinum", weight: 3 },
    { rank: "Diamond", weight: 2 },
    { rank: "Master", weight: 1 },
    { rank: "Grandmaster", weight: 1 },
  ];

  // Calculate the total weight
  const totalWeight = rankProbabilities.reduce(
    (sum, rank) => sum + rank.weight,
    0
  );

  // Generate a random number within the total weight
  const randomValue = Math.floor(Math.random() * totalWeight);

  // Find the rank based on the random number and weights
  let cumulativeWeight = 0;
  let selectedRank = "";

  for (const rank of rankProbabilities) {
    cumulativeWeight += rank.weight;
    if (randomValue < cumulativeWeight) {
      selectedRank = rank.rank;
      break;
    }
  }

  // Choose a random division
  const randomDivision = Math.floor(Math.random() * 5) + 1;

  // Format the rank and division as "Rank #"
  const rankString = `${selectedRank} ${randomDivision}`;

  return rankString;
}

function getRandomFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const surpriseRankPhrases = [
  "Surprisingly, they were ranked",
  "To our amazement, their rank was",
  "It's a shocker, their rank is",
  "Much to our surprise, they achieved a rank of",
  "Unexpectedly, their ranking is",
  "It comes as a surprise that they are ranked",
  "To our disbelief, they hold a rank of",
  "It's quite astonishing that they were placed at",
  "In an unexpected turn of events, they were ranked",
  "We couldn't believe it, their rank is",
];

const endPhrases = [
  "That seems a bit off.",
  "This appears to be incorrect.",
  "Something doesn't seem quite right.",
  "It doesn't appear to be accurate.",
  "This doesn't align with what I expected.",
  "This doesn't match up with the data.",
  "This doesn't seem to add up.",
  "There seems to be an issue here.",
  "That's not quite what I had in mind.",
  "This doesn't fit the pattern.",
];
