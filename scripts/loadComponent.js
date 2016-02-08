var loaderScriptNode = document.createElement('script');
loaderScriptNode.setAttribute('type', 'text/javascript');
loaderScriptNode.setAttribute('id', 'lively4-chrome-loader');
loaderScriptNode.setAttribute('src', config.location + 'export/loadPart.js');
loaderScriptNode.setAttribute('data-location', config.location);
loaderScriptNode.setAttribute('data-component', config.component);
document.head.appendChild(loaderScriptNode);