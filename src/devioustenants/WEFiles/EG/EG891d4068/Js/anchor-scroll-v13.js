$(function(){ EG891d4068.Init(); });

var EG891d4068 = {

	Init: function() {
		if (typeof(OEConfEG891d4068) === undefined) return;
		var allElements = OEConfEG891d4068;

		for(var ID in allElements) {
			var $el = $('#'+ID); // The element's main <div> tag
			var properties = allElements[ID]; // element's available properties for JS
			this.InitElement(ID, $el, properties);
			
			break; // handle only one element!
		}
	},

	InitElement: function(ID, $el, properties) {
		
		// get the page name from location given by browser:
		var pageURL = document.location.href;
		var pLastSlash = pageURL.lastIndexOf('/');
		if (pLastSlash > 0) {

			var pageName = pageURL.substr(pLastSlash+1);
			var cutOffChars = ['?', '#', '.'];  // ?URL parameters, #anchor, .extention or .lang code
			for (var i=0; i<cutOffChars.length; i++) {
				var pos = pageName.indexOf(cutOffChars[i]);
				if (pos >= 0) {
					pageName = pos ? pageName.substr(0, pos) : "";
				}
				if (!pageName.length) {
					break;
				}
			}
			if (!pageName.length) {
				pageName = 'index'; // default homepage
			}
			// ex. "//site.com/folder/page.php?p=1#a" => "page"		
		}

		var isSamePageAnchorURL = function(url) {
			if (url && url.indexOf('#') >= 0 && url.indexOf('//') < 0) {
				var targPageName = url.split('#')[0].split('.')[0]; // index.htm#anchor => "index"
				if (!targPageName.length || targPageName == pageName) { // no page or same page name
					return true;
				}
			}
			return false;
		};

		// for OE-generated link elements where links are to anchors on this page, remove default JS handler on base div:
		$('a').each(function(){
			var $a = $(this);
			var url = $a.attr('href');
			if (isSamePageAnchorURL(url)) { 
				var $parent = $a; // remove onclick inline handlers up to element's top tag (including)
				while ($parent.length && !$parent.hasClass('.BaseDiv')) {
					$parent = $parent.parent();
					$parent.removeAttr('onclick');
				}
			}
		})

		// for each link, test if it contains an anchor and if it's on the same page
		$('body').on('click', 'a', function(ev) {
			var $a = $(this);
			var target = $a.attr('href'); // URL, if auto-created by OE it is relative to this page or the name of this page
			if (isSamePageAnchorURL(target)) { // URL to an anchor on this page
				var targPageName = target.split('#')[0].split('.')[0]; // index.htm#anchor => "index"
				// on same page - smooth scroll
				var anchor = target.split('#')[1];
				var $t = $('#' + anchor); // search by ID
				if (!$t.length) { // search by attribute "name"
					$t = $('a[name="' + anchor +'"]');
				}
				if ($t.length) { // target found - scroll there and cancel default handling:

					ev.stopPropagation();
					ev.preventDefault();
					$('html, body').animate({scrollTop: $t.offset().top}, properties.Duration);
					return false;
				}
			}
		});
		
	}

};



