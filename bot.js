// Initialize TMI.JS
const tmi = require("tmi.js");
// Retrieve settings for bot
const settings = require("./settings.json");
// SQL utilities for bot to run
const { getListOfChannels } = require("./utilities/sql/bot.settings");
const { postMessage, postChannel } = require("./utilities/sql/bot.messages");

// Opts for the client
let opts = {
  options: { debug: false },
  identity: settings.twitch,
  channels: [],
  connction: {
    reconnect: false,
  },
};

// Function to check Database for list of channels to join or work off default channel in settings.json
const getChannels = async () => {
  const listOfChannels = await getListOfChannels();
  opts.channels = listOfChannels;
};

// Calls the function to get list of channels
getChannels();

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below), functions pulled from below
// What happens when an chat, action or whisper is done
client.on("message", onMessageHandler);
// What happens when connected
client.on("connected", onConnectedHandler);
// What happens when it's reconnecting
client.on("reconnect", onReconnectHandler);
// What happens when status ping is sent
client.on("pong", pingSentHandler);
// What happens when it's disconnected
client.on("disconnect", onDisconnectHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
async function onMessageHandler(target, context, msg, self) {
  // Ignore messages from the bot
  if (self) {
    return;
  }

  // Gets name of user who sent message
  const user = context.username;

  // ignore messages from other bots
  if (
    user == "nightbot" ||
    user == "streamelements" ||
    user == "wizebot" ||
    user == "pokemoncommunitygame"
  ) {
    return;
  }

  if (msg.startsWith("!")) {
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

    return;
  }

  postMessage({ target, user, msg, context });
}

// Event Handler called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  const time = new Date();
  const template = `[${time}] : * Connected to ${addr}:${port}`;
  console.log(template);
}

// What happens when disconnected
function onDisconnectHandler(addr, port) {
  const time = new Date();
  const template = `[${time}] : * Disconnected from ${addr}:${port}`;
  console.log(template);
}

// What happens when it's reconnecting
function onReconnectHandler() {
  const time = new Date();
  const template = `[${time}] : * Attempting to reconnect to twitch`;
  console.log(template);
}

// What happens when status ping is sent
function pingSentHandler(latency) {
  // filepath for pulse check log
  const time = new Date();
  const template = `[${time}] : * Pulse Check, latency: ${latency}ms`;
  console.log(template);
}
