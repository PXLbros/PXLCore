/**
 * pxlCore/Notification/Engine/Notiny
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification_Engine_Notiny($pxl)
{
	this.loaded = this.init($pxl);
}

pxlCore_Notification_Engine_Notiny.prototype =
{
	$pxl: null,

	options:
	{
		position: 'right-top',
		width: 'auto'
	},

	init: function($pxl)
	{
		var self = this;

		if ( typeof $.notiny !== 'function' )
		{
			return false;
		}

		self.$pxl = $pxl;

		return true;
	},

	showSuccess: function(options)
	{
		alert('hello notiny');
	},

	showError: function(options)
	{
		var self = this;

		$.notiny(
		{
			text: options.message,
			position: self.options.position,
			width: self.options.width
		});
	}
};