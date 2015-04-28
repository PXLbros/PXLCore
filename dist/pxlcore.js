/**
 * pxlCore/Notification/Engine/SweetAlert
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification_Engine_SweetAlert($pxl)
{
	this.loaded = this.init($pxl);
}

pxlCore_Notification_Engine_SweetAlert.prototype =
{
	$pxl: null,

	init: function($pxl)
	{
		var self = this;

		if ( typeof sweetAlert !== 'function' )
		{
			return false;
		}

		self.$pxl = $pxl;

		return true;
	},

	showSuccess: function(options)
	{
	},

	showConfirm: function(options)
	{
		swal(
		{
			title: options.question,
			type: (typeof options.type === 'string' ? options.type : 'info'),
			showCancelButton: true,
			confirmButtonText: (typeof options.buttons === 'object' && typeof options.buttons.yes === 'string' ? options.buttons.yes : 'Yes'),
			cancelButtonText: (typeof options.buttons === 'object' && typeof options.buttons.no === 'string' ? options.buttons.no : 'No')
		}, (typeof options.yes === 'function' ? options.yes : function() {}));
	}
};
/**
 * pxlCore/Notification/Engine/Notiny
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification_Engine_Notiny($pxl)
{
	this.loaded = this.init($pxl);
}

pxlCore_Notification_Engine_Notiny.prototype =
{
	$pxl: null,

	options:
	{
		position: 'right-top',
		width: 'auto'
	},

	init: function($pxl)
	{
		var self = this;

		if ( typeof $.notiny !== 'function' )
		{
			return false;
		}

		self.$pxl = $pxl;

		return true;
	},

	showSuccess: function(options)
	{
		alert('hello notiny');
	},

	showError: function(options)
	{
		var self = this;

		$.notiny(
		{
			text: options.message,
			position: self.options.position,
			width: self.options.width,
			delay: (self.options.autoHide === true ? 0 : 3000)
		});
	}
};
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
	engines: [],
	default_engine_id: null,
	current_engine_id: null,

	init: function($pxl)
	{
		var self = this;

		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Notification ~', '#CCC', 'black');
		}

		var engine_index,
			engine_id,
			engine_name,
			engine;

		for ( engine_index = 0, num_engines = $pxl.options.notification.engines.length; engine_index < num_engines; engine_index++ )
		{
			engine_id = $pxl.options.notification.engines[engine_index];
			engine_name = 'pxlCore_Notification_Engine_' + engine_id;
			engine = new window[engine_name]($pxl);

			if ( engine.loaded === false )
			{
				$pxl.error('Could not load notification engine "' + engine_id + '".');

				continue;
			}

			self.engines[engine_id] = engine;

			if ( (engine_index === 0) || (engine_index > 0 && self.default_engine_id === null) )
			{
				self.default_engine_id = engine_id;
			}
		}

		var num_loaded_engines = $pxl.getObjectSize(self.engines);

		if ( self.default_engine_id !== null )
		{
			self.setEngine(self.default_engine_id);
		}

		if ( $pxl.options.debug === true )
		{
			var loaded_engines_debug_str = 'Loaded Engines: ';

			if ( num_loaded_engines > 0 )
			{
				engine_index = 0;

				for ( engine_id in self.engines )
				{
					loaded_engines_debug_str += engine_id + (engine_index < (num_loaded_engines - 1) ? ', ' : '');

					engine_index++;
				}
			}
			else
			{
				loaded_engines_debug_str += 'None';
			}

			$pxl.log(loaded_engines_debug_str);

			$pxl.log('Default Engine: ' + (self.default_engine_id !== null ? self.default_engine_id : '/'));
		}
	},

	setEngine: function(engine_id)
	{
		this.current_engine_id = engine_id;
	},

	prepare: function(options, type)
	{
		var self = this;

		if ( typeof options.engine === 'string' )
		{
			if ( typeof self.engines[options.engine] !== 'object' )
			{
				$pxl.error('pxlCore/Notification: Engine "' + options.engine + '" not found.');

				return false;
			}

			self.setEngine(options.engine);
		}

		var current_engine = self.engines[self.current_engine_id];

		if ( typeof current_engine['show' + type] !== 'function' )
		{
			$pxl.error('pxlCore/Notification: Engine "' + self.current_engine_id + '" doesn\'t support type "' + type + '".');

			return false;
		}

		if ( type === 'Success' || type === 'Info' || type === 'Warning' || type === 'Error' )
		{
			if ( typeof options.message === 'undefined' )
			{
				$pxl.error('pxlCore/Notification: Missing required argument "message".');

				return false;
			}
		}
		else if ( type === 'Confirm' )
		{
			if ( typeof options.question === 'undefined' )
			{
				$pxl.error('pxlCore/Notification: Missing required argument "question".');

				return false;
			}
		}

		return true;
	},

	finalize: function()
	{
		this.setEngine(this.default_engine_id);
	},

	showSuccess: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Success') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showSuccess(options);

		self.finalize();
	},

	showInfo: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Info') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showInfo(options);

		self.finalize();
	},

	showWarning: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Warning') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showWarning(options);

		self.finalize();
	},

	showError: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Error') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showError(options);

		self.finalize();
	},

	showConfirm: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Confirm') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showConfirm(options);

		self.finalize();
	},

	show: function(options)
	{
		var self = this;

		if ( typeof options.type === 'undefined' )
		{
			$pxl.error('pxlCore/Notification: Missing required argument "type".');

			return false;
		}

		var type;

		if ( options.type === 1 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_SUCCESS
		{
			type = 'Success';
		}
		else if ( options.type === 2 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_INFO
		{
			type = 'Info';
		}
		else if ( options.type === 3 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_WARNING
		{
			type = 'Warning';
		}
		else if ( options.type === 4 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_ERROR
		{
			type = 'Error';
		}

		if ( self.prepare(options, type) === false )
		{
			return;
		}

		if ( options.type === 1 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_SUCCESS
		{
			self.engines[self.current_engine_id].showSuccess(options);
		}
		else if ( options.type === 2 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_INFO
		{
			self.engines[self.current_engine_id].showInfo(options);
		}
		else if ( options.type === 3 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_WARNING
		{
			self.engines[self.current_engine_id].showWarning(options);
		}
		else if ( options.type === 4 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_ERROR
		{
			self.engines[self.current_engine_id].showError(options);
		}

		self.finalize();
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
	},

	init_from_element: function(selector, options)
	{
		console.log('init from element');
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
	$pxl: null,

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

	init: function($pxl)
	{
		var self = this;

		self.$pxl = $pxl;

		if ( self.$pxl.options.debug === true )
		{
			self.$pxl.log('~ pxlCore/Ajax ~', '#CCC', 'black');
		}
	},

	execute: function()
	{
		var inst = this;

		if ( $pxl.isUndefined(inst.url) )
		{
			$pxl.log('Missing AJAX URL.');

			return;
		}

		if ( !$pxl.isUndefined($pxl.ajax.requests[inst.url]) )
		{
			$pxl.ajax.requests[inst.url].abort();
		}

		var file_upload = ($pxl.isDefined(inst.file_upload) && inst.file_upload === true);

		var headers = { 'X-XSRF-TOKEN': $pxl.framework.csrf_token };

		if ( file_upload === true && $pxl.isObject(inst.file_upload_data) )
		{
			headers = $.extend(headers, inst.file_upload_data);
		}

		$pxl.ajax.requests[inst.url] = $.ajax(
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

				if ( $pxl.isFunction(inst.progress) )
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
				if ( $pxl.isFunction(inst.before) )
				{
					inst.before(xhr, data);
				}
			}
		}).done(function(result)
		{
			if ( $pxl.isFunction(inst.success) )
			{
				inst.success(result);
			}

			if ( typeof result.notification !== 'undefined' && result.notification !== null )
			{
				if ( typeof result.notification.type === 'number' && typeof result.notification.text === 'string' )
				{
					$pxl.notification.show({ type: result.notification.type, message: result.notification.text });
				}
			}

			if ( !$pxl.isUndefined(result.redirect) )
			{
				setTimeout(function()
				{
					return $pxl.redirect(result.redirect.url);
				}, result.redirect.delay);
			}

			inst.result = result;
		}).always(function(result)
		{
			if ( $pxl.isFunction(inst.always) )
			{
				inst.always(result);
			}

			delete $pxl.ajax.requests[inst.url];
		}).fail(function(xhr, textStatus, errorThrown)
		{
			if ( xhr === 'abort' )
			{
				if ( $pxl.isFunction(inst.abort) )
				{
					inst.abort();
				}
			}
			else
			{
				if ( $pxl.isFunction(inst.error) )
				{
					inst.error(errorThrown);
				}

				if ( $pxl.options.debug === true )
				{
					$pxl.notification.showError({ message: xhr.responseText, autoHide: false });
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
	$pxl: null,

	requests: [],

	init: function($pxl)
	{
		var self = this;

		self.$pxl = $pxl;

		if ( self.$pxl.options.debug === true )
		{
			self.$pxl.log('~ pxlCore/Ajax ~', '#CCC', 'black');
		}
	},

	get: function(url, data, callbacks, extra)
	{
		var self = this;

		var request = new pxlCore_Ajax_Request(self.$pxl);
		request.method = 'GET';
		request.url = url;
		request.data = data;

		if ( self.$pxl.isUndefined(callbacks) )
		{
			callbacks = {};
		}

		if ( self.$pxl.isFunction(callbacks.before) )
		{
			request.before = callbacks.before;
		}

		if ( self.$pxl.isFunction(callbacks.progress) )
		{
			request.progress = callbacks.progress;
		}

		if ( self.$pxl.isFunction(callbacks.success) )
		{
			request.success = callbacks.success;
		}

		if ( self.$pxl.isFunction(callbacks.error) )
		{
			request.error = callbacks.error;
		}

		if ( self.$pxl.isFunction(callbacks.always) )
		{
			request.always = callbacks.always;
		}

		if ( self.$pxl.isFunction(callbacks.abort) )
		{
			request.abort = callbacks.abort;
		}

		if ( self.$pxl.isObject(extra) )
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
		var self = this;

		var request = new pxlCore_Ajax_Request(self.$pxl);
		request.method = 'POST';
		request.url = url;
		request.data = data;

		if ( self.$pxl.isUndefined(callbacks) )
		{
			callbacks = {};
		}

		if ( self.$pxl.isFunction(callbacks.before) )
		{
			request.before = callbacks.before;
		}

		if ( self.$pxl.isFunction(callbacks.progress) )
		{
			request.progress = callbacks.progress;
		}

		if (self. $pxl.isFunction(callbacks.success) )
		{
			request.success = callbacks.success;
		}

		if ( self.$pxl.isFunction(callbacks.error) )
		{
			request.error = callbacks.error;
		}

		if ( self.$pxl.isFunction(callbacks.always) )
		{
			request.always = callbacks.always;
		}

		if ( self.$pxl.isFunction(callbacks.abort) )
		{
			request.abort = callbacks.abort;
		}

		if ( self.$pxl.isObject(extra) )
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
 * pxlCore/UI
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_URI($pxl)
{
	this.init($pxl);
}

pxlCore_URI.prototype =
{
	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/URI ~', '#CCC', 'black');
		}
	},

	urlize: function(url)
	{
		if ( $pxl.isUndefined($pxl.framework.base_url) )
		{
			$pxl.log('Base URL not set.');

			return;
		}

		return $pxl.framework.base_url + url;
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
	version: '1.0.23',

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
	uri: null,

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

		// Dialog
		self.dialog = new pxlCore_Dialog(self);

		// Notification
		self.notification = new pxlCore_Notification(self);

		// URI
		self.uri = new pxlCore_URI(self);
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
	}
};