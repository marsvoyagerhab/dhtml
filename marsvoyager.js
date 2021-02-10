"use strict"; // don't allow hoisting or undeclared variables

function updatePage() {
    const DEBUGMAIN = (true && (location.href.indexOf("file:") == 0));

    const TITLE = "Mars Voyager on Creativity";
    const FOOTER = document.getElementById("Footer");
    
    let depth = getElementAttribute(FOOTER, "data-depth", "");
    let topic = getElementAttribute(FOOTER, "data-topic", null);
    //let version = getElementAttribute(FOOTER, "data-version", null);
    let ownIcons = getElementAttribute(FOOTER, "data-ownicons", false); //  for check of meta tags
    let visitorsId = getElementAttribute(FOOTER, "data-visitors", null);

    if (DEBUGMAIN) {
        const HEAD = document.getElementsByTagName("HEAD")[0];
        
        // check meta data
        let metas = HEAD.getElementsByTagName("META");
        for (let i = 0; i < metas.length; i++) {
            let meta = metas[i];
                        
            if ((meta.name == "title") && (meta.content.indexOf(document.title) < 0)) {
                alert ("<meta>" + meta.name + " = " + meta.content);
            } else if ((meta.name == "apple-mobile-web-app-title") && (meta.content.indexOf(topic) < 0)) {
                alert ("<meta>" + meta.name + " = " + meta.content);
            } else if ((meta.name == "application-name") && (meta.content.indexOf(topic) < 0)) {
                alert ("<meta>" + meta.name + " = " + meta.content);
            } else if ((!ownIcons) && (meta.name == "msapplication-config") && (!meta.content.startsWith(depth))) {
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
        
        // check Console for welformed XML, possibly replace & by &amp; in html
        var xhr = new XMLHttpRequest();
        xhr.open("GET", window.location, true);
        xhr.send();        
    }
    
    if (FOOTER != null) {
        if ((!DEBUGMAIN) && (visitorsId != null)) {
            // size 60%
            let name = "web counter"; // or hit counter
        
            let a = document.createElement("A");
            a.className = "Visitors";
            a.href = "https://www.freecounterstat.com";
            a.title = name;
        
            let img = document.createElement("IMG");
            img.src = "https://counter8.stat.ovh/private/freecounterstat.php?c=" + visitorsId;
            img.title = name;
            img.alt = name;
        
            a.appendChild(img);
            FOOTER.appendChild(document.createTextNode("Visitors: "));
            FOOTER.appendChild(a);
        }
        
        let div = document.createElement("DIV");
        
        div.appendChild(document.createElement("HR"));
        
        let span = document.createElement("SPAN");
        if ((depth != null) && (depth != "")) {
            let a = document.createElement("A");
            a.href = depth + "index.html";
            a.innerHTML = TITLE;
            span.appendChild(a);
        } else {
            span.appendChild(document.createTextNode(TITLE));
        }
        //if (((topic != null) && (topic != "")) || ((version != null) && (version != ""))) {
            span.appendChild(document.createTextNode(" : "));
        //}
        if ((topic != null) && (topic != "")) {
            span.appendChild(document.createTextNode(topic));
        }
        
        //if ((version != null) && (version != "")) {
            let small = document.createElement("SMALL");
            if ((topic != null) && (topic != "")) {
                small.appendChild(document.createTextNode(", "));
            }
            small.appendChild(document.createTextNode(getISODate()));
            span.appendChild(small);
        //}
        div.appendChild(span);
        
        div.appendChild(document.createElement("BR"));
        
        let a = document.createElement("A");
        a.href = "https://github.com/marsvoyagerhab/dhtml/issues";
        a.innerHTML = "Submit an issue via GitHub";
        div.appendChild(a);
        
        FOOTER.appendChild(div);
    }
}

function getElementAttribute(element, name, defaultValue) {
    let value = element.getAttribute(name);
    if (value == null) {
        value = defaultValue;
    }
    return value;
}

function getISODate() {
    if (!Date.prototype.toISOString) {
        // 02/08/2021 18:51:36
        let dateTime = document.lastModified.split(" ");
        let date = dateTime[0].split("/");
        let time = dateTime[1].split(":");
        return date[2] + "-" + date[0] + "-" + date[1] + "T" + time[0] + ":" + time[1];
    }
    // no seconds
    return new Date(document.lastModified).toISOString().substring(0, 16) + "Z";
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
            if (defaultValue == false) {
                value = true;
            }
        }
    } else {
        value = defaultValue;
    }
    return value;
}
