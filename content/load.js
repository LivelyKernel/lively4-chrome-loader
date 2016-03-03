var localLively4Url;

loadLively();

function loadLively() {
  if (window.lively4noserviceworker) {
    console.log("Lively4 already loaded!")
    return // if you cannot figure out why you are called twice... just ignore it! #Jens
  }
  window.lively4noserviceworker = true
  
  chrome.storage.sync.get(["lively4"], function(configs) {
      var config = configs.lively4 || {}
      var url = new URL(config.location || "https://lively-kernel.org/lively4/")
      url.protocol = document.location.protocol
      localLively4Url = "" + url
      injectLively4URL();
      loadJQuery();
      setTimeout(function() {
        loadSystem();
        setTimeout(function () {
          if (window.lively) {
            console.log("Lively already loaded")
          } else {
            loadBabel();
            loadLively4();
          } 
        }, 1000)
      }, 1000)
  })
}

function loadJQuery() {
  var jQueryNode = document.createElement('script');
  jQueryNode.setAttribute('type', 'text/javascript');
  jQueryNode.setAttribute('src', localLively4Url + 'external/jquery.js');
  document.head.appendChild(jQueryNode);
}

function loadSystem() {
  $.get(localLively4Url + 'src/external/system.src.js', function(data) {
    data = data.replace(
      `var baseURIObj = new URL(baseURI);`,
      `var baseURIObj = new URL("${localLively4Url}draft/");` );
    var systemScriptNode = document.createElement('script');
    systemScriptNode.setAttribute('type', 'text/javascript');
    systemScriptNode.innerHTML = data;
    document.head.appendChild(systemScriptNode);
  })
}

function loadBabel() {
  var babelLoaderNode = document.createElement('script');
  babelLoaderNode.setAttribute('type', 'text/javascript');
  babelLoaderNode.innerHTML = `
    System.paths['babel'] = '${localLively4Url}src/external/babel-browser.js;'
    System.config({
      transpiler: 'babel',
      babelOptions: { },
      map: {
        babel: '${localLively4Url}src/external/babel-browser.js'
      }
    })`
  document.head.appendChild(babelLoaderNode);
  System.config({
    baseURL: localLively4Url + 'draft/'
  });
}

function loadLively4() {
  var livelyLoaderNode = document.createElement('script');
  livelyLoaderNode.setAttribute('type', 'text/javascript');
  livelyLoaderNode.innerHTML = `
  console.log("loadLively4 ${localLively4Url}")
  System.import("${localLively4Url}/src/client/lively.js").then(function(module) {
      window.lively = module.default
      lively.initializeHalos()
      lively.initializeDocument(document, true)
      console.log("lively loaded! " + lively.preferences.getBaseURL());
    })`
  document.head.appendChild(livelyLoaderNode);
}

function injectLively4URL() {
  var lively4Node = document.createElement('script');
  lively4Node.setAttribute('type', 'text/javascript');
  lively4Node.innerHTML = `window.lively4url = '${localLively4Url}';`;
  document.head.appendChild(lively4Node);
}
