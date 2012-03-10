Savage.ellipse = Savage.element.extend({
	type: 'ellipse',
	init: function(attributes) {
		this._super(attributes);
	},
	render:function(context) {
		context.save();
		context.beginPath();
		this._doTransform(context);
		var ratio = this.ry / this.rx;
		context.translate(0, this.y);
		context.scale(1, ratio);
		context.translate(0, -this.y);
		context.arc(this.x, this.y, this.rx, Math.PI * 2, false);
		this._fillAndStroke(context);
		context.restore();
	},
	rx:0,
	ry:0
});