// Import
import Clipboard from "./dist/Clipboard.js";

// Example usage
document.getElementById("copy").addEventListener('click', () => Clipboard.copy("hello, world!"));

document.getElementById("paste").addEventListener('click', () => Clipboard.paste(window.alert));

document.getElementById("pasteItems").addEventListener('click', () => Clipboard.pasteItems(console.log));