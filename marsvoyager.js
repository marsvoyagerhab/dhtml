"use strict"; // don't allow hoisting or undeclared variables

const DEBUGMAIN = (true && (location.href.indexOf("file:") == 0));

function updatePage() {
    let footer = document.getElementById("Footer");
    let depth = getAttribute(footer, "data-depth", "");
    let topic = getAttribute(footer, "data-topic", null);
    let version = getAttribute(footer, "data-version", null);

    if (DEBUGMAIN) {
        let head = document.getElementsByTagName("head")[0];
        
        // check meta data
        let metas = head.getElementsByTagName("meta");
        for (let i = 0; i < metas.length; i++) {
            let meta = metas[i];
            if ((meta.name == "apple-mobile-web-app-title") && (meta.content.indexOf(topic) < 0)) {
                alert ("<meta>" + meta.name + " = " + meta.content);
            } else if ((meta.name == "application-name") && (meta.content.indexOf(topic) < 0)) {
                alert ("<meta>" + meta.name + " = " + meta.content);
            } else if ((meta.name == "msapplication-config") && (!meta.content.startsWith(depth))) {
                alert ("<meta>" + meta.name + " = " + meta.content);
            }
        }
        /*
        // the hrefs have been resolved to full path
        let links = document.getElementsByTagName("link");
        for (let i = 0; i < links.length; i++) {
            let link = links[i];
            if ((!link.href.startsWith(depth)) && (!link.href.startsWith("http"))) {
                alert ("<link>" + link.rel + " " + link.href);
            }
        }
        */
    }
    
    let main = document.getElementById("Main");
    if (main != null) {
        let para = document.createElement("P");
        para.innerHTML = "";
        main.appendChild(para);
    }
    
    if (footer != null) {
        let div = document.createElement("DIV");
        
        let title = "Mars Voyager on Creativity and DHTML";
        
        let txt = "";
        div.appendChild(document.createElement("HR"));
        
        let span = document.createElement("SPAN");
        if ((depth != null) && (depth != "")) {
            let a = document.createElement("A");
            a.href = depth + "index.html";
            a.innerHTML = title;
            span.appendChild(a);
        } else {
            txt = txt + title;
        }
        if (((topic != null) && (topic != "")) || ((version != null) && (version != ""))) {
            txt = txt + " : ";
        }
        if ((topic != null) && (topic != "")) {
            txt = txt + topic;
        }
        if ((version != null) && (version != "")) {
            if ((topic != null) && (topic != "")) {
                txt = txt + ", ";
            }
            txt = txt + "version " + version;
        }
        span.appendChild(document.createTextNode(txt));
        div.appendChild(span);
        
        div.appendChild(document.createElement("BR"));
        
        let a = document.createElement("A");
        a.href = "https://github.com/marsvoyagerhab/dhtml/issues";
        a.innerHTML = "Submit an issue via GitHub";
        div.appendChild(a);
        
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
