var STATE = {
	LOADED: 'loaded',
	ACTIVE: 'active',
	INACTIVE: 'inactive'
}
var tabsStore = {};

function supportsUrl(urlString) {
	return urlString.startsWith('http://') || urlString.startsWith('https://')
}

function setTabState(tab, state) {
	tabsStore[tab.id] = state;
}

function updateTabState(tab) {
	var newState = (tab === STATE.LOADED) ? STATE.LOADED :
		supportsUrl(tab.url) ? STATE.ACTIVE :
		STATE.INACTIVE;
	setTabState(tab, newState);

	if (tabsStore[tab.id] == STATE.ACTIVE) {
		chrome.storage.sync.get(["lively4"], function(configs) {
			var config = configs.lively4 || {}
			var host;
			if (config.hosts)
				host = config.hosts[new URL(tab.url).hostname]
			if (host && host.active) {
				setIconPath('background/media/icon-active.png');
				console.log("load lively4")
				chrome.tabs.executeScript(null, {
					file: 'content/load.js',
				});
			} else {
				setIconPath('background/media/icon-inactive.png');
			}		
		})
	} else {
		setIconPath('background/media/icon-inactive.png');
	}

}

/**
* EVENT HANDLERS
*/
function onVisitTab(tabId) {
	chrome.tabs.get(tabId, function (tab) {
		updateTabState(tab);
	})
}

function onUpdateTab(tab) {

	if (tab.status === 'loading') {
		var doLoadAgain = tabsStore[tab.id] === STATE.LOADED;
		delete tabsStore[tab.id];
	}
	chrome.tabs.getSelected(function(selectedTab) {
		if (tab.id === selectedTab.id) {
			updateTabState(tab);
		}
	})
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
	onVisitTab(activeInfo.tabId);
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	onUpdateTab(tab);
})

function setIconPath(path) {
	chrome.browserAction.setIcon({
        path: path
    });
}
