// GLOBAL ACCESSOR THAT THE POPUP USES.
var maxDuration = 60*60*24*6004;
var selectedId = null;
var selectedWindow = null;
var selectedMap = {};
var tabs = [];
var intervalId = null;
var intervalLength = null;
var bDebug = false;

//// UTIL

function debugLog(message){
	if( bDebug ){
		console.log(message);
	}
}

//// TAB SWITCHER (TAB SWISHA?)

var TabSwitcher = {
	isPlaying : function(){
		var state = Cookie.get('tabShow_state');
		
		return( state == 'playing' );
	},
	
	isPaused : function(){
		var state = Cookie.get('tabShow_state');
		
		return( state != 'playing' );
	},
	
	setDefaultInterval : function( defaultInterval ){
		Cookie.set( 'tabShow_interval', defaultInterval, { duration: maxDuration, path : chrome.extension.getURL('/') });
	},
	
	getSetDefaultInterval : function( defaultInterval ){
		var intervalFromCookie = Cookie.get('tabShow_interval');
		if( intervalFromCookie === null || !intervalFromCookie ){
			TabSwitcher.setDefaultInterval(defaultInterval);
			intervalFromCookie = defaultInterval;
		}
		
		return intervalFromCookie;
	},
	
	getLastTabIndex : function(tabs, currentTabId){
		for( var i = 0; i < tabs.length; i++ ){
			if( tabs[i] == currentTabId ){
				debugLog( 'Last Tab Index: ' + i );

				return i;
			}
		}
		
		return 0;
	},

	getNextIndex : function(tabs, lastIndex){
		if( lastIndex < tabs.length - 1 ){
			return (lastIndex + 1);
		}
		
		return 0;
	},

	beginShow : function(allTabs, params){
		debugLog( "beginShow" );

		tabs = allTabs;
		intervalLength = params.interval;	
		selectedWindow = params.windowId;
		
		Cookie.set( 'tabShow_state', 'playing', { duration: maxDuration, path : chrome.extension.getURL('/') });
		
		TabSwitcher.setDefaultInterval(intervalLength);
		TabSwitcher.displayNextTab();
	},

	pauseShow : function(){
		debugLog( "pauseShow" );
		
		Cookie.set( 'tabShow_state', 'paused', { duration: maxDuration, path : chrome.extension.getURL('/') });
	},
	
	displayNextTab : function(){
		debugLog( "displayNextTab" );
		
		var tabIndex = TabSwitcher.getLastTabIndex( tabs, selectedId );
		if( tabIndex === null ){
			TabSwitcher.pauseShow();
			return;
		}
			
		var newTabIndex = TabSwitcher.getNextIndex( tabs, tabIndex );
		debugLog( 'New Tab Index: ' + newTabIndex );
		
		chrome.tabs.update(tabs[newTabIndex], {selected:true});
	}
};

//// CHROME TAB EVENT MANAGEMENT

function updateSelected( tabId ){
	debugLog( "updateSelected(" + tabId + ")");

	selectedId = tabId;
}

chrome.tabs.onUpdated.addListener(function(tabId, change, tab){	
	if (change.status == "complete") {
		debugLog( "chrome.tabs.onUpdated" );
		TabSwitcher.pauseShow();
		updateSelected(tabId);
	}
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, info){
	debugLog( "chrome.tabs.onSelectionChanged" );

	updateSelected( tabId );
	
	if( TabSwitcher.isPlaying() ){
		debugLog( "chrome.tabs.onSelectionChanged: state == playing" );
		
		setTimeout( function(){
			if( TabSwitcher.isPlaying() ){
				TabSwitcher.displayNextTab();
			}
		}, intervalLength * 1000 );
	}
});

chrome.tabs.onRemoved.addListener(function(tabId, info){
	debugLog( "chrome.tabs.onRemoved" );
	
	TabSwitcher.pauseShow();
});

chrome.tabs.getSelected(null, function(tab){
	debugLog( "chrome.tabs.getSelected" );
		
	updateSelected(tab.id);
});
