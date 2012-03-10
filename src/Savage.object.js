Savage.object = Class.extend({
	elements: [],
	cached: null,
	// values after scaling
	width: 0,
	height: 0,
	// values before scaling
	originalWidth: 0,
	originalHeight: 0,
	x: 0,
	y: 0,
	rotation: 0,
	scaleX: 1,
	scaleY: 1,
	opacity: 1,
	visible: true,
	toDelete: false,
	deleteMargin: 1,
	destroy: false,
	// array index in the parent (for removing / destroying)
	index: 0,
	init: function(params) {
		Savage.extend(this, params);
	},
	add: function(elements) {
		this.elements = this.elements.concat(elements);
	},
	render: function(context) {
		if(this.scaleX != 0 && this.scaleY != 0 && this.visible && this.opacity != 0) {
			context.save();
			context.translate(this.x, this.y);
			context.scale(this.scaleX, this.scaleY);
			context.rotate(this.rotation);
			
			if(this.cached) {
				context.translate(this.viewBox.x, this.viewBox.y);
				context.drawImage(this.cached, 0, 0);
			} else {
				for(var i = 0, l = this.elements.length; i < l; i ++) {
					var element = this.elements[i];
					element.render(context);
				}
			}
			context.restore();
		}
	},
	clone: function() {
		var clone = Savage.extend({}, this);
		clone.d = Savage.extend({}, {
			x:0,
			y:0,
			scaleX:0,
			scaleY:0,
			rotation:0
		});
		return clone;
	}
});