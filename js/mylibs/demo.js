function makeWindowPos() {

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
}

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
		this.style.opacity = "0.4";
		//this.style.backgroundColor = "red";
		//ev.dataTransfer.setData('text/plain', 'Drag Me Button');
		//ev.dataTransfer.effectAllowed = "move";
	}
	
	function handleDragEnter(ev) {
		ev.preventDefault();
		this.style.opacity = "0.6";
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
		var panel = this.parentNode;
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
		if (only_id) {
			if (only_id != el.id) {
				el.style.display = "none";
			}
		}
	});
	function handlePanelDragStart(ev) {
		this.style.borderColor = "red";
		this.style.borderStyle = "solid";

		var url = window.location.href + "#" + this.id;

		var dt = ev.dataTransfer;
		// The Clipboard object has methods for setting and getting the data but Chromium hard codes to only support
		// 'text', 'text/plain', 'text/plain;...', 'url' and 'text/uri-list'
		dt.setData("url",url);
		dt.setData("application/json", JSON.stringify({"url": url}) );
		// dt.setData("text/csv", "http://www.mozilla.org");
		// dt.setData("text/plain", "http://www.mozilla.org");

		ev.dataTransfer.effectAllowed = "move";
	}
	function handlePanelDragEnd(ev) {
		this.style.borderColor = "";
		this.style.borderStyle = "";
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
		this.addClassName('over');
	}
	function handlePanelDragOver(ev) {
		var isNewPage;
		if (Array.__contains.call(ev.dataTransfer.types, "application/json")) {
			var json = JSON.parse( ev.dataTransfer.getData("application/json") );
			if (json.url) isNewPage = true;
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
  		this.removeClassName('over');
	}
	function handlePanelDrop(ev) {
		// http://code.google.com/p/chromium/issues/detail?id=31037

		// var json = JSON.parse( ev.dataTransfer.getData("application/json") );
		// var url = json.url;
  		//event.target.textContent = url;
  		var url = ev.dataTransfer.getData("url");
  		var u_bits = url.split("#");
  		var windowName = u_bits[1]; // Name shared with server for the resource

  		var windowFeatures = makeWindowPos();
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

  		ev.preventDefault();
  
  		var newwindow = window.open(url,windowName,windowFeatures.toString());
  		if (newwindow.focus) newwindow.focus();
  		console.info("dropped ",url, "(",windowFeatures.toString(),")");
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