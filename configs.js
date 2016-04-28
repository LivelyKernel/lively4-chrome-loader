
function withConfig(mutateConfigCB) {
	chrome.storage.sync.get(["lively4"], function(configs) {
		mutateConfigCB(ensureConfig(configs), function() {
			chrome.storage.sync.set(configs) // for saving inbetween	
		})
		chrome.storage.sync.set(configs)
	})	
}

function ensureConfig(configs) {
	configs.lively4 = configs.lively4 || {}
	configs.lively4.location = configs.lively4.location || "http://localhost:8080/lively4-core/"
	configs.lively4.hosts = configs.lively4.hosts || {}
	return configs.lively4
}

function ensureHost(config, host) {
	config.hosts[host] = config.hosts[host] || {active: false}
	return config.hosts[host]
}

function setIconPath(path) {
	chrome.browserAction.setIcon({
        path: path
    });
}

