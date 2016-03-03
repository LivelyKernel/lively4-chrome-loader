function get(name) {
	return document.getElementById(name)
}

function toggleLoadLively(){
	var checked =  get('loadLively_checkbox').checked
	chrome.tabs.getSelected(function(tab) {
		var host = new URL(tab.url).hostname
		changeConfig(function(config) {
			ensureHost(config, host).active = checked
			if (checked) 
				load()
			else
				unload()
		})
	})
	
}


function changeSettingsOnEnter(event) {
    if (event.keyCode === 13) {
		changeConfig(function(config) {
			config.location = get('location_input').value
		})
    }
}

function load(){
	setIconPath('background/media/icon-active.png');
	chrome.tabs.executeScript(null, {
		file: 'content/load.js',
	}, function () {
		window.close();
	});
}

function unload(){
	setIconPath('background/media/icon-inactive.png');
	chrome.tabs.executeScript(null, {
			file: 'content/unload.js',
	}, function () {
		window.close();
	});
}


function init() {
	chrome.tabs.getSelected(function(tab) {
		var host = new URL(tab.url).hostname
		get('host_label').textContent = host
		changeConfig(function(config) {
			get('location_input').value = config.location
			get('loadLively_checkbox').checked = ensureHost(config, host).active
		})
	})
	get('reset_button').addEventListener('click', resetConfig);
	get('loadLively_checkbox').addEventListener('click', toggleLoadLively);
	document.body.addEventListener('keyup', changeSettingsOnEnter);
}

function setIconPath(path) {
	chrome.browserAction.setIcon({
        path: path
    });
}

function resetConfig() {
	if (confirm("reset Lively4chrom settings?")) {
		chrome.storage.sync.set({lively4: {}})
	}
}

console.log("loaded popup.js")
document.addEventListener('DOMContentLoaded', init);