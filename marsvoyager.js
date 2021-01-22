"use strict"; // don't allow hoisting or undeclared variables

function updatePage() {
    let main = document.getElementById("Main"); // really used as footer

    if (main != null) {
        
        let para = document.createElement("P");
        para.innerHTML = "";
        main.appendChild(para);
    }
    
    
    let footer = document.getElementById("Footer");
    if (footer != null) {
        let div = document.createElement("DIV");
        
        let home = getAttribute(footer, "data-depth", "");
        let topic = getAttribute(footer, "data-topic", null);
        let version = getAttribute(footer, "data-version", null);
        
        let html = "<hr/><a href=\"" + home + "index.html\">Mars Voyager on Creativity and DHTML</a>";
        html = html + ((topic == null) ? "" : " : " + topic);
        html = html + ((version == null) ? "" : ", version " + version);
        html = html + "<br/>";
        html = html + "<a href='https://github.com/marsvoyagerhab/dhtml/issues'>Submit an issue via GitHub</a>";
        
        div.innerHTML = html;
        
        footer.appendChild(div);
    }
    
    function getAttribute(element, name, defaultValue) {
        let value = element.getAttribute(name);
        if (value == null) {
            value = defaultValue;
        }
        return value;
    }
}

/* Queries support */

// https://www.ietf.org/rfc/rfc2396.txt
// query: ";", "/", "?", ":", "@", "&", "=", "+", ",", and "$" are reserved.

// param to start with ? or &
// allow no =, giving boolean value if defaultValue = false
function getQueryValue(param, defaultValue) {
    // new URLSearchParams, no support in IE
    let query = window.location.search; // "?param=value&param2=value2"
    let i = query.indexOf(param);
    let value;
    if (i > -1) {
        let s = query.indexOf("=", i + 1);
        let e = query.indexOf("&", i + 1);
        if (s > -1) {
            if (e > -1) {
                value = query.substring(i + param.length + 1, e);
            } else {
                value = query.substring(i + param.length + 1);
            }
        } else {
            // allow for boolean value true without "="
            if ((defaultValue == false) && (defaultValue != "")) {
                value = true;
            }
        }
    } else {
        value = defaultValue;
    }
    return value;
}
