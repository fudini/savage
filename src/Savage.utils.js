Savage.utils = {
	hexToRGBA: function(hex, alpha) {
		var dec = parseInt(hex.replace('#', ''), 16);
		var r = dec >> 16 & 255;
		var g = dec >> 8 & 255;
		var b = dec & 255;
		var result = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
		return result;
	},
	hexToRGB: function(hex) {
		var dec = parseInt(hex.replace('#', ''), 16);
		var r = dec >> 16 & 255;
		var g = dec >> 8 & 255;
		var b = dec & 255;
		return [r, g, b];
	}
}