/**
* Styleswitch stylesheet switcher built on jQuery
* Under an Attribution, Share Alike License
* By Kelvin Luck ( http://www.kelvinluck.com/ )
**/

(function($)
{
	$(document).ready(function() {
		$('.styleswitch').click(function()
		{
    	    var themes = listThemes(); // stylesheets are generated late

		    var styleName = this.getAttribute("rel");
		    if (styleName) {
    			switchStylestyle(styleName);
		    }
		    else {
		        var useNext = false;
        		var c = readCookie('style');
                var firstName;
                
		        for(var n in themes) {
		            if (! firstName) firstName = n; // to fall back on when at end
		            
		            if (useNext) {
		                useNext = false;
		                styleName = n;
		            }
		            if (n == c) useNext = true; // cycle to next theme
		        }
    			switchStylestyle(styleName || firstName);
		    }
			return false;
		});
		var c = readCookie('style');
		if (c) switchStylestyle(c);
	});
	
	function listThemes() 
	{
	    var r = {};
		$('link[rel*=alternate][title]').each(function(i) 
		{
		    if (this.getAttribute('type') == "text/css") r[this.getAttribute('title')] = this;
		});
		$('style[title]').each(function(i) 
		{
		    if (this.getAttribute('type') == "text/css") r[this.getAttribute('title')] = this;
		});
	    return r;
	}

	function switchStylestyle(styleName)
	{
		$('link[rel*=alternate][title]').each(function(i) 
		{
			this.disabled = true;
			if (this.getAttribute('title') == styleName) this.disabled = false;
		});
		$('style[title]').each(function(i) 
		{
			this.disabled = true;
			if (this.getAttribute('title') == styleName) this.disabled = false;
		});
		createCookie('style', styleName, 365);
	}

// cookie functions http://www.quirksmode.org/js/cookies.html
function createCookie(name,value,days)
{
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function eraseCookie(name)
{
	createCookie(name,"",-1);
}
// /cookie functions

})(jQuery);
