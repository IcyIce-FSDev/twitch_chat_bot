const tmi = require("tmi.js");
const keys = require("./keys.json");
const channels = require("./channels.json");
const { rollDice } = require("./commands/randomCommands");
// const { sendReply } = require("./commands/chatGPT");
const { saveMsg } = require("./utilities/Messages/saveMsg");
const { processChannels } = require("./utilities/Settings/channelSettings");
const { useAdvice } = require("./commands/advice");
const { overwatch } = require("./commands/overwatch");

// Opts for the client
const opts = {
  options: { debug: false },
  identity: keys,
  channels: channels.channels,
  connction: {
    reconnect: false,
  },
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  // Ignore messages from the bot
  if (self) {
    return;
  }

  const user = context.username;

  // ignore messages from other bots
  if (user == "nightbot" || user == "streamelements" || user == "wizebot") {
    return;
  }

  // Logs all messages it sees
  if (!msg.startsWith("!")) {
    saveMsg(target, user, msg);
  }

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName.startsWith("!")) {
    // Random D20 roll
    if (commandName === "!dice") {
      rollDice(client, target);
      return;
    }
  }

  // If
  if (msg.startsWith("!advice")) {
    useAdvice(target, context, msg, client);
    return;
  }

  if (msg.startsWith("!rank")) {
    overwatch(target, context, msg, client);
    return;
  }

  // If bot is mentioned will take the message and run through ChatGPT for reply
  if (msg.includes("@monkaydonkay")) {
    // sendReply(client, target, msg);

    if (msg.includes("money")) {
      client.say(target, `I am not equiped to help with your finances`);
      return;
    }

    if (msg.includes("hate")) {
      client.say(target, `I am sorry you feel that way`);
      return;
    }

    if (msg.includes("hi")) {
      client.say(target, `Go fuck off`);
      return;
    }

    if (msg.includes("ily")) {
      client.say(
        target,
        `I am not ready for a committed relationship yet. I am still developing. Ha. Ha. Coding jokes.`
      );
      return;
    }

    client.say(target, `I am not equipped to help you yet`);
    return;
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);

  processChannels();
}
