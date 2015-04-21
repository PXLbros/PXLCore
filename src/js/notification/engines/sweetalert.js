/**
 * pxlCore/Notification/Engine/SweetAlert
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification_Engine_SweetAlert($pxl)
{
	this.init($pxl);
}

pxlCore_Notification_Engine_SweetAlert.prototype =
{
	$pxl: null,

	init: function($pxl)
	{
		var self = this;

		self.$pxl = $pxl;
	},

	showSuccess: function(options)
	{
		alert('hello sweetalert');
	}
};