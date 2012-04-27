Savage.path = Savage.element.extend({
	type: 'path',
	init: function(attributes) {
		this._super(attributes);
	},
	render:function(context) {
		context.save();
		context.beginPath();
		this._doTransform(context);
		for(var i = 0, l = this.commands.length; i < l; i++) {
			var command = this.commands[i];
			switch(command.type) {
				case "m":
					context.moveTo(command.data.x, command.data.y);
					break;
				case "l":
					context.lineTo(command.data.x, command.data.y);
					break;
				case "c":
					context.bezierCurveTo(command.data.x, command.data.y, command.data.x2, command.data.y2, command.data.x3, command.data.y3);
					break;
				case "q":
					context.bezierCurveTo(command.data.x, command.data.y, command.data.x2, command.data.y2, command.data.x2, command.data.y2);
					break;
			}
		}
		context.closePath();
		this._fillAndStroke(context);
		context.restore();
	},
	commands:[]
});