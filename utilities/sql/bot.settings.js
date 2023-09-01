var Pool = require("pg-pool");
const settings = require("../../settings.json");
const { postChannel } = require("./bot.messages");

// Worker pool for DB
var database = new Pool({
  user: settings.database.user,
  password: settings.database.password,
  port: 5432,
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

// If no database if found this command is ran to create it
async function setupDatabase() {
  const client = await database.connect();

  try {
    // Check if the 'messages' database exists
    const result = await client.query(
      "SELECT datname FROM pg_database WHERE datname = 'messages'"
    );

    if (result.rows.length === 0) {
      // If 'messages' database does not exist, create it
      await client.query("CREATE DATABASE messages");

      const time = new Date();
      const template = `[${time}] : * The 'messages' database has been created due to initial setup.`;
      console.log(template);
    }
  } catch (error) {
    console.error("Error creating or checking the database:", error);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// List of channels for the bot to use to watch for messages
module.exports.getListOfChannels = async () => {
  // Checks to make sure database exist
  await setupDatabase();
  // Setup new options for database
  database = new Pool({
    user: settings.database.user,
    password: settings.database.password,
    database: "messages",
    port: 5432,
    max: 20, // set pool max size to 20
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
  });

  // Variable to hold results
  let channelsResult = [];

  // Starts connection to database
  const client = await database.connect();

  // Tries to find tables
  try {
    // Attempts query search
    try {
      const result = await client.query(`
           SELECT table_name
           FROM information_schema.tables
           WHERE table_schema = 'public';
         `);
      // if results found adds results to array
      if (result) {
        result.rows.forEach((chat) => {
          channelsResult.push(chat.table_name);
        });
      }
    } catch (error) {
      console.log(error);
    }
  } finally {
    // Release DB connection
    client.release();
  }

  // If no tables found then will return default channel from settings
  if (channelsResult.length === 0) {
    channelsResult = settings.defaultChannel;
    postChannel("#" + settings.defaultChannel[0]);
  }

  return channelsResult;
};
