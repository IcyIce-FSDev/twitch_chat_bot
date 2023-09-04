const { postChannel } = require("../utilities/sql/bot.messages");
const { adivce } = require("./Advice/advice");

module.exports.handleCommands = async (client, target, msg, context) => {
  if (msg.startsWith("!advice")) {
    const package = { target, context, msg, client };
    adivce(package);
    return;
  }

  if (msg.startsWith("!portfolio") && target == "#monkayshrek") {
    client.say(target, `https://icy-ice-fs-dev.vercel.app`);
    return;
  }

  if (msg.startsWith("!github") && target == "#monkayshrek") {
    client.say(target, `https://github.com/IcyIce-FSDev`);
    return;
  }

  return;
};
