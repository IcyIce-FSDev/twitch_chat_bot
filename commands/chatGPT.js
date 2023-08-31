const tectalicOpenai = require("@tectalic/openai").default;
const keys = require("../keys.json");

// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const OPENAI_API_KEY = keys.openai;

function removeMonkaydonkay(inputString) {
  const searchString = "@monkaydonkay";
  const modifiedString = inputString.replace(searchString, "");
  return modifiedString;
}

module.exports = {
  sendReply: async (client, target, msg) => {
    const formatMsg = removeMonkaydonkay(msg);

    tectalicOpenai(OPENAI_API_KEY)
      .chatCompletions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: formatMsg }],
      })
      .then((response) => {
        console.log(response.data.choices[0].message.content.trim());
      });
  },
};
