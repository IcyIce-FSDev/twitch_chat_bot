var Pool = require("pg-pool");
const settings = require("../../settings.json");

// Worker pool for DB
var database = new Pool({
  user: settings.database.user,
  password: settings.database.password,
  database: "overwatch",
  port: 5432,
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

module.exports = {
  postOWJson: async function (btag, jsonResp) {
    const tableName = btag.replace(/#/g, "_");
    // should be true or false
    const tableCheck = await createOrGetTable(tableName);

    if (tableCheck) {
      postOWresp(tableName, jsonResp);
    }

    return;
  },
};

// This is used to check if table is there, if not will create one
async function createOrGetTable(tableName) {
  const client = await database.connect();

  try {
    // Check if the table exists by querying the information_schema
    const checkTableQuery = {
      text: "SELECT table_name FROM information_schema.tables WHERE table_name = $1",
      values: [tableName],
    };

    const result = await client.query(checkTableQuery);

    if (result.rows.length === 0) {
      // Table does not exist, create it
      const createTableQuery = {
        text: `
          CREATE TABLE ${tableName} (
            id SERIAL PRIMARY KEY,
            time TIMESTAMP,
            endorLvl INT,
            compGames INT,
            compWins INT,
            qpGames INT,
            qpWins INT,
            ratings JSON
          )
        `,
      };

      try {
        await client.query(createTableQuery);
      } catch (error) {
        // console.log(error);
      }
    } else {
      return true;
    }

    return true; // Return the table name
  } finally {
    client.release(); // Release the database client
  }
}

// This is used to post the settings from searching OW user
async function postOWresp(tableName, jsonResp) {
  const endorseLvl = jsonResp.endorsement;
  const compGames = jsonResp.competitiveStats.games.played;
  const compWins = jsonResp.competitiveStats.games.won;
  const qpGames = jsonResp.quickPlayStats.games.played;
  const qpWins = jsonResp.quickPlayStats.games.won;
  const extractedRatings = jsonResp.ratings.map((rating) => {
    return {
      group: rating.group,
      tier: rating.tier,
      role: rating.role,
    };
  });

  // Starts connection to database
  // This is to save the jsonResp
  const client = await database.connect();

  const query = {
    text: `
          INSERT INTO ${tableName} (
            time,
            endorLvl,
            compGames,
            compWins,
            qpGames,
            qpWins,
            ratings
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
    values: [
      new Date(), // Assuming you want the current timestamp
      endorseLvl,
      compGames,
      compWins,
      qpGames,
      qpWins,
      JSON.stringify(extractedRatings),
    ],
  };

  // Execute the query and handle any errors
  try {
    await client.query(query);
  } finally {
    client.release();
  }
}
