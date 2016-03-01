function saveConfig(config) {
	chrome.runtime.sendMessage({
		type: 'saveConfig',
		payload: config
	});
}

function loadIntoTab(config) {
	chrome.tabs.getSelected(function(tab) {
		config.tab = tab;
		chrome.tabs.executeScript(null, {
			code: "var config = " + JSON.stringify(config)
		}, function () {
			chrome.tabs.executeScript(null, {
				file: 'content/loadComponent.js',
			}, function () {
				window.close();
			});
		})
	});
}

function loadComponent() {
	var config = getCurrentConfig();
	saveConfig(config);
	loadIntoTab(config);
}

function setDefaultValue(inputType, value) {
	if(!value) return;
	document.getElementById(inputType + '_input').value = value;
}

function replaceDefaultsWithStoredValues() {
	chrome.storage.sync.get(['lively4'], function(items) {
		if (items && items.lively4) {
			setDefaultValue('component', items.lively4.componentString);
			setDefaultValue('location', items.lively4.locationString);
		}
	})
}

function loadComponentOnEnter(event) {
	if (event.keyCode === 13) {
		loadComponent();
	}
}

function getCurrentConfig() {
	return {
		component: document.getElementById('component_input').value,
		location: document.getElementById('location_input').value
	}
}

function init() {
	replaceDefaultsWithStoredValues();
	document.getElementById('load_button').addEventListener('click', loadComponent);
	document.body.addEventListener('keyup', loadComponentOnEnter);
}

document.addEventListener('DOMContentLoaded', init);