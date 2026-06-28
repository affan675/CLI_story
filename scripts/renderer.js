const outputContainer = document.getElementById("output");

export function printText(text, isCommand = false) {
    const paragraph = document.createElement("p");
    paragraph.textContent = isCommand ? `> ${text}` : text;
    
    if (isCommand) {
        paragraph.style.color = "#ffffff";
    }
    
    outputContainer.appendChild(paragraph);
    outputContainer.scrollTop = outputContainer.scrollHeight;
}

export function clearTerminal() {
    outputContainer.innerHTML = "";
}