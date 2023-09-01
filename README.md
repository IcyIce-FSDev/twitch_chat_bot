# Bot Information

## Setup

- Will need to create settings.json file in directory with bot.js and use following template.

`{
  "twitch": {
    "username": "Twitch Bot Name",
    "password": "oauth:key"
  },
  "database": {
    "user": "username",
    "password": "password"
  },
  "defaultChannel": ["Channel for bot to watch initially"],
  "openai": ""
}`

## Current function

- Bot will receive and record data from Twitch chats. It will store them in a folder base storage system.

## Require Modules to use

## Commands list

- `!addStreamer (streamer)`

  - Adds a channel for the bot to join. Creates table in database.

- `!advice`

  - returns a random piece of advice

  ### Not yet implemented in main function

  - `!advice on | off` -

    - Enable or disable bot for channel

## Utilities

- Saves every message in messages DB in table named after streamer, then by date message received.

  - Filters out bot messages

- Debug log in text files

## Current goals/roadmap

- Automation

  - Setup up so sql will setup settings database automatically

- `!advice`

  - This feature gets a random slip of advice from https://api.adviceslip.com/advice

  - Develop `!advice` further to include below features

    - `!advice on | off`

      - Enables or disables the command to in individuals chat

    - `!advice random on | off`

      - Allows for bot to random trigger messages in the channel

- `!rank`

  - Returns the rank of the stream if they set Battletag

  - `!rank (BattleTag#)*`

    - This feature returns the current ranks of provided user

- Develop function where a user mentions bot and the bot will take the message and feed through chatGPT and respond with the data from chatGPT.
