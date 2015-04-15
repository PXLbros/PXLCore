/**
 * pxlCore/Notification
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification($pxl)
{
	this.init($pxl);
}

pxlCore_Notification.prototype =
{
	current_engine: null,

	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Notification ~', '#CCC', 'black');
		}
	},

	prepare: function(options)
	{
		if ( options.title
	},

	show_success: function(options)
	{
	},

	show_info: function(options)
	{
	},

	show_warning: function(options)
	{
	},

	show_error: function(options)
	{
	}
};
/**
 * pxlCore/Dialog
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Dialog($pxl)
{
	this.init($pxl);
}

pxlCore_Dialog.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Dialog ~', '#CCC', 'black');
		}
	}
};
/**
 * pxlCore/Ajax
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Ajax($pxl)
{
	this.init($pxl);
}

pxlCore_Ajax.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Ajax ~', '#CCC', 'black');
		}
	}
};
/**
 * pxlCore/UI
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_UI($pxl)
{
	this.init($pxl);
}

pxlCore_UI.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/UI ~', '#CCC', 'black');
		}
	}
};
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