var lastQuery, userID, lastTopic = -1, currentModuleState = 0 , currentTabId , timerId = undefined,queryTimelimit = 0; //120 seconds
var TIMELIMIT = 30;
var INSESSION = false;
var onUpdateCounter={};
var querySessionlog = [];
var APIURL = "http://v2.searcular.com/api/v1/"
timerId = window.setInterval(countDown,1000);

var searcularOath2 = new OAuth2('searcular', {
  client_id: 'fb746eac6af87f5fa720',
  client_secret: 'bfffa96c637735d7fc0384ec143bff3537df81a8',
  api_scope: 'write'
});
searcularOath2.authorize();

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

        console.log("userID saved: %s", userID);
    } else if (request.action.match('getUserID') != null) {
        var res = localStorage.getItem("userID");

        console.log("userID collected from HTML5 local storage: %s", userID);

        sendResponse({
            'userID' : res
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
		
		sendResponse({
			"keywords" : lastQuery 
		});

	}else if (request.action.match('getAccessToken') != null) {
		searcularOath2.authorize(function() {
			sendResponse({
				"token" : searcularOath2.getAccessToken()
			});
  

		});
		

	}
});



function countDown(){
	if(queryTimelimit>0){
		queryTimelimit = queryTimelimit -1;
		if(queryTimelimit==0){
			leaveQuerySession();
		}
	}
	
	
	for(var p in onUpdateCounter){
		if(onUpdateCounter[p]>0){
			if(--onUpdateCounter[p]==0){
				var callback = function(tab){
					
					if(tab.url.indexOf("https://www.google.c")==0&&tab.url.indexOf("q=")>0){
						if(!INSESSION){
							enterQuerySession();
						}else{
							//refresh querysession
							queryTimelimit = TIMELIMIT;
						}
						

					}
					if(queryTimelimit>0){
						var timestamp = (new Date).getTime();
						querySessionlog.push(new queryAction(timestamp,"JP",tab.id));
						console.log(timestamp+"   tab "+tab.id+" is updated");

						if(sessionStorage.getItem(tab.id)==null){
							sessionStorage.setItem(tab.id,tab.url);
						}else{
							var temp = sessionStorage.getItem(tab.id);
							
								sessionStorage.setItem(tab.id, temp+" "+tab.url);
							
							
						}
					}
					
					
				}
				chrome.tabs.get(parseInt(p), callback);
				
			}
		}
	}
	
}



function queryAction(timestamp,action,additional){
	
	this.timestamp = timestamp;
	this.action = action ;
	this.additional = additional;
}

function enterQuerySession(){
	INSESSION = true ; 
	queryTimelimit = TIMELIMIT;
	var timestamp  = (new Date).getTime();
			querySessionlog.push(new queryAction(timestamp,"EQ",currentTabId));
			console.log(timestamp +"   enter query session at tab :"+currentTabId);
	// chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	// 	currentTabId = tabs[0].id;
		
	// 		var timestamp  = (new Date).getTime();
	// 		querySessionlog.push(new queryAction(timestamp,"EQ",currentTabId));
	// 		console.log(timestamp +"   enter query session at tab :"+currentTabId);
			
		
		
  		
  		
	// });
		

	
}


function leaveQuerySession(){

	var timestamp  = (new Date).getTime();
	querySessionlog.push(new queryAction(timestamp,"LQ",""));
	console.log((new Date).getTime()+"    leaveQuerySession");
	INSESSION = false;
	
	var tabUrlMap = buildTabURLMap();
	
	var updatePointer = buildUpdatePointer(tabUrlMap);
	for(var i = 0 , l = querySessionlog.length ; i<l; i++){
		var action = querySessionlog[i].action;
		var additional = querySessionlog[i].additional;
		if("JP" == action){
			var tabId = additional;
			if((tabUrlMap[tabId])[updatePointer[tabId]]==0){
				querySessionlog[i].additional = tabId+" "+(tabUrlMap[tabId])[0]; 
				updatePointer[tabId]++;
			}else{
				if ((tabUrlMap[tabId])[updatePointer[tabId]]!=(tabUrlMap[tabId])[updatePointer[tabId]-1]){

					querySessionlog[i].additional = tabId+" "+(tabUrlMap[tabId])[updatePointer[tabId]++]; 
				}else{
					querySessionlog[i].additional = "";
				}	
			}
			
			
			
			
		}else if("SW" == action || "CL" == action ){
			// var tabId = additional;
			// querySessionlog[i].additional = (tabUrlMap[tabId])[updatePointer[tabId]];
		}else if("EQ" == action){
			// var tabId = additional;
			// querySessionlog[i].additional = (tabUrlMap[tabId])[updatePointer[tabId]];

		}else if("CR" == action){
			// var tabIdArray = additional.split(" ");
			// var newTabId  = tabIdArray[0];
			// var sourceTabId = tabIdArray[1];
			// querySessionlog[i].additional = (tabUrlMap[tabId])[updatePointer[newTabId]]+" "+(tabUrlMap[tabId])[updatePointer[sourceTabId]];
			                                                //new                               //source

		}

	}

	onUpdateCounter = {};
	sessionStorage.clear();
	
	//TODO upload logs

	var jsondata = JSON.stringify({"objects":querySessionlog});
	querySessionlog=[];
	console.log(jsondata);
	$.ajax({
		beforeSend: function (request){
            request.setRequestHeader('Authorization','OAuth '+searcularOath2.getAccessToken());
        },
    	url: APIURL+'rawquerylog/',
   		type: 'PATCH',
  		contentType: 'application/json',
  		data: jsondata,
  		dataType: 'json',
  		processData: false,
  		statusCode: {
    		401: function() {
      			alert("Searcular authentication failed,click 'ok' to re-authenticate.");
      			searcularOath2.clear();
      			searcularOath2.authorize();

    		}
  		}
   		
	});

}

function buildTabURLMap(){
	var urlmap ={};
	for(var key in sessionStorage){
		var urlString = sessionStorage.getItem(key);
		var urlArray = urlString.split(" ");
		urlmap[key]=urlArray;

	}
	return urlmap;
}

function buildUpdatePointer(taburlmap){
	var updatePointer = {};
	for(var p in taburlmap){
		updatePointer[p] = 0;
	}
	return updatePointer;
}

chrome.tabs.onCreated.addListener(function(tab) {
	if(queryTimelimit>0){
		var id = tab.id;
		for(var key in onUpdateCounter){
			if( key==currentTabId+"" ){
				onUpdateCounter[id]=0;
				var timestamp  = (new Date).getTime();
				querySessionlog.push(new queryAction(timestamp,"CR",id+" "+currentTabId));
				console.log(timestamp+"    create new tab "+id+" from tab "+ currentTabId);
			}
		}
	}

});

chrome.tabs.onHighlighted.addListener(function(HighlightInfo){
	
	currentTabId = HighlightInfo.tabIds[0];
	if(queryTimelimit>0){
		for(var key in onUpdateCounter){
			if (currentTabId+"" == key){
				var timestamp  = (new Date).getTime();
				querySessionlog.push(new queryAction(timestamp,"SW",currentTabId));
				console.log((new Date).getTime()+"   switch to tab "+ currentTabId);
				return;
			}
		}
		
	}
	
	
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	if(queryTimelimit>0){
		for(var key in onUpdateCounter){
			if (tabId+"" == key){
				var timestamp  = (new Date).getTime();
				querySessionlog.push(new queryAction(timestamp,"CL",tabId));
				console.log((new Date).getTime()+"    close tab "+ tabId);
				return;
			}
		}
		
	}
	

});




//TODO filtering
//record query session
chrome.tabs.onUpdated.addListener(function(tabid,info,tab) {
	
	
	

	if(onUpdateCounter[tabid]!=undefined||tab.url.indexOf("https://www.google.c")==0){
		if(info.status == 'complete'){
			
			onUpdateCounter[tabid] = 2;	
		}
	}
	if (info = "loading") {
		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
			currentTabId = tabs[0].id;  		
		});
	}
		
});




chrome.browserAction.onClicked.addListener(function(tab) {
	 	chrome.tabs.executeScript(null, {file: 'js/testing.js'});
	 	 
 });



