/**
 * pxlCore/Notification
 * @param {string} $pxl - pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification($pxl)
{
	this.$pxl = $pxl;

	this.init();
}

pxlCore_Notification.prototype =
{
	engines: [],
	default_engine_id: null,
	current_engine_id: null,

	/**
     * Initialize pxlCore/Notification.
     * @param {string} $pxl - pxlCore object reference.
     */
	init: function()
	{
		var self = this;

		if ( self.$pxl.options.debug === true )
		{
			self.$pxl.log('~ pxlCore/Notification ~', '#CCC', 'black');
		}

		var engine_index,
			engine_id,
			engine_name,
			engine;

		for ( engine_index = 0, num_engines = self.$pxl.options.notification.engines.length; engine_index < num_engines; engine_index++ )
		{
			engine_id = self.$pxl.options.notification.engines[engine_index];
			engine_name = 'pxlCore_Notification_Engine_' + engine_id;
			engine = new window[engine_name](self.$pxl);

			if ( engine.loaded === false )
			{
				self.$pxl.error('Could not load notification engine "' + engine_id + '".');

				continue;
			}

			self.engines[engine_id] = engine;

			if ( (engine_index === 0) || (engine_index > 0 && self.default_engine_id === null) )
			{
				self.default_engine_id = engine_id;
			}
		}

		var num_loaded_engines = self.$pxl.getObjectSize(self.engines);

		if ( self.default_engine_id !== null )
		{
			self.setEngine(self.default_engine_id);
		}

		if ( self.$pxl.options.debug === true )
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

			self.$pxl.log(loaded_engines_debug_str);

			self.$pxl.log('Default Engine: ' + (self.default_engine_id !== null ? self.default_engine_id : '/'));
		}
	},

	/**
	 * Set engine.
	 * @param {string} engine_id Engine to switch to.
	 * @returns {string}
	 */
	setEngine: function(engine_id)
	{
		this.current_engine_id = engine_id;
	},

	/**
	 * Prepare engine before showing notification.
	 * @param {object} options Options.
	 * @param {type} type Type.
	 * @returns {boolean}
	 */
	prepare: function(options, type)
	{
		var self = this;

		if ( typeof options.engine === 'string' )
		{
			if ( typeof self.engines[options.engine] !== 'object' )
			{
				self.$pxl.error('pxlCore/Notification: Engine "' + options.engine + '" not found.');

				return false;
			}

			self.setEngine(options.engine);
		}

		var current_engine = self.engines[self.current_engine_id];

		if ( typeof current_engine['show' + type] !== 'function' )
		{
			self.$pxl.error('pxlCore/Notification: Engine "' + self.current_engine_id + '" doesn\'t support type "' + type + '".');

			return false;
		}

		if ( type === 'Success' || type === 'Info' || type === 'Warning' || type === 'Error' )
		{
			if ( typeof options.message === 'undefined' )
			{
				self.$pxl.error('pxlCore/Notification: Missing required argument "message".');

				return false;
			}
		}
		else if ( type === 'Confirm' )
		{
			if ( typeof options.question === 'undefined' )
			{
				self.$pxl.error('pxlCore/Notification: Missing required argument "question".');

				return false;
			}
		}

		return true;
	},

	/**
	 * Reset engine after showing notification.
	 */
	reset: function()
	{
		this.setEngine(this.default_engine_id);
	},

	/**
	 * Show success notification.
	 * @param {object} options Options.
	 */
	showSuccess: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Success') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showSuccess(options);

		self.reset();
	},

	/**
	 * Show info notification.
	 * @param {object} options Options.
	 */
	showInfo: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Info') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showInfo(options);

		self.reset();
	},

	/**
	 * Show warning notification.
	 * @param {object} options Options.
	 */
	showWarning: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Warning') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showWarning(options);

		self.reset();
	},

	/**
	 * Show error notification.
	 * @param {object} options Options.
	 */
	showError: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Error') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showError(options);

		self.reset();
	},

	/**
	 * Show confirmation notification.
	 * @param {object} options Options.
	 */
	showConfirm: function(options)
	{
		var self = this;

		if ( self.prepare(options, 'Confirm') === false )
		{
			return;
		}

		self.engines[self.current_engine_id].showConfirm(options);

		self.reset();
	},

	/**
	 * Show notification.
	 * @param {object} options Options.
	 */
	show: function(options)
	{
		var self = this;

		if ( typeof options.type === 'undefined' )
		{
			self.$pxl.error('pxlCore/Notification: Missing required argument "type".');

			return false;
		}

		var type;

		if ( options.type === 1 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_SUCCESS
		{
			type = 'Success';
		}
		else if ( options.type === 2 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_INFO
		{
			type = 'Info';
		}
		else if ( options.type === 3 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_WARNING
		{
			type = 'Warning';
		}
		else if ( options.type === 4 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_ERROR
		{
			type = 'Error';
		}

		if ( self.prepare(options, type) === false )
		{
			return;
		}

		if ( options.type === 1 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_SUCCESS
		{
			self.engines[self.current_engine_id].showSuccess(options);
		}
		else if ( options.type === 2 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_INFO
		{
			self.engines[self.current_engine_id].showInfo(options);
		}
		else if ( options.type === 3 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_WARNING
		{
			self.engines[self.current_engine_id].showWarning(options);
		}
		else if ( options.type === 4 ) // PXLBros\PXLFramework\Helpers\NOTIFICATION_TYPE_ERROR
		{
			self.engines[self.current_engine_id].showError(options);
		}

		self.reset();
	}
};