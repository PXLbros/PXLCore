/**
 * pxlCore/Ajax_Request
 * @param {string} $pxl - pxlCore object reference.
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
	},

	execute: function()
	{
		var inst = this;

		if ( inst.$pxl.isUndefined(inst.url) )
		{
			inst.$pxl.log('Missing AJAX URL.');

			return;
		}

		if ( !inst.$pxl.isUndefined(inst.$pxl.ajax.requests[inst.url]) && (inst.$pxl.isUndefined(inst.allowMultiple) || inst.allowMultiple === false) )
		{
			inst.$pxl.ajax.requests[inst.url].abort();
		}

		var file_upload = (inst.$pxl.isDefined(inst.file_upload) && inst.file_upload === true);

		var headers = {};

		if ( inst.$pxl.framework !== null )
		{
			headers['X-XSRF-TOKEN'] = inst.$pxl.framework.csrf_token;
		}

		if ( file_upload === true && inst.$pxl.isObject(inst.file_upload_data) )
		{
			headers = $.extend(headers, inst.file_upload_data);
		}

		inst.$pxl.ajax.requests[inst.url] = $.ajax(
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

				if ( inst.$pxl.isFunction(inst.progress) )
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
				if ( inst.$pxl.isFunction(inst.before) )
				{
					inst.before(xhr, data);
				}
			}
		}).done(function(result)
		{
			if ( inst.$pxl.isFunction(inst.success) )
			{
				inst.success(result);
			}

			if ( typeof result.notification !== 'undefined' && result.notification !== null )
			{
				if ( typeof result.notification.type === 'number' && typeof result.notification.text === 'string' )
				{
					inst.$pxl.notification.show({ type: result.notification.type, message: result.notification.text });
				}
			}

			if ( !inst.$pxl.isUndefined(result.redirect) )
			{
				setTimeout(function()
				{
					return inst.$pxl.redirect(result.redirect.url);
				}, result.redirect.delay);
			}

			inst.result = result;
		}).always(function(result)
		{
			if ( inst.$pxl.isFunction(inst.always) )
			{
				inst.always(result);
			}

			delete inst.$pxl.ajax.requests[inst.url];
		}).fail(function(xhr, textStatus, errorThrown)
		{
			if ( xhr === 'abort' )
			{
				if ( inst.$pxl.isFunction(inst.abort) )
				{
					inst.abort();
				}
			}
			else
			{
				if ( inst.$pxl.isFunction(inst.error) )
				{
					inst.error(errorThrown);
				}

				if ( inst.$pxl.options.debug === true && inst.$pxl.isDefined(xhr.responseText) )
				{
					inst.$pxl.notification.showError({ message: xhr.responseText, autoHide: false });
				}
			}
		});
	}
};