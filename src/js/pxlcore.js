function pxlCore()
{
	this.init();
}

pxlCore.prototype =
{
	options:
	{
		debug: false
	},

	framework: null,

	ui: null,
	ajax: null,
	dialog: null,
	notification: null,

	init: function(options)
	{
		var self = this;

		if ( typeof options === 'object' )
		{
			self.options = $.extend(self.options, options);
		}

		// Detect pxlFramework
		self.detectPXLFramework();

		if ( self.debug === true )
		{
			self.log('~ pxlCore ~', 'black', 'white');
		}

		// UI
		self.ui = new pxlCore_UI();

		// AJAX
		self.ajax = new pxlCore_AJAX();

		// Dialog
		self.dialog = new pxlCore_Dialog();

		// Notification
		self.notification = new pxlCore_Notification();
	},

	detectPXLFramework: function()
	{
		var self = this;

		if ( typeof pxl === 'object' )
		{
			self.framework = pxl;

			self.debug = self.framework.debug;
		}
	},

	// Log
	log: function(text, background_color, color)
	{
		var style = '';

		if ( typeof background_color === 'string' )
		{
			style = 'background:' + background_color + ';padding:0 6px';
		}

		if ( typeof color === 'string' )
		{
			style += (style !== '' ? ';' : '') + 'color:' + color;
		}

		console.log('%c' + text, (style !== '' ? style : null));
	}
};