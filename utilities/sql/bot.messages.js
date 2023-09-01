var Pool = require("pg-pool");
const settings = require("../../settings.json");

// Worker pool for DB
var database = new Pool({
  user: settings.database.user,
  password: settings.database.password,
  database: "messages",
  port: 5432,
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

// function to remove # from target
const removeHashFromString = function (str) {
  return str.replace("#", "");
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

// List of channels for the bot to use to watch for messages
module.exports = {
  // Saves messages to database
  postMessage: async (msgObj) => {
    // Starts connection to database
    const client = await database.connect();

    // unpacking and formating msgObj and establishing time chat came in
    const channelName = removeHashFromString(msgObj.target);
    const username = msgObj.user;
    const message = msgObj.msg;
    const timestamp = new Date();

    // Attempts to add message
    try {
      const query = {
        text: `INSERT INTO ${channelName} (time,username,message,info) VALUES ($1, $2, $3, $4)`,
        values: [timestamp, username, message, JSON.stringify(msgObj.context)],
      };

      try {
        client.query(query);
      } catch (error) {
        console.log(
          `${username} said "${message}" in ${channelName} chat and we had an error!`
        );
      }
    } finally {
      // Release DB connection
      client.release();
    }
  },
  // Creates table for channel in database
  postChannel: async (msg, bot, target) => {
    // unpacking and formating msgObj and establishing time chat came in
    const tableName = getTextBetweenFirstTwoSpacesOrToEnd(msg);

    // Starts connection to database
    const client = await database.connect();

    try {
      const query = {
        text: `CREATE TABLE ${tableName} (
          id SERIAL PRIMARY KEY,
          time TIMESTAMP NOT NULL,
          username VARCHAR NOT NULL,
          message VARCHAR NOT NULL,
          info JSON NOT NULL
      );`,
        // Use values if using code like INSERT INTO ${chatName} (time, username, message, info) VALUES ($1, $2, $3, $4)
        values: [],
      };

      try {
        client.query(query);
        bot.say(target, `Joined ${tableName} chat`);
      } catch (error) {
        console.log(error);
        bot.say(target, `Error joining ${tableName} chat`);
      }
      // Goes to end of code
    } finally {
      // Release DB connection
      client.release();
    }
  },
};
