function loadComponent() {
	var config = {
		component: document.getElementById('component_input').value,
		location: document.getElementById('location_input').value
	};
	chrome.tabs.getSelected(function(tab) {
		config.tab = tab;
		chrome.tabs.executeScript(null, {
			code: "var config = " + JSON.stringify(config)
		}, function () {
			chrome.tabs.executeScript(null, {
				file: 'scripts/loadComponent.js',
			});
		})
	}); 
	window.close();
}

function loadComponentOnEnter(event) {
	if(event.keyCode == 13) {
        loadComponent();
    }
}

function init() {
	document.getElementById('load_button').addEventListener('click', loadComponent);
	document.body.addEventListener('keyup', loadComponentOnEnter);
}

document.addEventListener('DOMContentLoaded', init);