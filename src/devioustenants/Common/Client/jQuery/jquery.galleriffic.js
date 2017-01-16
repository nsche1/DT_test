(function(n){var t={},r=0,u;n.galleriffic={version:"2.0.1",normalizeHash:function(n){return n.replace(/^.*#/,"").replace(/\?.*$/,"")},getImage:function(i){return i?(i=n.galleriffic.normalizeHash(i),t[i]):undefined},gotoImage:function(t){var i=n.galleriffic.getImage(t),r;return i?(r=i.gallery,r.gotoImage(i),!0):!1},removeImageByHash:function(t,i){var r=n.galleriffic.getImage(t),u;return r?(u=r.gallery,i&&i!=u)?!1:u.removeImageByIndex(r.index):!1}};u={delay:3e3,numThumbs:20,preloadAhead:40,enableTopPager:!1,enableBottomPager:!0,maxPagesToShow:7,imageContainerSel:"",captionContainerSel:"",controlsContainerSel:"",loadingContainerSel:"",renderSSControls:!0,renderNavControls:!0,playLinkText:"Play",pauseLinkText:"Pause",prevLinkText:"Previous",nextLinkText:"Next",nextPageLinkText:"Next &rsaquo;",prevPageLinkText:"&lsaquo; Prev",enableHistory:!1,enableKeyboardNavigation:!0,autoStart:!1,syncTransitions:!1,defaultTransitionDuration:1e3,onSlideChange:undefined,onTransitionOut:undefined,onTransitionIn:undefined,onPageTransitionOut:undefined,onPageTransitionIn:undefined,onImageAdded:undefined,onImageRemoved:undefined};n.fn.galleriffic=function(f){var e,o,s,h;return n.extend(this,{version:n.galleriffic.version,isSlideshowRunning:!1,slideshowTimeout:undefined,clickHandler:function(t,i){if(this.pause(),!this.enableHistory){var r=n.galleriffic.normalizeHash(n(i).attr("href"));n.galleriffic.gotoImage(r);t.preventDefault()}},appendImage:function(n){return this.addImage(n,!1,!1),this},insertImage:function(n,t){return this.addImage(n,!1,!0,t),this},addImage:function(i,u,f,e){var s=typeof i=="string"?n(i):i,l=s.find("a.thumb"),a=l.attr("href"),v=l.attr("title"),y=s.find(".caption").remove(),o=l.attr("name"),h,c;return r++,(!o||t[""+o])&&(o=r),f||(e=this.data.length),h={title:v,slideUrl:a,caption:y,hash:o,gallery:this,index:e},f?(this.data.splice(e,0,h),this.updateIndices(e)):this.data.push(h),c=this,u||this.updateThumbs(function(){var n=c.find("ul.thumbs");if(f?n.children(":eq("+e+")").before(s):n.append(s),c.onImageAdded)c.onImageAdded(h,s)}),t[""+o]=h,l.attr("rel","history").attr("href","#"+o).removeAttr("name").click(function(n){c.clickHandler(n,this)}),this},removeImageByIndex:function(n){if(n<0||n>=this.data.length)return!1;var t=this.data[n];return t?(this.removeImage(t),!0):!1},removeImageByHash:function(t){return n.galleriffic.removeImageByHash(t,this)},removeImage:function(n){var i=n.index;return this.data.splice(i,1),delete t[""+n.hash],this.updateThumbs(function(){var t=e.find("ul.thumbs").children(":eq("+i+")").remove();if(e.onImageRemoved)e.onImageRemoved(n,t)}),this.updateIndices(i),this},updateIndices:function(n){for(i=n;i<this.data.length;i++)this.data[i].index=i;return this},initializeThumbs:function(){this.data=[];var t=this;return this.find("ul.thumbs > li").each(function(){t.addImage(n(this),!0,!1)}),this},isPreloadComplete:!1,preloadInit:function(){if(this.preloadAhead==0)return this;this.preloadStartIndex=this.currentImage.index;var n=this.getNextIndex(this.preloadStartIndex);return this.preloadRecursive(this.preloadStartIndex,n)},preloadRelocate:function(n){return this.preloadStartIndex=n,this},preloadRecursive:function(n,t){var e,f,r,i,u;return n!=this.preloadStartIndex?(e=this.getNextIndex(this.preloadStartIndex),this.preloadRecursive(this.preloadStartIndex,e)):(f=this,r=t-n,r<0&&(r=this.data.length-1-n+t),this.preloadAhead>=0&&r>this.preloadAhead)?(setTimeout(function(){f.preloadRecursive(n,t)},500),this):(i=this.data[t],!i)?this:i.image?this.preloadNext(n,t):(u=new Image,u.onload=function(){i.image=this;f.preloadNext(n,t)},u.alt=i.title,u.src=i.slideUrl,this)},preloadNext:function(n,t){var i=this.getNextIndex(t),r;return i==n?this.isPreloadComplete=!0:(r=this,setTimeout(function(){r.preloadRecursive(n,i)},100)),this},getNextIndex:function(n){var t=n+1;return t>=this.data.length&&(t=0),t},getPrevIndex:function(n){var t=n-1;return t<0&&(t=this.data.length-1),t},pause:function(){return this.isSlideshowRunning=!1,this.slideshowTimeout&&(clearTimeout(this.slideshowTimeout),this.slideshowTimeout=undefined),this.$controlsContainer&&this.$controlsContainer.find("div.ss-controls a").removeClass().addClass("play").attr("href","#play").html(this.playLinkText),this},play:function(){if(this.isSlideshowRunning=!0,this.$controlsContainer&&this.$controlsContainer.find("div.ss-controls a").removeClass().addClass("pause").attr("href","#pause").html(this.pauseLinkText),!this.slideshowTimeout){var n=this;this.slideshowTimeout=setTimeout(function(){n.ssAdvance()},this.delay)}return this},toggleSlideshow:function(){return this.isSlideshowRunning?this.pause():this.play(),this},ssAdvance:function(){return this.isSlideshowRunning&&this.next(!0),this},next:function(n,t){return this.gotoIndex(this.getNextIndex(this.currentImage.index),n,t),this},previous:function(n,t){return this.gotoIndex(this.getPrevIndex(this.currentImage.index),n,t),this},nextPage:function(n,t){var i=this.getCurrentPage(),f=this.getNumPages()-1,r,u;return i<f&&(r=i*this.numThumbs,u=r+this.numThumbs,this.gotoIndex(u,n,t)),this},previousPage:function(n,t){var i=this.getCurrentPage(),r,u;return i>0&&(r=i*this.numThumbs,u=r-this.numThumbs,this.gotoIndex(u,n,t)),this},gotoIndex:function(t,i,r){i||this.pause();t<0?t=0:t>=this.data.length&&(t=this.data.length-1);var u=this.data[t];return!r&&this.enableHistory?n.historyLoad(String(u.hash)):this.gotoImage(u),this},gotoImage:function(n){var t=n.index;if(this.onSlideChange)this.onSlideChange(this.currentImage.index,t);return this.currentImage=n,this.preloadRelocate(t),this.refresh(),this},getDefaultTransitionDuration:function(n){return n?this.defaultTransitionDuration:this.defaultTransitionDuration/2},refresh:function(){var n=this.currentImage,e,u,r,f;if(!n)return this;e=n.index;this.$controlsContainer&&this.$controlsContainer.find("div.nav-controls a.prev").attr("href","#"+this.data[this.getPrevIndex(e)].hash).end().find("div.nav-controls a.next").attr("href","#"+this.data[this.getNextIndex(e)].hash);u=this.$imageContainer.find("span.current").addClass("previous").removeClass("current");r=0;this.$captionContainer&&(r=this.$captionContainer.find("span.current").addClass("previous").removeClass("current"));var t=this.syncTransitions&&n.image,s=!0,i=this,o=function(){s=!1;u.remove();r&&r.remove();t||(n.image&&n.hash==i.data[i.currentImage.index].hash?i.buildImage(n,t):i.$loadingContainer&&i.$loadingContainer.show())};if(u.length==0)o();else if(this.onTransitionOut)this.onTransitionOut(u,r,t,o);else u.fadeTo(this.getDefaultTransitionDuration(t),0,o),r&&r.fadeTo(this.getDefaultTransitionDuration(t),0);return t&&this.buildImage(n,t),n.image||(f=new Image,f.onload=function(){n.image=this;s||n.hash!=i.data[i.currentImage.index].hash||i.buildImage(n,t)},f.alt=n.title,f.src=n.slideUrl),this.relocatePreload=!0,this.syncThumbs()},buildImage:function(n,t){var u=this,f=this.getNextIndex(n.index),r=this.$imageContainer.append('<span class="image-wrapper current "><a class="advance-link" rel="history" href="#'+this.data[f].hash+'" title="'+n.title+'"><\/a><\/span>').find("span.current").css("opacity","0"),i;if(n.image.className="OESZ_Zoom",r.find("a").append(n.image).click(function(n){u.clickHandler(n,this)}),i=0,this.$captionContainer&&(i=this.$captionContainer.append('<span class="image-caption current"><\/span>').find("span.current").css("opacity","0").append(n.caption)),this.$loadingContainer&&this.$loadingContainer.hide(),this.onTransitionIn)this.onTransitionIn(r,i,t);else r.fadeTo(this.getDefaultTransitionDuration(t),1),i&&i.fadeTo(this.getDefaultTransitionDuration(t),1);return this.isSlideshowRunning&&(this.slideshowTimeout&&clearTimeout(this.slideshowTimeout),this.slideshowTimeout=setTimeout(function(){u.ssAdvance()},this.delay)),this},getCurrentPage:function(){return Math.floor(this.currentImage.index/this.numThumbs)},syncThumbs:function(){var t=this.getCurrentPage(),n;return t!=this.displayedPage&&this.updateThumbs(),n=this.find("ul.thumbs").children(),n.filter(".selected").removeClass("selected OESZ_SelectedFrame"),n.eq(this.currentImage.index).addClass("selected OESZ_SelectedFrame"),this},updateThumbs:function(n){var t=this,i=function(){n&&n();t.rebuildThumbs();t.onPageTransitionIn?t.onPageTransitionIn():t.show()};if(this.onPageTransitionOut)this.onPageTransitionOut(i);else this.hide(),i();return this},rebuildThumbs:function(){var f=this.data.length>this.numThumbs,t,i,u;this.enableTopPager&&(t=this.find("div.top"),t.length==0?t=this.prepend('<div class="top pagination"><\/div>').find("div.top"):t.empty(),f&&this.buildPager(t));this.enableBottomPager&&(i=this.find("div.bottom"),i.length==0?i=this.append('<div class="bottom pagination"><\/div>').find("div.bottom"):i.empty(),f&&this.buildPager(i));var e=this.getCurrentPage(),o=e*this.numThumbs,r=o+this.numThumbs-1;return r>=this.data.length&&(r=this.data.length-1),u=this.find("ul.thumbs"),u.find("li").each(function(t){var i=n(this);t>=o&&t<=r?i.show():i.hide()}),this.displayedPage=e,u.removeClass("noscript"),this},getNumPages:function(){return Math.ceil(this.data.length/this.numThumbs)},buildPager:function(n){var c=this,i=this.getNumPages(),u=this.getCurrentPage(),s=u*this.numThumbs,r=this.maxPagesToShow-1,t=u-Math.floor((this.maxPagesToShow-1)/2)+1,f,h,e,o;for(t>0&&(f=i-t,f<r&&(t=t-(r-f))),t<0&&(t=0),u>0&&(h=s-this.numThumbs,n.append('<a rel="history" href="#'+this.data[h].hash+'" title="'+this.prevPageLinkText+'">'+this.prevPageLinkText+"<\/a>")),t>0&&(this.buildPageLink(n,0,i),t>1&&n.append('<span class="ellipsis">&hellip;<\/span>'),r--);r>0;)this.buildPageLink(n,t,i),r--,t++;return t<i&&(e=i-1,t<e&&n.append('<span class="ellipsis">&hellip;<\/span>'),this.buildPageLink(n,e,i)),o=s+this.numThumbs,o<this.data.length&&n.append('<a rel="history" href="#'+this.data[o].hash+'" title="'+this.nextPageLinkText+'">'+this.nextPageLinkText+"<\/a>"),n.find("a").click(function(n){c.clickHandler(n,this)}),this},buildPageLink:function(n,t,i){var r=t+1,f=this.getCurrentPage(),u;return t==f?n.append('<span class="current">'+r+"<\/span>"):t<i&&(u=t*this.numThumbs,n.append('<a rel="history" href="#'+this.data[u].hash+'" title="'+r+'">'+r+"<\/a>")),this}}),n.extend(this,u,f),this.enableHistory&&!n.historyInit&&(this.enableHistory=!1),this.imageContainerSel&&(this.$imageContainer=n(this.imageContainerSel)),this.captionContainerSel&&(this.$captionContainer=n(this.captionContainerSel)),this.loadingContainerSel&&(this.$loadingContainer=n(this.loadingContainerSel)),this.initializeThumbs(),this.maxPagesToShow<3&&(this.maxPagesToShow=3),this.displayedPage=-1,this.currentImage=this.data[0],e=this,this.$loadingContainer&&this.$loadingContainer.hide(),this.controlsContainerSel&&(this.$controlsContainer=n(this.controlsContainerSel).empty(),this.renderSSControls&&(this.autoStart?this.$controlsContainer.append('<div class="ss-controls"><a href="#pause" class="pause" ">'+this.pauseLinkText+"<\/a><\/div>"):this.$controlsContainer.append('<div class="ss-controls"><a href="#play" class="play">'+this.playLinkText+"<\/a><\/div>"),this.$controlsContainer.find("div.ss-controls a").click(function(n){return e.toggleSlideshow(),n.preventDefault(),!1})),this.renderNavControls&&this.$controlsContainer.append('<div class="nav-controls"><a class="prev" rel="history" >'+this.prevLinkText+'<\/a><a class="next" rel="history" >'+this.nextLinkText+"<\/a><\/div>").find("div.nav-controls a").click(function(n){e.clickHandler(n,this)})),o=!this.enableHistory||!location.hash,this.enableHistory&&location.hash&&(s=n.galleriffic.normalizeHash(location.hash),h=t[s],h||(o=!0)),o&&this.gotoIndex(0,!1,!0),this.enableKeyboardNavigation&&n(document).keydown(function(n){var t=n.charCode?n.charCode:n.keyCode?n.keyCode:0;switch(t){case 32:e.next();n.preventDefault();break;case 33:e.previousPage();n.preventDefault();break;case 34:e.nextPage();n.preventDefault();break;case 35:e.gotoIndex(e.data.length-1);n.preventDefault();break;case 36:e.gotoIndex(0);n.preventDefault();break;case 37:e.previous();n.preventDefault();break;case 39:e.next();n.preventDefault()}}),this.autoStart&&this.play(),setTimeout(function(){e.preloadInit()},1e3),this}})(jQuery)