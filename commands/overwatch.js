const fs = require("fs");
const path = require("path");

// Get the path to the directory containing the script
const scriptDir = path.dirname(__filename);
// Calculate the path to the settings.json file located in the parent directory
const parentDir = path.dirname(scriptDir);

async function getStreamersRanks(target) {
  // Function to get settings from the streamers .json file
  const getStreamSettings = () => {
    const streamer = target.substring(1);

    const filePath = path.join(
      parentDir,
      `/utilities/Settings/settings/${streamer}.json`
    );

    let jsonObject;

    try {
      const jsonString = fs.readFileSync(filePath, "utf8");
      jsonObject = JSON.parse(jsonString);
    } catch (error) {
      console.error("Error reading or parsing the JSON file:", error.message);
      return null;
    }

    const battleTag = jsonObject.battletag;

    if (!battleTag) {
      return false;
    }

    return battleTag;
  };

  const btag = getStreamSettings();

  if (!btag) {
    return `Streamer doesn't have their BattleTag in the settings for the bot`;
  }

  const formatBTag = btag.replace(/#/g, "-");

  const urlToFetch = `https://ow-api.com/v1/stats/pc/us/${formatBTag}/profile`;

  const response = await fetch(urlToFetch);

  const { private, ratings } = await response.json();

  // Starts construction to return ranks
  let tank = `Tank: unranked`;
  let offense = `Offense: unranked`;
  let support = `Support: unranked`;

  // If profile is private returns string saying such
  if (private === true) {
    return `Sorry the streamers profile is private, please tell them to change it. Changes can take few hours to reflect on Blizzards side`;
  }
  // If profile has no ratings will return such
  if (ratings === null) {
    return `Sorry the streamer doesn't have any ranks in OW2`;
  }

  // Reviews each rating object and assigns to appropriate variables
  if (ratings) {
    ratings.map((rank) => {
      switch (rank.role) {
        case "support":
          // Code to execute if value is 1
          // prettier-ignore
          support = `${rank.role.charAt(0).toUpperCase() + rank.role.slice(1)}: ${rank.group} ${rank.tier}`;
          break;
        case "offense":
          // Code to execute if value is 2
          // prettier-ignore
          offense = `${rank.role.charAt(0).toUpperCase() + rank.role.slice(1)}: ${rank.group} ${rank.tier}`;
          break;
        case "tank":
          // Code to execute if value is 3
          // prettier-ignore
          tank = `${rank.role.charAt(0).toUpperCase() + rank.role.slice(1)}: ${rank.group} ${rank.tier}`;
          break;
        default:
        // Code to execute if value doesn't match any case
      }
    });
  }

  // Statement regarding uses ranks
  const statement =
    "The streamers ranks are " + tank + " | " + offense + " | " + support;

  return statement;
}

async function getOWRanks(msg) {
  const endPointIndex = msg.indexOf("*");
  const battleTag = msg.slice(6, endPointIndex);

  const formatBTag = battleTag.replace(/#/g, "-");

  const urlToFetch = `https://ow-api.com/v1/stats/pc/us/${formatBTag}/profile`;

  const response = await fetch(urlToFetch);

  const { private, ratings } = await response.json();

  // If profile is private returns string saying such
  if (private === true) {
    return `Sorry that persons profile is private, please tell them to change it. Changes can take few hours to reflect on Blizzards side`;
  }
  // If profile has no ratings will return such
  if (ratings === null) {
    return `Sorry that person doesn't have any ranks in OW2`;
  }

  // Starts construction to return ranks
  let tank = `Tank: unranked`;
  let offense = `Offense: unranked`;
  let support = `Support: unranked`;

  // Reviews each rating object and assigns to appropriate variables
  if (ratings) {
    ratings.map((rank) => {
      switch (rank.role) {
        case "support":
          // Code to execute if value is 1
          // prettier-ignore
          support = `${rank.role.charAt(0).toUpperCase() + rank.role.slice(1)}: ${rank.group} ${rank.tier}`;
          break;
        case "offense":
          // Code to execute if value is 2
          // prettier-ignore
          offense = `${rank.role.charAt(0).toUpperCase() + rank.role.slice(1)}: ${rank.group} ${rank.tier}`;
          break;
        case "tank":
          // Code to execute if value is 3
          // prettier-ignore
          tank = `${rank.role.charAt(0).toUpperCase() + rank.role.slice(1)}: ${rank.group} ${rank.tier}`;
          break;
        default:
        // Code to execute if value doesn't match any case
      }
    });
  }

  // Statement regarding uses ranks
  const statement =
    battleTag + " ranks are " + tank + " | " + offense + " | " + support;

  return statement;
}

module.exports.overwatch = async (target, context, msg, client) => {
  // Base command to get streamers rank from settings
  if (msg == "!rank") {
    // Placeholder
    const streamerRanks = await getStreamersRanks(target);
    client.say(target, streamerRanks);
    return;
  }

  if (msg.includes("*")) {
    const owStats = await getOWRanks(msg);
    client.say(target, owStats);
    return;
  }
};
