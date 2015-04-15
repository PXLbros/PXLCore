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
	current_engine: null,

	init: function($pxl)
	{
		if ( $pxl.options.debug === true )
		{
			$pxl.log('~ pxlCore/Notification ~', '#CCC', 'black');
		}
	},

	prepare: function(options)
	{
		if ( typeof options.title === 'undefined' )
		{
			$pxl.error('pxlCore/Notification: Missing required argument "title".');

			return false;
		}

		return true;
	},

	show_success: function(options)
	{
		if ( self.prepare(options) === false )
		{
			return;
		}

		$pxl.log('show success', 'green', 'white');
	},

	show_info: function(options)
	{
	},

	show_warning: function(options)
	{
	},

	show_error: function(options)
	{
	}
};