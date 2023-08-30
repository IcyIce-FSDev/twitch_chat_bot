# Bot Information

## Setup

- Will need to create two json files in root dir.
  - channels.json
    <div style="border: 1px solid #ccc; padding: 10px; background-color: #f4f4f4; margin: 0 auto;">
    {
    "channels": ["channel name", "channel name", "channel name"] // multiples can be included
    }
    </div>
  - keys.json
    <div style="border: 1px solid #ccc; padding: 10px; background-color: #f4f4f4; margin: 0 auto;">
    {
    "username": "TWICH_USERNAME",
    "password": "oauth:key",
    "openai": "key"
    }
    </div>

## Current function

- Bot will receive and record data from Twitch chats. It will store them in a folder base storage system. Will have limited number of commands and possibly the ability to respond by chatGPT

## Commands list

- `!dice`

  - Does a D20 roll and returns with users results

- `!advice`

  - This feature gets a random slip of advice from https://api.adviceslip.com/advice

## Utilities

- Saves every message in channel folder then by date message received
  - Filters out bot messages

## Current goals/roadmap

- Develop function where a user mentions bot and the bot will take the message and feed through chatGPT and respond with the data from chatGPT.
