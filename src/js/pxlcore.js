/**
 * pxlCore
 * @constructor
 */
function pxlCore(options)
{
	this.init(options);
}

pxlCore.prototype =
{
	version: '1.0.7',

	options:
	{
		debug: false,
		notification:
		{
			engines: []
		}
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
			self.options = self.extend(self.options, options);
		}

		// Detect pxlFramework
		self.detectPXLFramework();

		if ( self.options.debug === true )
		{
			self.log('~ pxlCore ~', 'black', 'white');
		}

		// UI
		self.ui = new pxlCore_UI(self);

		// Ajax
		self.ajax = new pxlCore_Ajax(self);

		// Dialog
		self.dialog = new pxlCore_Dialog(self);

		// Notification
		self.notification = new pxlCore_Notification(self);
	},

	detectPXLFramework: function()
	{
		var self = this;

		if ( typeof pxl === 'object' )
		{
			self.framework = pxl;
		}
	},

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
	},

	error: function(text)
	{
		self.log(text, 'red', 'black');
	},

	extend: function (defaults, options)
	{
	    var extended = {},
	        key;

	    for ( key in defaults )
	    {
	        if ( Object.prototype.hasOwnProperty.call(defaults, key) )
	        {
	            extended[key] = defaults[key];
	        }
	    }

	    for ( key in options )
	    {
	        if ( Object.prototype.hasOwnProperty.call(options, key) )
	        {
	            extended[key] = options[key];
	        }
	    }

	    return extended;
	}
};