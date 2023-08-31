const fs = require("fs");
const path = require("path");

// Get the path to the directory containing the script
const scriptDir = path.dirname(__filename);

// Calculate the path to the settings.json file located in the parent directory
const parentDir = path.dirname(scriptDir);
const channelsPath = path.join(parentDir, "../channels.json");
const settingsPath = path.join(parentDir, "../utilities/Settings/settings");
const settings = {
  openai: false,
  battletag: "",
};

// Function to retrieve all channels in settings.json
const getChannelsFromSettings = (channelsPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(channelsPath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading settings.json:", err);
        reject(err);
        return;
      }

      try {
        const settings = JSON.parse(data);
        if (Array.isArray(settings.channels)) {
          resolve(settings.channels);
        } else {
          console.log("Channels array not found in settings.json");
          reject("Channels array not found");
        }
      } catch (parseError) {
        console.error("Error parsing settings.json:", parseError);
        reject(parseError);
      }
    });
  });
};

// Function to retrieve all settings from /settings
function getFileNamesInSettingsFolder(settingsPath) {
  try {
    const files = fs.readdirSync(settingsPath);
    const fileNamesWithoutExtension = files
      .filter((file) => fs.statSync(path.join(settingsPath, file)).isFile())
      .map((file) => path.parse(file).name);

    return fileNamesWithoutExtension;
  } catch (error) {
    console.error(`Error getting file names: ${error.message}`);
    return [];
  }
}

// Function to filter out unique strings from the arrays
function getUniqueItems(array1, array2) {
  const uniqueItems = [];

  for (const item of array1) {
    if (!array2.includes(item) && !uniqueItems.includes(item)) {
      uniqueItems.push(item);
    }
  }

  for (const item of array2) {
    if (!array1.includes(item) && !uniqueItems.includes(item)) {
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
}

// Function to create channel settings in ./settings/channel.json
function createSettingsFile(settingsPath, channelKey, settings) {
  const folderPath = settingsPath;
  const filePath = path.join(folderPath, `${channelKey}.json`);

  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error(`Error creating settings file: ${error.message}`);
  }
}

module.exports.processChannels = async () => {
  // Start list of channels from settings.json
  let listOfChannels = await getChannelsFromSettings(channelsPath);
  let listOfSettings = getFileNamesInSettingsFolder(settingsPath);

  // Start empty list of channels there is no settings for
  let channelsNeedSettings = getUniqueItems(listOfChannels, listOfSettings);

  channelsNeedSettings.forEach(async (channel) => {
    const channelKey = channel;

    const timeout = Math.floor(Math.random() * (500 - 50 + 1)) + 50;

    setTimeout(() => {
      createSettingsFile(settingsPath, channelKey, settings);
    }, timeout);
  });
};
