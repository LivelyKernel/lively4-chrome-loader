# lively4-chrome-loader
Loads lively components from a server running lively4 into any website.

The lively4 code can be found at https://github.com/LivelyKernel/lively4-core

This Chrome extension consists of three components: **background**, **content** and **ui**. Ui is responsible for creating a popup when clicking the extension icon. Background updates the icon and stores information from the popups input fields. Content scripts are used to manipulate the DOM of the current tab.

##Basic workflow
The component loading workflow from a technical perspective looks like this:

1. When switching to the desired tab, an event page with access to the chrome api is used to change the icon. It can be active (on pages where lively can be loaded), inactive (on pages where lively cannot be loaded) or loaded (when lively is loaded). The event pages is based on background/eventPage.js and has chrome.tabs.onActivated and chrome.tabs.onUpdated handlers registered.

2. Clicking the chrome extension icon creates a popup based on ui/popup.html that runs ui/popup.js in its own process. It registers handlers to trigger a load. When opened, it also replaces default input values from popup.html with those persisted in chromes localStorage.

3. Clicking 'Load component'

  * reads the given information and sends them in a 'saveSettings' message to the background process created from background/eventPages.js. It is stored in chromes localStorage.
  * injects the content script content/loadComponent.js into the DOM of the currently shown tab.
  * closes the ui window

4. When lively4 is loaded, the content script sends a message 'loadedInTab' to the background that updates the Icon.

##Component loading
The content script loadComponent.js contains the steps neccessary to load a lively4 instance into a web page. It runs in an isolated world that allows access to the current tabs DOM but not to any javascript objects. 

The script basically adds script and custome nodes to the web pages DOM. The content script

1. Injects window.lively4Url into the web pages execution environment. This is 'hacked' by appending a script node the the web pages dom that sets this global variable, as content scripts have no access to a pages javascript objects. The lively4Url is used by a lively4 environment to load additional templates required by a component.

2. Loads jquery into the web pages DOM.

3. Waits until jquery is loaded and loads the module loader system.src.js from the given lively4 instance. In order to change the base path for module loading to the lively4 instance, it manipulates the received source code. Here is why this chrome extension also requires jquery to be present as a content script. This is NOT the jQuery object that was loaded in step 1 (that one exists in the web pages DOM).

4. Waits until the System.js module loader is present and then loads babel from \[lively4\]/src/external/babel-browser.js

5. Loads lively4 from \[lively4\]/src/client/load.js

6. Adds a link tag referencing the desired template

7. Mounts a custom HTML tag that uses the given template into the web pages DOM.
