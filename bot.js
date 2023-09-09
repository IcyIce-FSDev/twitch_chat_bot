// Initialize TMI.JS
const tmi = require("tmi.js");
// Retrieve settings for bot
const settings = require("./settings.json");
// SQL utilities for bot to run
const {
  postMessage,
  postChannel,
  getListOfChannels,
} = require("./utilities/sql/bot.messages");

const { appendToLogFile } = require("./utilities/Logging/bot.logging");
const { handleCommands } = require("./commands/commandHandler");

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
    handleCommands(client, target, msg, context);

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

  // Saves message to database
  postMessage({ target, user, msg, context });
}

// Event Handler called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  const template = `* Connected to ${addr}:${port}`;
  appendToLogFile(template);
  console.log(template);
}

// What happens when disconnected
function onDisconnectHandler(addr, port) {
  const template = `* Disconnected from ${addr}:${port}`;
  appendToLogFile(template);
}

// What happens when it's reconnecting
function onReconnectHandler() {
  const template = `* Attempting to reconnect to twitch`;
  appendToLogFile(template);
}

// What happens when status ping is sent
function pingSentHandler(latency) {
  const template = `* Pulse Check, latency: ${latency}ms`;
  appendToLogFile(template);
}
