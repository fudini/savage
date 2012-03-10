Savage.polygon = Savage.element.extend({
	type: 'polygon',
	points:[],
	init: function(attributes) {
		this._super(attributes);
	},
	translate: function(x, y) {
		for(var i = 1, l = this.points.length; i < l; i++) {
			this.points[i].x += x;
			this.points[i].y += y;
		}
	},
	render:function(context) {
		context.save();
		context.beginPath();
		this._doTransform(context);
		context.moveTo(this.points[0].x, this.points[0].y);
		for(var i = 1, l = this.points.length; i < l; i++) {
			context.lineTo(this.points[i].x, this.points[i].y);
		}
		context.closePath();
		this._fillAndStroke(context);
		context.restore();
	}
});