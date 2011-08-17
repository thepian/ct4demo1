/**
 * Create an instance for managing a browser window.
 * If no parameter is supplied manage the current window
 * Otherwise a dict of parameters must be supplied
 *
 * @param config Config dict
 */
function ManagedWindow(/*{panelId:panelId}*/config)
{
	if (config) {
		// other window
		this.panelId = config.panelId;
		this.windowName = config.windowName || config.panelId;
		this.url = config.url;
		this.handle = null;
	}
	else {
		/* Grap page positioning parameters */	
		this.layout = LayoutUrl.parse(location.hash);

		// this window
		this.panelId = this.layout? this.layout.panelId : null;
		this.windowName;
		this.url = location.href;
		this.handle = null;
	}
}

ManagedWindow.prototype.openWindow = function()
{
	var windowFeatures = this.features = this.makeWindowPos();
	// windowFeatures.toolbar = "1";
	// windowFeatures.menubar = "1";
	// windowFeatures.location = "1";
	// windowFeatures.resizable = "1";
	// windowFeatures.scrollbars = "1";
	// windowFeatures.status = "no";

	windowFeatures.menubar = "no";
	windowFeatures.location = "no";
	windowFeatures.resizable = "yes";
	windowFeatures.scrollbars = "yes";
	windowFeatures.status = "no";
	// 'toolbar=1,scrollbars=1,location=1,status=1,menubar=1,resizable=1

	this.handle = window.open(this.url,this.windowName,windowFeatures.toString());
	if (this.handle) {
		if (this.handle.focus) this.handle.focus();
	} else {
		console.log("Couldn't open window",this.windowName)
	}
	
};

ManagedWindow.prototype.openTab = function()
{
	this.features = {};

	var makeForm = document.getElementById("make-tab");
	makeForm.setAttribute("target",this.windowName);
	makeForm.setAttribute("action",this.url);

	var windowFeatures = this.features = this.makeWindowPos();
	windowFeatures.menubar = "no";
	windowFeatures.location = "no";
	windowFeatures.resizable = "yes";
	windowFeatures.scrollbars = "yes";
	windowFeatures.status = "no";

	var that = this;
	setTimeout(function(){
		makeForm.submit();
		console.log("form submitted");
		setTimeout(function(){
			console.log("opening ",that.url);
			that.handle = window.open(that.url,that.windowName,windowFeatures.toString());
			if (that.handle.focus) that.handle.focus();
			setTimeout(function(){
				that.handle.postMessage("hello",location.protocol + "//" + location.host);
				console.log("hello posted 2");
			},50);
		},50);		
	},50);
};

function postMessageHandler(ev) {
	console.log("message received.");
	//alert(ev);
	//debugger;	
}

if (window.addEventListener) {
	window.addEventListener("message",postMessageHandler,false);
	console.log("message listener rdy");
} else {
	window.attachEvent("message",postMessageHandler);
}

ManagedWindow.prototype.makeWindowPos = function() {

	function toString() {
		var r = [];
		for(var n in this) {
			if (typeof this[n] != "function") {
				r.push(n + "=" + this[n]);
			}
		}
		return r.join(",");
	};

	// screenX
	// screenY
	// innerHeight
	// innerWidth
	var pos = {
		left: 0, top: 0,
		width: 300, height: 300,

		toString: toString
	};

	return pos;
};

ManagedWindow.prototype.measureChrome = function()
{
	this.chromeWidth = window.outerWidth - window.innerWidth;
	this.chromeHeight = window.outerHeight - window.innerHeight;

	var content = document.querySelectorAll(".content")[0];
	this.chromeHeight -= content.parentNode.offsetHeight - content.offsetHeight;
};



var LAST_LAYOUT_ID = 0;

function LayoutUrl(config)
{
	this.data = config;
}

LayoutUrl.prototype.setLayoutId = function(layoutId)
{
	this.layoutId = layoutId;
};

LayoutUrl.prototype.getWindowName = function()
{
	return "layout-L"+this.layoutId;	
};

LayoutUrl.prototype.getWindowUrl = function()
{
	var r = [];
	for(var n in this.data) {
		r.push(n+"="+this.data[n]);
	}

	var u_bits = location.href.split("#");
	var windowUrl = u_bits[0].split("?")[0] + "../layouts/L"+this.layoutId+"#layout-L"+this.layoutId + "?" + r.join(",");	

	return windowUrl;
};

LayoutUrl.prototype.toString = function()
{
	var r = [];
	for(var n in this.data) {
		r.push(n+"="+this.data[n]);
	}
	return "layout://" + r.join(",");
};

LayoutUrl.parse = function(url)
{
	if (url.indexOf("layout://") == 0) {
		var r = {};
		var bits = url.substring(9).split(",");
		for(var i=0,b; b=bits[i]; ++i) {
			var key_value = b.split("=");
			r[key_value[0]] = key_value[1];
		}
		return new LayoutUrl(r);
	}
	if (url.indexOf("#") == 0) {
		var ba = url.substring(1).split("?");

		var r = {};
		var bits = ba[1].split(",");
		for(var i=0,b; b=bits[i]; ++i) {
			var key_value = b.split("=");
			r[key_value[0]] = key_value[1];
		}
		var layout = new LayoutUrl(r)
		layout.layoutId = ba[0];

		return layout;
	}
	return null;
};


/* This window */
var THIS_WINDOW = new ManagedWindow();

function do_stuff(ev){

	/* DIVIDER */
	var content = document.querySelectorAll(".content")[0];
	var divider = document.querySelectorAll(".content .divider")[0];
	var divider_up = document.querySelectorAll(".content .divider-up")[0];
	var divider_down = document.querySelectorAll(".content .divider-down")[0];
	if (window.addEventListener) {
		divider.addEventListener("mousewheel", handleMouseWheel,false);
		divider.addEventListener("DOMMouseScroll", handleMouseScroll,false);

		divider_up.addEventListener("click", handleUpClick,false);
		divider_down.addEventListener("click", handleDownClick,false);
	} else {
		divider.attachEvent("onmousewheel", handleMouseWheel);

		divider_up.attachEvent("onclick", handleUpClick);
		divider_down.attachEvent("onclick", handleDownClick);
	}
	
	function handleMouseWheel(ev) {
	console.log("wheel",ev);
	}
	
	function handleMouseScroll(ev) {
	console.log("wheel",ev);
	}

	var UPDOWN = {
		"divided-100-0": { "up":"divided-66-33", "down":null },
		"divided-66-33": { "up":"divided-33-66", "down":"divided-100-0" },
		"divided-33-66": { "up":"divided-0-100", "down":"divided-66-33" },
		"divided-0-100": { "up":null, "down":"divided-33-66" }
	};
	
	function handleUpClick(ev) {
		var cls = content.className;
		var existing = /divided-[^ ]+/.exec(cls);
		if (existing) {
			var ud = UPDOWN[existing[0]];
			if (ud && ud.up) {
				content.className = cls.replace(/divided-[^ ]+/,ud.up);
			}
		}
	}
	
	function handleDownClick(ev) {
		var cls = content.className;
		var existing = /divided-[^ ]+/.exec(cls);
		if (existing) {
			var ud = UPDOWN[existing[0]];
			if (ud && ud.down) {
				content.className = cls.replace(/divided-[^ ]+/,ud.down);
			}
		}
	}
	
	//divider.addEventListener("dragstart",handleDragStart,false);
	//divider.addEventListener("dragenter",handleDragEnter,false);
	
	function handleDragStart(ev) {
		(ev.srcElement || this).style.opacity = "0.4";
		//this.style.backgroundColor = "red";
		//ev.dataTransfer.setData('text/plain', 'Drag Me Button');
		//ev.dataTransfer.effectAllowed = "move";
	}
	
	function handleDragEnter(ev) {
		ev.preventDefault();
		(ev.srcElement || this).style.opacity = "0.6";
		//this.style.backgroundColor = "red";
	}

	/* BREAKOUT BUTTONS */
	var breakoutButtons = document.querySelectorAll("button.breakout");
	[].forEach.call(breakoutButtons,function(el) {
		if (el.addEventListener) {
			el.addEventListener("click",handleBreakoutButton,false);
		} else {
			el.attachEvent("onclick",handleBreakoutButton,false);
		}
	});

	function handleBreakoutButton(ev) {
		var panel = (ev.srcElement || this).parentNode;
		var url = window.location.href + "#" + panel.id;
		window.open(url);
	}

	/* PANELS */
	var panels = document.querySelectorAll(".content .panel");
	[].forEach.call(panels,function(el) {
		if (el.addEventListener) {
			el.addEventListener("dragstart",handlePanelDragStart,false);
			el.addEventListener("dragend",handlePanelDragEnd,false);
		} else {
			el.attachEvent("ondragstart",handlePanelDragStart,false);
			el.attachEvent("ondragend",handlePanelDragEnd,false);
		}
		var only_id = location.hash.substring(1);
		if (THIS_WINDOW.layout) {
			only_id = THIS_WINDOW.layout.data.panelId;
		}
		if (only_id) {
			if (only_id != el.id) {
				el.style.display = "none";
			}
		}
	});

	if (THIS_WINDOW.layout && THIS_WINDOW.layout.data.width) {
		THIS_WINDOW.measureChrome();
		var newWidth = parseInt(THIS_WINDOW.layout.data.width) + THIS_WINDOW.chromeWidth;
		var newHeight = parseInt(THIS_WINDOW.layout.data.height) + THIS_WINDOW.chromeHeight;
		var newTop = THIS_WINDOW.layout.data.top!=null? parseInt(THIS_WINDOW.layout.data.top) : null;
		var newLeft = THIS_WINDOW.layout.data.left!=null? parseInt(THIS_WINDOW.layout.data.left) : null;
		var newRight = THIS_WINDOW.layout.data.right!=null? parseInt(THIS_WINDOW.layout.data.right) : null;
		if (newRight != null) {
			newLeft = newRight - newWidth;
		} 
		if (console.log) {
			console.log("resizing to ",newWidth,",",newHeight);
		}

	    var browser=navigator.appName; 
	    if (browser=="Microsoft Internet Explorer") { 
	            window.dialogHeight = newHeight+'px'; 
	            window.dialogWidth = newWidth+'px'; 
	            //TODO dialogLeft
	    } 
	    else { 
			window.resizeTo(newWidth,newHeight);
			if (newTop != null) {
				window.moveTo(newLeft,newTop);
			}
	    } 
	}

	function handlePanelDragStart(ev) {
		(ev.srcElement || this).style.borderColor = "red";
		(ev.srcElement || this).style.borderStyle = "solid";

		// layout://panelId=5,width=100,height=50
		var url = new LayoutUrl({
			panelId: (ev.srcElement || this).id,
			width: (ev.srcElement || this).offsetWidth,
			height: (ev.srcElement || this).offsetHeight
		});

		var dt = ev.dataTransfer;
		// The Clipboard object has methods for setting and getting the data but Chromium hard codes to only support
		// 'text', 'text/plain', 'text/plain;...', 'url' and 'text/uri-list'
		dt.setData("url",url.toString());
		dt.setData("application/json", JSON.stringify({ "url": url.toString() }) );
		// dt.setData("text/csv", "http://www.mozilla.org");
		// dt.setData("text/plain", "http://www.mozilla.org");

		ev.dataTransfer.effectAllowed = "move";
	}
	function handlePanelDragEnd(ev) {
		(ev.srcElement || this).style.borderColor = "";
		(ev.srcElement || this).style.borderStyle = "";
	}

	/* DROP AREAS */
	var dropAreas = document.querySelectorAll(".drop-area");
	[].forEach.call(dropAreas,function(el) {
		if (el.addEventListener) {
			// el.addEventListener("dragenter",handlePanelDragEnter,false);
			el.addEventListener("dragover",handlePanelDragOver,false);
			// el.addEventListener("dragleave",handlePanelDragLeave,false);
			el.addEventListener("drop",handlePanelDrop,false);
		} else {
			// el.attachEvent("ondragenter",handlePanelDragEnter,false);
			el.attachEvent("ondragover",handlePanelDragOver,false);
			// el.attachEvent("ondragleave",handlePanelDragLeave,false);
			el.attachEvent("ondrop",handlePanelDrop,false);
		}
	});

	function handlePanelDragEnter(ev) {
		(ev.srcElement || this).addClassName('over');
	}
	function handlePanelDragOver(ev) {
		var isNewPage;
		if (Array.__contains.call(ev.dataTransfer.types, "application/json")) {
			isNewPage = true; // not allowed during over
			// var json = JSON.parse( ev.dataTransfer.getData("application/json") );
			// if (json.url) isNewPage = true;
		}
		else if (Array.__contains.call(ev.dataTransfer.types, "url")) {
			isNewPage = true;
		}
		if (isNewPage) ev.preventDefault();

		ev.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
  		this.addClassName('over');

  		return !isNewPage;
  	}
	function handlePanelDragLeave(ev) {
  		(ev.srcElement || this).removeClassName('over');
	}
	function handlePanelDrop(ev) {
		// http://code.google.com/p/chromium/issues/detail?id=31037

		// var json = JSON.parse( ev.dataTransfer.getData("application/json") );
		// var url = json.url;
  		//event.target.textContent = url;
  		var url = ev.dataTransfer.getData("url");
  		var layoutUrl = LayoutUrl.parse(url);
  		if (layoutUrl) {
			var layout_id = ++LAST_LAYOUT_ID;
  			layoutUrl.setLayoutId(layout_id);

	  		if (this.getAttribute("target") == "new-tab") {
	  			delete layoutUrl.data.width;
	  			delete layoutUrl.data.height;
		  		var newwindow = new ManagedWindow({ panelId : url.panelId, windowName: layoutUrl.getWindowName(), url: layoutUrl.getWindowUrl() });
		  		newwindow.openTab();
	  		} else {
	  			layoutUrl.data.top = window.screenY;
	  			layoutUrl.data.right = window.screenX - 2;
		  		var newwindow = new ManagedWindow({ panelId : url.panelId, windowName: layoutUrl.getWindowName(), url: layoutUrl.getWindowUrl() });
		  		newwindow.openWindow();
	  		}

	  		ev.preventDefault();
	  
	  		console.info("dropped ",layoutUrl.getWindowUrl(), "(",newwindow.features.toString(),")");
  		}
	}
}

if (Modernizr.draganddrop) {
	if (window.addEventListener) {
		window.addEventListener("load",do_stuff,false);
	} else {
		window.attachEvent("onload",do_stuff);
	}
} else {
	//TODO compat
}