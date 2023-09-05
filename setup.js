// This file will be used to automate the setup of the databases to allow for easier installation and use
// Will need to check if the databases overwatch, messages, and settings are created.
// If any is missing will create it with the streamers name loaded as a table
// If databases already exist will alert user
const fs = require("fs");
const readline = require("readline");
const Pool = require("pg-pool"); // Import pg-pool
const { execSync } = require("child_process");

try {
  console.log(`Installing needed dependencies`);
  // Function to install needed dependencies
  // Array of dependencies to install
  const dependenciesToInstall = ["pg-pool", "pg", "tmi.js"];

  // Install dependencies synchronously
  execSync(`npm install ${dependenciesToInstall.join(" ")}`);

  console.log(`Dependencies installed: ${dependenciesToInstall.join(", ")}`);
} catch (error) {
  console.error(`Error installing dependencies: ${error.message}`);
  process.exit(1); // Exit the process if there's an error
}

// Continue with the rest of your code
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt for user input
rl.question("Enter your Twitch username: ", (twitchUsername) => {
  rl.question(
    "Enter your Twitch password (OAuth token): ",
    (twitchPassword) => {
      rl.question("Enter your PostgreSQL database username: ", (dbUser) => {
        rl.question(
          "Enter your PostgreSQL database password: ",
          (dbPassword) => {
            rl.question(
              "Enter your default channel (comma-separated if multiple): ",
              (defaultChannel) => {
                rl.close();

                // Create the settings object
                const settings = {
                  twitch: {
                    username: twitchUsername,
                    password: twitchPassword,
                  },
                  database: {
                    user: dbUser,
                    password: dbPassword,
                  },
                  defaultChannel: defaultChannel
                    .split(",")
                    .map((channel) => channel.trim()),
                };

                // Write the settings to settings.json
                fs.writeFileSync(
                  "settings.json",
                  JSON.stringify(settings, null, 2)
                );

                console.log("settings.json file created with blank values.");

                // Run the database and table setup
                createDatabases();
              }
            );
          }
        );
      });
    }
  );
});

// Function to create the default table
async function createTable(string, tableName) {
  // Read settings from settings.json
  const settings = JSON.parse(fs.readFileSync("settings.json", "utf8"));

  // DB connection
  const database = new Pool({
    user: settings.database.user,
    password: settings.database.password,
    port: 5432,
    database: string,
    max: 20,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
    maxUses: 7500,
  });

  const client = await database.connect();

  switch (string) {
    case "messages":
      // Create a table in the "messages" database named after defaultChannel
      const defaultChannelTableMessagesQuery = `
          CREATE TABLE IF NOT EXISTS ${tableName} (
            id SERIAL PRIMARY KEY,
            time TIMESTAMPTZ NOT NULL,
            username VARCHAR NOT NULL,
            message VARCHAR NOT NULL,
            info JSON NOT NULL
          );
        `;

      try {
        await client.query(defaultChannelTableMessagesQuery);
      } catch (error) {
        console.log(error);
      } finally {
        // Release the client back to the pool
        client.release();
        // Close the database pool
        database.end();
      }
      break;

    case "overwatch":
      const defaultChannelTableOWQuery = `
          CREATE TABLE IF NOT EXISTS ${tableName} (
            time TIMESTAMPTZ NOT NULL,
            endorLvl INTEGER NOT NULL,
            compGames INTEGER NOT NULL,
            compWins INTEGER NOT NULL,
            compLose INTEGER NOT NULL,
            qpGames INTEGER NOT NULL,
            qpWins INTEGER NOT NULL,
            qpLose INTEGER NOT NULL,
            ratings JSON NOT NULL
          );
        `;

      try {
        await client.query(defaultChannelTableOWQuery);
      } catch (error) {
        console.log(error);
      } finally {
        // Release the client back to the pool
        client.release();
        // Close the database pool
        database.end();
      }
      break;

    case "settings":
      const defaultChannelTableSettingsQuery = `
          CREATE TABLE IF NOT EXISTS ${tableName} (
            id SERIAL PRIMARY KEY,
            advice JSON
          );
        `;

      try {
        await client.query(defaultChannelTableSettingsQuery);
      } catch (error) {
        console.log(error);
      } finally {
        // Release the client back to the pool
        client.release();
        // Close the database pool
        database.end();
      }

      break;
    default:
      break;
  }
}

// Function to create the databases
async function createDatabases() {
  // Read settings from settings.json
  const settings = JSON.parse(fs.readFileSync("settings.json", "utf8"));

  // Initialize the database connection pool
  const database = new Pool({
    user: settings.database.user,
    password: settings.database.password,
    port: 5432,
    max: 20,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
    maxUses: 7500,
  });

  // Connect to the database
  const client = await database.connect();

  try {
    // Create the "messages" database
    try {
      await client.query("CREATE DATABASE messages");
      console.log('Database "messages" created.');
      await createTable("messages", settings.defaultChannel);
    } catch (error) {
      console.log(error);
    }

    // Create the "overwatch" database
    try {
      await client.query("CREATE DATABASE overwatch");
      console.log('Database "overwatch" created.');
      await createTable("overwatch", "placeholder_1234");
    } catch (error) {
      console.log(error);
    }

    // Create the "settings" database
    try {
      await client.query("CREATE DATABASE settings");
      console.log('Database "settings" created');
      await createTable("settings", settings.defaultChannel);
    } catch (error) {
      console.log(error);
    }

    //
  } catch (error) {
    console.error("Error creating databases and tables:", error);
  } finally {
    // Release the client back to the pool
    client.release();

    // Close the database pool
    database.end();
  }
}
