function pxlCore(options)
{
	this.init(options);
}

pxlCore.prototype =
{
	version: '1.0.46',

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
	modal: null,
	notification: null,
	uri: null,
	form: null,

	libraries: [],

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
			self.log('Version: ' + self.version);
			self.log('Detected pxlFramework: ' + (self.framework !== null ? 'Yes' : 'No'));

			if ( self.framework !== null )
			{
				self.log('Current Page: ' + self.framework.current_page);
				self.log('Page ID: ' + self.framework.page_id);
				self.log('Base URL: ' + self.framework.base_url);
			}
		}

		// UI
		self.ui = new pxlCore_UI(self);

		// Ajax
		self.ajax = new pxlCore_Ajax(self);

		// Modal
		self.modal = new pxlCore_Modal(self);

		// Notification
		self.notification = new pxlCore_Notification(self);

		// URI
		self.uri = new pxlCore_URI(self);

		// Form
		self.form = new pxlCore_Form(self);
	},

	/**
     * Detect if pxlFramework exist.
     */
	detectPXLFramework: function()
	{
		var self = this;

		if ( typeof pxl === 'object' )
		{
			self.framework = pxl;
		}
	},

	/**
     * Log message to console.
	 * @param {string} text - Text to show.
	 * @param {string} background_color - Background color.
	 * @param {string} color - Text color.
     */
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
		this.log(text, '#F00', '#FFF');
	},

	extend: function(defaults, options)
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
	},

	isUndefined: function(object)
	{
		return object == void 0;
	},

	isDefined: function(object)
	{
		return !this.isUndefined(object);
	},

	isFunction: function(object)
	{
		return (typeof object === 'function');
	},

	isObject: function(object)
	{
		return object === Object(object);
	},

	inArray: function(subject, array)
	{
		return ($.inArray(subject, array) !== -1);
	},

	getObjectSize: function(object)
	{
		var size = 0,
			key;

		for ( key in object )
		{
			if ( object.hasOwnProperty(key) )
			{
				size++;
			}
		}

		return size;
	},

	redirect: function(url, with_base_url)
	{
		window.location = (typeof with_base_url === 'boolean' ? this.uri.urlize(url) : url);
	},

	implode: function(glue, pieces, last_glue)
	{
		var i = '',
			return_value = '',
			append_glue = '';

		last_glue = last_glue || null;

		if ( arguments.length === 1 )
		{
			pieces = glue;
			glue = '';
		}

		if ( typeof pieces === 'object' )
		{
			if ( Object.prototype.toString.call(pieces) === '[object Array]' && last_glue === null )
			{
				return pieces.join(glue);
			}

			var num_pieces = pieces.length;

			for ( i in pieces )
			{
				if ( pieces.hasOwnProperty(i) )
				{
					return_value += append_glue + pieces[i];

					append_glue = (i < (num_pieces - 2) ? glue : last_glue);
				}
			}

			return return_value;
		}

		return pieces;
	},

	openPopup: function(url, width, height)
	{
		var top_position = ($(window).height() / 2) - (height / 2),
			left_position = ($(window).width() / 2) - (width / 2);

		window.open(url, 'pxl-popup', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=' + top_position + ',left=' + left_position + ',width=' + width + ',height=' + height);
	}
};