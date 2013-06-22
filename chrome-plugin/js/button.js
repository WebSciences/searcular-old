var WEBSITE_ROOT = "http://dev.searcular.com/";
var SERVICE_ROOT = WEBSITE_ROOT + "RemoteServices/";

$(document).ready(function () {

    console.log("Clicked!");

    $('.error').hide();

    // console.log(chrome.tabs.getCurrent());

    // get the URL and title of current tab
    var current_url = "http://www.google.co.uk";
    var current_title = "Google UK";

    chrome.tabs.getSelected(null, function (tab) {
        current_url = tab.url;
        current_title = tab.title;
        console.log("Clicked!");

        $('#bookmark_name').val(current_url);
        $('#bookmark_description').val(current_title);
    });
});

$('#submit_btn').click(
    function (event) {
        event.preventDefault();
        $.post(SERVICE_ROOT + "addItem.json", {
            "url": document.URL,
            "title": document.title,
            "keywords": "lastQuery",
            "user_id": 18,
            "token": 0
        }, function (data, status) {
            console.log(status);
            var itemId;
            // notification
            $('div#notification').html(
                'Saved with keywords: <label id="sdb-keywords" style="font-weight: bold;">'
                    + lastQuery
                    + '</label>, '
                    + '<a href="'
                    + WEBSITE_ROOT
                    + 'Items/edit/'
                    + itemId
                    + '" id="sdb-edit">edit</a> or <a href="'
                    + WEBSITE_ROOT
                    + 'Items/del/'
                    + itemId
                    + '" id="sdb-undo">undo</a>.');
        });
        console.log(status);
    });

})
;
