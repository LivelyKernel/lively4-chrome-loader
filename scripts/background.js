var STATE = {
	LOADED: 'loaded',
	ACTIVE: 'active',
	INACTIVE: 'inactive'
}
var tabsStore = {};

/**
* HELPERS
*/

function setIconForTab(tab) {
	setIconPath('media/icon-' + tabsStore[tab.id] + '.png');
}

function supportsUrl(urlString) {
	return urlString.startsWith('http://') || urlString.startsWith('https://')
}

function setTabState(tab, state) {
	tabsStore[tab.id] = state;
}

function updateTabState(tab) {
	var newState = tab === STATE.LOADED ? STATE.LOADED :
		supportsUrl(tab.url) ? STATE.ACTIVE :
		STATE.INACTIVE;
	setTabState(tab, newState);
	setIconForTab(tab);
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

/**
* MESSAGE PROTOCOL
*/

function setLoadedInTab(tab) {
	setTabState(tab, STATE.LOADED);
	setIconForTab(tab);
}

function setIconPath(path) {
	chrome.browserAction.setIcon({
        path: path
    });
}

function saveSettings(config) {
	chrome.storage.local.set({
		'lively4': {
			'componentString': config.component,
			'locationString': config.location
		}
	})
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.type) {
		case 'newIconPath': setIconPath(request.payload); break;
		case 'loadedInTab': setLoadedInTab(request.payload); break;
		case 'saveSettings': saveSettings(request.payload); break;
	}
});