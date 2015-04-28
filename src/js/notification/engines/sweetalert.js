/**
 * pxlCore/Notification/Engine/SweetAlert
 * @param {string} $pxl - The pxlCore object reference.
 * @constructor
 */
function pxlCore_Notification_Engine_SweetAlert($pxl)
{
	this.loaded = this.init($pxl);
}

pxlCore_Notification_Engine_SweetAlert.prototype =
{
	$pxl: null,

	init: function($pxl)
	{
		var self = this;

		if ( typeof sweetAlert !== 'function' )
		{
			return false;
		}

		self.$pxl = $pxl;

		return true;
	},

	showSuccess: function(options)
	{
	},

	showConfirm: function(options)
	{
		swal(
		{
			title: options.question,
			type: (typeof options.type === 'string' ? options.type : 'info'),
			showCancelButton: true,
			confirmButtonText: (typeof options.buttons === 'object' && typeof options.buttons.yes === 'string' ? options.buttons.yes : 'Yes'),
			cancelButtonText: (typeof options.buttons === 'object' && typeof options.buttons.no === 'string' ? options.buttons.no : 'No')
		}, (typeof options.yes === 'function' ? options.yes : function() {}));
	}
};