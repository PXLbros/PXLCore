import pxlCore_UI from 'ui';

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
				title_background_color: 'black',
				title_foreground_color: 'white'
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

		if ( this.options.debug == true )
		{
			this.log('~ pxlCore ~', this.options.console.title_background_color, this.options.console.title_foreground_color);
			this.log('Version: ' + this.version);
		}

		this.UI = new pxlCore_UI(this);
	}

	log(text, background_color, color)
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

	error(text)
	{
		this.log(text, 'red', 'white');
	}

	extend(defaults, options)
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
}