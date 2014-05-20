/**
 * lazyLoad Plugin
 * @since 2.0.0
 */

;(function ( $, window, document, undefined ) {

    LazyLoad = function(scope){
    	this.owl = scope;
    	this.owl._options = $.extend(LazyLoad.Defaults, this.owl.options);

    	if (!this.owl.options.lazyLoad) return;

		this.owl.dom.$el.on({
			'onUpdated.owl': $.proxy(function(e) {
				if (this.owl.options.lazyLoad) this.check();
			}, this)
		});

    }

	LazyLoad.Defaults = {
		lazyLoad:	false,
	}

	LazyLoad.prototype.check = function(){

		var attr = window.devicePixelRatio > 1 ? 'data-src-retina' : 'data-src';
		var src, img,i;

		for(i = 0; i < this.owl.num.items; i++){
			var $item = this.owl.dom.$items.eq(i);

			if( $item.data('owl-item').current === true && $item.data('owl-item').loaded === false){
				img = $item.find('.owl-lazy');
				src = img.attr(attr);
				src = src || img.attr('data-src');
				if(src){
					img.css('opacity','0');
					this.preload(img,$item);
				}
			}
		}
	};

	LazyLoad.prototype.preload = function(images,$item){
		var that = this.owl; // fix this later

		images.each(function(i,el){
			var $el = $(el);
			var img = new Image();
			var srcType = window.devicePixelRatio > 1 ? $el.attr('data-src-retina') : $el.attr('data-src');
			var srcType = srcType || $el.attr('data-src');

			img.onload = function(){

				$item.data('owl-item').loaded = true;
				if($el.is('img')){
					$el.attr('src',img.src);
				}else{
					$el.css('background-image','url(' + img.src + ')');
				}
				
				$el.css('opacity',1);
				that.fireCallback('onLazyLoaded');
			};
			img.src = srcType;
		});
	};

	LazyLoad.prototype.destroy = function(){
		this.owl.dom.$el.off('.owl');
	};

	$.fn.owlCarousel.Constructor.Plugins['lazyLoad'] = LazyLoad;

})( window.Zepto || window.jQuery, window,  document );