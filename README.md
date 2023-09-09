# Bot Information

## Setup

- To start make sure node.js and postgres database is installed
- Then run node setup.js
  - This will ensure neccessary dependecies are installed
  - This will then enter a guided process to create settings.json
  - Once done will then create databases and tables as needed

## Current function

- Bot will receive and record data from Twitch chats, will also respond to chat commands as listed below

## Require Modules to use

["pg-pool", "pg", "tmi.js"]

## Commands list

- `!addStreamer (streamer)`

  - Adds a channel for the bot to join. Creates table in database.

- `!advice`

  - returns a random piece of advice

  - `!advice on | off` -

    - Enable or disable bot for channel

- `!owrank`

  - Returns the rank of the stream if they set Battletag

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

- Develop function where a user mentions bot and the bot will take the message and feed through chatGPT and respond with the data from chatGPT.
