"use strict"; // don't allow hoisting or undeclared variables

function updatePage() {
    let main = document.getElementById("Main");

    if (main != null) {
        let para = document.createElement("P");
        para.innerHTML = "Mars Voyager on Creativity and DHTML";
        main.appendChild(para);
    }
}