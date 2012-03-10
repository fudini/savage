Savage.circle = Savage.element.extend({
	type: 'circle',
	init: function(attributes) {
		this._super(attributes);
	},
	translate: function(x, y) {
		this.x += x;
		this.y += y;
	},
	render:function(context) {
		context.save();
		context.beginPath();
		this._doTransform(context);
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		this._fillAndStroke(context);
		context.restore();
	},
	radius:0
});