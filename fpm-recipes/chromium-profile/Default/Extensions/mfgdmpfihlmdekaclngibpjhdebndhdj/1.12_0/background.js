'use strict';

var tabs = {};
var size = 10;
var index = Number(localStorage.getItem('closed.index')) || 0;
var weather = null;
var weatherUrl = null;
var expireHandle = null;

// store tab info in memory
function storeTab(tab) {
	if (tab.url && tab.url.substring(0, 15) !== 'chrome://newtab')
		tabs[tab.id] = {url: tab.url, title: tab.title || tab.url};
}

// send message to newtab page to refresh closed list
function notifyChange() {
	if (chrome.extension.sendMessage)
		chrome.extension.sendMessage('tab.closed');
}

// clear recently closed list
function clearClosed() {
	for (var i = 0; i < size; i++) {
		localStorage.removeItem('closed.' + i + '.url');
		localStorage.removeItem('closed.' + i + '.title');
	}
	index = 0;
	localStorage.setItem('closed.index', index);
	notifyChange();
}

// cache weather info in memory temporarily
function cacheWeather(data, url) {
	if (expireHandle)
		clearTimeout(expireHandle);

	weather = data;
	weatherUrl = url;
	expireHandle = setTimeout(function() {
		weather = null;
		weatherUrl = null;
		expireHandle = null;
	}, 1000*60*15);// cache 15 minutes
}

// store initial tabs
chrome.tabs.query({}, function(result) {
	for (var i in result) {
		storeTab(result[i]);
	}
});

// store tab info on change
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	storeTab(tab);
});

// store removed tab info
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	if (!tabs[tabId])
		return;

	var url = tabs[tabId].url;
	var title = tabs[tabId].title;

	// check for duplicates
	var i = (index - 1 + size) % size;
	while (true) {

		var storedurl = localStorage.getItem('closed.' + i + '.url');
		if (!storedurl)
			break;

		if (url == storedurl) {
			// update indexes
			var j = (index - 1 + size) % size;
			while (true) {
				var nexturl = localStorage.getItem('closed.' + j + '.url');
				var nexttitle = localStorage.getItem('closed.' + j + '.title');

				localStorage.setItem('closed.' + j + '.url', url);
				localStorage.setItem('closed.' + j + '.title', title);

				url = nexturl;
				title = nexttitle;

				if (j == i)
					break;

				j = (j - 1 + size) % size;
			}

			delete tabs[tabId];
			notifyChange();
			return;
		}

		if (i == index)
			break;

		i = (i - 1 + size) % size;
	}

	// store new entry
	localStorage.setItem('closed.' + index + '.url', url);
	localStorage.setItem('closed.' + index + '.title', title);
	index = (index + 1) % size;
	localStorage.setItem('closed.index', index);

	delete tabs[tabId];
	notifyChange();
});
