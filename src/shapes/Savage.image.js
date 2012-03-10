Savage.image = Class.extend({
	type: 'image',
	init: function(image) {
		this.image = image;
	},
	render: function(context) {
		context.save();
		context.translate(this.x, this.y);
		context.drawImage(this.image, 0, 0);
		context.restore();
	},
	image:null,
	opacity:1,
	_parentOpacity:1,
	matrix:null
});