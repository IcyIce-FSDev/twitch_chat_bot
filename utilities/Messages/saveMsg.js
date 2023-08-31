const fs = require("fs").promises;
const path = require("path");

const TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

module.exports = {
  saveMsg: async (target, user, msg) => {
    try {
      const date = new Date();
      // Get YYYY-MM-DD format
      const formattedDate = date
        .toLocaleDateString("en-US")
        .split("/")
        .join("-");
      // Get hh:mm format
      const formattedTime = TIME_FORMAT.format(date);

      // Remove '#' from the start of target
      const sanitizedTarget = target.replace(/^#/, "");

      const folderPath = path.join(__dirname, "messages", sanitizedTarget);
      const filePath = path.join(folderPath, `${formattedDate}.txt`);
      // Create folder if it doesn't exist
      await fs.mkdir(folderPath, { recursive: true });
      await fs.appendFile(
        filePath,
        `[${formattedTime}] - User: ${user} - ${msg}\n`
      );
    } catch (error) {
      console.error("Error saving message:", error);
    }
  },
};
