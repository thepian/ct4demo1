function do_stuff(ev){

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