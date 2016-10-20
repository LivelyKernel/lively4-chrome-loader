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
        injectLively4URL()
            .then(loadJQuery)
            .then(loadSystem)
            .then(loadBabel)
            .then(loadFontAwesome)
            .then(loadLively4);
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

function loadJQuery() {
    return loadJavaScriptThroughDOM("jQuery", localLively4Url + 'src/external/jquery.js', false);
}

function loadFontAwesome() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = localLively4Url + "src/external/font-awesome/css/font-awesome.min.css";
    document.head.appendChild(link);
    return Promise.resolve();
}

function loadSystem() {
    var systemPromise = new Promise((resolve) => {
        $.get(localLively4Url + 'src/external/system.src.js', function (data) {
            data = data.replace(
                `var baseURIObj = new URL(baseURI);`,
                `var baseURIObj = new URL("${localLively4Url}");`);
            var systemScriptNode = document.createElement('script');
            systemScriptNode.setAttribute('type', 'text/javascript');
            systemScriptNode.innerHTML = data;
            // systemScriptNode.addEventListener("load", resolve, false);
            document.head.appendChild(systemScriptNode);
            resolve();
        })
    });

    var regeneratorPromise = new Promise((resolve) => {
        var regeneratorRuntimeNode = document.createElement('script');
        regeneratorRuntimeNode.setAttribute('type', 'text/javascript');
        regeneratorRuntimeNode.setAttribute('src', localLively4Url + 'vendor/regenerator-runtime.js');
        regeneratorRuntimeNode.addEventListener("load", resolve, false);
        document.head.appendChild(regeneratorRuntimeNode);
    });

    return Promise.all([systemPromise, regeneratorPromise]);
}

function loadBabel() {
    if (window.lively) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        var babelLoaderNode = document.createElement('script');
        babelLoaderNode.setAttribute('type', 'text/javascript');
        babelLoaderNode.innerHTML = `
            System.paths['babel'] = '${localLively4Url}src/external/babel-browser.js;'
            System.config({
            	baseURL: '${localLively4Url}',
                transpiler: 'babel',
                babelOptions: { },
                map: {
                  babel: '${localLively4Url}src/external/babel-browser.js',
                  kernel: '${localLively4Url}src/client/legacy-kernel.js'
                }
            })`
        document.head.appendChild(babelLoaderNode);
        resolve();
    });
}

function loadLively4() {
    if (window.lively) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
  		var lively4node = document.createElement('script');
        lively4node.setAttribute('type', 'text/javascript');
        lively4node.innerHTML = `
        System.import(lively4url + "/src/client/load.js").then(function(load){
	        console.log("load lively 1/3")
	        load.whenLoaded(function(){
	          console.log("load lively 2/3")
	          lively.components.loadUnresolved().then(function() {
	            console.log("load lively 3/3")
	              lively.initializeDocument(document)
	              console.log("Finally loaded!")
	          })
	      })}).catch(function(err) {
	          console.log("Lively Loaging failed", err)
	          alert("load Lively4 failed:" + err)
	      });
        `
        document.head.appendChild(lively4node);
        resolve();
    });
}


function injectLively4URL() {
    return new Promise((resolve) => {
        var lively4Node = document.createElement('script');
        lively4Node.setAttribute('type', 'text/javascript');
        lively4Node.innerHTML = `window.lively4url = '${localLively4Url}'; window.lively4chrome=true;`;
        document.head.appendChild(lively4Node);
        resolve();
    });
}
