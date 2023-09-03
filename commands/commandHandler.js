const { getAdivce } = require("./Advice/advice");

module.exports.handleCommands = async (client, target, msg, context) => {
  // Command to add a streamer for the bot to join
  if (msg.startsWith("!addStreamer")) {
    if (user == "monkayshrek") {
      await postChannel(msg, (bot = client), target);

      await client
        .disconnect()
        .then((data) => {
          // data returns [server, port]
          onDisconnectHandler(data[0], data[1]);

          getChannels();
        })
        .catch((err) => {
          // Logging error
          console.log(err);
        });

      await client.connect().catch((err) => {
        // Logging error
        console.log(err);
      });

      return;
    }
    return;
  }

  if (msg.startsWith("!advice")) {
    const package = { target, context, msg, client };
    getAdivce(package);
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
