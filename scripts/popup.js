function loadComponent() {
	var config = {
		component: document.getElementById('component_input').value,
		location: document.getElementById('location_input').value
	};
	chrome.runtime.sendMessage({ loadComponent: {
		component: document.getElementById('component_input').value,
		location: document.getElementById('location_input').value
	} });
	chrome.tabs.getSelected(function(tab) {
		config.tab = tab;
		chrome.tabs.executeScript(null, {
			code: "var config = " + JSON.stringify(config)
		}, function () {
			chrome.tabs.executeScript(null, {
				file: 'scripts/loadComponent.js',
			});
			window.close();
		})
	});
}

function replaceLocationValue(config) {
	if (config.locationString) {
		document.getElementById('location_input').value = locationString;
	}
}

function replaceDefaultsWithStoredValues() {
	chrome.storage.local.get(['lively4'], function(items) {
		if (items && items.lively4) {
			var componentString = items.lively4.componentString;
			var locationString = items.lively4.locationString;
			if (componentString) {
				document.getElementById('component_input').value = componentString;
			}
			if (locationString) {
				document.getElementById('location_input').value = locationString;
			}
		}
	})
}

function loadComponentOnEnter(event) {
	if (event.keyCode === 13) {
		loadComponent();
	}
}

function init() {
	replaceDefaultsWithStoredValues();
	document.getElementById('load_button').addEventListener('click', loadComponent);
	document.body.addEventListener('keyup', loadComponentOnEnter);
}

document.addEventListener('DOMContentLoaded', init);