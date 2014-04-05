(function($) {
		function banner(container, settings) {
			this.container = container;
			this.slides = this.container.find('ul');
			this.settings = settings;

			this.startX = 0;
			this.moveX = 0;
			this.startSlideX = 0;

			instance = this;

			this.init();

			var inst = this;
			this.container.find('a.right').click(function() {
				inst.move('+');
			});
			this.container.find('a.left').click(function() {
				inst.move('-');
			});
			this.container.bind('touchstart', function(e) {
				inst.handleTouchStart(e);
			});
			this.container.bind('touchmove', function(e) {
				inst.handleTouchMove(e);
			});

			this.container.bind('touchend', function(e) {
				inst.handleTouchEnd(e);
			});
		}

		banner.prototype.init = function() {
			var moveTo = 0;
			if(this.container.find('ul li.active').size()) {
				moveTo = this.container.find('ul li.active').index();
			}

			this.move(moveTo, 0);
		};

		banner.prototype.move = function(position, speed) {
			if(typeof(speed) != 'number') {
				speed = this.settings.speed;
			}
			if(position == '+') {
				var index = this.slides.find('li.active').index()+1;
				if(index >= this.slides.find('li').length) {
					return;
				}
				position = index;
			}else if(position == '-') {
				var index = this.slides.find('li.active').index()-1;
				if(index < 0) {
					return;
				}
				position = index;
			}else if(typeof(position) == 'number'){
				if(position >= this.slides.find('li').length) {
					position = this.slides.find('li').length-1;
				}
			}

			this.slides.find('li.active').removeClass('active');
			this.slides.find('li:eq('+position+')').addClass('active');

			this.slides.animate({
				'margin-left':position*300*-1+'px'
			}, speed);
		};

		banner.prototype.handleTouchStart = function(e) {
			this.startX = e.originalEvent.touches[0].pageX;
			this.startSlideX = parseInt(this.slides.css('margin-left'));
		};
		banner.prototype.handleTouchMove = function(e) {
			this.moveX = this.startX - e.originalEvent.touches[0].pageX;
			this.slides.css({
				'margin-left': this.startSlideX - this.moveX
			});
		};
		banner.prototype.handleTouchEnd = function(e) {
			var abs = Math.abs(this.moveX);

			var tmpX = parseInt(this.slides.css('margin-left'));
			var tmpIndex = Math.round(tmpX / 300);
			if(tmpIndex > 0) {
				tmpIndex = 0;
			}else{
				tmpIndex = Math.abs(tmpIndex);
			}
			this.move(tmpIndex);
		};

		$.fn.shaunoBanner = function(options) {
			 // This is the easiest way to have default options.
			var settings = $.extend({
				speed: 500
			}, options);

			var instances = [], i;
			return this.each(function(i, ele) {
				i = instances.length;
				instances[i] = new banner($(this), settings);
			});

		};
}(jQuery));