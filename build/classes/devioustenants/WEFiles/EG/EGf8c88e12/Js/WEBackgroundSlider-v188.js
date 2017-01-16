/*_______________________________________________
|                                                |
|    ©2013 Element Technologie - openElement     |
|________________________________________________|

100% backgound slideShow 
*/

$(function(){ EGf8c88e12.Init(); });

var EGf8c88e12 = {

	Init: function() {
		if (OEConfEGf8c88e12 === undefined) return;
		var allElements = OEConfEGf8c88e12;

		for(var ID in allElements) {
			var $el = $('#'+ID); // le tag <div> principale de l'élément
			var properties = allElements[ID]; // les propriétés de l'élément disponibles pour JS
			this.InitElement(ID, $el, properties);
		}
	},

	InitElement: function(ID, $el, properties) {
		if (properties.No_Editor && WEInfoPage.RenderMode == 'Editor') {
			return; // don't show in editor mode
		}
		if (!properties.Images.length) {
			return;
		}
		
		var ListImages = this.getListImages(properties);
		var tabbackgrounds=eval("["+ListImages+"]");

		var overlay = null;
		if (properties.Overlay !== 0) {
			overlay = EGf8c88e12.GetOverlayImagePath(properties.Overlay);
		}

		//preload done in OE (?)

		// Choose either page backgrodund or parent element:
		var $target = $('body');
		if (properties.Element && $('#'+properties.Element).length) {
			$target = $('#'+properties.Element);
			/* if ($target.children('.OESZ_DivContent').length) {
				$target = $target.children('.OESZ_DivContent');
			} */
			$target = $('<div class="oebs-vegas-target">').prependTo($target);
		}
		
		// Slider options ////////////////////////////////
		var options = {
			delay: 		properties.Delay,
			slides: 	tabbackgrounds, 
			preload: 	false,
			transition: false,
			timer:		false
		};
		
		if (properties.Transition) { // only if transition duration > 0
			var ttypes = [
				"random",
				"fade",
				"fade2",
				"slideLeft",
				"slideLeft2",
				"slideRight",
				"slideRight2",
				"slideUp",
				"slideUp2",
				"slideDown",
				"slideDown2",
				"zoomIn",
				"zoomIn2",
				"zoomOut",
				"zoomOut2",
				"swirlLeft",
				"swirlLeft2",
				"swirlRight",
				"swirlRight2",
				"burn",
				"burn2",
				"blur",
				"blur2",
				"flash",
				"flash2"
			];
			options['transition'] = ttypes[properties.Trans_Type];
			options['transitionDuration'] = parseInt(properties.Transition) || 1000;
			options['animationDuration'] = parseInt(properties.Transition) || "auto";
		}
		
		if (overlay !== null) {
			options['overlay'] = overlay;
			//properties.OverlayOpacity is applied below
		}

		$target.vegas(options);
		$('.vegas-loading').css('background','url('+WEEdSiteCommon.LinkGetPath(OEConfSharedEGf8c88e12.Images.Loading)+') no-repeat center center'); 
		if (overlay !== null && (properties.OverlayOpacity >= 0 && properties.OverlayOpacity <= 1)) {
			$('.vegas-overlay').css('opacity', properties.OverlayOpacity);
		}

	},
	
	
	getListImages: function(properties) {
		var ListImages='';
		for (var lineInd in properties.Images) {
			var img = properties.Images[lineInd];
			var path = WEEdSiteCommon.LinkGetPath(img['Images']);

			var align = "'center'", valign = "'center'";
			switch(img['Align']) {
				case 0 : align="'center'"; break;
				case 1 : align="'left'"; break;
				case 2 : align="'right'"; break;
			}
			switch(img['Valign']) {
				case 0 : valign="'center'"; break;
				case 1 : valign="'top'"; break;
				case 2 : valign="'bottom'";	break;
			}

			if (ListImages!=='') ListImages=ListImages+",";
			ListImages=ListImages+"{ ";
			ListImages=ListImages+"src:'"+path+"',";
			ListImages=ListImages+"loading:"+properties.Loading+", ";     
			//DD ListImages=ListImages+"fade:"+properties.Fade+", ";
			ListImages=ListImages+"align:"+align+", ";     
			ListImages=ListImages+"valign:"+valign+" }";     


			//}
		}
		return ListImages;
	},
	
	
	//Get Overlay image path
	GetOverlayImagePath: function(ID) {
		var image = eval('OEConfSharedEGf8c88e12.Images.Image'+ID);
		return "'"+WEEdSiteCommon.LinkGetPath(image)+"'";
	}


};





