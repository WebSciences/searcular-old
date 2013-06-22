
var WEBSITE_ROOT = "http://dev.searcular.com/";
var SERVICE_ROOT = WEBSITE_ROOT + "RemoteServices/";
var ISRIL_H = '71274';

var serverUserID, userID = 0;


//check if jQuery is loaded
if($) {
	console.log("jquery loaded")
	
	} else {
		console.log("jquery not loaded")
	}
	

 /*
  * SEARCULAR -> Overlay banner, buttons etc. 
  * 
  */

if (SEARCULAR_INIT) {
    SEARCULAR_INIT.save();
} else {
    try {
        if (ISRIL_H) {};
    } catch (e) {
        ISRIL_H = 0
    }
    try {
        if (SEARCULAR_URL) {};
    } catch (e) {
        SEARCULAR_URL = "dev.searcular.com"
    }
    var SEARCULAR = function (a) {
            this.inited = false;
        };
    SEARCULAR.prototype = {
        create: function () {
            var a = document.getElementById("SEARCULAR_STYLE");
            if (a) a.parentNode.removeChild(a);
            var b = document.getElementById("SEARCULAR");
            if (b) b.parentNode.removeChild(b);
            var c = window.innerWidth / screen.availWidth;
            if (c < 1) c = 1;
            var d = window.navigator.userAgent;
            this.isMobile = d.match(/iPad/i) || d.match(/iPhone/i);
            var e = (this.isMobile ? 60 : 80) * c;
            var f = (this.isMobile ? 18 : 20) * c;
            var g = this.isMobile ? e * .95 : e;
            var h = this.isMobile ? "normal" : "bold";
            var i = 6 * c;
            var j = 80 * c;
            var k = 30 * c;
            var l = 30 * c;
            var m = 1 * c;
            if (m < 1) m = 1;
            var n = 17 * c;
            var o = 25 * c;
            var p = 15 * c;
            this.shadowHeight = 20;
            var bg = chrome.extension.getURL("images/icon38.png");
            var q = "\n\t\t\t#SEARCULAR\n\t\t\t{\n\t\t\t\tvisibility:hidden;\n\t\t\t\tposition:fixed;\n\t\t\t\ttop:0px;\n\t\t\t\tleft:0px;\n\t\t\t\twidth:100%;\n\t\t\t\theight:" + e + "px;\n\t\t\t\t-webkit-box-shadow:0px 0px " + this.shadowHeight + "px rgba(0,0,0,0.4);\n\t\t\t\t-moz-box-shadow:0px 0px " + this.shadowHeight + "px rgba(0,0,0,0.4);\n\t\t\t\t-o-box-shadow:0px 0px " + this.shadowHeight + "px rgba(0,0,0,0.4);\n\t\t\t\tbox-shadow:0px 0px " + this.shadowHeight + "px rgba(0,0,0,0.4);\n\t\t\t\tz-index:999999999;\n\t\t\t\tbackground: white;border-bottom:2px solid #399;\n\t\t\t\tfont-size:" + f + "px !important;\n\t\t\t\tfont-family:HelveticaNeue,Helvetica,Arial !important;\n\t\t\t\tline-height:" + g + "px !important;\n\t\t\t\ttext-align: left;\n\t\t\t\tcolor: #4b4b4b !important;\n\t\t\t}\n\t\t\t\n\t\t\t#SEARCULAR_LOGO\n\t\t\t{\n\t\t\t\tdisplay: block;\n\t\t\t\twidth: 200px;\n\t\t\t\theight: 100%;\n\t\t\t\ttext-indent: -789em;\n\t\t\t\tbackground: url("+ bg+") left center no-repeat;\n\t\t\t}\n\t\t\t.PKT_mobile #SEARCULAR_LOGO\n\t\t\t{\n\t\t\t\tdisplay: none;\n\t\t\t}\n\t\t\t.PKT_desktop #SEARCULAR_LABEL\n\t\t\t{\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 0px;\n\t\t\t\tleft: 0px;\n\t\t\t\ttext-align:center;\n\t\t\t\twidth: 100%;\n\t\t\t\tpadding: 0px;\n\t\t\t\tfont-weight: " + h + ";\n\t\t\t}\n\t\t\t\n\t\t\t#SEARCULAR_WRAPPER\n\t\t\t{\n\t\t\t\tpadding-left:7%;\n\t\t\t}\n\t\t\t\n\t\t\t.SEAR_BUTTON\n\t\t\t{\n\t\t\t\tposition:absolute;\n\t\t\t\ttop:" + (this.isMobile ? "25%" : "30%;") + ";\n\t\t\t\tright:17%;\n\t\t\t\twidth: " + j + "px;\n\t\t\t\theight: " + k + "px;\n\t\t\t\tline-height: " + l + "px;\n\t\t\t\tvisibility:hidden;\n\t\t\t\tborder:" + m + "px solid #a4a4a4;\n\t\t\t\ttext-shadow: 0px " + m + "px 0px rgba(255, 255, 255, 0.7);\n\t\t\t\t-webkit-box-shadow: 0px " + m + "px 0px white;\n\t\t\t\t-moz-box-shadow: 0px " + m + "px 0px white;\n\t\t\t\t-o-box-shadow: 0px " + m + "px 0px white;\n\t\t\t\tbox-shadow: 0px " + m + "px 0px white;\n\t\t\t\t-webkit-border-radius: " + i + "px;\n\t\t\t\t-moz-border-radius: " + i + "px;\n\t\t\t\t-o-border-radius: " + i + "px;\n\t\t\t\tborder-radius: " + i + "px;\n\t\t\t\ttext-align:center !important;\n\t\t\t\tfont-size:0.7em !important;\n\t\t\t\tcolor:black !important;\n\t\t\t\tfont-weight:bold !important;\n\t\t\tbackground:white;\n\t\t\t\ttext-decoration: none !important;}\n\t\t\t.SEAR_BUTTON:hover\n\t\t\t{\n\t\t\t\tbackground: rgb(251,182,74);}\n\t\t\t.SEAR_BUTTON.gray\n\t\t\t{\n\t\t\t\tbackground: #f9f9f9;\n\t\t\t\t}\n\t\t\t.SEAR_BUTTON div\n\t\t\t{\n\t\t\t\tdisplay: block;\n\t\t\t}\n\t\t\t#SEAR_FORM\n\t\t\t{\n\t\t\t\tposition: static !important;\n\t\t\t\tdisplay: block !important;\n\t\t\t\tvisibility: visible !important;\n\t\t\t\tmargin: 0px !important;\n\t\t\t\tpadding: 0px !important;\n\t\t\t}\n\t\t\t#SEARCULAR_INPUT\n\t\t\t{\n\t\t\t\tdisplay: none;\n\t\t\t}\n\t\t\t.SEAR_SHOW #SEARCULAR_INPUT\n\t\t\t{\n\t\t\t\tposition: absolute !important;\n\t\t\t\tdisplay: block !important;\n\t\t\t\ttop: " + n + "px !important;\n\t\t\t\tleft: 7% !important;\n\t\t\t\twidth: 50% !important;\n\t\t\t\theight: " + o + "px !important;\n\t\t\t\tborder: " + m + "px solid #c9c9c9 !important;\n\t\t\t\tmargin: 0px !important;\n\t\t\t\tpadding: 0px 0px 0px 5px !important;\n\t\t\t\tfont-size: " + p + "px !important;\n\t\t\t\tcolor: #666666 !important;\n\t\t\t\tbackground: white !important;\n\t\t\t\t\n\t\t\t\t/* overrides */\n\t\t\t\tfont-family: Arial !important;\n\t\t\t\t-webkit-box-shadow: none !important;\n\t\t\t\t-moz-box-shadow: none !important;\n\t\t\t\tbox-shadow: none !important;\n\t\t\t\t-webkit-border-radius: 0px !important;\n\t\t\t\t-moz-border-radius: 0px !important;\n\t\t\t\tborder-radius: 0px !important;\n\t\t\t}\n\t\t\t.PKT_desktop #SEARCULAR_INPUT\n\t\t\t{\n\t\t\t\ttop: 27px !important;\n\t\t\t\tleft: auto !important;\n\t\t\t\tright: 7% !important;\n\t\t\t\twidth: 300px !important;\n\t\t\t\tmargin-right: 100px !important;\n\t\t\t}\n\t\t\t.SEAR_SHOW #SEARCULAR_LABEL\n\t\t\t{\n\t\t\t}\n\t\t\t";
            var r = '\n\t\t\t<div id="SEARCULAR">\n\t\t\t\t<div id="SEARCULAR_WRAPPER" class="PKT_desktop">\n\t\t\t\t\t<a id="SEARCULAR_LOGO" href="http://' + SEARCULAR_URL + '" target="_blank">Searcular</a>\n\t\t\t\t\t<div id="SEARCULAR_LABEL"></div>\n\t\t\t\t\t<form id="SEAR_FORM"><input type="text" id="SEARCULAR_INPUT" /><input type="submit" value="Submit" name="submit" style="position:absolute !important;left:-789em !important;"/></form>\n\t\t\t\t\t<a id="SEAR_BUTTON" class="SEAR_BUTTON" target="_blank" href=""></a><a id="SEAR_BUTTON2" class="SEAR_BUTTON" target="_blank" href=""></a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t';
            var s = document.createElement("div");
            s.innerHTML = '<style id="SEARCULAR_STYLE">' + q + "</style>" + r;
            document.body.appendChild(s);
            try {
                if (document.location.host.match("twitter.")) document.getElementsByClassName("topbar")[0].style.position = "absolute"
            } catch (t) {}
            var u = this;
            setTimeout(function () {
                u.show()
            }, 30)
        },
        
        displayMessage: function (a) {
            this.toggleClass(document.getElementById("SEARCULAR_WRAPPER"), "SEAR_SHOW", false);
            document.getElementById("SEARCULAR_LABEL").innerHTML = a
        },
        showButton: function (a, b, c, d) {
            var ov = this
            var e = document.getElementById("SEAR_BUTTON");
            e.style.visibility = a ? "visible" : "hidden";
            if (a) {
                e.innerHTML = a;
                if (!b) e.removeAttribute("href");
                else e.href = b;
                e.onclick = function () {
                    c()
                };
                this.toggleClass(e, "gray", d)
            }
            if(a == "Save"){
                var f = document.getElementById("SEAR_BUTTON2");
                f.style.visibility = a ? "visible" : "hidden";
                f.style.marginRight = "-90px";
                f.innerHTML = "Cancel";
                f.removeAttribute("href");
                f.onclick = function() {
                        ov.hide();
                   }
                            }
        },
        getReadyToHide: function () {
            var a = this;
            clearTimeout(this.hideTO);
            this.hideTO = setTimeout(function () {
                a.hide()
            }, 3e3)
        },
        cancelPendingHide: function () {
            clearTimeout(this.hideTO);
            this.hideTO = undefined
        },
        show: function () {
            this.hidesOnClick = false;
            this.cancelPendingHide();
            var a = document.getElementById("SEARCULAR");
            a.style[this.browserPrefix() + "Transform"] = "translate3d(0px," + (0 - a.offsetHeight - this.shadowHeight) + "px,10px)";
            a.style.visibility = "visible";
            var b = this;
            a.onclick = function () {
                if (b.hidesOnClick) b.hide()
            };
            setTimeout(function () {
                var c = b.browserPrefix();
                a.style[c + "Transition"] = "-" + c + "-transform 0.3s ease-out";
                a.style[c + "Transform"] = "translate3d(0px,0px,0px)"
            }, 100)
        },
        hide: function () {
            var a = document.getElementById("SEARCULAR");
            a.style[this.browserPrefix() + "Transform"] = "translate3d(0px," + (0 - a.offsetHeight - this.shadowHeight) + "px,0px)";
            setTimeout(function () {
                a.style.visibility = "hidden";
                a.parentNode.removeChild(a)
            }, 200)
        },
        wasSaved: function () {
            var a = this;
            this.displayMessage("Saved!");
            this.getReadyToHide()
        },
        
        showTextField: function (a) {
            this.toggleClass(document.getElementById("SEARCULAR_WRAPPER"), "SEAR_SHOW", true);
            this.textField = document.getElementById("SEARCULAR_INPUT");
            this.textField.placeholder = a
        },
        toggleClass: function (a, b, c) {
            if (!a) return;
            if (c && !a.className.match(b)) a.className += " " + b;
            else if (!c && a.className.match(b)) a.className = a.className.replace(b, "")
        },
        browserPrefix: function () {
            if (this._prefix) return this._prefix;
            var a = document.createElement("div");
            var b = ["Webkit", "Moz", "MS", "O"];
            for (var c in b) {
                if (a.style[b[c] + "Transition"] !== undefined) {
                    this._prefix = b[c];
                    return this._prefix
                }
            }
        },
        trim: function (a) {
            var a = a.replace(/^\s\s*/, ""),
                b = /\s/,
                c = a.length;
            while (b.test(a.charAt(--c)));
            return a.slice(0, c + 1)
        }
    };


    /*
     * SEARCULAR_WORKER, Acutal functionality. Saving bookmarks.
     */
    var SEARCULAR_WORKER = function () {};
    SEARCULAR_WORKER.prototype = {
        init: function () {
            userID = localStorage.getItem("userID");
			
            if (this.inited) return;
            var a = this;
            this.overlay = new SEARCULAR();
            this.inited = true
            this.overlay.create();
            var ov = this
			var loggedIn = false
			if (userID > 0 ) {
				loggedIn = true
				console.log('you are logged in and the id is: ' + userID)
				}
			else {
				console.log(userID + " this is the id") 
			
			}
			console.log(loggedIn)
            if (loggedIn){

                this.overlay.displayMessage('Saving search words: <input id="kvalue" value="'+window.lastQuery+'"> </input> into topic : <input id="tvalue" type="textarea" value="'+ "Uncategorized"+'"></input>');
				
                this.overlay.showButton("Save", null, function(){
					kvalue = $("#kvalue").val()
					tvalue = $("#tvalue").val()
                    ov.save(kvalue,tvalue)
                });
              } else {
                var ov = this.overlay;
                this.overlay.displayMessage("Please Log In")
                this.overlay.showButton("Login", WEBSITE_ROOT+'users/login', function(){}, true)
              }
           

        },
        save: function (kvalue, tvalue) {
            a =this;          
            this.overlay.displayMessage("Saving...");
			
			console.log(kvalue)
            this.sendRequest({

                url: document.location.href,
                title: document.title.replace(/^\s\s*/, "").replace(/\s\s*$/, ""),
				keywords: kvalue,
				topic: tvalue
                
            	
            }, function () {
                a.overlay.wasSaved()
            })
                
            
        },
       
        sendRequest: function (a, b) {
			console.log(a)
        	$.post(SERVICE_ROOT + "addItem.json", {
             "url" : a.url,
             "title" : a.title,
             "snippet" : "",
             "keywords" : a.keywords,
             "topic_name" : a.topic || "Uncategorized",
             "user_id" : localStorage.getItem("userID"),
             "token" : 0,
             "source" : 0, // 1:=Elsewhere
             "position" : 0

    }, function(response, code) {

        /*
         * response format: "status": 0:=success, -1:=auth failed exists item_id
         * "keyword_ids" "topic_id" "user_id"
         */
        var status = response.status;

        if (0 === status) {
            // success
            console.log("sent successfully")
           
        } else if (-1 === status) {
            // auth failed
            console.log("auth failed")

        }
    });
         if (a && b) b()
        },
        
    };
    var SEARCULAR_INIT = new SEARCULAR_WORKER;
    SEARCULAR_INIT.init();
}
void(0)   		