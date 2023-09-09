var Pool = require("pg-pool");
const settings = require("../../settings.json");

// Worker pool for DB
var database = new Pool({
  user: settings.database.user,
  password: settings.database.password,
  database: "settings",
  port: 5432,
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

// List of channels for the bot to use to watch for messages
module.exports = {
  getStreamerBTag: async (target) => {
    // Starts connection to database
    const client = await database.connect();
    const tableName = removeHashFromString(target);

    // Tries to find tables
    try {
      // Attempts query search
      try {
        const result = await client.query(`
             SELECT owrank
             FROM ${tableName}
             WHERE id = 1;
           `);

        if (result.rowCount > 0) {
          return result.rows[0].owrank;
        }

        if (result.rowCount == 0) {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    } finally {
      // Release DB connection
      client.release();
    }
  },
  // Function to turn on | off bot. Will create table for streamer if none found
  postPowerMode: async (setting, target) => {
    const streamerName = removeHashFromString(target);

    const table = await tableCheck(streamerName);

    if (table) {
      return updatePowerMode(streamerName, setting);
    }
  },
  // Function to get power state. Will create table for streamer if none found
  getPowerMode: async (target) => {
    const streamerName = removeHashFromString(target);

    await tableCheck(streamerName);

    return await checkPowerMode(streamerName);
  },
};

// function to remove # from target
const removeHashFromString = function (str) {
  return str.replace("#", "");
};

// Fucntion to create table to hold settings
async function tableCheck(streamerName) {
  const client = await database.connect();

  try {
    const query = {
      text: `CREATE TABLE ${streamerName} (
            id SERIAL PRIMARY KEY,
            advice JSON,
            owrank JSON
        );`,
      // Use values if using code like INSERT INTO ${chatName} (time, username, message, info) VALUES ($1, $2, $3, $4)
      values: [],
    };

    try {
      await client.query(query);

      return true;
    } catch (error) {
      return true;
    }
    // Goes to end of code
  } finally {
    // Release DB connection
    client.release();
  }
}

// Function to update or create the json data for advice settings
async function updatePowerMode(streamerName, setting) {
  const client = await database.connect();

  const opts = {
    power: setting ? setting : "off",
    timer: {
      type: "messages", // Can be messages or time
      cooldown: "0", // If messages will be counter, if time will be how long til next advice
      target: "", // How many messages or when last time timer was zero
      cdType: "", // Setting for random or static counter/timer
      min: "", // If random selected will have minimum number of messages or mins for cooldown
      max: "", //  If random selected will have maximum number of messages or mins for cooldown
    },
  };

  try {
    const query = {
      text: `
      INSERT INTO ${streamerName} (id, advice)
      VALUES (1, $1)
      ON CONFLICT (id)
      DO UPDATE
      SET advice = $1
      RETURNING *
    `,
      values: [opts],
    };

    try {
      const resp = await client.query(query);

      return resp.rows[0].advice.power;
    } catch (error) {
      console.log(error);
    }
  } finally {
    // Release DB connection
    client.release();
  }
}

// Function to get the power mode setting for advice settings
async function checkPowerMode(streamerName) {
  const client = await database.connect();

  try {
    const query = {
      text: `
    SELECT advice->>'power' AS power_value
    FROM ${streamerName}
    WHERE id = 1;
    `,
    };

    try {
      const resp = await client.query(query);

      if (resp.rowCount > 0) {
        return resp.rows[0].power_value;
      }

      if (resp.rowCount == 0) {
        return "off";
      }
    } catch (error) {
      console.log(error);
    }
  } finally {
  }
}
