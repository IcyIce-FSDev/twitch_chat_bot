# Bot Information

# Undergoing revamp

- Revamp current storage system.
- Roadmap listed below

  ### Step 1

  - Setup so bot initializes with default streamer channel and twitch auth info located in settings.json.
    - Will setup messages database for future initializations to get list of channels from.

  ### Step 2

  - Setup command `!addStreamer (streamer)` to add streamer to list for bot to join their chat.
    - Sets up the table to be named after the streamers name.

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

## Utilities

- Saves every message in messages DB in table named after streamer, then by date message received.
  - Filters out bot messages

## Current goals/roadmap

- `!dice`

  - Does a D20 roll and returns with users results

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
