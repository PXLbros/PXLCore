class pxlCore_Notification extends pxlCore_Module
{
	constructor(pxlCore)
	{
		super('Notification', pxlCore);

		this.TYPE_SUCCESS = 1;
		this.TYPE_INFO = 2;
		this.TYPE_WARNING = 3;
		this.TYPE_ERROR = 4;
		this.TYPE_CONFIRM = 5;

		this.engines = [];
		this.default_engine_id = null;
		this.current_engine_id = null;

		let engine_index,
			engine_id,
			engine_name,
			engine,
			num_engines = this.pxlCore.options.notification.engines.length;

		for ( engine_index = 0; engine_index < num_engines; engine_index++ )
		{
			engine_id = this.pxlCore.options.notification.engines[engine_index];
			engine_name = 'pxlCore_Notification_Engine_' + engine_id;
			engine = new window[engine_name](this.pxlCore);

			if ( engine.loaded === false )
			{
				this.pxlCore.error('Could not load notification engine "' + engine_id + '".');

				continue;
			}

			this.engines[engine_id] = engine;

			if ( (engine_index === 0) || (engine_index > 0 && this.default_engine_id === null) )
			{
				this.default_engine_id = engine_id;
			}
		}

		let num_loaded_engines = this.pxlCore.getObjectSize(this.engines);

		if ( this.default_engine_id !== null )
		{
			this.setEngine(this.default_engine_id);
		}

		if ( this.pxlCore.options.debug === true )
		{
			let loaded_engines_debug_str = 'Loaded Engines: ';

			if ( num_loaded_engines > 0 )
			{
				engine_index = 0;

				for ( engine_id in this.engines )
				{
					loaded_engines_debug_str += engine_id + (engine_index < (num_loaded_engines - 1) ? ', ' : '');

					engine_index++;
				}
			}
			else
			{
				loaded_engines_debug_str += 'None';
			}

			this.pxlCore.log(loaded_engines_debug_str);

			this.pxlCore.log('Default Engine: ' + (this.default_engine_id !== null ? this.default_engine_id : '/'));
		}
	}

	setEngine(engine_id)
	{
		this.current_engine_id = engine_id;
	}

	resetEngine()
	{
		this.setEngine(this.default_engine_id);
	}

	showSuccess(options)
	{
		var _options = { type: 1 };

		this.show((this.pxlCore.isObject(options) ? this.pxlCore.extend(options, _options) : _options));
	}

	showInfo(options)
	{
		var _options = { type: 2 };

		this.show((this.pxlCore.isObject(options) ? this.pxlCore.extend(options, _options) : _options));
	}

	showWarning(options)
	{
		var _options = { type: 3 };

		this.show((this.pxlCore.isObject(options) ? this.pxlCore.extend(options, _options) : _options));
	}

	showError(options)
	{
		var _options = { type: 4 };

		this.show((this.pxlCore.isObject(options) ? this.pxlCore.extend(options, _options) : _options));
	}

	show(options)
	{
		if ( this.pxlCore.isUndefined(options) )
		{
			this.pxlCore.error('pxlCore/Notification: Missing required argument "options".');

			return false;
		}

		if ( typeof options.type === 'undefined' )
		{
			this.pxlCore.error('pxlCore/Notification: Missing required property "type".');

			return false;
		}

		if ( this.prepareShow(options) === false )
		{
			return false;
		}

		this.getCurrentEngine().show(options);

		this.resetEngine();

		return true;
	}

	getCurrentEngine()
	{
		if ( this.current_engine_id === null )
		{
			return null;
		}

		return this.engines[this.current_engine_id];
	}

	prepareShow(options)
	{
		if ( this.pxlCore.isUndefined(options) )
		{
			this.pxlCore.error('pxlCore/Notification: Missing required argument "options".');

			return false;
		}

		if ( typeof options.engine === 'string' )
		{
			if ( typeof this.engines[options.engine] !== 'object' )
			{
				this.pxlCore.error('pxlCore/Notification: Engine "' + options.engine + '" not found.');

				return false;
			}

			this.setEngine(options.engine);
		}

		if ( options.type === 1 || options.type === 2 || options.type === 3 || options.type === 4 )
		{
			if ( typeof options.message === 'undefined' )
			{
				this.pxlCore.error('pxlCore/Notification: Missing required property "message".');

				return false;
			}
		}
		else if ( options.type === 5 )
		{
			if ( typeof options.question === 'undefined' )
			{
				this.pxlCore.error('pxlCore/Notification: Missing required property "question".');

				return false;
			}
		}

		return true;
	}

	convertTypeToTitle(type)
	{
		switch ( type )
		{
			case this.TYPE_SUCCESS: return 'Success';
			case this.TYPE_INFO: return 'Info';
			case this.TYPE_WARNING: return 'Warning';
			case this.TYPE_ERROR: return 'Error';
			case this.TYPE_CONFIRM: return 'Confirm';
			default:
				this.pxlCore.error('pxlCore/Notification: Invalid type "' + type + '".');

				return null;
		}
	}
}