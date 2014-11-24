var tabToMonitor = [];		//keeps track of object with param tabId, url, duration and searchstring
var urls = [];
var currentSite = null;
var currentTabId = -1;
var startTime = null;
var tracking = false;
var lastRemoved = null;

var updateCounterInterval = 1000 * 60;  // 1 minute.
var sendStatsInterval = 3600 * 1000;

var trackerServer = "http://localhost/~EeRen";

initialize();


function initialize() {
	chrome.tabs.onUpdated.addListener(onUpdatedTabListener);
	chrome.tabs.onCreated.addListener(onCreatedTabListener);
	chrome.tabs.onSelectionChanged.addListener(onSelectionChangedTabListener);
	chrome.tabs.onRemoved.addListener(onRemovedTabListener);
	//chrome.windows.onCreated.addListener(onCreatedWindowListener)
	chrome.windows.onFocusChanged.addListener(onFocusChangedWindowListener);
	chrome.webNavigation.onTabReplaced.addListener(onTabReplacedListener);
	chrome.runtime.onMessage.addListener(onMessageListener);
	
	if (!localStorage.recordedSearch) {
		localStorage.setItem('recordedSearch', JSON.stringify({}));
	}//clear and send stats if exist, test content	
	sendStatistics();
	window.setInterval(sendStatistics, sendStatsInterval);
}

function onMessageListener(request, sender, sendResponse) {
	if (request.message == 'trackTab') {  		
		decodedUrl = getDecodedUrl(request.url);
		tabToMonitor.push({tabId : sender.tab.id , url : decodedUrl, searchstring : request.searchstring})	
		console.log(tabToMonitor);
      	sendResponse({url : request.url});
    }
}

function onCreatedTabListener(tab) {
	isParentTabGoogleSearch(tab);
}

function onRemovedTabListener(tabId, removeInfo) {
	console.log("Tab changed. Tab removed : " + tabId);
	console.log("Url removed : " + urls[tabId]);
	lastRemoved = tabId;
	var removedUrl = urls[tabId];	
	var trackingIndex = getTrackingObjectIndex(removedUrl, tabId);
	if (trackingIndex != null) {
		if (tracking) {
			tracking = false;
			var now = new Date();
			var delta = now.getTime() - startTime.getTime();
			updateRecordedTime(tabToMonitor[trackingIndex],delta/1000);
			console.log('ending tracking on tab ' + tabId + ' on url : ' + removedUrl);
		}
		tabToMonitor.splice(trackingIndex, 1);
		delete urls[tabId];
		console.log("removing tracking object from array");
		console.log(tabToMonitor);
	}
}

function updateRecordedTime(trackingObj, timeSpent) {
	console.log('updating time spent on object with url: ' + trackingObj.url + ' with tab id: ' + trackingObj.url + ' and search string: ' + trackingObj.searchstring);
	var trackingSearchString = trackingObj.searchstring;
	var recordedSearch = JSON.parse(localStorage.getItem('recordedSearch'));
	if (!recordedSearch[trackingSearchString]) {
		var jsonObj = 	[ 
							{
								"url" : trackingObj.url ,
								"duration" : timeSpent	
							}
						]
		recordedSearch[trackingSearchString] = jsonObj;
		localStorage.recordedSearch = JSON.stringify(recordedSearch);
	} else {
		var found = false;
		for (var x = 0 ; x < recordedSearch[trackingSearchString].length ; x ++) {
			if (recordedSearch[trackingSearchString][x].url == trackingObj.url) {
  			recordedSearch[trackingSearchString][x].duration += timeSpent;
  			found = true;
  			break;
			}
		}
		if (!found) {
			var jsonObj =	{
								"url" : trackingObj.url ,
								"duration" : timeSpent		
						}
			recordedSearch[trackingSearchString].push(jsonObj);
		}
		localStorage.recordedSearch = JSON.stringify(recordedSearch);
	}

	
}

function onSelectionChangedTabListener(tabId, selectInfo) {
	console.log("Tab changed");
	console.log('currentTabId : ' + currentTabId);
    console.log('new tab id : ' + tabId);
	focusChanged(tabId);
	
}

function onFocusChangedWindowListener(windowId) {
	console.log("Detected window focus changed.");
    chrome.tabs.query({active : true},
    function(actualTab) {
    	console.log("Window/Tab changed");
    	console.log('currentTabId : ' + currentTabId);
		console.log('new tab id : ' + actualTab[0].id);
		focusChanged(actualTab[0].id);
    });
}

function onUpdatedTabListener(tabId, info, tab) {
	if(info.status == 'complete') {
		console.log('updating url array... urls[' + tabId + '] = ' + tab.url);
		urls[tabId] = tab.url;
        if (tab.url.match(/google\..*\/webhp.*q=/)) {		//special google webhp case to re-inject content script
    		setTimeout(function(){
				chrome.tabs.executeScript(tabId, {file: 'webhpscript.js'});
			},800); //had to timeout because of webhp unusual behavior
		}
		if (tabId == currentTabId) {
			console.log('Tab updated. Tab ID : ' + tabId + ' current site : ' + currentSite);
			tryStopTracking(currentSite);
			//changed to a tracking site-tab, start recording, else record time spent
			currentSite = tab.url;
			tryTracking(tab.url);
    	}
    }
}

function onTabReplacedListener(object) {
	console.log('on tab replace, tab ' + object.replacedTabId + ' is replaced by tab id : ' + object.tabId);
	if (currentTabId == object.replacedTabId) {
		console.log('changing current tab id ' + currentTabId + ' to ' + object.tabId + ' due to ontabreplaced');
		currentTabId = object.tabId;
	}
	for (var i = 0 ; i < tabToMonitor.length ; i++) {
		if (tabToMonitor[i].tabId == object.replacedTabId) {
			tabToMonitor[i].tabId = object.tabId;
			console.log('tabToMonitor array updated due to tab replaced....');
			console.log(tabToMonitor);
		}	
	}
	urls[object.tabId] = urls[object.replacedTabId];
	delete urls[object.replacedTabId];
	console.log('urls array updated due to tab replaced...');
	console.log(urls);
}

function focusChanged(newTabId) {
	if (lastRemoved == currentTabId || currentTabId == -1) {
		if (currentTabId == -1) {
			console.log('initializing currentTabId');
		} else {
			console.log('previously tab removed, currentTabId is the removed tab id');
		}
		console.log('changing current tab id ' + currentTabId + ' to ' + newTabId);
		currentTabId = newTabId;
		chrome.tabs.get(currentTabId, function(actualTab) {
			tryTracking(actualTab.url); 
		});
		return;
	}
	chrome.tabs.get(currentTabId, function(previousTab) {
		tryStopTracking(previousTab.url);
		console.log('changing current tab id ' + currentTabId + ' to ' + newTabId);
		currentTabId = newTabId;
		chrome.tabs.get(currentTabId, function(actualTab) {
			tryTracking(actualTab.url); 
		});
	}); 
}

function tryStopTracking(checkURL) {
	if (tracking) {
		tracking = false;
		var now = new Date();
		var delta = now.getTime() - startTime.getTime();
		var trackingIndex = getTrackingObjectIndex(checkURL, currentTabId);
		updateRecordedTime(tabToMonitor[trackingIndex],delta/1000);
		console.log('ending tracking on tab ' + currentTabId + ' on url : ' + checkURL);
	}
}

function tryTracking(checkURL) {	
	if (trackableSites(checkURL, currentTabId)) {
		startTime = new Date();
		console.log('begin tracking for tab ' + currentTabId + ' on url : ' + checkURL);
		tracking = true;
	}
}


function trackableSites(site_url, tab_id) {
	var fragmentedUrl = site_url.split("#");
	for (var i = 0 ; i < tabToMonitor.length ; i++) {
		console.log(tabToMonitor[i]);
		if (tabToMonitor[i].url == fragmentedUrl[0] && tabToMonitor[i].tabId == tab_id) {
			return true;
		}
	}
	return false;
}

function getTrackingObjectIndex(site_url, tab_id) {
	var fragmentedUrl = site_url.split("#");
	for (var i = 0 ; i < tabToMonitor.length ; i++) {
		console.log('Iteration ' + i + ': url = ' + tabToMonitor[i].url + '  and tab id : ' + tabToMonitor[i].tabId);
		if (tabToMonitor[i].url == fragmentedUrl[0] && tabToMonitor[i].tabId == tab_id) {
			console.log('prepare to return index ' +i);
			return i;
		}
	}
	return null;
}

function isParentTabGoogleSearch(tab) {
	if (tab.url.match(/google\..*\/url\?/)) {
		if (tab.openerTabId != null) {
			chrome.tabs.get(tab.openerTabId, function(parentTab) {
				if (parentTab.url.match(/google\..*\/.*q=/)) {
					var decodedUrl = getDecodedUrl(tab.url)
					console.log('New tab - ' + tab.id + ' is opened from parent tab id : ' + tab.openerTabId);
					chrome.tabs.sendMessage(parentTab.id, {message: 'verifyWeb'}, function(response) {
						if (response.isWebSearch == true) {
							tabToMonitor.push({tabId : tab.id, url : decodedUrl, searchstring : response.searchstring})
							console.log(tabToMonitor);
						}
					});
				}
			});
		}
	}
}

function sendStatistics() {
	if (JSON.parse(localStorage.recordedSearch) == '{}') {
		console.log('localstorage recordedSearch is empty, sendStatistics is aborted..');
		return;
	}
	var request = $.ajax({
			url: trackerServer + "/stats/update.php",
			type: "POST",
			contentType:'application/json',
			dataType: 'json',
			data: JSON.stringify(localStorage.recordedSearch)
		});

	request.done(function(msg) {
		console.log(msg);	
		console.log("Successfully updated statistics.");
		//localStorage.recordedSearch = JSON.stringify({});		
	});

	request.fail(function(jqXHR, textStatus) {
		alert( "Request failed: " + textStatus );
	});
}

function getDecodedUrl(rawGoogleUrl) {
	var uri = new URI(rawGoogleUrl);
	var queryString = uri.search();
	var results = URI.parseQuery(queryString);
	return results.url;
}