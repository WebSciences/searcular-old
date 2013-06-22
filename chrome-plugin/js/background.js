var lastQuery, userID, lastTopic = -1, currentModuleState = 0;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action.match('setCurrentModuleState') != null) {
        
        currentModuleState = request.currentModuleState;
    } else if (request.action.match('getCurrentModuleState') != null) {
       
        sendResponse({
            'currentModuleState' : currentModuleState
        });
    } else if (request.action.match('saveUserID') != null) {
        
        userID = request.userID;
        localStorage.setItem("userID", userID);
		var res = localStorage.getItem("userID");
		var server_res = request.userID
        console.log("userID saved: %s", userID);
		
    } else if (request.action.match('getUserID') != null) {
        var res = localStorage.getItem("userID");
		var server_res = request.userID
        console.log("userID collected from HTML5 local storage: %s", userID);
		console.log("userID from server %s", server_res);
        sendResponse({
            'userID' : res,
			'serverUserID' : server_res
        });
    } else if (request.action.match('saveLastQuery') != null) {

		lastQuery = request.lastQuery;
	} else if (request.action.match('getLastQuery') != null) {
		sendResponse({
			'lastQuery' : lastQuery
		});

	} else if (request.action.match('saveLastTopic') != null) {

		lastTopic = request.lastTopic;
	} else if (request.action.match('getLastTopic') != null) {

		sendResponse({
			'lastTopic' : lastTopic
		});
	} else if (request.action.match('getKeywordsByQuery') != null) {
		// break the query to n-grams and test against the bloom filter to obtain
		// valid keywords
		/* keywords to be validated again in the future
        
        var words = lastQuery.split(" ");
		var keywords = new Array();

        
		if (words.length >= 2) {
			// bigrams
			for ( var i = 0; i < words.length - 1; i++) {
				var target = words[i] + "-" + words[i + 1];
				if (bloom.test(target)) {
					keywords[keywords.length] = target;
				}
			}
		}

		if (words.length >= 3) {
			// trigrams
			for ( var i = 0; i < words.length - 2; i++) {
				var target = words[i] + "-" + words[i + 1] + "-" + words[i + 2];
				if (bloom.test(target)) {
					keywords[keywords.length] = target;
				}
			}
		}
        
        sendResponse({
            "keywords" : keywords 
        });
        
        
        */
    
		
		sendResponse({
			"keywords" : lastQuery 
		});

	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	 	chrome.tabs.executeScript(null, {file: 'js/testing.js'});
	 	 
 });



