class pxlCore_Ajax extends pxlCore_Module
{
	constructor(pxlCore)
	{
		super('Ajax', pxlCore);

		this.requests = [];
	}
	
	get(url, data = {}, callbacks = {}, extra = null)
	{
		var request_data =
		{
			type: 'GET',
			url: url,
			data: data,
			callbacks: {},
			extra: {}
		};

		if ( this.pxlCore.isFunction(callbacks.before) )
		{
			request_data.callbacks.before = callbacks.before;
		}

		if ( this.pxlCore.isFunction(callbacks.progress) )
		{
			request_data.callbacks.progress = callbacks.progress;
		}

		if ( this.pxlCore.isFunction(callbacks.success) )
		{
			request_data.callbacks.success = callbacks.success;
		}

		if ( this.pxlCore.isFunction(callbacks.error) )
		{
			request_data.callbacks.error = callbacks.error;
		}

		if ( this.pxlCore.isFunction(callbacks.always) )
		{
			request_data.callbacks.always = callbacks.always;
		}

		if ( this.pxlCore.isFunction(callbacks.abort) )
		{
			request_data.callbacks.abort = callbacks.abort;
		}

		if ( this.pxlCore.isObject(extra) )
		{
			for ( var key in extra )
			{
				if ( extra.hasOwnProperty(key) )
				{
					request_data.extra[key] = extra[key];
				}
			}
		}

		var request = new pxlCore_Ajax_Request(this.pxlCore, request_data);
		request.execute();

		return request;
	}
}