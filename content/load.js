var localLively4Url;
loadLively();

function loadLively() {
    if (window.lively4load) {
        console.log("Lively4 already loaded!")
        return // if you cannot figure out why you are called twice... just ignore it! #Jens
    }
    window.lively4load = true

    chrome.storage.sync.get(["lively4"], function (configs) {
        var config = configs.lively4
        var url = new URL(config.location)
        url.protocol = document.location.protocol
        localLively4Url = "" + url
        injectLively4State().then(bootLively)

    })
}

function loadJavaScriptThroughDOM(name, src, force) {
    return new Promise((resolve) => {
        var scriptName = name + "Script";
        var scriptNode = document.querySelector("#" + scriptName);
        if (scriptNode) {
            scriptNode.remove();
        }
        var script = document.createElement("script");
        script.id = scriptName;
        script.type = "text/javascript";
        if (force) {
            src += +"?" + Date.now();
        }
        script.addEventListener("load", resolve, false);
        script.src = src;
        document.head.appendChild(script);
    })
}


function bootLively() {
    return loadJavaScriptThroughDOM("boot", localLively4Url + 'src/client/boot.js', false);
}



function injectLively4State() {
    return new Promise((resolve) => {
        var lively4Node = document.createElement('script');
        lively4Node.setAttribute('type', 'text/javascript');
        lively4Node.innerHTML = `window.lively4chrome=true;`;
        document.head.appendChild(lively4Node);
        resolve();
    });
}