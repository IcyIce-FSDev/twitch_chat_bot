const { postOWJson } = require("../../utilities/sql/bot.overwatch");
const { funnyOW } = require("./funny");
const { getStreamerBTag } = require("../../utilities/sql/bot.settings");

module.exports.overwatch = async (package) => {
  const { client, target, msg, context } = package;

  // Funny troll
  if (msg.startsWith("!realOW")) {
    const formatMessage = funnyOW(msg);
    client.say(target, `${formatMessage}`);
    return;
  }

  // Start of looking up an OW rank
  if (msg.startsWith("!owrank")) {
    // Help for the bot commands
    if (msg == "!owrank help") {
      client.say(
        target,
        `@${context.username} To use the look up feature, please do "!owrank (pc/psn/xbl/switch) (us/eu/asia) (battletag)" all without the parentheses`
      );
      return;
    }

    // If reached here, searching for player info.
    // Parses the message to get format data
    const regex = /^!owrank\s+(\S+)\s+(\S+)\s+([^\s]+)/;
    const match = msg.match(regex);

    if (match) {
      const playerInfoForSearch = parsePlayerInfo(msg);

      // Gets the OW ranks return as string formated to send
      const ranksStatment = await getOWRank(playerInfoForSearch);

      client.say(target, ranksStatment);
      return;
    }

    // No other commands recognized, returns Streamers rank
    const streamerOWSettings = await getStreamerBTag(target);

    const { battletag, platform, region } = streamerOWSettings;

    const battleTag = battletag.replace("#", "-");

    const playerInfoForSearch = { platform, region, battleTag };

    const ranksStatment = await getOWRank(playerInfoForSearch);

    client.say(target, ranksStatment);

    return;
  }

  return;
};

function parsePlayerInfo(inputString) {
  const regex = /^!owrank\s+(\S+)\s+(\S+)\s+([^\s]+)/;
  const match = inputString.match(regex);

  if (!match) {
    return null; // Invalid format
  }

  const platform = match[1].trim(); // "pc/psn/xbl/switch"
  const region = match[2].trim(); // "us/eu/asia"
  let battleTag = match[3].trim(); // "battletag#1234"

  // Replace '#' with '-'
  battleTag = battleTag.replace("#", "-");

  return { platform, region, battleTag };
}

async function getOWRank(playerInfoForSearch) {
  const { platform, region, battleTag } = playerInfoForSearch;
  const urlToFetch = `https://ow-api.com/v1/stats/${platform}/${region}/${battleTag}/profile`;

  const response = await fetch(urlToFetch);
  const jsonResp = await response.json();

  const btag = battleTag.replace("-", "#");

  const { private, ratings } = jsonResp;

  // Starts construction to return ranks
  let tank = `Tank: unranked`;
  let offense = `Offense: unranked`;
  let support = `Support: unranked`;

  // If profile is private returns string saying such
  if (private === true) {
    return `Sorry the profile is private, please tell them to change it. Changes can take few hours to reflect on Blizzards side`;
  }

  // If profile has no ratings will return such
  if (ratings === null) {
    return `Sorry they don't have any ranks in OW2 or profile doesn't exist`;
  }

  await postOWJson(btag, jsonResp);

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
    btag + " ranks are " + tank + " | " + offense + " | " + support;

  return statement;
}
