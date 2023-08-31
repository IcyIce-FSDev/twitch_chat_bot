module.exports = {
  // Roll D20
  rollDice: (client, target) => {
    // Variable for number of sides to dice
    const sides = 20;
    // Random number between 1-20
    const randNum = Math.floor(Math.random() * sides) + 1;
    // Sends message with users roll
    client.say(target, `You rolled a D${randNum}`);
  },
};
