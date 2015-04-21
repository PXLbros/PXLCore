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

			if ( typeof result.message !== 'undefined' && result.message !== null )
			{
				if ( typeof result.message.type === 'number' && typeof result.message.text === 'string' )
				{
					$pxl.notification.show({ type: result.message.type, message: result.message.text });
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
			}
		});
	}
};