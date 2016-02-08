function loadComponent() {
	var config = {
		component: document.getElementById('component_input').value,
		location: document.getElementById('location_input').value
	};
	chrome.tabs.executeScript(null, {
		code: "var config = " + JSON.stringify(config)
	}, function () {
		chrome.tabs.executeScript(null, {
			file: 'scripts/loadComponent.js'
		});
	}); 
}

function init() {
	document.getElementById('load_button').addEventListener('click', loadComponent);
}

document.addEventListener('DOMContentLoaded', init);