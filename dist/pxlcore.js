function pxlCore_Notification()
{
}

pxlCore_Notification.prototype =
{
	init: function()
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore: Notification ~', 'black', 'white');
		}
	}
};
function pxlCore_Dialog()
{
}

pxlCore_Dialog.prototype =
{
	init: function()
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore: Dialog ~', 'black', 'white');
		}
	}
};
function pxlCore_AJAX()
{
}

pxlCore_AJAX.prototype =
{
	init: function()
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore: AJAX ~', 'black', 'white');
		}
	}
};
function pxlCore_UI()
{
}

pxlCore_UI.prototype =
{
	init: function()
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore: UI ~', 'black', 'white');
		}
	}
};
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