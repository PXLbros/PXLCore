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

		if ( typeof options.message === 'undefined' )
		{
			$pxl.error('pxlCore/Notification: Missing required argument "message".');

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

		var current_engine = self.engines[self.current_engine_id];

		if ( typeof current_engine['show' + type] !== 'function' )
		{
			$pxl.error('pxlCore/Notification: Engine "' + self.current_engine_id + '" doesn\'t support type "' + type + '".');

			return false;
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
	}
};