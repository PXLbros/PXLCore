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
	default_engine: null,
	current_engine: null,

	init: function($pxl)
	{
		var self = this;

		var engine_index,
			engine_id,
			engine_name,
			engine;

		for ( engine_index = 0, num_engines = $pxl.options.notification.engines.length; engine_index < num_engines; engine_index++ )
		{
			engine_id = $pxl.options.notification.engines[engine_index];
			engine_name = 'pxlCore_Notification_Engine_' + engine_id;
			engine = new window[engine_name]($pxl);

			self.engines[engine_id] = engine;

			if ( engine_index === 0 )
			{
				self.default_engine = engine_id;
			}
		}

		if ( self.default_engine !== null )
		{
			self.setEngine(self.default_engine);
		}

		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Notification ~', '#CCC', 'black');

			var loaded_engines_debug_str = 'Loaded Engines: ';

			if ( num_engines > 0 )
			{
				engine_index = 0;

				for ( engine_id in self.engines )
				{
					loaded_engines_debug_str += engine_id + (engine_index < (num_engines - 1) ? ', ' : '');

					engine_index++;
				}
			}
			else
			{
				loaded_engines_debug_str += 'None';
			}

			$pxl.log(loaded_engines_debug_str);

			$pxl.log('Default Engine: ' + (self.default_engine !== null ? self.default_engine : '/'));
		}
	},

	setEngine: function(engine_id)
	{
		this.current_engine = this.engines[engine_id];
	},

	prepare: function(options, type)
	{
		var self = this;

		if ( typeof options.title === 'undefined' )
		{
			$pxl.error('pxlCore/Notification: Missing required argument "title".');

			return false;
		}

		if ( typeof options.engine === 'string' )
		{
			if ( typeof self.engines[options.engine] !== 'object' )
			{
				$pxl.error('pxlCore/Notification: Engine "' + options.engine + '" not found.');

				return false;
			}

			self.setEngine(options.engine);
		}

		console.log(self.current_engine);

		if ( typeof self.current_engine['show' + type] !== 'function' )
		{
			$pxl.error('pxlCore/Notification: Engine "' + self.current_engine + '" doesn\'t support type "' + type + '".');

			return false;
		}

		return true;
	},

	finalize: function()
	{
		this.setEngine(this.default_engine);
	},

	showSuccess: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Success') === false )
		{
			return;
		}

		self.current_engine.showSuccess(options);

		self.finalize();
	},

	showInfo: function(options)
	{
	},

	showWarning: function(options)
	{
	},

	showError: function(options)
	{
	}
};