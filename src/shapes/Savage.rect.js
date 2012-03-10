Savage.rect = Savage.element.extend({
	type: 'rect',
	rx:0,
	ry:0,
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
		if(this.rx == 0 || this.ry == 0) {
			context.moveTo(this.x, this.y);
			context.lineTo(this.x + this.width, this.y);
			context.lineTo(this.x + this.width, this.y + this.height);
			context.lineTo(this.x, this.y + this.height);
			context.lineTo(this.x, this.y);
		} else {
			context.moveTo(this.x + this.rx, this.y);
			context.lineTo(this.x + this.width - this.rx, this.y);
			context.bezierCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.ry, this.x + this.width, this.y + this.ry);
			context.lineTo(this.x + this.width, this.y + this.height - this.ry);
			context.bezierCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.rx, this.y + this.height, this.x + this.width - this.rx, this.y + this.height);
			context.lineTo(this.x + this.rx, this.y + this.height);
			context.bezierCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.ry, this.x, this.y + this.height - this.ry);
			context.lineTo(this.x, this.y + this.ry);
			context.bezierCurveTo(this.x, this.y ,this.x + this.rx, this.y, this.x + this.rx, this.y);
		}
		context.closePath();		
		this._fillAndStroke(context);
		context.restore();
	}
});