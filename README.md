# Text Adventure Engine

A lightweight, modular, terminal-style adventure game engine built with Vanilla JavaScript. 

This engine uses a JSON-driven architecture, allowing you to define complex worlds, items, and room mutations without touching the core logic.

## 🚀 Getting Started

1. **Clone the repository** to your local machine.
2. **Navigate** to the project root folder.
3. **Start the local server** (Python):
```
   python -m http.server 1500
```
Access the game by opening your browser to http://localhost:1500.

## 📁 Project Structure
```
index.html: Main UI template.

styles/terminal.css: Retro CRT terminal aesthetics.

scripts/:

engine.js: Core command parser and game loop.

state.js: Manages player inventory, current room, and game flags.

loader.js: Fetches and validates story JSON files.

renderer.js: Handles DOM updates and terminal output.

stories/: JSON files defining world maps.
```
## 📖 Story Format
Create your own adventures by adding a new JSON file to the stories/ directory. The engine expects this structure:

```
{
  "start": "room_id",
  "rooms": {
    "room_id": {
      "desc": "Room description text.",
      "exits": {"north": "other_room_id"},
      "items": ["item1"],
      "useActions": {
        "item1": {
          "msg": "Action success message.",
          "addExit": {"east": "secret_room"}
        }
      }
    }
  }
}
```
## 🛠 Features
Command Parser: Interprets natural [verb] + [noun] syntax.

Fuzzy Matching: Suggests corrections for mistyped exit directions.

Aliases: Supports shorthand commands (e.g., n for north, i for inventory).

Dynamic Mutations: Use items to unlock new paths or change room descriptions dynamically.

## ⚖️ License
> This project is open-source and free to use for any personal or educational projects.