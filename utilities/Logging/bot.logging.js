const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");

module.exports.appendToLogFile = (text) => {
  // Create the "./logs" folder if it doesn't exist
  const logsFolderPath = "./logs";
  if (!fs.existsSync(logsFolderPath)) {
    fs.mkdirSync(logsFolderPath);
  }

  // Get the current date and format it
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const opts = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };
  const formattedTime = currentDate.toLocaleString("en-US", opts);

  // Define the file path
  const filePath = path.join(logsFolderPath, `${formattedDate}.txt`);

  // Append the text to the file
  fs.appendFile(filePath, `${formattedTime} : ${text}` + "\n", (err) => {
    if (err) {
      console.error("Error appending to log file:", err);
    }
  });
};
