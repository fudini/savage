Savage.polyline = Savage.element.extend({
	type: 'polyline',
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
		Savage.error('ERROR: method not implemented: Savage.polyline.render()');
	}
});