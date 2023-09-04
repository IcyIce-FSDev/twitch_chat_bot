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

module.exports = {
  postOWJson: async function () {
    // Starts connection to database
    const client = await database.connect();
    const query = {
      text: `INSERT INTO ${channelName} (time,username,message,info) VALUES ($1, $2, $3, $4)`,
      values: [timestamp, username, message, JSON.stringify(msgObj.context)],
    };
  },
};
