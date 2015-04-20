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
		var request = new pxlCore_Ajax_Request();
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
		var request = new pxlCore_Ajax_Request();
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