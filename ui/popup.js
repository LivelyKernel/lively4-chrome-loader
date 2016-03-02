function toggleLoadLively(){
	var checked =  document.getElementById('loadLively_checkbox').checked
	chrome.tabs.getSelected(function(tab) {
		var host = new URL(tab.url).hostname
		chrome.storage.sync.get(["lively4"], function(configs) {
			var config = configs.lively4
			if (!config.hosts) config.hosts = {}
			config.hosts[host] = {active: checked}
			chrome.storage.sync.set(configs)
			
			if (checked) 
				load()
			else
				unload()
		})
	})
}

function changeSettingsOnEnter(event) {
       if (event.keyCode === 13) {
			chrome.storage.sync.get(["lively4"], function(configs) {
				var config = configs.lively4
				config.location = document.getElementById('location_input').value
				chrome.storage.sync.set(configs)
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
		document.getElementById('host_label').textContent = host
		chrome.storage.sync.get(["lively4"], function(configs) {
			var config = configs.lively4
			try {
				if (config.location) {
					document.getElementById('location_input').value = config.location
				}
				document.getElementById('loadLively_checkbox').checked = config.hosts[host].active
			} catch(err) {
				console.log("lively4chrome error to apply settings " + err)
			}
		})
	})
	document.getElementById('loadLively_checkbox').addEventListener('click', toggleLoadLively);
	document.body.addEventListener('keyup', changeSettingsOnEnter);
}

function setIconPath(path) {
	chrome.browserAction.setIcon({
        path: path
    });
}

console.log("loaded popup.js")
document.addEventListener('DOMContentLoaded', init);