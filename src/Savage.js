/*
Savage.js - SVG to canvas parser
Author: Daniel Fudala

What savage does:

parses svg shapes into canvas drawing commands:
	supported shapes: rect, circle, ellipse, polygon, path
	supported transform commands: matrix
It only supports SVG files created with Adobe Illustrator

Savage.Parser.parse(svg)
Savage.Parser.parseElement(svgNode) - converts svg node into a Savage.object
Savage.object - a collection of paths

*/

// not so cool if you want to run this thing on node.js
// var Savage = window.Savage || {};
var Savage = {};
// probably not the best way of checking if running on node
if(typeof window === 'undefined') {
	exports.Savage = Savage;
}

Savage.error = function(message) {
	console.log("SAVAGE ERROR: " + message);
};
Savage.debug = true;
Savage.extend = function(o1, o2) {
	for(var key in o2) {
		if(o2.hasOwnProperty(key)) {
			o1[key] = o2[key];
		}
	}
};