/**
 * pxlCore/Ajax
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Ajax($pxl)
{
	if ( $pxl.options.debug === true )
	{
		$pxl.log('~ pxlCore/Ajax ~', '#CCC', 'black');
	}

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

		return request;
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

		return request;
	}
};