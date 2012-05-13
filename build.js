var fs = require('fs');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

var dir = __dirname + '\\';
var output = dir + 'bin/savage.min.js';

function compress(root, package, uglified) {
	var all = "";
	var startTime = new Date().getTime();
	while(fileName = package.shift()) {
		var content = fs.readFileSync(root + fileName, 'utf8');
		console.log('merging: ' + fileName);
		all += content;
	}
	console.log('parsing..');
	try {
		var ast = jsp.parse(all);
		console.log('mangling..');
		ast = pro.ast_mangle(ast, {
			toplevel: false
		});
		console.log('squeezing..');
		ast = pro.ast_squeeze(ast);
		console.log('generating..');
		var finalCode = pro.gen_code(ast);
		console.log('writing..');
		fs.writeFileSync(uglified, finalCode, 'utf8');

		var endTime = new Date().getTime();
		var miliseconds = endTime - startTime;
		console.log(uglified + ' done in ' + miliseconds + 'ms');
	} catch(e) {
		console.log(e);
	}
}

var savage = [
	"src/Class.js",
	"src/Savage.js",
	"src/Savage.object.js",
	"src/Savage.utils.js",
	"src/Savage.Parser.js",
	"src/shapes/Savage.element.js",
	"src/shapes/Savage.circle.js",
	"src/shapes/Savage.ellipse.js",
	"src/shapes/Savage.path.js",
	"src/shapes/Savage.polygon.js",
	"src/shapes/Savage.polyline.js",
	"src/shapes/Savage.glyph.js",
	"src/shapes/Savage.rect.js"
];

compress(dir, savage, output);