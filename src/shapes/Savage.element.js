Savage.element = Class.extend({
	id:"",
	fill:"#000000",
	stroke:null,
	strokeWidth: 0,
	opacity:1,
	transform:null,
	x:0,
	y:0,
	width:0,
	height:0,
	init: function(attributes) {
		Savage.extend(this, attributes);
	},
	_doTransform: function(context) {
		if(this.transform) {
			context.transform(this.transform[0], this.transform[1], this.transform[2], this.transform[3], this.transform[4], this.transform[5]);
		}
	},
	_fillAndStroke: function(context) {
		if(this.fill)  {
			if(this.fill.indexOf('#') != -1) {
				context.fillStyle = Savage.utils.hexToRGBA(this.fill, this.opacity);
			} else {
				context.fillStyle = this.fill;
			}
			context.fill();
		}
		if(this.stroke) {
			context.lineWidth = this.strokeWidth;
			context.strokeStyle = this.stroke;
			context.stroke();
		}
	},
	clone: function() {
		return Savage.extend({}, this);
	}
});