/**
 * pxlCore/Notification/Engine/Notiny
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification_Engine_Notiny($pxl)
{
	this.init($pxl);
}

pxlCore_Notification_Engine_Notiny.prototype =
{
	$pxl: null,

	init: function($pxl)
	{
		var self = this;

		self.$pxl = $pxl;
	},

	showSuccess: function(options)
	{
		alert('hello notiny');
	}
};