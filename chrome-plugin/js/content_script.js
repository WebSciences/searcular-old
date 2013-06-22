//@import "../bootstrap.js"; 

var WEBSITE_ROOT = "http://dev.searcular.com/";
var SERVICE_ROOT = WEBSITE_ROOT + "RemoteServices/";
var USER_IMG = WEBSITE_ROOT + "img/user_images/";


// local images
var img_grey = chrome.extension.getURL("images/grey_logo_min.png");
var img_full = chrome.extension.getURL("images/full_logo_min.png");
var img_key = chrome.extension.getURL("images/key.png");
var img_toggle = chrome.extension.getURL("images/toggle.png");
var img_topic = chrome.extension.getURL("images/topics.png");
var img_delete = chrome.extension.getURL("images/delete.png");
var icon19 = chrome.extension.getURL("images/icon19.png");
var icon38 = chrome.extension.getURL("images/icon38.png");

var userID = 0;
var lastQuery = getTheLastQuery();
///**
// * save user id to background.js
// */
function saveUserID() {
//    $.post(SERVICE_ROOT + 'getUserAuthentication.json', {
//
//    }, function (response, code) {
////        console.log("userID saved: %s", response.userID);
////        localStorage.setItem("userID", response.userID);

    chrome.extension.sendMessage({
        userID: userID,
        action: 'saveUserID'
    });

//        if (typeof response.userID != 'undefined') {
//            //set global var userID value
//            window.userID = response.userID;
//        }
//    });

}

///**
// * get user id from background.js
// */
function getUserID(logged_in, not_logged_in) {
//    chrome.extension.sendMessage({
//        action: 'getUserID'
//    }, function (response) {
//        userID = response.userID;
////        console.log('userID: ')
//
//        if(userID != null){
//            logged_in();
//        }else{
//            not_logged_in();
//        }
//    });
    $.post(SERVICE_ROOT + 'getUserAuthentication.json', {  // log in the user to access services

    }, function (response, code) {
        window.userID = response.userID;

        if (userID == null || userID == 0) {  // remote auth failed
            not_logged_in();
        } else {
            console.log("userID saved: %s", response.userID);

            // only works for the same webpage
            localStorage.setItem("userID", response.userID);

            chrome.extension.sendMessage({
                userID: response.userID,
                action: 'saveUserID'
            });

            logged_in();
        }

//
//        if (typeof response.userID != 'undefined') {
//            //set global var userID value
//            window.userID = response.userID;
//        }
    });
}

function getTheLastQuery() {

    chrome.extension.sendMessage({
        action: 'getLastQuery'
    }, function (response) {
        window.lastQuery = response.lastQuery;

    });
    return window.lastQuery;
}


/****************************************** CLICK HANDLERS ******************************************/

/**
 * toggle the visibility of the module window
 */
function toggleModuleWindow() {
    event.preventDefault();
    event.stopPropagation();

    //TODO: finish menu toggle - save current setting on background.js in order to preserve state upon refresh

    chrome.extension.sendMessage({
        action: 'getCurrentModuleState'
    }, function (response) {
        var currentModuleState = response.currentModuleState;

        if (currentModuleState == 0) {
            $('#sdb-tabs').fadeIn();

            //update visibility status
            chrome.extension.sendMessage({
                currentModuleState: 1,
                action: 'setCurrentModuleState'
            });


        } else {
            $('#sdb-tabs').fadeOut();

            //update visibility status
            chrome.extension.sendMessage({
                currentModuleState: 0,
                action: 'setCurrentModuleState'
            });
        }
    });
}

/**
 * handle the click event of "edit" in googleSearchDialog.
 */
function editLinkClickHandler(event) {
    event.preventDefault();
    event.stopPropagation();
}

/**
 * handle the click event of "delete" in googleSearchDialog.
 */
function deleteItemClickHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    alert('Delete Item with ID: ' + event.data.id);
}

/**
 * handle the click event of submit reply.
 */
function submitReplyClickHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    alert('Submit Reply for Item with ID: ' + event.data.id);
}

/**
 * handle the click event of "toggle" in googleSearchDialog.
 */
function toggleDetailsClickHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    //check current visibility status and toggle
    if ($('#sdb-expand-' + event.data.id + '').css('display') === 'none') {
        $('#sdb-expand-' + event.data.id + '').show();
        $('#sdb-more-actions-' + event.data.id + '').show();
        $('#toggle-expand-link-' + event.data.id + '').text("Collapse");
    } else {
        $('#sdb-expand-' + event.data.id + '').hide();
        $('#toggle-expand-link-' + event.data.id + '').text("Expand");

        //hide reply button
        $('#sdb-reply-' + event.data.id + '').hide();

        //reset textarea size
        $('#sdb-reply-form-' + event.data.id + '').height(30);

        //reset li padding
        $('#sdb-li-' + event.data.id + '').css({"padding-bottom": "10px"});
    }
}

/**
 * handle the click event of input field in reply box
 */
function toggleReplyDivClickHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    //increase textarea size and show reply button
    $(this).height(50);
    $('#sdb-reply-' + event.data.id + '').show();

    //increase li padding so that reply button does not overlap next bookmark
    $(this).parent().parent().css({"padding-bottom": "25px"});
}

/****************************************************************************************************/



$(document).ready(main);

function main() {
//    if (window.location.href.match(WEBSITE_ROOT + "items/public_index") != null){
//        //get user id after logging in on Web server
//        saveUserID();
//    }
//
//    if (window.location.href.match(WEBSITE_ROOT + "users/login") != null){
//        // clear userID
//        localStorage.removeItem("userID");
//
//        console.log("userID removed")
//    }

    // get user id
    getUserID(
        function () {  // logged in
//            console.log("User logged in. Creating Searcular dialog.")
            saveUserID();

            var domain = window.location.origin;
            // add sdb module only on Google search result page
            if (domain.match("http://www.google.com") != null
                || domain.match("https://www.google.com") != null
                || domain.match("http://www.google.co.uk") != null
                || domain.match("https://www.google.co.uk")) {

                // check continuously
                setInterval(function () {
                    if ($('#mini_logo').length == 0 && $('h3[class="r"]').length != 0) {
                        // wait a little bit for the page to load completely
                        setTimeout(function () {
                            //                            console.log("Searcular dialog not found")

                            //create the toolbar button and the module window
                            createMiniMenu();

                            //                            console.log("Mini menu created")
                            //createModuleGoogle();
                        }, 100);
                    }
                }, 500);
            }
        }, function () {  // not logged in
            // TODO: ask for log in
        });

    // query changed
    // $('input[name="q"]').change(function(eventObj) {
    // setTimeout(function() {
    //
    // createModuleGoogle();
    // }, 1000);
    // });
    // $('input[name="q"]').keyup(function(eventObj) {
    // setTimeout(function() {
    //
    // createModuleGoogle();
    // }, 1000);
    // });

    // use last known search
//    } else {  // webpage
//
//    }
}

function createModuleWebpage() {
    // get the last known search query from background.js

    chrome.extension.sendMessage({
        action: 'getLastQuery'
    }, function (response) {
        window.lastQuery = response.lastQuery;
        createAddItemDialogWebpage(lastQuery);
    });
    console.log(lastQuery)
    return window.lastQuery;


}

function createAddItemDialogWebpage(lastQuery) {
    $('body').append(
        '<div id="sdb-webpage-dialog" class="sdb-webpage-dialog">'
            + '<div id="sdb-notification" class="sdb-notification">'
            + '<a href="#" id="sdb-webpage-save">Save</a> this page with keywords: '
            + '<label id="sdb-keywords" style="font-weight: bold;">'
            + lastQuery
            + '</label>?</div></div>');

    // show dialog
    $('#sdb-webpage-dialog').dialog({
        'minHeight': 80,
        'minWidth': 120,
        'hide': {
            effect: 'fade',
            duration: 2000
        },
        'position': [ 'right', 'bottom' ],
        'open': function () {
            // hide the dialog title
            $('.ui-dialog-titlebar').css('display', 'none');
        }
    });

    // listen to the save action
    $('#sdb-webpage-save').click(
        function (event) {
            event.preventDefault();

            $.post(SERVICE_ROOT + "addItem.xml", {
                "url": document.URL,
                "title": document.title,
                "keywords": lastQuery,
                "user_id": userID,
                "token": 0
            }, function (data, status) {

                var itemId;
                // notification
                $('div#sdb-notification').html(
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
        });
    // refreshBrowser();

}


/**
 * create mini menu
 */
function createMiniMenu() {


    //check if user is logged in to show module or login form
    if (userID != 0) {

        //create plugin window
        createModuleGoogle();

        //get user profile picture
        var img = USER_IMG + userID + ".jpg";

        var html = "<li class='ab_ctl'>"
            + "<a href='#' id='mini_logo'>"
            + "<img src='" + img + "' width='24' height='24' />&nbsp;&nbsp;"
            + "<img src='" + window.icon38 + "' width='24' height='24' />"
            + "</a>"
            + "<div id='user_menu'>teste</div>"
            + "</li>";

        //add menu to page
        $('#ab_ctls').prepend(html);


        //hover div effect 
        $(document).on({
            mouseenter: function () {
                //$("#user_menu").show(); --> commented for presentation purposese
            },
            mouseleave: function () {
                //$("#user_menu").hide(); --> commented for presentation purposese
            }
        }, "#mini_logo");

        //toggle module window click behaviour
        $(document).on("click", "#mini_logo", toggleModuleWindow);
    } else {
        //alert("login user");

        console.log("user not logged in");

        var html = "<li class='ab_ctl'><a href='#' id='mini_logo'><img src='" + window.icon38 + "' width='24' height='24' /></a></li>";

        //add button to page
        $('#ab_ctls').prepend(html);
    }
}


//TODO: OPTIMIZE - duplicate getItemsByQuery method
function createModuleGoogle() {

    var query = $('input[name="q"]').val();

    // create an icon after each search result item
    var iconHtml = '&nbsp;&nbsp;<a name="sdb-link" href="#" class="sdb-link">'
        + '<img style="vertical-align: middle;" src="'
        + window.img_grey
        + '" /></a>';

    //full coloured icon - when the item has been already saved
    var savedIconHtml =
        '&nbsp;&nbsp;<img style="vertical-align: middle;" src="'
            + window.img_full
            + '" />';

    //for each search result, check if already saved, to change the icon and remove link button
    $.post(SERVICE_ROOT + 'getItemsByQuery.json', {
        'query': query,
        'user_id': userID,
        'token': 0
    }, function (response, code) {


        $('h3[class="r"]').each(function () {
            var saved = 0;
            var preText = $(this).parent().find('span .b');
            var url = $(this).parent().find('a').first().attr('href');

            for (var i = 0; i < response.length; i++) {
                if (response[i].Item.url == url) {
                    saved = 1;
                    break;
                }
            }


            if (preText.length !== 0) {
                if (saved) {
                    $(preText).append(savedIconHtml);
                } else {
                    $(preText).append(iconHtml);
                }
            } else {
                if (saved) {
                    $(this).append(savedIconHtml);
                } else {
                    $(this).append(iconHtml);
                }
            }

        });

        // bind the click event of the icon after each search result item
        $('a[name="sdb-link"]').click(function (event) {
            event.preventDefault();

            $('#sdb-dialog-form').show();

            displayAddItemDialogGoogle($(this));
        });
    });

    createAddItemDialogGoogle();

    createSuggestionBlockGoogle();

    // use message passing to record the last known search
    chrome.extension.sendMessage({
        lastQuery: $('input[name="q"]').val(),
        action: 'saveLastQuery'
    });

    //window.lastQuery = $('input[name="q"]').val();
}

function topicAutocomplete() {
    $.widget("ui.combobox", {
        _create: function () {
            var input;
            var self = this;
            var select = this.element.hide();
            var selected = select.children(":selected");
            var value = selected.val()
                ? selected.text()
                : "";
            var wrapper = this.wrapper = $('<span>').addClass("ui-combobox").insertAfter(select);

            input = $('<input id="sdb-topic-name">').appendTo(wrapper).val(value).addClass("ui-state-default ui-combobox-input sdb-topic-input").autocomplete(
                {
                    delay: 0,
                    minLength: 0,
                    source: function (request, response) {
                        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                        response(select.children("option").map(
                            function () {
                                var text = $(this).text();
                                if (this.value && (!request.term || matcher.test(text)))
                                    return {
                                        label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)",
                                            "gi"), "<strong>$1</strong>"),
                                        value: text,
                                        option: this
                                    };
                            }));
                    },
                    select: function (event, ui) {
                        ui.item.option.selected = true;
                        self._trigger("selected", event, {
                            item: ui.item.option
                        });
                        // save the selected topic id
                        $('#sdb-topic-id').val(ui.item.option.value);
                    },
                    change: function (event, ui) {
                        if (!ui.item) {
                            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"), valid = false;
                            select.children("option").each(function () {
                                if ($(this).text().match(matcher)) {
                                    // save the selected topic id
                                    this.selected = valid = true;

                                    $('#sdb-topic-id').val(ui.item.value);
                                    return false;
                                }
                            });
                            if (!valid) {
                                // creating a new topic
                                $('#sdb-topic-id').val(-1);

                                return false;
                            }
                        }
                    }
                }).addClass("ui-widget ui-widget-content ui-corner-left");

            input.data("autocomplete")._renderItem = function (ul, item) {
                return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
            };

            $("<a>").attr("tabIndex", -1).attr("title", "Show All Items").appendTo(wrapper).button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            }).removeClass("ui-corner-all").addClass("ui-corner-right ui-combobox-toggle sdb-topic-button").click(function () {
                    // close if already visible
                    if (input.autocomplete("widget").is(":visible")) {
                        input.autocomplete("close");
                        return;
                    }

                    // work around a bug (likely same cause as #5265)
                    $(this).blur();

                    // pass empty string as value to search for, displaying
                    // all results
                    input.autocomplete("search", "");
                    input.focus();
                });
        },

        destroy: function () {
            this.wrapper.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        }
    });

    $('#sdb-topic-select').combobox();
}

/**
 * create a floating dialog when adding directly from google search result page.
 */
function createAddItemDialogGoogle() {
    $('div#search').append(
        '<div id="sdb-dialog" class="sdb-dialog" style="display: none;">'
            + '<div id="sdb-dialog-form">'
            + '<div><label id="sdb-title" style="font-weight: bold;"></label></div>'
            + '<div>would be added to the topic:</div>'
            + '<div><select id="sdb-topic-select"></select></div>'
            + '<div>with the following keywords:</div>'
            + '<div><input type="text" id="sdb-keywords" class="sdb-keywords-input" readonly/></div>'
            // helper hidden fields
            + '<input type="hidden" id="sdb-topic-id" />'
            + '<input type="hidden" id="sdb-url" />'
            + '<input type="hidden" id="sdb-snippet" />'
            + '<input type="hidden" id="sdb-position" />'
            + '<div class="sdb-dialog-link-div">'
            + '<a id="sdb-add-link" href="#">Add</a>'
            + ' or <a id="sdb-edit-link" target="_blank" href="#">edit</a> details on '
            + '<a href='
            + WEBSITE_ROOT
            + ' target="_blank">dev.searcular.com</a>.'
            + '</div></div>'
            + '<div id="sdb-dialog-notification"></div>'
            + '</div>');

    // active the auto complete on topic input
    topicAutocomplete();

    loadTopics();

    // bind the link events
    $('#sdb-add-link').click(addLinkClickHandler);
    $('#sdb-edit-link').click(editLinkClickHandler);
}

/**
 * load user's topics.
 */
function loadTopics() {

    console.log("Loading user's topic w/ userID: " + userID)

    $.post(SERVICE_ROOT + 'getTopicsByOwner.json', {
        'user_id': userID
    }, function (response, status) {

        // load topics into #sdb-topic-select
        if (-1 != response) {
            for (var i = 0; i < response.length; i++) {
                $('#sdb-topic-select').append('<option value="' + response[i].Topic.id + '">' + response[i].Topic.name + '</option>');

                console.log("Topic loaded: " + response[i].Topic.name)
            }
        }

        // save the default selected topic id
        var default_id = $('#sdb-topic-select').val();
        $('#sdb-topic-id').val(default_id);

        console.log("Topic selected as default: " + default_id)

        // get last used topic
        // chrome.extension.sendMessage({
        // action : 'getLastTopic'
        // }, function(response) {
        // lastTopic = response.lastTopic;
        // $('#sdb-topic-select').val(lastTopic);
        // $('#sdb-topic-id').val(lastTopic);
        //        });
    });
}


/**
 * handle the click event of "add" in googleSearchDialog.
 */
function addLinkClickHandler(event) {
    event.preventDefault();

    $('#sdb-dialog-form').hide();
    $('#sdb-dialog-notification').show();

    var token = 0;

    $.post(SERVICE_ROOT + "addItem.json", {
        "url": $('#sdb-url').val(),
        "title": $('#sdb-title').text(),
        "snippet": $('#sdb-snippet').val(),
        "keywords": $('#sdb-keywords').val(),
        "topic_id": $('#sdb-topic-id').val(),
        "topic_name": $('#sdb-topic-name').val(),
        "user_id": userID,
        "token": token,
        "source": 1, // 1:=Google
        "position": 0 //$('#sdb-position').val()
    }, function (response, code) {

        /*
         * response format: "status": 0:=success, -1:=auth failed exists item_id
         * "keyword_ids" "topic_id" "user_id"
         */
        var status = response.status;

        if (0 == status) {
            // success
            $('#sdb-dialog-notification').html('<div style="text-align: center; vertical-align: middle;">' + '<label class="sdb-success">Success!</label></div>');

            //  setTimeout(function() {

            $('#sdb-dialog').dialog('close');

            $('#sdb-dialog-notification').hide();

            // clear tags
            $("#sdb-keywords").tagit("removeAll");
            // }, 1000);

        } else if (-1 == status) {
            // auth failed

        }
    });

    // save last used topic id
    // and get last used topic
    chrome.extension.sendMessage({
        action: 'saveLastTopic',
        lastTopic: $('#sdb-topic-id').val()
    });

    $('#sdb-dialog').dialog('close');

    //reCreateModuleGoogle();
//    ;

}


// Recreate plugin screen upon saving a new link
function reCreateModuleGoogle() {

    var query = $('input[name="q"]').val();

    createSuggestionBlockGoogle();

    //getSuggestionsByQuery();  

    // use message passing to record the last known search
    chrome.extension.sendMessage({
        lastQuery: $('input[name="q"]').val(),
        action: 'saveLastQuery'
    });

    //window.lastQuery = $('input[name="q"]').val();
}


function displayAddItemDialogGoogle(item) {

    // clear
    $('#sdb-topic-select').html('');
    loadTopics();

    // show the dialog
    $('#sdb-dialog').dialog({
        'minHeight': 400,
        'width': 640,
        'hide': {
            effect: 'fade',
            duration: 500
        },
        'position': [ 'middle', 'center' ],
        'resizable': false,
        'draggable': false,
        'modal': true,
        'title': 'Add an item to Searcular',
        'open': function () {

            // hide the titlebar
            // $('.ui-dialog-titlebar').css('display', 'none');

            // // bind the float
            // $(window).bind('scroll', function(evt) {
            //                
            // var scrollTop = $(window).scrollTop();
            // var bottom = $(document).height() - scrollTop;
            //                
            // $d.dialog("option", {
            // "position" : [ dlg_offset_x, ((dlg_margin_top - scrollTop > 0)
            // ? dlg_margin_top - scrollTop
            // : ((bottom - dlg_height > dlg_margin_bottom)
            // ? 0
            // : bottom - dlg_height - dlg_margin_bottom)) ]
            // });
            // });

            // get and set parameters
            var parentDiv = $(item).parent();
            if (parentDiv.attr('class') === "vsc") {
                ;
            } else {
                parentDiv = $(parentDiv).parent().parent();
            }

            var url = $(parentDiv).find('a').first().attr('href');
            var title = $(parentDiv).find('a').first().text();
            //var query = $('input[name="q"]').val();
            var snippet = $(parentDiv).find('span.st').first().text();
//            var position = $(parentDiv).find('div.esc').first().attr('id');
            // the position always start from 1
//            position = new Number(position.substring(3, 4)) + 1;

            $('#sdb-title').text(title);
            $('#sdb-url').val(url);
            $('#sdb-snippet').val(snippet);
//            $('#sdb-position').val(position);
            $('#sdb-keywords').val(query);

            // test keywords from query using bloom filter
            chrome.extension.sendMessage({
                action: 'getKeywordsByQuery'
            }, function (response) {

                /* to be enabled again when analysing keywords

                 var keywordsByQuery = response.keywords;
                 for ( var i = 0; i < keywordsByQuery.length; i++) {
                 keywordsArray[keywordsArray.length] = keywordsByQuery[i];
                 }

                 keywordsArray = dedupe(keywordsArray);

                 // active tag-it widget
                 $('#sdb-keywords').tagit({
                 "itemName" : "item",
                 "fieldName" : "keywords",
                 "availableKeywords" : keywordsArray
                 });

                 // set default keywords from query
                 for ( var i = 0; i < keywordsByQuery.length; i++) {
                 $("#sdb-keywords").tagit("createTag", keywordsByQuery[i]);
                 }*/
                var keywordsByQuery = response.keywords;
                // active tag-it widget
                $('#sdb-keywords').tagit({
                    "itemName": "item",
                    "fieldName": "keywords",
                    "availableKeywords": keywordsByQuery,
                    "createTag": keywordsByQuery
                });
            });

            // get keywords recommendation from DB
//            $.post(SERVICE_ROOT + "getKeywordsSuggestionByItem.json", {
//                "user_id": userID,
//                "item_url": url,
//                //"query" : query,
//                "token": 0
//            }, function (response, code) {

//                var keywordsArray = new Array();
//                for (var i = 0; i < response.length; i++) {
//                    keywordsArray[keywordsArray.length] = response[i].Keyword.name;
//                }


//            });

        }
    });

}

/**
 * top-right box for suggestions display.
 */
function createSuggestionBlockGoogle() {


    // var blockHtml = '<fieldset id="sdb" class="sdb-fieldset"><legend
    // class="sdb-legend">from Search Daybook</legend>';
    chrome.extension.sendMessage({
        action: 'getCurrentModuleState'
    }, function (response) {

//        currentModuleState = response.currentModuleState;
        var currentModuleState = 1;
        //define suggestion block visibility
        var blockHtml;
        if (currentModuleState == 0) {
            blockHtml = '<div id="sdb-tabs" class="sdb-tabs" style="display:none;">';

        } else {
            blockHtml = '<div id="sdb-tabs" class="sdb-tabs">';
        }


        $('#myTab a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });


        $(function () {
            $("#check").button();
            $("#format").buttonset();
        });

        blockHtml += '<ul>';
        blockHtml += '<li><a href="#tab-items" title="Items">Things Found</a></li>';
        blockHtml += '<li><a href="#tab-topics" title="Topics">Topics</a></li>';
        blockHtml += '<li><a href="#tab-keywords" title="Keywords">Queries</a></li>';

        //blockHtml += '<input type="ui-button" id="check"/><label for="check">Public</label>';

        //add dropdown to toggle results between private / public
        blockHtml += '<select name="toggle_feed" id="toggle_feed">';
        blockHtml += '<option value="personal">Personal</option>';
        blockHtml += '<option value="public" selected>Public</option>';
        blockHtml += '</select>';
        //blockHtml += '<li><a href="#" title="Public">Public</a></li>';
        blockHtml += '</ul>';

        blockHtml += '<div id="tab-items"><ul id="items-by-query" class="sdb-ul"></ul></div>';
        blockHtml += '<div id="tab-topics"><ul id="topics-by-query" class="sdb-ul"></ul></div>';
        blockHtml += '<div id="tab-keywords"><ul id="keywords-by-query" class="sdb-ul"></ul></div>';
        //blockHtml += '<div id="tab-view"><ul id="results-view-mode" class="sdb-ul"></ul></div>';
        blockHtml += '</div>';


        $('div#rhs_block.rhstc5').prepend(blockHtml);
        //$('div#rhs_block.rhstc5').prepend(s);

        $('#rhs_block').css('margin-bottom', '0px');

        // active tabs
        $('#sdb-tabs').tabs();

        // retrieve data
//        getSuggestionsByQuery();
        getPublicSuggestionsByQuery();
    });
};


/**
 * get items/topics/keywords by query.
 */
function getSuggestionsByQuery() {

    query = $('input[name="q"]').val();

    $.post(SERVICE_ROOT + 'getItemsByQuery.json', {
        'query': query,
        'user_id': userID,
        'token': 0
    }, function (response, code) {

        //empty the current list
        $('#items-by-query').empty();

        //return message if no saved bookmarks
        if (response.length == 0) {
            $('#items-by-query').append(
                '<li class="sdb-li">No saved things found for your query</li>'
            );
        } else {

            var noOfresults = response.length;

            //Header describing the results tab 
            $('#items-by-query').append(

                '<li class="sdb-li"> ' + noOfresults + ' results found for "' + query + '"</li>'
            );

            for (var i = 0; i < response.length; i++) {

                var id = response[i].Item.id;
                var url = response[i].Item.url;
                var title = response[i].Item.title;
                var snippet = response[i].Item.snippet;

                var max_length = 50;

                //truncate the title 
                if (title.length > max_length) {
                    title = title.substr(0, max_length);
                    title += '...';
                }

                $('#items-by-query').append(
                    '<li class="sdb-li" id="sdb-li-' + id + '">'
                        + '<a target="_blank" href="' + url + '">' + title + '</a>'

                        + '<div class="sdb-more-details" id="sdb-more-details-' + id + '">'
                        + snippet
                        + '<br/><br/>'
                        + '<div class="sdb-expand-link" id="sdb-expand-link-' + id + '">'
                        + '<a id="toggle-expand-link-' + id + '" target="_blank" href="#" class="expand-link" >Expand</a>&nbsp;'
                        + '</div>'

                        + '<div class="sdb-more-actions" id="sdb-more-actions-' + id + '">'
                        + '<a id="sdb-delete-link-' + id + '" class="sdb-reply-link" target="_blank" href="#">Delete</a>&nbsp;'
                        //+ '<a id="sdb-delete-link-'+ id +'" class="sdb-reply-link" target="_blank" href="#"><img src="'+ window.img_delete +'" height= "12" width="12" align="middle"/>&nbsp;Delete</a>&nbsp;'
                        + '</div>'
                        + '</div>'
                        + '<br/>'

                        + '<div class="sdb-expand" id="sdb-expand-' + id + '">'
                        + '<textarea name="sdb-reply-form-' + id + '" id="sdb-reply-form-' + id + '" class="sdb-reply-form" /></textarea><br/>'
                        + '</div>'

                        + '<div class="sdb-reply" id="sdb-reply-' + id + '">'
                        + '<a id="sdb-reply-link-' + id + '" class="sdb-reply-link" target="_blank" href="#">Reply</a>'
                        + '</div>'

                        + '</li>');


                //delete button behaviour
                $('#sdb-delete-link-' + id + '').click({id: id}, deleteItemClickHandler);

                //toggle button behaviour
                $('#toggle-expand-link-' + id + '').click({id: id}, toggleDetailsClickHandler);

                //click div behaviour
                $('#sdb-li-' + id + '').click({id: id}, toggleDetailsClickHandler);

                //input click behaviour
                $('#sdb-reply-form-' + id + '').click({id: id}, toggleReplyDivClickHandler);

                //submit click behaviour
                $('#sdb-reply-link-' + id + '').click({id: id}, submitReplyClickHandler);

                //div hover behaviour
                $('#sdb-li-' + id + '').hover(
                    function () {

                        //check if div is visible, to show on hover
                        if ($(this).find(".sdb-more-actions").css('display') === 'none') {
                            $(this).find(".sdb-more-actions").show();
                        }

                    },
                    function () {

                        //if expand div is visible, no hide on hover out
                        if ($(this).find(".sdb-expand").css('display') === 'none') {
                            $(this).find(".sdb-more-actions").hide();
                        }
                    }
                );

            }
        }
    });


    $.post(SERVICE_ROOT + 'getTopicsByQuery.json', {
        'query': query,
        'user_id': userID,
        'token': 0
    }, function (response, code) {


        $('#topics-by-query').empty();

        //return message if no saved topics
        if (response.length == 0) {

            $('#topics-by-query').append(
                '<li class="sdb-li">No saved topics found for your query</li>'
            );

        } else {

            for (var i = 0; i < response.length; i++) {
                $('#topics-by-query').append(
                    '<li class="sdb-li">'
                        + '<a target="_blank" href="'
                        + WEBSITE_ROOT
                        + 'topics/view/'
                        + response[i].Topic.id
                        + '">'
                        + response[i].Topic.name
                        + '</a></li>');
            }
        }
    });


    $.post(SERVICE_ROOT + 'getKeywordsByQuery.json', {
        'query': query,
        'user_id': userID,
        'token': 0
    }, function (response, code) {

        $('#keywords-by-query').empty();

        //return message if no saved topics
        if (response.length == 0) {
            $('#keywords-by-query').append(
                '<li class="sdb-li">No similar query keywords found</li>'
            );
        } else {

            var noOfkeywords = response.length;

            //Header describing the keyworks/queries tab 

            $('#keywords-by-query').append(

                '<li class="sdb-li"> We found ' + noOfkeywords + ' similar queries</li>'
            );

            for (var i = 0; i < response.length; i++) {
                $('#keywords-by-query').append(
                    '<li class="sdb-li">'
                        + '<a target="_blank" href="'
                        + WEBSITE_ROOT
                        + 'keywords/view/'
                        + response[i].Keyword.id
                        + '">'
                        + response[i].Keyword.name
                        + '</a></li>');
            }
        }
    });


    //listener for the change in the dropdown
    $("#toggle_feed").change(function () {
        toggleFeed($(this).val());
    });
}


/**
 * get public items/topics/keywords by query.
 */
function getPublicSuggestionsByQuery() {

    query = $('input[name="q"]').val();


    $.post(SERVICE_ROOT + 'getPublicItemsByQuery.json', {
        'query': query,
        'token': 0
    }, function (response, code) {

        //empty the current list
        $('#items-by-query').empty();

        if (response.length == 0) {
            $('#items-by-query').append(
                '<li class="sdb-li">There are no saved items for the current query</li>'
            );
        } else {
            var n_results = response.length;

            //Header describing the results tab 
            $('#items-by-query').append(

                '<li class="sdb-li"> ' + n_results + ' public results found for "' + query + '"</li>'
            );

            for (var i = 0; i < n_results; i++) {

                var id = response[i].Item.id;
                var url = response[i].Item.url;
                var title = response[i].Item.title;
                var snippet = response[i].Item.snippet;
                var user_id = response[i].User.id;
                var user_name = response[i].User.username;
//                var user_image_url = response[i].User.image_url;

                var max_length = 50;

                //truncate the title 
                if (title.length > max_length) {
                    title = title.substr(0, max_length);
                    title += '...';
                }

                $('#items-by-query').append(
                    '<li class="sdb-li" id="sdb-li-' + id + '">'
                        // user's info
                        + '<a href="' + WEBSITE_ROOT + 'items/user_timeline/' + user_id + '" target="_blank">'
                        + '<img width="30px" src="' + USER_IMG + user_id + '" /></a>&nbsp;&nbsp;'
                        + '<a href="' + WEBSITE_ROOT + 'items/user_timeline/' + user_id + '" target="_blank">' + user_name + '</a>&nbsp;&nbsp;found <br />'
                        + '<a target="_blank" href="' + url + '">' + title + '</a>'
                        + '<div class="sdb-li-cite">' + url + '</div>'

                        + '<div class="sdb-more-details" id="sdb-more-details-' + id + '">'
                        + snippet
                        + '<br/>'
                        + '<div class="sdb-expand-link" id="sdb-expand-link-' + id + '">'
                        + '<a id="toggle-expand-link-' + id + '" target="_blank" href="#" class="expand-link" >Expand</a>&nbsp;'
                        + '</div>'

                        + '<div class="sdb-more-actions" id="sdb-more-actions-' + id + '">'
                        + '<a id="sdb-delete-link-' + id + '" class="sdb-reply-link" target="_blank" href="#">Delete</a>&nbsp;'
//                        + '<a id="sdb-delete-link-'+ id +'" class="sdb-reply-link" target="_blank" href="#"><img src="'+ window.img_delete +'" height= "12" width="12" align="middle"/>&nbsp;Delete</a>&nbsp;'
                        + '</div>'
                        + '</div>'
                        + '<br/>'

                        + '<div class="sdb-expand" id="sdb-expand-' + id + '">'
                        + '<textarea name="sdb-reply-form-' + id + '" id="sdb-reply-form-' + id + '" class="sdb-reply-form" /></textarea><br/>'
                        + '</div>'

                        + '<div class="sdb-reply" id="sdb-reply-' + id + '">'
                        + '<a id="sdb-reply-link-' + id + '" class="sdb-reply-link" target="_blank" href="#">Reply</a>'
                        + '</div>'

                        + '</li>');


                //delete button behaviour
                $('#sdb-delete-link-' + id + '').click({id: id}, deleteItemClickHandler);

                //toggle button behaviour
                $('#toggle-expand-link-' + id + '').click({id: id}, toggleDetailsClickHandler);

                //click div behaviour
//                $('#sdb-li-' + id + '').click({id: id}, toggleDetailsClickHandler);

                //input click behaviour
//                $('#sdb-reply-form-' + id + '').click({id: id}, toggleReplyDivClickHandler);

                //submit click behaviour
                $('#sdb-reply-link-' + id + '').click({id: id}, submitReplyClickHandler);

                //div hover behaviour
                $('#sdb-li-' + id + '').hover(
                    function () {

                        //check if div is visible, to show on hover
                        if ($(this).find(".sdb-more-actions").css('display') === 'none') {
                            $(this).find(".sdb-more-actions").show();
                        }

                    },
                    function () {

                        //if expand div is visible, no hide on hover out
                        if ($(this).find(".sdb-expand").css('display') === 'none') {
                            $(this).find(".sdb-more-actions").hide();
                        }
                    }
                );

            }
        }
    });


    $.post(SERVICE_ROOT + 'getPublicTopicsByQuery.json', {
        'query': query,
        'token': 0
    }, function (response, code) {

        $('#topics-by-query').empty();

        //return message if no saved topics
        if (response.length == 0) {

            $('#topics-by-query').append(
                '<li class="sdb-li">There are no saved topics for the current query</li>'
            );

        } else {

            for (var i = 0; i < response.length; i++) {
                $('#topics-by-query').append(
                    '<li class="sdb-li">'
                        + '<a target="_blank" href="'
                        + WEBSITE_ROOT
                        + 'items/topic_index/'
                        + response[i].Topic.id
                        + '">'
                        + response[i].Topic.name
                        + '</a></li>');
            }
        }
    });


    $.post(SERVICE_ROOT + 'getPublicKeywordsByQuery.json', {
        'query': query,
        'token': 0
    }, function (response, code) {

        $('#keywords-by-query').empty();

        //return message if no saved topics
        if (response.length == 0) {
            $('#keywords-by-query').append(
                '<li class="sdb-li">No similar query keywords found</li>'
            );
        } else {

            var noOfkeywords = response.length;

            //Header describing the keyworks/queries tab 

            $('#keywords-by-query').append(

                '<li class="sdb-li"> We found ' + noOfkeywords + ' similar queries</li>'
            );

            for (var i = 0; i < response.length; i++) {
                $('#keywords-by-query').append(
                    '<li class="sdb-li">'
                        + '<a target="_blank" href="'
                        + WEBSITE_ROOT
                        + 'items/keyword_index/'
                        + response[i].Keyword.id
                        + '">'
                        + response[i].Keyword.name
                        + '</a></li>');
            }
        }
    });


    //listener for the change in the dropdown
    $("#toggle_feed").change(function () {
        toggleFeed($(this).val());
    });
}


/**
 * toggle the feed between public and personal
 */
function toggleFeed(feed) {

    if (feed == 'personal') {
        getSuggestionsByQuery();
    } else {
        getPublicSuggestionsByQuery();
    }
}
