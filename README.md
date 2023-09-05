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

- Automation

  - Setup up so sql will setup settings database automatically

## Require Modules to use

## Commands list

- `!addStreamer (streamer)`

  - Adds a channel for the bot to join. Creates table in database.

- `!advice`

  - returns a random piece of advice

  - `!advice on | off` -

    - Enable or disable bot for channel

- `!owrank Help`

  - Returns how to use !owrank

- `!owrank (pc/psn/xbl/switch) (us/eu/asia) (battletag)`

  - This feature returns the current ranks of provided user
  - To use do "!owrank (pc/psn/xbl/switch) (us/eu/asia) (battletag)" all without the parentheses

- `!realOW BattleTag`

  - Returns a randomly generated ranks

## Utilities

- Saves every message in messages DB in table named after streamer, then by date message received.

  - Filters out bot messages

- Debug log in text files

## Current goals/roadmap

- `!owrank`

  - Returns the rank of the stream if they set Battletag

- Develop function where a user mentions bot and the bot will take the message and feed through chatGPT and respond with the data from chatGPT.
