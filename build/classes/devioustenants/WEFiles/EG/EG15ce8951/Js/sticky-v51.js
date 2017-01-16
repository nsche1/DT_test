$(function(){ EG15ce8951.Init(); });

var EG15ce8951 = {
	
	// Note: if update jquery sticky, check fix for absolute positioning
	
	Init: function() {
		if (typeof(OEConfEG15ce8951) === undefined) return;
		var allElements = OEConfEG15ce8951;

		for(var ID in allElements) {
			var $el = $('#'+ID); // The element's main <div> tag
			var properties = allElements[ID]; // element's available properties for JS
			this.InitElement(ID, $el, properties);
		}
	},

	InitElement: function(ID, $el, properties) {
		
		var $elements = [], i = 0;
		
		var ids = properties.Ids ? properties.Ids.trim().split(',') : [];
		if(properties.Element!==null) { // element directly specified
			if (properties.Element.List.length !==0) {
				ids.push([properties.Element.List[0]]);
			}
		}
		for (i in ids) { // add by IDs
			var $element = $('#' + ids[i]);
			if ($element.length) {
				$elements.push($element);
			}
		}
		
		if (properties.Custom_Class) { // add by class
			var $elementsByClass = $('.' + properties.Custom_Class.trim());
			$elementsByClass.each(function(){ $elements.push($(this)); });
		}
		
		if (!$elements.length) { // no elements to stick
			return;
		}
		
		for (i in $elements) {
			var isAbsolute = ($elements[i].css('position') == 'absolute'); // does not work with absolute positioning
			if (isAbsolute) { // not compatible with absolute positioning
				// continue;
			}
			var $target = 
				// (isAbsolute && $elements[i].children().length) ? $elements[i].children().first() : // not recommended, emergency workaround not very reliable
				$elements[i];
			$target.sticky({
				topSpacing: 	properties.Top_Spacing || 0,
				center:			!!properties.Center,
				
				//getWidthFrom: 	(properties.Keep_Width) ? ('#' + $target.attr('id')) : '',
				//responsiveWidth:	true, // properties.Keep_Width
				widthFromWrapper:	!properties.Keep_Width,
				
			});
		}
				
		// examples:
		// var elWd = parseInt($el.width()); // Obtain the width of the element
		// var bgIm = $el.find('.OESZ_Zone1').css('background-image'); // obtain the background image for Style Zone 'Zone1'
		
	}

};

