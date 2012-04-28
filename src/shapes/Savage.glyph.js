Savage.glyph = Savage.path.extend({
	type: 'glyph',
	horizAdvX: null, // if this is null - use the global value from the font tag
	init: function(attributes) {
		this._super(attributes);
	}
});