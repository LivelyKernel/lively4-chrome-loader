var lively4Url;

loadTemplate(
  config.component,
  config.location);

function loadTemplate (partNamesString, url) {
  lively4Url = url;
  loadJQuery();
  setTimeout(function() {
    loadSystem();
    setTimeout(function () {
      loadBabel();
      loadLively4();
      var partName = partNamesString.split(' ')[0];
      addLinkTagForPart(partName);
      mountPart(partName);
    }, 1000)
  }, 1000)
}

function addLinkTagForPart (partName) {
  var linkTag = document.createElement('link');
  linkTag.setAttribute('rel', 'import');
  linkTag.setAttribute('href', lively4Url + 'templates/' + partName + '.html');
  document.head.appendChild(linkTag);
}

function mountPart(partIdentifierString) {
  var aToolbox = document.createElement(partIdentifierString);
  document.body.insertBefore(aToolbox, document.body.firstChild);
  aToolbox.style.setProperty('position', 'fixed');
  aToolbox.style.setProperty('z-index', 10000);
  chrome.runtime.sendMessage({
    type: 'loadedInTab',
    payload: config.tab
  });
}

function loadJQuery () {
  var jQueryNode = document.createElement('script');
  jQueryNode.setAttribute('type', 'text/javascript');
  jQueryNode.setAttribute('src', 'https://code.jquery.com/jquery-2.1.4.js');
  document.head.appendChild(jQueryNode);
}

function loadSystem () {
  $.get(lively4Url + 'src/external/system.src.js', function(data) {
    data = data.replace(
      'var baseURIObj = new URL(baseURI);',
      'var baseURIObj = new URL("' + lively4Url + 'draft/");' );
    var systemScriptNode = document.createElement('script');
    systemScriptNode.setAttribute('type', 'text/javascript');
    systemScriptNode.innerHTML = data;
    document.head.appendChild(systemScriptNode);
  })
}

function loadBabel () {
  var babelLoaderNode = document.createElement('script');
  babelLoaderNode.setAttribute('type', 'text/javascript');
  babelLoaderNode.innerHTML = `
    window.lively4Url = '${lively4Url}';
    System.paths['babel'] = '${lively4Url}src/external/babel-browser.js;'
    System.config({
      transpiler: 'babel',
      babelOptions: { },
      map: {
        babel: '${lively4Url}src/external/babel-browser.js'
      }
    })`
  document.head.appendChild(babelLoaderNode);
  System.config({
    baseURL: lively4Url + 'draft/'
  });
}

function loadLively4 () {
  System.import(lively4Url + "/src/client/load.js").then(function(load) {
    load.whenLoaded(() => {
      console.log("lively loaded! " + lively.preferences.getBaseURL());
    })
  })
}
