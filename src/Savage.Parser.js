/*
TODO:
	parse all color values (hex, rgb(), rgba(), red, blue, green, etc..) into some sort of rgba object
	
*/
Savage.Parser = {
	parse: function(svg) {
		var elements = svg.getElementsByTagName('*');
		var savageElements = this.parseElements(elements);
		var savageObject = new Savage.object();
		savageObject.add(savageElements.elements);
		savageObject.originalWidth = parseFloat(svg.attributes["width"].nodeValue);
		savageObject.originalHeight = parseFloat(svg.attributes["height"].nodeValue);
		savageObject.width = savageObject.originalWidth;
		savageObject.height = savageObject.originalHeight;
		return savageObject;
	},
	parseElements: function(elements) {
		var result = [];
		for(var i = 0; i < elements.length; i++) {
			var element = elements[i];
			var tag = element.tagName.toLowerCase();
			// Illustrator doesn't apply transformations to groups so we don't care about it just yet.
			if(tag != "g") {
				var attributes = this.parseAttributes(element.attributes);
				var savage = new Savage[tag](attributes);
				result.push(savage);
			}
		}
		return {elements: result};
	},
	parseElement: function(element) {
		var tag = element.tagName.toLowerCase();
		var attributes = this.parseAttributes(element.attributes);
		var savage = new Savage[tag](attributes);
		savage.id = element.id;
		return savage;
	},
	parseAttributes: function(attributes) {
		var result = {};
		for(var i = 0; i < attributes.length; i ++) {
			var attributeName = attributes[i].nodeName;
			var attributeValue = attributes[i].nodeValue;
			if(this.attributeMap[attributeName]) {
				attributeName = this.attributeMap[attributeName];
			}
			var parseFunctionName = this.attributeTypesMap[attributeName];
			if(this.parseAttribute[parseFunctionName]) {
				result[attributeName] = this.parseAttribute[parseFunctionName](attributeValue);
			} else {
				// this will write in other attributes
				result[attributeName] = attributeValue;
			}
		}
		return result;
	},
	// translate to something more usable
	attributeMap: {
		"cx" : "x",
		"cy" : "y",
		"r"	: "radius",
		"d" : "commands",
		"stroke-width": "strokeWidth",
		"horiz-adv-x": "horizAdvX"
	},
	// allowed attributes names and their corresponding parse methods
	attributeTypes: {
		"width,height,x,y,horizAdvX": "float",
		"rx,ry,radius,opacity,strokeWidth": "float",
		"fill,stroke": "color",
		"transform": "transform",
		"commands": "d",
		"points": "points",
		"id,unicode": "string"
	},
	attributeTypesMap: null,
	// get the attributeTypes object and convert to name-value pairs for a quick lookup
	parseAttributeTypesMap: function() {
		if(this.attributeTypesMap == null) {
			this.attributeTypesMap = {};
			for(var i in this.attributeTypes) {
				if(this.attributeTypes.hasOwnProperty(i)) {
					var keys = i.split(',');
					var value = this.attributeTypes[i];
					for(var j in keys) {
						if(keys.hasOwnProperty(j)) {
							this.attributeTypesMap[keys[j]] = value;
						}
					}
				}
			}
		}
	},
	parseAttribute: {
		'string': function(value) {
			return value;
		},
		'color': function(value) {
			if(value == "none") return null;
			return value;
		},
		'float': function(value) {
			return parseFloat(value);
		},
		'int': function(value) {
			return parseInt(value);
		},
		'transform': function(transform) {
			transform = transform.replace(/\,/g, '');
			var match = transform.match(/matrix\(([0-9\-\.\s]+)\)/);
			if(match) {
				var matrix = match[1].split(" ");
				for(var i = 0, l = matrix.length; i < l; i ++) {
					matrix[i] = parseFloat(matrix[i]);
				}
				return matrix;
			} else {
				Savage.error("transform command not implemented"); // only matrix for now
				return null;
			}
		},
		'd': function(path) {
			path = Savage.Parser.pathToArray_d(path);
			var commands = [];
			var item = null;
			var command = null;
			var x = 0;
			var y = 0;
			function parseCommand(item) {
				switch(item) {
					case "M":
						x = parseFloat(path.shift());
						y = parseFloat(path.shift());
						commands.push({
							type:'m',
							data: {x: x, y: y}
						});
						command = item;
						break;
					case "h":
						x += parseFloat(path.shift());
						commands.push({
							type: 'l',
							data: {x: x, y: y}
						});
						command = item;
						break;
					case "H":
						x = parseFloat(path.shift());
						commands.push({
							type: 'l',
							data: {x: x, y: y}
						});
						command = item;
						break;
					case "v":
						y += parseFloat(path.shift());
						commands.push({
							type: 'l',
							data: {x: x, y: y}
						});
						command = item;
						break;
					case "V":
						y = parseFloat(path.shift());
						commands.push({
							type: 'l',
							data: {x: x, y: y}
						});
						command = item;
						break;
					case "l":
						x += parseFloat(path.shift());
						y += parseFloat(path.shift());
						commands.push({
							type: 'l',
							data: {x: x, y: y}
						});
						command = item;
						break;
					case "L":
						x = parseFloat(path.shift());
						y = parseFloat(path.shift());
						commands.push({
							type: 'l',
							data: {x: x, y: y}
						});
						command = item;
						break;
					case "c":
						var data = {
							x: x + parseFloat(path.shift()),
							y: y + parseFloat(path.shift()),
							x2: x + parseFloat(path.shift()),
							y2: y + parseFloat(path.shift()),
							x3: x + parseFloat(path.shift()),
							y3: y + parseFloat(path.shift())
						};
						commands.push({
							type: 'c',
							data: data
						});
						x = data.x3;
						y = data.y3;
						command = item;
						break;
					case "C":
						var data = {
							x: parseFloat(path.shift()),
							y: parseFloat(path.shift()),
							x2: parseFloat(path.shift()),
							y2: parseFloat(path.shift()),
							x3: parseFloat(path.shift()),
							y3: parseFloat(path.shift())
						};
						commands.push({
							type: 'c',
							data: data
						});
						x = data.x3;
						y = data.y3;
						command = item;
						break;
					case "q":
						var data = {
							x: x + parseFloat(path.shift()),
							y: y + parseFloat(path.shift()),
							x2: x + parseFloat(path.shift()),
							y2: y + parseFloat(path.shift())
						};
						commands.push({
							type: 'q',
							data: data
						});
						x = data.x2;
						y = data.y2;
						command = item;
						break;
					case "Q":
						var data = {
							x: parseFloat(path.shift()),
							y: parseFloat(path.shift()),
							x2: parseFloat(path.shift()),
							y2: parseFloat(path.shift())
						};
						commands.push({
							type: 'q',
							data: data
						});
						x = data.x2;
						y = data.y2;
						command = item;
						break;
					case "t":
						var previousCommand = commands[commands.length - 1];
						if("qQtT".indexOf(previousCommand.type) != -1) {
							var data = {
								x: x + x - previousCommand.data.x,
								y: y + y - previousCommand.data.y,
								x2: x + parseFloat(path.shift()),
								y2: y + parseFloat(path.shift())
							};
							commands.push({
								type: 'q',
								data: data
							});
							x = data.x2;
							y = data.y2;
							command = item;
						} else {
							Savage.error("previous command not a quadratic bezier (qQtT)");
						}
						break;
					case "T":
						var previousCommand = commands[commands.length - 1];
						if("qQtT".indexOf(previousCommand.type) != -1) {
							var data = {
								x: x + x - previousCommand.data.x2,
								y: y + y - previousCommand.data.y2,
								x2: parseFloat(path.shift()),
								y2: parseFloat(path.shift())
							};
							commands.push({
								type: 'c',
								data: data
							});
							x = data.x2;
							y = data.y2;
							command = item;
						} else {
							Savage.error("previous command not a quadratic bezier (qQtT)");
						}
						break;
					case "s":
						var previousCommand = commands[commands.length - 1];
						if("cCsS".indexOf(previousCommand.type) != -1) {
							var data = {
								x: x + x - previousCommand.data.x2,
								y: y + y - previousCommand.data.y2,
								x2: x + parseFloat(path.shift()),
								y2: y + parseFloat(path.shift()),
								x3: x + parseFloat(path.shift()),
								y3: y + parseFloat(path.shift())
							};
							commands.push({
								type: 'c',
								data: data
							});
							x = data.x3;
							y = data.y3;
							command = item;
						} else {
							Savage.error("previous command not a bezier");
						}
						break;
					case "S":
						var previousCommand = commands[commands.length - 1];
						if("cCsS".indexOf(previousCommand.type) != -1) {
							var data = {
								x: x + x - previousCommand.data.x2,
								y: y + y - previousCommand.data.y2,
								x2: parseFloat(path.shift()),
								y2: parseFloat(path.shift()),
								x3: parseFloat(path.shift()),
								y3: parseFloat(path.shift())
							};
							commands.push({
								type: 'c',
								data: data
							});
							x = data.x3;
							y = data.y3;
							command = item;
						} else {
							Savage.error("previous command not a bezier");
						}
						break;
					case "z":
						break;
					default:
						// numeric value, use the previous command to process
						path.unshift(item);
						parseCommand(command);
					break;
				}
			}
			while(item = path.shift()) {
				parseCommand(item);
			}
			return commands;
		},
		'points': function(path) {
			path = Savage.Parser.pathToArray_points(path);
			var points = [];
			var x = 0;
			var y = 0;
			while(x = path.shift()) {
				y = path.shift();
				points.push({
					x: parseFloat(x),
					y: parseFloat(y)
				});
			}
			return points;
		}
	},
	pathToArray_points: function (path) {
		var result = path.replace(/[\n\t]/g, "").replace(/\s/g, ",").replace(/\-/, ",-").replace(/\,+/g, ",").replace(/^\,|\,$/g, "").split(",");
		return result;
	},
	pathToArray_d: function (path) {
		var result = path.replace(/[\n\t\-\smlhvcszqta]/gmi, function(match) {
			var value = "," + match + ",";
			switch(match) {
				case "\t":
				case "\n":
					value = "";
					break;
				case " ":
					value = ",";
					break;
				case "-":
					value = ",-";
					break;
			}
			return value;
		}).replace(/\,+/g, ",").replace(/^\,|\,$/g, "");
		return result.split(",");
	},
	pointsToBox: function(points) {
		var box = {
			x: null,
			y: null,
			x2: null,
			y2: null,
			width: null,
			height: null
		};
		for(var i = 1, l = points.length; i < l; i++) {
			var point = points[i];
			if(point.x < box.x || box.x == null) box.x = point.x;
			if(point.x > box.x2 || box.x2 == null) box.x2 = point.x;
			if(point.y < box.y || box.y == null) box.y = point.y;
			if(point.y > box.y2 || box.y2 == null) box.y2 = point.y;
		}
		box.width = box.x2 - box.x;
		box.height = box.y2 - box.y;
		return box;
	}
}
Savage.Parser.parseAttributeTypesMap();