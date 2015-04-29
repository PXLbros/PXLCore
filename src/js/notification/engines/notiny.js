/**
 * pxlCore/Notification/Engine/Notiny
 * @param {string} $pxl - pxlCore object reference.
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

		var auto_hide = ((typeof options.autoHide === 'boolean' && options.autoHide === true) || (typeof options.autoHide === 'number' && options.autoHide > 0));

		$.notiny(
		{
			text: options.message,
			position: self.options.position,
			width: self.options.width,
			delay: (typeof options.autoHide === 'number' ? options.autoHide : 3000),
			autohide: auto_hide,
			clickhide: (typeof options.hideOnClick === 'boolean' ? options.hideOnClick : true)
		});
	}
};