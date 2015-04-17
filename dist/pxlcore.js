


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
		if ( typeof options.title === 'undefined' )
		{
			$pxl.error('pxlCore/Notification: Missing required argument "title".');

			return false;
		}

		return true;
	},

	show_success: function(options)
	{
		if ( self.prepare(options) === false )
		{
			return;
		}

		$pxl.log('show success', 'green', 'white');
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
 * pxlCore/Ajax_Request
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Ajax_Request($pxl)
{
	this.init($pxl);
}

pxlCore_Ajax_Request.prototype =
{
	$form: null,

	url: '',
	data: {},
	method: 'GET',
	data_type: 'json',
	cache: false,
	async: true,

	result: null,

	before: null,
	progress: null,
	success: null,
	error: null,
	always: null,
	abort: null,

	execute: function()
	{
		var inst = this;

		if ( $core.isUndefined(inst.url) )
		{
			$core.log('Missing AJAX URL.');

			return;
		}

		if ( !$core.isUndefined($core.ajax.requests[inst.url]) )
		{
			$core.ajax.requests[inst.url].abort();
		}

		var file_upload = ($core.isDefined(inst.file_upload) && inst.file_upload === true);

		var headers = { 'X-XSRF-TOKEN': $core.options.csrf_token };

		if ( file_upload === true && $core.isObject(inst.file_upload_data) )
		{
			headers = $.extend(headers, inst.file_upload_data);
		}

		$core.ajax.requests[inst.url] = $.ajax(
		{
			type: inst.method,
			url: inst.url,
			data: inst.data,
			dataType: inst.data_type,
			cache: inst.cache,
			async: inst.async,
			processData: (file_upload !== true),
			contentType: (file_upload === true ? false : 'application/x-www-form-urlencoded; charset=UTF-8'),
			headers: headers,
			xhr: function()
			{
				var xhr = $.ajaxSettings.xhr();

				if ( $core.isFunction(inst.progress) )
				{
					xhr.upload.onprogress = function(e)
					{
						var percent = (e.loaded / e.total) * 100;

						inst.progress(percent);
					};
				}

				return xhr;
			},
			beforeSend: function(xhr, data)
			{
				if ( $core.isFunction(inst.before) )
				{
					inst.before(xhr, data);
				}
			}
		}).done(function(result)
		{
			if ( $core.isFunction(inst.success) )
			{
				inst.success(result);
			}

			if ( typeof result.message !== 'undefined' && result.message !== null )
			{
				if ( typeof result.message.type === 'number' && typeof result.message.text === 'string' )
				{
					$core.ui.message.engine.show(result.message.type, result.message.text);
				}
			}

			if ( !$core.isUndefined(result.redirect) )
			{
				setTimeout(function()
				{
					return $core.uri.redirect(result.redirect.url);
				}, result.redirect.delay);
			}

			inst.result = result;
		}).always(function(result)
		{
			if ( $core.isFunction(inst.always) )
			{
				inst.always(result);
			}

			delete $core.ajax.requests[inst.url];
		}).fail(function(xhr, textStatus, errorThrown)
		{
			if ( xhr === 'abort' )
			{
				if ( $core.isFunction(inst.abort) )
				{
					inst.abort();
				}
			}
			else
			{
				if ( $core.isFunction(inst.error) )
				{
					inst.error(errorThrown);
				}
			}
		});
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
	requests: [],
	
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Ajax ~', '#CCC', 'black');
		}
	},

	get: function(url, data, callbacks, extra)
	{
		var request = new Core_Ajax_Request();
		request.method = 'GET';
		request.url = url;
		request.data = data;

		if ( $pxl.isUndefined(callbacks) )
		{
			callbacks = {};
		}

		if ( $pxl.isFunction(callbacks.before) )
		{
			request.before = callbacks.before;
		}

		if ( $pxl.isFunction(callbacks.progress) )
		{
			request.progress = callbacks.progress;
		}

		if ( $pxl.isFunction(callbacks.success) )
		{
			request.success = callbacks.success;
		}

		if ( $pxl.isFunction(callbacks.error) )
		{
			request.error = callbacks.error;
		}

		if ( $pxl.isFunction(callbacks.always) )
		{
			request.always = callbacks.always;
		}

		if ( $pxl.isFunction(callbacks.abort) )
		{
			request.abort = callbacks.abort;
		}

		if ( $pxl.isObject(extra) )
		{
			for ( var key in extra )
			{
				if ( extra.hasOwnProperty(key) )
				{
					request[key] = extra[key];
				}
			}
		}

		request.execute();
	},

	post: function(url, data, callbacks, extra)
	{
		var request = new Core_Ajax_Request();
		request.method = 'POST';
		request.url = url;
		request.data = data;

		if ( $pxl.isUndefined(callbacks) )
		{
			callbacks = {};
		}

		if ( $pxl.isFunction(callbacks.before) )
		{
			request.before = callbacks.before;
		}

		if ( $pxl.isFunction(callbacks.progress) )
		{
			request.progress = callbacks.progress;
		}

		if ( $pxl.isFunction(callbacks.success) )
		{
			request.success = callbacks.success;
		}

		if ( $pxl.isFunction(callbacks.error) )
		{
			request.error = callbacks.error;
		}

		if ( $pxl.isFunction(callbacks.always) )
		{
			request.always = callbacks.always;
		}

		if ( $pxl.isFunction(callbacks.abort) )
		{
			request.abort = callbacks.abort;
		}

		if ( $pxl.isObject(extra) )
		{
			for ( var key in extra )
			{
				if ( extra.hasOwnProperty(key) )
				{
					request[key] = extra[key];
				}
			}
		}

		request.execute();
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