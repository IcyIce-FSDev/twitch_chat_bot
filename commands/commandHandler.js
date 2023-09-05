const { adivce } = require("./Advice/advice");
const { overwatch } = require("./Overwatch/overwatch");

module.exports.handleCommands = async (client, target, msg, context) => {
  const package = { client, target, msg, context };

  if (msg.startsWith("!advice")) {
    adivce(package);
    return;
  }

  if (msg.startsWith("!ow") || msg.startsWith("!realOW")) {
    overwatch(package);
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
