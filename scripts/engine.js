import { loadStory } from './loader.js';
import { state } from './state.js';
import { printText, clearTerminal } from './renderer.js';

// Configuration maps for Aliases and Fuzzy Spellcheck Matching
const ALIASES = {
    "n": "north", "s": "south", "e": "east", "w": "west",
    "get": "take", "pickup": "take", "i": "inventory", "look": "inspect"
};

const VALID_DIRECTIONS = ["north", "south", "east", "west", "up", "down"];

const inputElement = document.getElementById("command-input");

// Simple string similarity matching to suggest correct path directions
function handleTypoCheck(noun) {
    if (!noun) return null;
    for (let target of VALID_DIRECTIONS) {
        if (target.startsWith(noun) || noun.startsWith(target.substring(0, 3))) {
            return target;
        }
    }
    return null;
}

function lookRoom() {
    const room = state.getCurrentRoomObj();
    printText(room.desc);
    
    if (room.items && room.items.length > 0) {
        printText(`You spot the following items: ${room.items.join(', ')}`);
    }
    
    const availableExits = Object.keys(room.exits || {});
    if (availableExits.length > 0) {
        printText(`Obvious exits: ${availableExits.join(', ')}`);
    }
}

function parseAndExecute(inputStr) {
    const cleanInput = inputStr.trim().toLowerCase();
    if (!cleanInput) return;

    printText(inputStr, true);

    const tokens = cleanInput.split(/\s+/);
    let verb = tokens[0];
    let noun = tokens.slice(1).join('-'); // Handle multi-word items cleanly via hyphens

    // Resolve Verb Aliases
    if (ALIASES[verb]) {
        verb = ALIASES[verb];
    }

    const currentRoomObj = state.getCurrentRoomObj();

    switch (verb) {
        case "go":
            if (!noun) {
                printText("Go where?");
                break;
            }
            // Check for directional aliases inside noun parameters
            if (ALIASES[noun]) noun = ALIASES[noun];

            if (currentRoomObj.exits && currentRoomObj.exits[noun]) {
                state.moveTo(currentRoomObj.exits[noun]);
                lookRoom();
            } else {
                const suggestion = handleTypoCheck(noun);
                if (suggestion && currentRoomObj.exits[suggestion]) {
                    printText(`I don't see that exit. Did you mean: go ${suggestion}?`);
                } else {
                    printText("You cannot go that way.");
                }
            }
            break;

        case "take":
            if (!noun) {
                printText("Take what?");
                break;
            }
            if (currentRoomObj.items && currentRoomObj.items.includes(noun)) {
                currentRoomObj.items = currentRoomObj.items.filter(item => item !== noun);
                state.inventory.push(noun);
                printText(`You picked up the ${noun}.`);
            } else {
                printText("I don't see that here.");
            }
            break;

        case "drop":
            if (!noun) {
                printText("Drop what?");
                break;
            }
            if (state.inventory.includes(noun)) {
                state.inventory = state.inventory.filter(item => item !== noun);
                if (!currentRoomObj.items) currentRoomObj.items = [];
                currentRoomObj.items.push(noun);
                printText(`You dropped the ${noun} onto the ground.`);
            } else {
                printText("You aren't carrying that item.");
            }
            break;

        case "inspect":
            if (!noun) {
                lookRoom();
            } else if (state.inventory.includes(noun) || (currentRoomObj.items && currentRoomObj.items.includes(noun))) {
                printText(`It looks like a typical ${noun}.`);
            } else {
                printText("I don't see that asset anywhere nearby.");
            }
            break;

        case "inventory":
            if (state.inventory.length === 0) {
                printText("Your inventory is currently empty.");
            } else {
                printText(`Inventory contents: ${state.inventory.join(', ')}`);
            }
            break;

        case "use":
            if (!noun) {
                printText("Use what?");
                break;
            }
            if (!state.inventory.includes(noun)) {
                printText(`You do not possess a ${noun}.`);
                break;
            }
            
            // Check room dictionary mutations
            if (currentRoomObj.useActions && currentRoomObj.useActions[noun]) {
                const action = currentRoomObj.useActions[noun];
                printText(action.msg);
                
                if (action.addExit) {
                    Object.assign(currentRoomObj.exits, action.addExit);
                }
                // Strip used key items out if desired (optional state management)
            } else {
                printText(`Using the ${noun} does nothing notable here.`);
            }
            break;

        case "clear":
            clearTerminal();
            break;

        default:
            printText("Unknown command action string structure. Try: go, take, drop, inspect, use, or inventory.");
    }

    // Check Ending States
    if (state.getCurrentRoomObj().ending) {
        printText("\n--- GAME OVER ---");
        inputElement.disabled = true;
        inputElement.style.display = "none";
    }
}

// Global Document Initializer Hook Execution Setup
async function initGame() {
    const story = await loadStory('./stories/dungeon.json');
    if (!story) {
        printText("Critical Engine Crash: Failure processing configuration asset data map schema structure.");
        return;
    }
    
    state.init(story);
    lookRoom();

    inputElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const command = inputElement.value;
            inputElement.value = "";
            parseAndExecute(command);
        }
    });

    // Enforce permanent focus on terminal prompt
    document.body.addEventListener("click", () => {
        if (!inputElement.disabled) inputElement.focus();
    });
}

initGame();