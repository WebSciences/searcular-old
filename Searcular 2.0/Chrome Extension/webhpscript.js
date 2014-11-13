function isDocumentReady() {
  return document.webkitVisibilityState != "hidden" && document.webkitVisibilityState != "prerender";
}


(function() {
	prepareLinks();	
})();


function prepareLinks() {
	if (verifyWebSearch()) {
		addLinksListener();
	}
}

function addLinksListener() {
	var g_list = document.getElementById('rso').querySelectorAll('.g .r a');
	if (g_list.length < 1) {
		return;
	}
	for(var i=0; i<g_list.length; i++) {
		g_list[i].addEventListener("click", 
        function (event) {
           event.preventDefault();
           chrome.runtime.sendMessage({message : 'trackTab' , url: this.href , searchstring : getSearchString()}, function(response) {
				window.location = response.url;			   	
		   });
        }, 
        false);
	}
}

function verifyWebSearch() {
	var hdtb_msb = document.getElementById('hdtb_msb');
	var hdtb_msb_child_nodes = hdtb_msb.childNodes;
	
	for(var i=0; i<hdtb_msb_child_nodes.length; i++)
	{
		if (hdtb_msb_child_nodes[i].innerHTML == 'Web' && 
		hdtb_msb_child_nodes[i].classList.contains('hdtb_msel')) {
			return true;
		}
	}
	return false;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  	if (request.message == 'verifyWeb') {
   		var isWebSearch = verifyWebSearch();
      	sendResponse({isWebSearch: isWebSearch , searchstring : getSearchString()});
    }
});

function getSearchString() {
	return document.getElementById('gbqfq').value;
}


