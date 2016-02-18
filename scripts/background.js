var tabsStore = {};

function updateIconInTab(tab) {
	switch(tabsStore[tab.id]) {
		case 'hasLivelyLoaded': {
			chrome.runtime.sendMessage({ 'newIconPath' : 'media/icon-loaded.png' });
			break;
		}
		case 'canLively': {
			chrome.runtime.sendMessage({ 'newIconPath' : 'media/icon-active.png' });
			break;
		}
		default: {
			chrome.runtime.sendMessage({ 'newIconPath' : 'media/icon-inactive.png' });
			break;
		}
	}
}

function setActiveInTab(tab) {
	if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
		if (tabsStore[tab.id] === 'hasLivelyLoaded') {
			tabsStore[tab.id] = 'hasLivelyLoaded';
		} else {
			tabsStore[tab.id] = 'canLively';
		}
	} else {
		tabsStore[tab.id] = 'cannotLively';
	}
	updateIconInTab(tab);
}

function onTabAction(tabId) {
	chrome.tabs.get(tabId, function (tab) {
		setActiveInTab(tab);
	})
}

function loadComponent(config) {
	chrome.storage.local.set( {
		'lively4': {
			'componentString': config.component,
			'locationString': config.location
		}
	})
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.newIconPath) {
	    chrome.browserAction.setIcon({
	        path: request.newIconPath
	    });
    }
    if (request.loadedInTab) {
		tabsStore[request.loadedInTab.id] = 'hasLivelyLoaded';
		updateIconInTab(request.loadedInTab);
    }
    if (request.loadComponent) {
		loadComponent(request.loadComponent);
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	onTabAction(activeInfo.tabId);
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.status === 'loading') {
		var doLoadAgain = tabsStore[tabId] === 'hasLivelyLoaded';
		delete tabsStore[tabId];
		setActiveInTab(tab);
	}
	chrome.tabs.getSelected(function(selectedTab) {
		if (tab.id === selectedTab.id) {
			setActiveInTab(tab);
		}
	})
})
