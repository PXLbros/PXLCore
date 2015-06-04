class pxlCore
{
	constructor(options)
	{
		this.version = '1.0.0';

		this.options =
		{
			debug: false,
			console:
			{
				main_title_background_color: 'black',
				main_title_foreground_color: 'white',
				module_title_background_color: '#EEE',
				module_title_foreground_color: 'black'
			},
			notification:
			{
				engines: []
			}
		};

		if ( typeof options === 'object' )
		{
			this.options = this.extend(this.options, options);
		}

		if ( this.options.debug === true )
		{
			this.log('~ pxlCore ~', this.options.console.main_title_background_color, this.options.console.main_title_foreground_color);
			this.log('Version: ' + this.version);
		}

		this.ui = new pxlCore_UI(this);
		this.ajax = new pxlCore_Ajax(this);
		this.uri = new pxlCore_URI(this);
		this.form = new pxlCore_Form(this);
		this.notification = new pxlCore_Notification(this);
	}

	log(text, background_color = null, color = null)
	{
		let style = '';

		if ( background_color !== null )
		{
			style = 'background:' + background_color + ';padding:0 6px';
		}

		if ( color !== null )
		{
			style += (style !== '' ? ';' : '') + 'color:' + color;
		}

		console.log('%c' + text, (style !== '' ? style : null));
	}

	error(text)
	{
		this.log(text, 'red', 'white');
	}

	extend(defaults, options)
	{
	    let extended = {},
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

	isUndefined(object)
	{
		return object == void 0;
	}

	isDefined(object)
	{
		return !this.isUndefined(object);
	}

	isFunction(object)
	{
		return (typeof object === 'function');
	}

	isObject(object)
	{
		return object === Object(object);
	}

	inArray(subject, array)
	{
		return ($.inArray(subject, array) !== -1);
	}

	getObjectSize(object)
	{
		let size = 0,
			key;

		for ( key in object )
		{
			if ( object.hasOwnProperty(key) )
			{
				size++;
			}
		}

		return size;
	}
}